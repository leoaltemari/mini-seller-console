export interface PaginationParams {
  /** 1-based page index */
  page?: number;
  /** number of leads per page */
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T;
  total: number;
}
