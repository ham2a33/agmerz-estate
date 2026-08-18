import type { Client } from "@/types";

export type AdminClientListItem = Client & {
  requestCount: number;
  lastActivity: string | null;
};
