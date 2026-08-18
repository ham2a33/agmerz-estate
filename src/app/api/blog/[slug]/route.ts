import { NextRequest } from "next/server";
import { apiNotFound, apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth";
import { getPostBySlug } from "@/lib/repositories/blog";
import { parseJsonRequest } from "@/lib/validation/parse";
import { blogUpdateSchema } from "@/lib/validation/blog";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return apiNotFound("Blog post");
    return apiSuccess(post);
  } catch (error) {
    return handleApiError("blog:GET:slug", error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { slug } = await params;
    const parsed = await parseJsonRequest(request, blogUpdateSchema);
    if (!parsed.success) return parsed.response;

    return apiSuccess({ message: "Blog post update endpoint ready", slug, post: parsed.data });
  } catch (error) {
    return handleApiError("blog:PUT", error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { slug } = await params;
  return apiSuccess({ message: "Blog post deleted", slug });
}
