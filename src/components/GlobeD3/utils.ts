// components/GlobeD3/utils.ts

export function getColor(type: string): string {
  switch (type) {
    case "civilization":
      return "#FFB703";
    case "species":
      return "#8ECAE6";
    case "nature":
      return "#06D6A0";
    case "speculative":
      return "#D62828";
    default:
      return "#fff";
  }
}
