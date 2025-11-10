import { BaseBadge } from "@/components/base/badgeBase";
import { BaseButton } from "@/components/base/baseButton";
import { BaseModal } from "@/components/base/baseModal";
import {
  formatDate,
  formatUSD,
  getStatusBadgeVariant,
  getStatusLabel,
} from "@/pkg/helpers/formatter";
import { JOB_STATUS } from "@/pkg/types/enums/job";
import { PAYMENT_METHOD } from "@/pkg/types/enums/payment";
import type { JobInterface } from "@/pkg/types/interfaces/job.type";
import { useState } from "react";

interface Props {
  job: JobInterface;
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  makeJobComplete: (id: string, payment: string) => void;
}

function MarkCompleteModalDetail({
  job,
  isOpen,
  onOpenChange,
  makeJobComplete,
}: Props) {
  const paymentSelections = [
    { key: PAYMENT_METHOD.CASH, label: "Cash" },
    {
      key: PAYMENT_METHOD.BANK_TRANSFER,
      label: "Bank transfer",
    },
    { key: PAYMENT_METHOD.CREDIT_CARD, label: "Credit card" },
    { key: PAYMENT_METHOD.E_WALLET, label: "E-wallet" },
  ];

  const [payment, setPayment] = useState("");
  const [err, setErr] = useState("");

  return (
    <BaseModal isOpen={isOpen} onClose={() => onOpenChange(false)}>
      <div className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Job Request Details</h2>
          <p className="text-muted-foreground">
            Detailed information about the job request and assigned worker
          </p>
        </div>

        <div className="space-y-6">
          {/* Job Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Job Information
            </h3>

            <div>
              <h4 className="text-base font-medium text-foreground mb-1">
                {job.title}
              </h4>
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <i className="bx bx-map text-xl text-muted-foreground mt-0.5 flex-shrink-0"></i>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Location
                  </p>
                  <p className="text-sm font-medium">{job.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <i className="bx bx-dollar text-xl text-muted-foreground mt-0.5 flex-shrink-0"></i>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Budget
                  </p>
                  <p className="text-sm font-medium">{formatUSD(job.budget)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Job Status
                </p>
                <BaseBadge variant={getStatusBadgeVariant(job.status)}>
                  {getStatusLabel(job.status)}
                </BaseBadge>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Request Status
                </p>
                <BaseBadge variant={getStatusBadgeVariant(job.status)}>
                  {getStatusLabel(job.status)}
                </BaseBadge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Created At
                </p>
                <p>{formatDate(job.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Last Updated
                </p>
                <p>{formatDate(job.updatedAt)}</p>
              </div>
            </div>
          </div>
          {/* Worker Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Assigned Worker Information
            </h3>

            <div className="flex items-start gap-3">
              <i className="bx bx-user text-xl text-muted-foreground mt-0.5 flex-shrink-0"></i>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Worker Name
                </p>
                <p className="text-sm font-medium">
                  {job.assignedWorkerId?.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <i className="bx bx-envelope text-xl text-muted-foreground mt-0.5 flex-shrink-0"></i>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-sm font-medium">
                  {job.assignedWorkerId?.email}
                </p>
              </div>
            </div>

            {job.assignedWorkerId?.phone && (
              <div className="flex items-start gap-3">
                <i className="bx bx-phone text-xl text-muted-foreground mt-0.5 flex-shrink-0"></i>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-sm font-medium">
                    {job.assignedWorkerId.phone || "Not updated"}
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* payments */}
          <select
            value={payment}
            onChange={(e) => {
              setPayment(e.target.value);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          >
            <option value="">Select payment method</option>
            {paymentSelections.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>

          {err && (
            <>
              <p className="text-red-500 text-sm">{err}</p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <BaseButton variant="default" onClick={() => onOpenChange(false)}>
            Close
          </BaseButton>
          {job.status === JOB_STATUS.CHECK_COMPLETE ? (
            <>
              <BaseButton
                variant="success"
                onClick={() => {
                  setErr("");
                  if (!payment || payment.trim() === "") {
                    setErr("Please select a pament method");
                  }
                  makeJobComplete(job._id, payment);
                  onOpenChange(false);
                }}
              >
                Accept
              </BaseButton>
            </>
          ) : null}
        </div>
      </div>
    </BaseModal>
  );
}

export default MarkCompleteModalDetail;
