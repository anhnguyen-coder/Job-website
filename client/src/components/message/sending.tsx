import type { AttachmentInterface } from "@/pkg/types/interfaces/conversation";
import React, { useEffect, useState } from "react";

interface Props {
  text: string;
  attachments?: File[]; // pass trực tiếp File[]
  isMine?: boolean;
}

const SendingMessage: React.FC<Props> = ({
  text,
  attachments = [],
  isMine = true,
}) => {
  const [tempAttachments, setTempAttachments] = useState<AttachmentInterface[]>(
    []
  );

  useEffect(() => {
    const temps: AttachmentInterface[] = attachments.map((file, index) => ({
      _id: `temp-${index}`,
      fileName: file.name,
      fileType: file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("video")
        ? "video"
        : "file",
      url: URL.createObjectURL(file),
      messageId: `temp-${index}`, // tạm placeholder
      uploaderId: "temp", // tạm placeholder
      fileSize: file.size,
      mimeType: file.type,
      thumbnailUrl: URL.createObjectURL(file), // dùng same url tạm
    }));

    setTempAttachments(temps);

    return () => {
      // cleanup để tránh memory leak
      temps.forEach((att) => URL.revokeObjectURL(att.url));
    };
  }, [attachments]);

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
      <div className="flex flex-col max-w-[70%] bg-indigo-500 text-white px-4 py-2 rounded-lg rounded-br-none animate-pulse">
        {text && <p className="whitespace-pre-wrap mb-2">{text}</p>}

        {tempAttachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tempAttachments.map((att) => (
              <div key={att._id} className="flex-shrink-0 max-w-[200px]">
                {att.fileType === "image" && (
                  <img
                    src={att.url}
                    alt={att.fileName}
                    className="rounded-md max-h-64 w-full object-contain"
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
        )}
      </div>
    </div>
  );
};

export default SendingMessage;
