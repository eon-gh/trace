// components/GlobeD3/useProjection.ts

import * as d3 from "d3";

export function useProjection(width: number, height: number) {
  const projection = d3
    .geoOrthographic()
    .scale(width / 2.5)
    .translate([width / 2, height / 2])
    .clipAngle(90);

  const path = d3.geoPath().projection(projection);
  const graticule = d3.geoGraticule10();

  return { projection, path, graticule };
}
