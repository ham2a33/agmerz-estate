export type RequestType = "buy" | "rent" | "sell" | "consultation" | "contact";

export type RequestStatus = "new" | "in_progress" | "completed" | "cancelled";

export interface Request {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: RequestType;
  budget: number | null;
  district: string | null;
  rooms: number | null;
  message: string;
  internalNotes: string;
  status: RequestStatus;
  clientId: string | null;
  propertyId: string | null;
  createdAt: string;
}

export type RequestCreateInput = Omit<Request, "id" | "status" | "createdAt">;

export type RequestUpdateInput = Partial<Omit<Request, "id" | "createdAt">>;
