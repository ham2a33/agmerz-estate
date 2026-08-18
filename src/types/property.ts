export type PropertyType = "apartment" | "house" | "commercial" | "land" | "rent";

export type PropertyStatus = "active" | "reserved" | "sold" | "rented" | "draft";

export interface PropertyCoordinates {
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  type: PropertyType;
  category: string;
  status: PropertyStatus;
  price: number;
  currency: string;
  address: string;
  district: string;
  area: number;
  rooms: number | null;
  floor: number | null;
  totalFloors: number | null;
  yearBuilt: number | null;
  description: string;
  features: string[];
  images: string[];
  coordinates: PropertyCoordinates | null;
  isFeatured: boolean;
  featuredOrder: number | null;
  createdAt: string;
  updatedAt: string;
}

export type PropertyCreateInput = Omit<Property, "id" | "createdAt" | "updatedAt">;

export type PropertyUpdateInput = Partial<PropertyCreateInput>;
