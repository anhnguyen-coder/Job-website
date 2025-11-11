import type { BaseBadgeProps } from "@/components/base/badgeBase";
import { JOB_REQUEST_STATUS, JOB_STATUS } from "../enums/job";

export const formatVND = (value: number): string => {
  if (isNaN(value)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export const formatUSD = (value: number): string => {
  if (isNaN(value)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export function formatDate(
  date: string | Date,
  locale: string = "vi-VN",
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
): string {
  if (!date) return "Không có dữ liệu";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Ngày không hợp lệ";
    return d.toLocaleString(locale, options);
  } catch {
    return "Lỗi định dạng ngày";
  }
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 => 12

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes} ${ampm}`;
}
// src/helpers/getStatusBadgeVariant.ts
export function getStatusBadgeVariant(
  status?: string
): BaseBadgeProps["variant"] {
  if (!status) return "default";

  switch (status) {
    // ✅ Job statuses
    case JOB_STATUS.AVAILABLE:
      return "info";
    case JOB_STATUS.TAKEN:
    case JOB_STATUS.IN_PROGRESS:
      return "warning";
    case JOB_STATUS.CHECK_COMPLETE:
    case JOB_STATUS.COMPLETED:
      return "success";
    case JOB_STATUS.CANCELLED:
      return "danger";

    // ✅ Job request statuses
    case JOB_REQUEST_STATUS.PENDING:
      return "warning";
    case JOB_REQUEST_STATUS.ACCEPTED:
      return "success";
    case JOB_REQUEST_STATUS.REJECTED:
      return "danger";

    default:
      return "default";
  }
}
export function getStatusLabel(status?: string): string {
  if (!status) return "Unknown";

  switch (status) {
    // ✅ Job statuses
    case JOB_STATUS.AVAILABLE:
      return "Available";
    case JOB_STATUS.TAKEN:
      return "Taken";
    case JOB_STATUS.IN_PROGRESS:
      return "In Progress";
    case JOB_STATUS.CHECK_COMPLETE:
      return "Check Complete";
    case JOB_STATUS.COMPLETED:
      return "Completed";
    case JOB_STATUS.CANCELLED:
      return "Cancelled";

    // ✅ Job request statuses
    case JOB_REQUEST_STATUS.PENDING:
      return "Pending";
    case JOB_REQUEST_STATUS.ACCEPTED:
      return "Accepted";
    case JOB_REQUEST_STATUS.REJECTED:
      return "Rejected";

    default:
      // fallback — format nicely (e.g. "in_progress" → "In Progress")
      return (
        status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")
      );
  }
}

export function formatDateDDMMYYYY(date: string | Date): string {
  if (!date) return "Không có dữ liệu";

  const _date = new Date(date);
  const day = String(_date.getDate()).padStart(2, "0");
  const month = String(_date.getMonth() + 1).padStart(2, "0");
  const year = _date.getFullYear();
  return `${day}-${month}-${year}`;
}
