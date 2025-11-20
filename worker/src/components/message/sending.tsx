type FilePreviewType =
  | "image"
  | "video"
  | "audio"
  | "text"
  | "application"
  | "file";

import type { AttachmentInterface } from "@/pkg/interfaces/conversation";
import React, { useEffect, useState } from "react";

interface Props {
  text: string;
  attachments?: File[];
  isMine?: boolean;
}

// Detect preview type from MIME
const detectFileType = (file: File): FilePreviewType => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("text/")) return "text";

  if (file.type.startsWith("application/")) return "application";

  return "file";
};

const SendingMessage: React.FC<Props> = ({
  text,
  attachments = [],
  isMine = true,
}) => {
  const [tempAttachments, setTempAttachments] = useState<AttachmentInterface[]>(
    []
  );

  const [textPreview, setTextPreview] = useState<Record<string, string>>({});

  useEffect(() => {
    const temps: AttachmentInterface[] = attachments.map((file, index) => {
      const fileType = detectFileType(file);

      return {
        _id: `temp-${index}`,
        fileName: file.name,
        fileType,
        url: URL.createObjectURL(file),
        messageId: `temp-${index}`,
        uploaderId: "temp",
        fileSize: file.size,
        mimeType: file.type,
        thumbnailUrl: URL.createObjectURL(file),
      };
    });

    setTempAttachments(temps);

    // Load text preview asynchronously
    temps.forEach((att) => {
      if (att.fileType === "text") {
        fetch(att.url)
          .then((res) => res.text())
          .then((txt) =>
            setTextPreview((prev) => ({
              ...prev,
              [att._id]: txt.substring(0, 200),
            }))
          );
      }
    });

    return () => {
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
                
                {/* IMAGE PREVIEW */}
                {att.fileType === "image" && (
                 <div className="flex items-center gap-2 p-2 bg-black/20 rounded-md">
                    <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center text-2xl">
                      📄
                    </div>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-white break-all"
                    >
                      {att.fileName}
                    </a>
                  </div>
                )}

                {/* VIDEO PREVIEW */}
                {att.fileType === "video" && (
                  <video
                    src={att.url}
                    controls
                    className="rounded-md max-h-64 w-full object-contain"
                  />
                )}

                {/* AUDIO PREVIEW */}
                {att.fileType === "audio" && (
                  <div className="p-2 bg-black/20 rounded-md">
                    <audio src={att.url} controls className="w-full" />
                  </div>
                )}

                {/* TEXT PREVIEW */}
                {att.fileType === "text" && (
                  <div className="p-3 bg-black/20 rounded-md text-sm whitespace-pre-wrap">
                    <strong>{att.fileName}</strong>
                    <p className="mt-1 opacity-90">
                      {textPreview[att._id] || "Loading text preview..."}
                    </p>
                  </div>
                )}

                {/* APPLICATION / FILE */}
                {(att.fileType === "application" || att.fileType === "file") && (
                  <div className="flex items-center gap-2 p-2 bg-black/20 rounded-md">
                    <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center text-2xl">
                      📄
                    </div>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-white break-all"
                    >
                      {att.fileName}
                    </a>
                  </div>
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
