export interface PagyInterface {
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  nextPage?: number;
  prevPage?: number;
}

export interface PagyInput {
  page: number;
  limit: number;
}
