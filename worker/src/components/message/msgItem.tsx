import type { MessageInterface } from "@/pkg/interfaces/conversation";
import { useState } from "react";
import MessageAttachments from "./attachments";

interface props {
  msg: MessageInterface;
  isMine: boolean;
  onDelete?: () => void;
  onReply?: () => void;
  onForward?: () => void;
}

const MessageItem = ({ msg, isMine, onDelete, onReply, onForward }: props) => {
  const [showOptions, setShowOptions] = useState(false);

  const hasContent = !!msg.content;
  const hasAttachments = msg.attachments && msg.attachments.length > 0;

  const OptionButton = () => (
    <div
      className={`relative flex-shrink-0 self-start ${
        isMine ? "ml-2" : "mr-2"
      }`}
    >
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="p-1 hover:bg-gray-300 rounded-full"
      >
        <i className="mdi mdi-dots-horizontal text-gray-600"></i>
      </button>

      {showOptions && (
        <div
          className={`absolute ${
            isMine ? "left-full translate-x-2" : "right-full -translate-x-2"
          } bottom-1/2 bg-white border shadow-lg rounded-md flex z-10`}
        >
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-100 flex items-center justify-center"
          >
            <i className="mdi mdi-delete text-red-500"></i>
          </button>
          <button
            onClick={onReply}
            className="p-2 hover:bg-blue-100 flex items-center justify-center"
          >
            <i className="mdi mdi-reply text-blue-500"></i>
          </button>
          <button
            onClick={onForward}
            className="p-2 hover:bg-green-100 flex items-center justify-center"
          >
            <i className="mdi mdi-message-text text-green-500"></i>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}
      onMouseLeave={() => setShowOptions(false)}
    >
      {/* Nếu là tin nhắn của mình thì nút ... nằm bên trái */}
      {isMine && hasContent && <OptionButton />}

      {/* Nội dung message + attachments */}
      <div
        className={`flex flex-col max-w-[70%] ${
          isMine ? "items-end" : "items-start"
        }`}
      >
        {hasContent && (
          <div
            className={`px-4 py-2 rounded-lg break-words whitespace-pre-wrap ${
              isMine
                ? "bg-indigo-500 text-white rounded-br-none"
                : "bg-gray-200 text-gray-800 rounded-bl-none"
            }`}
          >
            {msg.content}
          </div>
        )}

        {hasAttachments && (
          <div className="mt-1 w-full">
            <MessageAttachments attachments={msg.attachments} isMine={isMine} />
          </div>
        )}
      </div>

      {/* Nếu KHÔNG phải tin nhắn của mình thì nút ... nằm bên phải */}
      {!isMine && hasContent && <OptionButton />}
    </div>
  );
};

export default MessageItem;
