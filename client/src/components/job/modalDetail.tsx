import { BaseBadge } from "@/components/base/badgeBase";
import { BaseButton } from "@/components/base/baseButton";
import { BaseModal } from "@/components/base/baseModal";
import {
  formatDate,
  formatUSD,
  getStatusBadgeVariant,
  getStatusLabel,
} from "@/pkg/helpers/formatter";
import { JOB_REQUEST_STATUS } from "@/pkg/types/enums/job";
import type { JobRequestInterface } from "@/pkg/types/interfaces/job.type";

interface Props {
  jobRequest: JobRequestInterface;
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  makeAcceptRequest: (id: string, status: string, workerId: string) => void;
}

function ModalDetail({
  jobRequest,
  isOpen,
  onOpenChange,
  makeAcceptRequest,
}: Props) {
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
                {jobRequest.jobId.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {jobRequest.jobId.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <i className="bx bx-map text-xl text-muted-foreground mt-0.5 flex-shrink-0"></i>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Location
                  </p>
                  <p className="text-sm font-medium">
                    {jobRequest.jobId.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <i className="bx bx-dollar text-xl text-muted-foreground mt-0.5 flex-shrink-0"></i>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Budget
                  </p>
                  <p className="text-sm font-medium">
                    {formatUSD(jobRequest.jobId.budget)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Job Status
                </p>
                <BaseBadge
                  variant={getStatusBadgeVariant(jobRequest.jobId.status)}
                >
                  {getStatusLabel(jobRequest.jobId.status)}
                </BaseBadge>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Request Status
                </p>
                <BaseBadge variant={getStatusBadgeVariant(jobRequest.status)}>
                  {getStatusLabel(jobRequest.status)}
                </BaseBadge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Created At
                </p>
                <p>{formatDate(jobRequest.jobId.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Last Updated
                </p>
                <p>{formatDate(jobRequest.jobId.updatedAt)}</p>
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
                  {jobRequest.workerId.name}
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
                  {jobRequest.workerId.email}
                </p>
              </div>
            </div>

            {jobRequest.workerId.phone && (
              <div className="flex items-start gap-3">
                <i className="bx bx-phone text-xl text-muted-foreground mt-0.5 flex-shrink-0"></i>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-sm font-medium">
                    {jobRequest.workerId.phone || "Not updated"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Request Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Request History
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Request Created At
                </p>
                <p>{formatDate(jobRequest.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Last Updated
                </p>
                <p>{formatDate(jobRequest.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <BaseButton variant="default" onClick={() => onOpenChange(false)}>
            Close
          </BaseButton>
          {jobRequest.status === JOB_REQUEST_STATUS.PENDING ? (
            <>
              <BaseButton
                variant="success"
                onClick={() => {
                  makeAcceptRequest(
                    jobRequest.jobId._id,
                    JOB_REQUEST_STATUS.ACCEPTED,
                    jobRequest.workerId._id
                  );
                  onOpenChange(false);
                }}
              >
                Accept
              </BaseButton>
              <BaseButton
                variant="danger"
                onClick={() => {
                  makeAcceptRequest(
                    jobRequest.jobId._id,
                    JOB_REQUEST_STATUS.REJECTED,
                    jobRequest.workerId._id
                  );
                  onOpenChange(false);
                }}
              >
                Reject
              </BaseButton>
            </>
          ) : null}
        </div>
      </div>
    </BaseModal>
  );
}

export default ModalDetail;
