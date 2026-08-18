import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { getHomepageConfig, updateHomepageConfig } from "@/lib/homepage";
import { listFeaturedProperties, reorderFeaturedProperties } from "@/lib/properties";
import {
  featuredReorderSchema,
  homepageUpdateSchema,
} from "@/lib/validation/homepage";
import { revalidatePublicContent } from "@/lib/revalidate-content";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const [config, featuredProperties] = await Promise.all([
      getHomepageConfig(),
      listFeaturedProperties(),
    ]);

    return apiSuccess({ config, featuredProperties });
  } catch (error) {
    return handleApiError("homepage:GET", error);
  }
}

export async function PATCH(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    if (body.featuredOrder) {
      const parsed = featuredReorderSchema.safeParse(body.featuredOrder);
      if (!parsed.success) {
        return handleApiError("homepage:PATCH:featured", parsed.error);
      }

      const featuredProperties = await reorderFeaturedProperties(parsed.data.propertyIds);
      revalidatePublicContent(["/"]);
      return apiSuccess({ featuredProperties });
    }

    const parsed = homepageUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError("homepage:PATCH", parsed.error);
    }

    const config = await updateHomepageConfig(parsed.data);
    revalidatePublicContent();
    return apiSuccess({ config });
  } catch (error) {
    return handleApiError("homepage:PATCH", error);
  }
}
