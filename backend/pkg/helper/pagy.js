export function getPagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, parseInt(query.limit) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function getPagingData(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;
  return {
    totalItems: total,
    totalPages,
    currentPage: page,
    pageSize: limit,
    nextPage,
    prevPage,
  };
}
