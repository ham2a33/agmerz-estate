import { NextRequest } from "next/server";
import { apiError, apiNotFound, apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import {
  deleteBlogPost,
  getPostById,
  isBlogSlugAvailable,
  updateBlogPost,
} from "@/lib/repositories/blog";
import { parseJsonRequest } from "@/lib/validation/parse";
import { blogUpdateSchema } from "@/lib/validation/blog";
import { revalidateBlogPages } from "@/lib/revalidate-content";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const post = await getPostById(id);
    if (!post) return apiNotFound("Blog post");
    return apiSuccess(post);
  } catch (error) {
    return handleApiError("blog:GET:id", error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const existing = await getPostById(id);
    if (!existing) return apiNotFound("Blog post");

    const parsed = await parseJsonRequest(request, blogUpdateSchema);
    if (!parsed.success) return parsed.response;

    if (parsed.data.slug && !(await isBlogSlugAvailable(parsed.data.slug, id))) {
      return apiError("Slug already in use", 409);
    }

    const post = await updateBlogPost(id, parsed.data);
    revalidateBlogPages(post?.slug ?? existing.slug);
    return apiSuccess(post);
  } catch (error) {
    return handleApiError("blog:PATCH:id", error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const existing = await getPostById(id);
    if (!existing) return apiNotFound("Blog post");

    const deleted = await deleteBlogPost(id);
    if (!deleted) return apiNotFound("Blog post");

    revalidateBlogPages(existing.slug);
    return apiSuccess({ id });
  } catch (error) {
    return handleApiError("blog:DELETE:id", error);
  }
}
