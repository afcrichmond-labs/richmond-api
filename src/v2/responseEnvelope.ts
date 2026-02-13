/**
 * API v2 response envelope.
 * Breaking change from v1 flat responses.
 */
export interface ApiResponse<T> {
  data: T;
  meta: {
    api_version: "v2";
    request_id: string;
    timestamp: string;
    pagination?: CursorPagination;
  };
  errors?: ApiError[];
}

export interface CursorPagination {
  cursor: string | null;
  has_more: boolean;
  total_count: number;
}

export function wrapResponse<T>(data: T, meta?: Partial<ApiResponse<T>["meta"]>): ApiResponse<T> {
  return {
    data,
    meta: {
      api_version: "v2",
      request_id: generateRequestId(),
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}
