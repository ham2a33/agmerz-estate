import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { getSettings, updateSettings } from "@/lib/settings";
import { revalidateSettingsPages } from "@/lib/revalidate-content";
import { parseJsonRequest } from "@/lib/validation/parse";
import { settingsFormSchema } from "@/lib/validation/settings";

export async function GET() {
  try {
    return apiSuccess(await getSettings());
  } catch (error) {
    return handleApiError("settings:GET", error);
  }
}

export async function PATCH(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const parsed = await parseJsonRequest(request, settingsFormSchema);
    if (!parsed.success) return parsed.response;

    const updated = await updateSettings(parsed.data);
    revalidateSettingsPages();
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError("settings:PATCH", error);
  }
}
