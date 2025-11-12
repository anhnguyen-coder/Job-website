import React, { useState } from "react";
import AttachmentPreviewModal from "./attachmentPreview";
import type { AttachmentInterface } from "@/pkg/types/interfaces/conversation";

interface Props {
  attachments: AttachmentInterface[];
  isMine: boolean;
}

const MessageAttachments: React.FC<Props> = ({ attachments, isMine }) => {
  if (!attachments || attachments.length === 0) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openPreview = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextAttachment = () =>
    setCurrentIndex((prev) => (prev + 1) % attachments.length);

  const prevAttachment = () =>
    setCurrentIndex((prev) => (prev === 0 ? attachments.length - 1 : prev - 1));

  return (
    <div
      className={`relative mt-1 flex items-center ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      {/* Stack kiểu Messenger có hiệu ứng nghiêng xen kẽ */}
      <div className="relative h-48 w-48 cursor-pointer">
        {attachments.map((att, index) => {
          const rotate =
            index % 2 === 0
              ? `${Math.min(index * 3, 8)}deg` // nghiêng phải
              : `${-Math.min(index * 3, 8)}deg`; // nghiêng trái

          const offset = index * 5; // khoảng cách lệch xuống
          const zIndex = 10 + index; // đảm bảo layer rõ

          return (
            <div
              key={att._id}
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              style={{
                transform: `rotate(${rotate}) translateY(${offset}px)`,
                zIndex,
              }}
              onClick={() => openPreview(index)}
            >
              {att.fileType === "image" && (
                <img
                  src={att.url}
                  alt={att.fileName}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              {att.fileType === "video" && (
                <video
                  src={att.url}
                  className="w-full h-full object-cover rounded-lg"
                  muted
                />
              )}
              {att.fileType !== "image" && att.fileType !== "video" && (
                <div className="bg-gray-100 border rounded-lg p-3 flex items-center justify-center h-full">
                  <span className="text-sm text-gray-700 text-center break-all">
                    {att.fileName}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isOpen && (
        <AttachmentPreviewModal
          attachments={attachments}
          currentIndex={currentIndex}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onNext={nextAttachment}
          onPrev={prevAttachment}
        />
      )}
    </div>
  );
};

export default MessageAttachments;
