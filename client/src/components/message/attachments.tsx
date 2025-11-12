import React, { useState } from "react";
import AttachmentPreviewModal from "./attachmentPreview";
import type { AttachmentInterface } from "@/pkg/types/interfaces/conversation";

interface Props {
  attachments: AttachmentInterface[];
  isMine: boolean;
}

const MessageAttachments: React.FC<Props> = ({ attachments, isMine }) => {
  if (!attachments || attachments.length === 0) return null;

  const rows: AttachmentInterface[][] = [];
  for (let i = 0; i < attachments.length; i += 3) {
    rows.push(attachments.slice(i, i + 3));
  }

  const [isOpen, setIsOpen] = useState(false);
  const [attachment, setAttachment] = useState<AttachmentInterface>();

  return (
    <div className="flex flex-col gap-2 mt-1">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-3 gap-2"
          style={isMine ? { direction: "rtl" } : {}}
        >
          {row.map((att) => (
            <div
              onClick={() => {
                setAttachment(att);
                setIsOpen(true);
              }}
              key={att._id}
              className="flex-shrink-0 max-w-[200px] cursor-pointer"
              style={{ direction: "ltr" }} // giữ nội dung không bị đảo
            >
              {att.fileType === "image" && (
                <img
                  src={att.url}
                  alt={att.fileName}
                  className="rounded-md max-h-64 w-full object-contain shadow-blue-00 shadow-lg"
                />
              )}
              {att.fileType === "video" && (
                <video
                  src={att.url}
                  controls
                  className="rounded-md max-h-64 w-full object-contain"
                />
              )}
              {att.fileType !== "image" && att.fileType !== "video" && (
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  {att.fileName}
                </a>
              )}
            </div>
          ))}
        </div>
      ))}

      {isOpen && (
        <AttachmentPreviewModal
          attachment={attachment || null}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MessageAttachments;
