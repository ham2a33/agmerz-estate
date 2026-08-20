import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import {
  clearImageSlot,
  resolveAllImageSlots,
  updateImageSlot,
} from "@/lib/image-slots";
import { revalidatePublicContent } from "@/lib/revalidate-content";
import { imageSlotUpdateSchema } from "@/lib/validation/image-slots";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const slots = await resolveAllImageSlots();
    return apiSuccess({ slots });
  } catch (error) {
    return handleApiError("media-content:GET", error);
  }
}

export async function PATCH(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = imageSlotUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return handleApiError("media-content:PATCH", parsed.error);
    }

    const { slotId, url, alt, action } = parsed.data;

    if (action === "clear") {
      await clearImageSlot(slotId);
    } else {
      await updateImageSlot(slotId, { url, alt });
    }

    const resolved = await resolveAllImageSlots();
    const slot = resolved.find((item) => item.id === slotId);
    revalidatePublicContent();
    return apiSuccess({ slot });
  } catch (error) {
    return handleApiError("media-content:PATCH", error);
  }
}
