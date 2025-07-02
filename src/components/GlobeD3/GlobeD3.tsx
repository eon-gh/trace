import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import worldData from "../../data/world-110m.json";
import { getColor } from "./utils";
import { useProjection } from "./useProjection";
import type { PointData } from "./types";
import ArticleModal from "../ArticleModal";
import FilterBar from "../FilterBar";
import { historicalPeriods } from "../../data/historicalPeriods";

const GlobeD3 = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const navigateToArticleRef = useRef<(id: string) => void>(() => {});
  const [points, setPoints] = useState<PointData[]>([]);
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [articleContent, setArticleContent] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ category?: string; subcategory?: string }>({});
  const defaultPeriod = historicalPeriods.find(p => p.label === "Anthropocène - Époque contemporaine");

  const [selectedPeriods, setSelectedPeriods] = useState<string[]>(
    defaultPeriod ? [defaultPeriod.label] : []
  );

  const [dateRange, setDateRange] = useState<[number, number]>(
    defaultPeriod ? [defaultPeriod.start, defaultPeriod.end] : [-3000000, 2025]
  );



  useEffect(() => {
    const selected = historicalPeriods.filter((p) => selectedPeriods.includes(p.label));
    if (selected.length > 0) {
      const min = Math.min(...selected.map((p) => p.start));
      const max = Math.max(...selected.map((p) => p.end));
      setDateRange([min, max]);
    }
  }, [selectedPeriods]);

  useEffect(() => {
    if (!activeArticleId) return;

    fetch(`/articles/${activeArticleId}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Article non trouvé");
        return res.text();
      })
      .then((text) => {
        setArticleContent(text);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement de l'article :", err);
        setArticleContent(null);
      });
  }, [activeArticleId]);

  // Fetch points data
  useEffect(() => {
    fetch("/data/points.json")
      .then((res) => res.json())
      .then((data) => setPoints(data))
      .catch((err) => console.error("Erreur chargement points:", err));
  }, []);

  // Draw globe and points
  useEffect(() => {
    if (!svgRef.current || points.length === 0) return;

    const width = 800;
    const height = 800;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "radial-gradient(#0a0a0a, #000)")
      .style("border-radius", "100%");

    svg.selectAll("*").remove();

    const { projection, path, graticule } = useProjection(width, height);
    const g = svg.append("g");

    g.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", projection.scale()!)
      .attr("fill", "url(#ocean)");

    svg
      .append("defs")
      .append("radialGradient")
      .attr("id", "ocean")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#041C32" },
        { offset: "100%", color: "#000" },
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    g.append("path")
      .datum(graticule)
      .attr("fill", "none")
      .attr("stroke", "#1f2937")
      .attr("stroke-width", 0.5)
      .attr("d", path);

    const countries = feature(worldData as any, (worldData as any).objects.countries);
    g.selectAll("path.countries")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#222")
      .attr("stroke", "#666")
      .attr("stroke-width", 0.3)
      .attr("opacity", 0.9);

    const pulse = svg.append("g");

    function drawPoints() {
      pulse.selectAll("*").remove();



      const tooltip = d3.select("#tooltip");
      if (tooltip.empty()) {
        d3.select("body")
          .append("div")
          .attr("id", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(15, 23, 42, 0.8)")
          .style("backdrop-filter", "blur(6px)")
          .style("color", "#f8fafc")
          .style("font-size", "0.875rem")
          .style("border-radius", "12px")
          .style("pointer-events", "none")
          .style("opacity", 0)
          .style("transform", "translateY(0px)")
          .style("transition", "opacity 0.3s ease, transform 0.3s ease")
          .style("box-shadow", "0 8px 24px rgba(0, 0, 0, 0.4)")
          .style("width", "220px")
          .style("z-index", "1000");
      }

      points
      .filter((point) => {
        // Catégorie
        if (filters.category && point.category !== filters.category) return false;
        if (filters.subcategory && point.subcategory !== filters.subcategory) return false;

        // Périodes
        if (selectedPeriods.length > 0) {
          const match = selectedPeriods.some(periodLabel => {
            const period = historicalPeriods.find(p => p.label === periodLabel);
            return period && point.year >= period.start && point.year <= period.end;
          });
          if (!match) return false;
        }

        // Plage temporelle (slider)
        if (point.year < dateRange[0] || point.year > dateRange[1]) return false;

        return true;
      })
      .forEach((point) => {
        if (!isPointVisible(point.coords, projection)) return;
        const dispersedCoords = getDispersedCoords(point.coords, points, point);
        const [x, y] = projection(dispersedCoords)!;
        const overlapping = points.filter(p =>
          p.coords[0] === point.coords[0] && p.coords[1] === point.coords[1]
        );
        const isOverlapping = overlapping.length > 1;

        pulse
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 5)
          .style("fill", getColor(point.category))
          .style("stroke", "#fff")
          .style("stroke-width", 0.7)
          .style("cursor", "pointer")
          .on("mouseover", function (event) {
            d3.select(this).transition().attr("r", 8);
            d3.select("#tooltip")
              .style("opacity", 1)
              .style("transform", "translateY(-10px)")
              .html(`
                <div style="display:flex; flex-direction: column; gap: 6px;">
                  <img src="${point.image}" alt="${point.name}" style="width: 100%; height: auto; border-radius: 12px 12px 0 0;"/>
                  <div style="padding: 10px;">
                    <strong style="font-size: 1rem;">${point.name}</strong>
                    ${isOverlapping ? `<small style="color:#aaa;">${overlapping.length} points proches</small>` : ""}
                  </div>
                </div>
              `)
              .style("left", `${event.pageX + 15}px`)
              .style("top", `${event.pageY + 15}px`);
          })
          .on("mouseout", function () {
            d3.select(this).transition().attr("r", 5);
            d3.select("#tooltip")
              .style("opacity", 0)
              .style("transform", "translateY(0px)");
          })
          .on("click", function () {
            setActiveArticleId(point.id);
          });

        pulse
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 4)
          .style("fill", "none")
          .style("stroke", getColor(point.category))
          .style("stroke-width", 1)
          .style("opacity", 0.8)
          .transition()
          .duration(2000)
          .ease(d3.easeCubicOut)
          .attr("r", 20)
          .style("stroke-opacity", 0)
          .on("end", function repeat() {
            d3.select(this)
              .attr("r", 4)
              .style("stroke-opacity", 0.8)
              .transition()
              .duration(2000)
              .ease(d3.easeCubicOut)
              .attr("r", 20)
              .style("stroke-opacity", 0)
              .on("end", repeat);
          });
          console.log(point.name, point.category, point.year);
      });
      
    }

    drawPoints();

    const rotation = { lon: 0, lat: 0 };
    svg.call(
      d3
        .drag<SVGSVGElement, unknown>()
        .on("start", () => {
          const [lon, lat] = projection.rotate();
          rotation.lon = lon;
          rotation.lat = lat;
        })
        .on("drag", (event) => {
          const dx = event.dx * 0.25;
          const dy = event.dy * 0.25;
          rotation.lon += dx;
          rotation.lat = Math.max(-90, Math.min(90, rotation.lat - dy));
          projection.rotate([rotation.lon, rotation.lat]);
          svg.selectAll("path").attr("d", path);
          drawPoints();
        })
    );

    // 🔁 Fonction de rotation vers un point
    function rotateToTarget(targetCoords: [number, number], callback: () => void) {
      const [targetLon, targetLat] = targetCoords;
      const currentRotation = projection.rotate();
      const interpolator = d3.interpolate(currentRotation, [-targetLon, -targetLat]);

      d3.transition()
        .duration(2000)
        .tween("rotate", () => (t) => {
          projection.rotate(interpolator(t));
          svg.selectAll("path").attr("d", path);
          drawPoints();
        })
        .on("end", callback);
    }

    // 🔁 Navigation inter-articles
    navigateToArticleRef.current = (targetId: string) => {
      const targetPoint = points.find((p) => p.id === targetId);
      if (!targetPoint) return;

      setActiveArticleId(null);
      setArticleContent(null);
      setTimeout(() => {
        rotateToTarget(targetPoint.coords, () => {
          setActiveArticleId(targetPoint.id);
        });
      }, 300);
    };

    return () => {
      d3.select("#tooltip").remove();
    };
  }, [points, filters, dateRange]);

  // 🔁 Calcul dynamique minYear / maxYear
  const selectedPeriodRanges = selectedPeriods
    .map((label) => historicalPeriods.find((p) => p.label === label))
    .filter((p): p is { start: number; end: number } => !!p);

  const minYear = selectedPeriodRanges.length
    ? Math.min(...selectedPeriodRanges.map((p) => p.start))
    : -3000000;

  const maxYear = selectedPeriodRanges.length
    ? Math.max(...selectedPeriodRanges.map((p) => p.end))
    : 2025;


  const periodOptions = historicalPeriods.map((p) => ({
    value: p.label,
    label: p.label,
  }));

  const selectedOptions = periodOptions.filter((opt) =>
    selectedPeriods.includes(opt.value)
  );
  return (
    <div
      className="flex justify-center items-center w-full h-full"
      style={{ flexDirection: "column", marginTop: "150px", overflow: "hidden" }}
    >
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedPeriods={selectedPeriods}
        setSelectedPeriods={setSelectedPeriods}
        minYear={minYear}
        maxYear={maxYear}
        periodOptions={periodOptions}
        selectedOptions={selectedOptions}
      />

      <svg ref={svgRef}></svg>

      {activeArticleId && articleContent && (
        <ArticleModal
          content={articleContent}
          onClose={() => setActiveArticleId(null)}
          onNavigate={(id) => navigateToArticleRef.current(id)}
          relatedBefore={points.find((p) => p.id === activeArticleId)?.relatedBefore?.[0]}
          relatedAfter={points.find((p) => p.id === activeArticleId)?.relatedAfter?.[0]}
        />
      )}
    </div>
  );

};



// ✅ Visibilité d’un point sur le globe
function isPointVisible([lon, lat]: [number, number], projection: d3.GeoProjection): boolean {
  const [λ0, φ0] = projection.rotate();
  const λ = lon * (Math.PI / 180);
  const φ = lat * (Math.PI / 180);
  const λr = -λ0 * (Math.PI / 180);
  const φr = -φ0 * (Math.PI / 180);

  const x = Math.cos(φ) * Math.cos(λ);
  const y = Math.cos(φ) * Math.sin(λ);
  const z = Math.sin(φ);

  const cx = Math.cos(φr) * Math.cos(λr);
  const cy = Math.cos(φr) * Math.sin(λr);
  const cz = Math.sin(φr);

  const dot = x * cx + y * cy + z * cz;
  return dot > 0;
}
function getDispersedCoords(
  baseCoords: [number, number],
  allPoints: PointData[],
  point: PointData
): [number, number] {
  const overlapping = allPoints.filter(p =>
    p.coords[0] === baseCoords[0] && p.coords[1] === baseCoords[1]
  );

  if (overlapping.length <= 1) return baseCoords;

  const index = overlapping.findIndex(p => p.id === point.id);
  const angle = (index / overlapping.length) * 2 * Math.PI;
  const radius = 0.4; // 0.4° de dispersion maximum (~44km)

  const lonOffset = radius * Math.cos(angle);
  const latOffset = radius * Math.sin(angle);

  return [baseCoords[0] + lonOffset, baseCoords[1] + latOffset];
}


export default GlobeD3;