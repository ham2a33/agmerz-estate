export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

export function parsePaginationParams(
  searchParams: URLSearchParams,
): PaginationParams | null {
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  if (!pageParam && !limitParam) {
    return null;
  }

  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(limitParam ?? "20", 10) || 20));

  return { page, limit };
}

export function buildPaginationMeta(
  total: number,
  params: PaginationParams,
): PaginationMeta {
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / params.limit)),
  };
}

export function getSkipTake(params: PaginationParams) {
  return {
    skip: (params.page - 1) * params.limit,
    take: params.limit,
  };
}
