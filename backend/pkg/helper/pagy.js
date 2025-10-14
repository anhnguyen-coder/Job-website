export function getPagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, parseInt(query.limit) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function getPagingData(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return {
    totalItems: total,
    totalPages,
    currentPage: page,
    pageSize: limit,
  };
}