import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import worldData from "../../data/world-110m.json";
import { points } from "../../data/points";
import { getColor } from "./utils";
import { useProjection } from "./useProjection";

const GlobeD3 = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 800;
    const height = 800;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "radial-gradient(#0a0a0a, #000)")
      .style("border-radius", "100%");

    svg.selectAll("*").remove(); // clean rerenders

    const { projection, path, graticule } = useProjection(width, height);

    const g = svg.append("g");

    // 🌊 Ocean shading circle
    g.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", projection.scale()!)
      .attr("fill", "url(#ocean)");

    // 🌀 Ocean gradient
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

    // 🌐 Graticule
    g.append("path")
      .datum(graticule)
      .attr("fill", "none")
      .attr("stroke", "#1f2937")
      .attr("stroke-width", 0.5)
      .attr("d", path);

    // 🗺️ Countries
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

    // ✨ Points
    const pulse = svg.append("g");

    function drawPoints() {
      pulse.selectAll("*").remove();

      const tooltip = d3.select("#tooltip");

    if (tooltip.empty()) {
      d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(15, 23, 42, 0.8)") // fond sombre semi-transparent
        .style("backdrop-filter", "blur(6px)")        // effet verre dépoli
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

      points.forEach((point) => {
        if (!isPointVisible(point.coords, projection)) return;

        const [x, y] = projection(point.coords)!;

        // 🌟 Cercle principal, maintenant cliquable
        pulse
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 5)
          .style("fill", getColor(point.type))
          .style("stroke", "#fff")
          .style("stroke-width", 0.7)
          .style("cursor", "pointer")
          .on("mouseover", function (event) {
            d3.select(this).transition().attr("r", 8);
            d3.select("#tooltip")
              .style("opacity", 1)
              .style("transform", "translateY(-10px)") // effet montée
              .html(`
                <div style="display:flex; flex-direction: column; gap: 6px;">
                  <img src="${point.image}" alt="${point.name}" style="width: 100%; height: auto; border-radius: 12px 12px 0 0;"/>
                  <div style="padding: 10px;">
                    <strong style="font-size: 1rem;">${point.name}</strong>
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
            window.open(point.link, "_blank");
          });

        // 🌊 Cercle pulsant
        pulse
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 4)
          .style("fill", "none")
          .style("stroke", getColor(point.type))
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
      });
    }




    drawPoints();

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("padding", "6px 12px")
      .style("background", "#0f172a")
      .style("color", "#f8fafc")
      .style("font-size", "0.875rem")
      .style("border-radius", "8px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.3)");

    // 🌐 Drag rotate
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
          const sensitivity = 0.25; // Ajuste cette valeur si nécessaire
          const dx = event.dx * sensitivity;
          const dy = event.dy * sensitivity;

          // Applique les nouvelles valeurs avec limite de latitude
          rotation.lon += dx;
          rotation.lat = Math.max(-90, Math.min(90, rotation.lat - dy)); // clamp lat

          projection.rotate([rotation.lon, rotation.lat]);
          svg.selectAll("path").attr("d", path);
          drawPoints(); // redraw points
        })
    );

    return () => {
      tooltip.remove();
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GlobeD3;



function isPointVisible([lon, lat]: [number, number], projection: d3.GeoProjection): boolean {
  const [λ0, φ0] = projection.rotate(); // Rotation du globe

  // Convertir en radians
  const λ = lon * (Math.PI / 180);
  const φ = lat * (Math.PI / 180);

  const λr = -λ0 * (Math.PI / 180);
  const φr = -φ0 * (Math.PI / 180);

  // Vecteur du point en coordonnées sphériques → cartésiennes
  const x = Math.cos(φ) * Math.cos(λ);
  const y = Math.cos(φ) * Math.sin(λ);
  const z = Math.sin(φ);

  // Vecteur "vue caméra" (direction face visible)
  const cx = Math.cos(φr) * Math.cos(λr);
  const cy = Math.cos(φr) * Math.sin(λr);
  const cz = Math.sin(φr);

  // Produit scalaire
  const dot = x * cx + y * cy + z * cz;

  return dot > 0;
}
