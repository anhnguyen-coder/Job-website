import type {
  ConversationInterface,
  MessageInterface,
} from "@/pkg/interfaces/conversation";
import type { PagyInterface } from "@/pkg/interfaces/pagy";
import type { UserInterface } from "@/pkg/interfaces/user.type";
import { useSocketMessages } from "@/pkg/socket/handler/message.handler";
import { getSocket } from "@/pkg/socket/socket";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { LoadingCustom } from "../base/loading";
import { formatTime } from "@/pkg/helper/formatter";
import MessageAttachments from "./attachments";

type Props = {
  loading: boolean;
  currentUser: UserInterface;
  messages: MessageInterface[];
  setMessages: Dispatch<SetStateAction<MessageInterface[]>>;
  handleGetMessages: (
    conversationId: string,
    page: number,
    isLoadMore: boolean
  ) => void;
  page: number;
  setPage: (page: number) => void;
  userId: string;
  handleGetConversation: (userId: string) => Promise<ConversationInterface>;
  handleSendMessage: (
    conversationId: string,
    message: string,
    userId: string,
    files?: File[]
  ) => Promise<MessageInterface>;
  sending: boolean;
  pagy: PagyInterface;
  firstTimeLoad: boolean;
  setFirstTimeLoad: (val: boolean) => void;
};

const SCROLL_BOTTOM_THRESHOLD = 100; // px

const Message: React.FC<Props> = ({
  loading,
  currentUser,
  messages,
  handleGetMessages,
  page,
  userId,
  sending,
  setMessages,
  handleSendMessage,
  handleGetConversation,
  firstTimeLoad,
  setFirstTimeLoad,
  pagy,
}) => {
  const [conversation, setConversation] = useState<ConversationInterface>();
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [rows, setRows] = useState(1);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef(0);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const socket = getSocket();
  const maxRows = 5;

  // 🧠 Fetch conversation khi userId thay đổi
  useEffect(() => {
    if (!userId) return;
    handleGetConversation(userId).then((conv) => {
      if (conv) {
        if (socket) {
          const join = () => socket.emit("join_conversation", conv._id);
          if (socket.connected) join();
          else socket.once("connect", join);
        }
        setConversation(conv);
        handleGetMessages(conv._id, 1, false);
      }
    });
  }, [userId]);

  // 🌀 Auto scroll xuống cuối khi lần đầu load
  useLayoutEffect(() => {
    if (firstTimeLoad && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      setFirstTimeLoad(false);
    }
  }, [messages, firstTimeLoad]);

  // 🔁 Khi có tin nhắn mới (realtime)
  useSocketMessages(conversation?._id || "", (newMessage) => {
    if (newMessage.conversationId === conversation?._id) {
      setMessages((prev) => [...prev, newMessage]);
    }
  });

  // 👇 Auto scroll nếu user đang ở gần cuối
  useEffect(() => {
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // 🧭 Kiểm tra vị trí scroll
  const handleScroll = () => {
    const el = messageRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;

    // Bỏ qua lần đầu load (để tránh load more tự động)
    if (firstTimeLoad) return;

    // Load thêm khi scroll lên đầu
    if (scrollTop <= 10 && pagy?.nextPage && conversation && !isLoadMore) {
      prevScrollHeight.current = scrollHeight;
      setIsLoadMore(true);
      handleGetMessages(conversation._id, pagy.nextPage, true);
    }

    // Xác định user có đang ở gần đáy không
    const atBottom =
      scrollHeight - scrollTop - clientHeight < SCROLL_BOTTOM_THRESHOLD;
    setIsNearBottom(atBottom);
  };

  // 📜 Giữ nguyên vị trí khi load thêm message
  useLayoutEffect(() => {
    const el = messageRef.current;
    if (!el) return;
    if (prevScrollHeight.current > 0) {
      const newHeight = el.scrollHeight;
      el.scrollTop = newHeight - prevScrollHeight.current;
      prevScrollHeight.current = 0;
      setIsLoadMore(false);
    }
  }, [messages]);

  // 📎 File input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const newFiles = [...selectedFiles, ...filesArray].slice(0, 5);
    setSelectedFiles(newFiles);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✉️ Gửi tin nhắn
  const handleSend = useCallback(async () => {
    if (!message.trim() && selectedFiles.length === 0) return;
    if (!conversation || !userId) return;

    const res = await handleSendMessage(
      conversation._id,
      message.trim(),
      userId,
      selectedFiles
    );

    if (res && (!socket || !socket.connected)) {
      setMessages((prev) => [...prev, res]);
    }

    setMessage("");
    setSelectedFiles([]);
    setRows(1);
    textareaRef.current?.focus();
  }, [conversation, message, selectedFiles, userId]);

  // 🧩 Tự động thay đổi chiều cao textarea
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

  // 👤 Xác định tên người chat
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
          {/* Header */}
          <div className="shadow-md px-6 py-4 text-2xl font-semibold border-b border-gray-200">
            <p>{targetUserName}</p>
          </div>

          {/* Message list */}
          {loading ? (
            <div className="flex-1 flex justify-center items-center">
              <LoadingCustom />
            </div>
          ) : (
            <div
              ref={messageRef}
              onScroll={handleScroll}
              className="flex-1 flex flex-col px-6 py-4 overflow-y-auto max-h-[70vh]"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1">
                  <i className="mdi mdi-message-outline text-gray-400 text-4xl"></i>
                  <p className="text-gray-400 text-xl">No message yet!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {messages.map((msg) => {
                    const isMine = msg.senderId._id === currentUser._id;
                    return (
                      <div key={msg._id} className="px-8">
                        {msg.content && (
                          <div
                            className={`flex items-center gap-3 ${
                              isMine ? "justify-end" : "justify-start"
                            } mb-2`}
                          >
                            {isMine && (
                              <p className="text-xs text-gray-400">
                                {formatTime(msg.createdAt)}
                              </p>
                            )}
                            <div
                              className={`flex flex-col px-4 py-2 rounded-lg max-w-[70%] break-words ${
                                isMine
                                  ? "bg-indigo-500 text-white rounded-br-none"
                                  : "bg-gray-200 text-gray-800 rounded-bl-none"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">
                                {msg.content}
                              </p>
                            </div>
                            {!isMine && (
                              <p className="text-xs text-gray-400">
                                {formatTime(msg.createdAt)}
                              </p>
                            )}
                          </div>
                        )}

                        {msg.attachments?.length > 0 && (
                          <div
                            className={`flex mb-3 ${
                              isMine ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div className="max-w-[60%] flex items-center gap-4">
                              {isMine && (
                                <p className="text-xs text-gray-400">
                                  {formatTime(msg.createdAt)}
                                </p>
                              )}
                              <MessageAttachments
                                attachments={msg.attachments}
                                isMine={isMine}
                              />
                              {!isMine && (
                                <p className="text-xs text-gray-400">
                                  {formatTime(msg.createdAt)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>
          )}

          {/* File preview */}
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

          {/* Input */}
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
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <i className="mdi mdi-message-outline text-4xl"></i>
          <p className="text-2xl font-semibold">Please select a conversation</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(Message);
