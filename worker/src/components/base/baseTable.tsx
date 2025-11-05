import { type ReactNode } from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode; // custom render cho cell
}

interface BaseTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  title?: string;
  emptyText?: string;
  onRowClick?: (id: string) => void;
}

export const BaseTable = <T extends { _id?: string }>({
  columns,
  data,
  loading,
  title,
  emptyText = "Không có dữ liệu",
  onRowClick,
}: BaseTableProps<T>) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      {title && <h3 className="text-xl font-semibold mb-3">{title}</h3>}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-200 text-sm text-left">
          <thead className="bg-slate-100">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-2 border-b border-slate-200 font-medium text-slate-600"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-slate-500"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-slate-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item._id || Math.random()}
                  className="hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    onRowClick?.(item._id || "");
                  }}
                >
                  {columns.map((col, index) => (
                    <td
                      key={index}
                      className="px-4 py-2 border-b border-slate-100 text-slate-700"
                    >
                      {col.render
                        ? col.render(item)
                        : (item[col.key as keyof T] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
