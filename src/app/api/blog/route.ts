import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import {
  createBlogPost,
  isBlogSlugAvailable,
  listPosts,
  listPublishedPosts,
} from "@/lib/repositories/blog";
import { parseJsonRequest } from "@/lib/validation/parse";
import { blogCreateSchema } from "@/lib/validation/blog";
import { revalidateBlogPages } from "@/lib/revalidate-content";

export async function GET(request: NextRequest) {
  try {
    if (requireAdmin(request) === null) {
      return apiSuccess(await listPosts());
    }

    return apiSuccess(await listPublishedPosts());
  } catch (error) {
    return handleApiError("blog:GET", error);
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const parsed = await parseJsonRequest(request, blogCreateSchema);
    if (!parsed.success) return parsed.response;

    if (!(await isBlogSlugAvailable(parsed.data.slug))) {
      return apiError("Slug already in use", 409);
    }

    const post = await createBlogPost(parsed.data);
    revalidateBlogPages(post.slug);
    return apiSuccess(post, 201);
  } catch (error) {
    return handleApiError("blog:POST", error);
  }
}
