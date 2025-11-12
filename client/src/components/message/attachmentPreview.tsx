import type { AttachmentInterface } from "@/pkg/types/interfaces/conversation";
import React, { useEffect } from "react";

interface Props {
  attachments: AttachmentInterface[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const AttachmentPreviewModal: React.FC<Props> = ({
  attachments,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}) => {
  const att = attachments[currentIndex];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onNext, onPrev, onClose]);

  if (!isOpen || !att) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-2xl hover:text-gray-300"
      >
        <i className="mdi mdi-close"></i>
      </button>

      <button
        onClick={onPrev}
        className="absolute left-5 text-white text-3xl hover:text-gray-300"
      >
        <i className="mdi mdi-chevron-left"></i>
      </button>

      <div className="max-w-4xl max-h-[90vh] flex justify-center items-center">
        {att.fileType === "image" && (
          <img
            src={att.url}
            alt={att.fileName}
            className="max-w-full max-h-[90vh] rounded-lg object-contain"
          />
        )}
        {att.fileType === "video" && (
          <video
            src={att.url}
            controls
            autoPlay
            className="max-w-full max-h-[90vh] rounded-lg object-contain"
          />
        )}
        {att.fileType !== "image" && att.fileType !== "video" && (
          <a
            href={att.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline text-lg"
          >
            {att.fileName}
          </a>
        )}
      </div>

      <button
        onClick={onNext}
        className="absolute right-5 text-white text-3xl hover:text-gray-300"
      >
        <i className="mdi mdi-chevron-right"></i>
      </button>
    </div>
  );
};

export default AttachmentPreviewModal;
