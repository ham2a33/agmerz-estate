import { NextRequest } from "next/server";
import { apiError, apiNotFound, apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { getPropertyById, setPropertyFeatured, updatePropertyImages } from "@/lib/properties";
import { parseBody } from "@/lib/validation/parse";
import { propertyFeaturedSchema } from "@/lib/validation/homepage";
import { assetUrlSchema } from "@/lib/validation/common";
import { z } from "zod";
import { revalidatePropertyPages } from "@/lib/revalidate-content";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const propertyImagesSchema = z.object({
  images: z.array(assetUrlSchema).max(30),
});

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const existing = await getPropertyById(id);
    if (!existing) return apiNotFound("Property");

    const body = await request.json();

    if ("images" in body) {
      const parsed = propertyImagesSchema.safeParse(body);
      if (!parsed.success) return apiError("Invalid images payload", 400);

      const updated = await updatePropertyImages(id, parsed.data.images);
      revalidatePropertyPages(id);
      return apiSuccess(updated);
    }

    const parsed = parseBody(propertyFeaturedSchema, body);
    if (!parsed.success) return parsed.response;

    const updated = await setPropertyFeatured(
      id,
      parsed.data.isFeatured,
      parsed.data.featuredOrder ?? null,
    );

    revalidatePropertyPages(id);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError("properties:PATCH:featured", error);
  }
}
