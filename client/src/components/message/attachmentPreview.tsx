import type { AttachmentInterface } from "@/pkg/types/interfaces/conversation";
import React from "react";

interface Props {
  attachment: AttachmentInterface | null;
  isOpen: boolean;
  onClose: () => void;
}

const AttachmentPreviewModal: React.FC<Props> = ({
  attachment,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !attachment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90%] max-h-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl font-bold z-10"
        >
          &times;
        </button>
        {attachment.fileType === "image" && (
          <img
            src={attachment.url}
            alt={attachment.fileName}
            className="w-full h-auto max-h-[90vh] object-contain rounded-md"
          />
        )}
        {attachment.fileType === "video" && (
          <video
            src={attachment.url}
            controls
            autoPlay
            className="w-full max-h-[90vh] rounded-md"
          />
        )}
        {attachment.fileType !== "image" && attachment.fileType !== "video" && (
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline"
          >
            {attachment.fileName}
          </a>
        )}
      </div>
    </div>
  );
};

export default AttachmentPreviewModal;
