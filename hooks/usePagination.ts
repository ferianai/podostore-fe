import { useState, useMemo } from "react";

export function usePagination<T>(data: T[], initialRowsPerPage = 10) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  }, [data, page, rowsPerPage]);

  // Jika user ubah rowsPerPage, kembalikan ke page 1
  const handleRowsPerPageChange = (newRows: number) => {
    setRowsPerPage(newRows);
    setPage(1);
  };

  return {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage: handleRowsPerPageChange,
    totalPages,
    paginatedData,
  };
}
