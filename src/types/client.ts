export type ClientType = "buyer" | "seller" | "renter" | "landlord" | "investor";

export type ClientStatus = "new" | "active" | "in_progress" | "completed" | "inactive";

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  type: ClientType;
  status: ClientStatus;
  notes: string;
  assignedManager: string;
  createdAt: string;
  updatedAt: string;
}

export type ClientCreateInput = Omit<Client, "id" | "createdAt" | "updatedAt">;

export type ClientUpdateInput = Partial<ClientCreateInput>;
