import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { getPagesConfig, updatePagesConfig } from "@/lib/pages";
import { revalidatePagesContent } from "@/lib/revalidate-content";
import { pagesUpdateSchema } from "@/lib/validation/pages";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const config = await getPagesConfig();
    return apiSuccess({ config });
  } catch (error) {
    return handleApiError("content:GET", error);
  }
}

export async function PATCH(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = pagesUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return handleApiError("content:PATCH", parsed.error);
    }

    const config = await updatePagesConfig(parsed.data);
    revalidatePagesContent(Object.keys(parsed.data));
    return apiSuccess({ config });
  } catch (error) {
    return handleApiError("content:PATCH", error);
  }
}
