export interface PointData {
  id: string;
  name: string;
  date: string; // format ISO "YYYY-MM-DD"
  coords: [number, number]; // [longitude, latitude]
  category: string;
  subcategory: string;
  type: "article";
  image: string;
  link: string;
  relatedBefore: string[];
  relatedAfter: string[];
  relatedOther: string[];
}
