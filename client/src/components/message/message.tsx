import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import type {
  ConversationInterface,
  MessageInterface,
} from "@/pkg/types/interfaces/conversation";
import type { UserInterface } from "@/pkg/types/interfaces/user.type";
import { LoadingCustom } from "../base/loading";

type Props = {
  loading: boolean;
  currentUser: UserInterface;
  messages: MessageInterface[];
  handleGetMessages: (conversationId: string, page: number) => void;
  page: number;
  setPage: (page: number) => void;
  userId: string;
  handleGetConversation: (userId: string) => Promise<ConversationInterface>;
  handleSendMessage: (
    conversationId: string,
    message: string,
    userId: string,
    files?: File[]
  ) => Promise<void>;
};

const Message: React.FC<Props> = ({
  loading,
  currentUser,
  messages,
  handleGetMessages,
  page,
  userId,
  handleSendMessage,
  handleGetConversation,
}) => {
  const [conversation, setConversation] = useState<ConversationInterface>();
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [rows, setRows] = useState(1);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const maxRows = 5;

  // 🧠 Fetch conversation khi userId thay đổi
  useEffect(() => {
    if (!userId) return;
    handleGetConversation(userId).then((conv) => {
      if (conv) {
        setConversation(conv);
        handleGetMessages(conv._id, 1);
      }
    });
  }, [userId]);

  // 🌀 Auto scroll xuống cuối khi có message mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📎 Chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const newFiles = [...selectedFiles, ...filesArray].slice(0, 5);
    setSelectedFiles(newFiles);
  };

  // 🗑 Gỡ file đính kèm
  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✉️ Gửi tin nhắn
  const handleSend = useCallback(async () => {
    if (!message.trim() && selectedFiles.length === 0) return;
    if (!conversation || !userId) return;

    await handleSendMessage(
      conversation._id,
      message.trim(),
      userId,
      selectedFiles
    );

    setMessage("");
    setSelectedFiles([]);
    setRows(1);
    textareaRef.current?.focus();
  }, [conversation, message, selectedFiles, userId]);

  // 🔤 Tự động điều chỉnh chiều cao textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lineHeight = 24;
    e.target.rows = 1;
    const currentRows = Math.min(
      Math.floor(e.target.scrollHeight / lineHeight),
      maxRows
    );
    e.target.rows = currentRows;
    setRows(currentRows);
    setMessage(e.target.value);
  };

  // 👤 Lấy tên người đối thoại
  const targetUserName = useMemo(() => {
    if (!conversation || !currentUser) return "Unknown";
    return currentUser._id === conversation.user1._id
      ? conversation.user2.name
      : conversation.user1.name;
  }, [conversation, currentUser]);

  return (
    <div className="bg-white rounded-lg flex flex-col h-full">
      {conversation ? (
        <div className="flex flex-col h-full">
          {/* 🧭 Header */}
          <div className="shadow-md px-6 py-4 text-2xl font-semibold border-b border-gray-200">
            <p>{targetUserName}</p>
          </div>

          {/* 💬 Nội dung tin nhắn */}
          {loading ? (
            <div className="flex-1 flex justify-center items-center">
              <LoadingCustom />
            </div>
          ) : (
            <div className="flex-1 flex flex-col px-6 py-4 overflow-y-auto max-h-[70vh]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1">
                  <i className="mdi mdi-message-outline text-gray-400 text-4xl"></i>
                  <p className="text-gray-400 text-xl">No message yet!</p>
                </div>
              ) : (
                <div className="flex flex-col-reverse gap-2 scroll-hidden">
                  <div ref={bottomRef} />
                  {messages.map((msg) => {
                    const isMine = msg.senderId._id === currentUser._id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-lg max-w-[70%] whitespace-pre-wrap break-words ${
                            isMine
                              ? "bg-indigo-500 text-white rounded-br-none"
                              : "bg-gray-200 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 📎 File đính kèm */}
          {selectedFiles.length > 0 && (
            <div className="px-6 mb-2 flex flex-wrap gap-2">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm border"
                >
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 📝 Input gửi tin */}
          <div className="px-6 pb-4 flex items-end gap-2">
            <label
              htmlFor="fileInput"
              className="bg-gray-200 text-gray-600 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
              title="Attach files"
            >
              📎
            </label>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />

            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              rows={rows}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-200 resize-none overflow-y-auto"
            />

            <button
              onClick={handleSend}
              className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors text-sm"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        // 🕊 Trạng thái chưa chọn hội thoại
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <i className="mdi mdi-message-outline text-4xl"></i>
          <p className="text-2xl font-semibold">Please select a conversation</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(Message);
