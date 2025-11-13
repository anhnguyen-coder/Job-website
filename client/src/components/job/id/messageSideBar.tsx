import MessageAttachments from "@/components/message/attachments";
import { formatTime } from "@/pkg/helpers/formatter";
import { useSocketMessages } from "@/pkg/socket/handler/message.handler";
import { getSocket } from "@/pkg/socket/socket";
import type {
  ConversationInterface,
  MessageInterface,
} from "@/pkg/types/interfaces/conversation";
import type { PagyInterface } from "@/pkg/types/interfaces/pagy";
import type { UserInterface } from "@/pkg/types/interfaces/user.type";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  currentUser: UserInterface;
  userId: string;
  handleGetConversation: (userId: string) => Promise<ConversationInterface>;
  handleGetMessages: (
    conversationId: string,
    page: number,
    isLoadMore?: boolean
  ) => Promise<[MessageInterface[], PagyInterface]>;
  handleSendMessage: (
    conversationId: string,
    message: string,
    userId: string,
    files?: File[]
  ) => Promise<MessageInterface>;
}

const SCROLL_BOTTOM_THRESHOLD = 100;

function MessageSideBar({
  isOpen,
  setIsOpen,
  currentUser,
  userId,
  handleGetConversation,
  handleGetMessages,
  handleSendMessage,
}: Props) {
  const [conversation, setConversation] = useState<ConversationInterface>();
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [rows, setRows] = useState(1);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [messages, setMessages] = useState<MessageInterface[]>();
  const [pagy, setPagy] = useState<PagyInterface>();
  const [page, setPage] = useState(1);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);

  const prevScrollHeight = useRef(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const socket = getSocket();
  const maxRows = 5;

  // Fetch conversation khi mở sidebar
  useEffect(() => {
    if (!userId || !isOpen) return;

    handleGetConversation(userId).then((conv) => {
      if (!conv) return;
      setConversation(conv);

      const join = () => socket?.emit("join_conversation", conv._id);
      if (socket?.connected) join();
      else socket?.once("connect", join);

      handleGetMessages(conv._id, 1, false).then((res) => {
        if (res) {
          if (res[0]) {
            setMessages(res[0]);
          }
          if (res[1]) {
            setPagy(res[1]);
          }
        }
      });
    });
  }, [userId, isOpen]);

  // Auto scroll lần đầu
  useLayoutEffect(() => {
    if (firstTimeLoad && messages && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      setFirstTimeLoad(false);
    }
  }, [messages, firstTimeLoad]);

  // Socket realtime
  useSocketMessages(conversation?._id || "", (newMessage) => {
    if (newMessage.conversationId === conversation?._id) {
      setMessages((prev) => [...(prev || []), newMessage]);
    }
  });

  // Auto scroll nếu ở gần đáy
  useEffect(() => {
    if (!messages) return;
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages?.length]);

  // Scroll + load more
  const handleScroll = () => {
    const el = messageRef.current;
    if (!el || !conversation || firstTimeLoad) return;

    const { scrollTop, scrollHeight, clientHeight } = el;

    // Load more khi scroll lên đầu
    if (scrollTop <= 10 && pagy?.nextPage && !isLoadMore) {
      prevScrollHeight.current = scrollHeight;
      setIsLoadMore(true);

      handleGetMessages(conversation._id, pagy.nextPage, true)
        .then(([newMessages, newPagy]) => {
          // Prepend messages cũ + mới
          setMessages((prev) => [...(newMessages || []), ...(prev || [])]);
          if (newPagy) setPagy(newPagy);
        })
        .finally(() => setIsLoadMore(false));
    }

    const atBottom =
      scrollHeight - scrollTop - clientHeight < SCROLL_BOTTOM_THRESHOLD;
    setIsNearBottom(atBottom);
  };

  // Giữ nguyên scroll khi load thêm
  useLayoutEffect(() => {
    const el = messageRef.current;
    if (!el) return;
    if (prevScrollHeight.current > 0) {
      const newHeight = el.scrollHeight;
      el.scrollTop = newHeight - prevScrollHeight.current;
      prevScrollHeight.current = 0;
    }
  }, [messages]);

  // File input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...filesArray].slice(0, 5));
  };

  const handleRemoveFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Send message
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
      setMessages((prev) => [...(prev || []), res]);
    }

    setMessage("");
    setSelectedFiles([]);
    setRows(1);
    textareaRef.current?.focus();
  }, [conversation, message, selectedFiles, userId]);

  // Resize textarea
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

  const targetUserName = useMemo(() => {
    if (!conversation || !currentUser) return "Unknown";
    return currentUser._id === conversation.user1._id
      ? conversation.user2.name
      : conversation.user1.name;
  }, [conversation, currentUser]);

  return (
    <div
      className={`
      fixed top-0 right-0 h-screen w-full sm:w-[360px] bg-white shadow-xl
      flex flex-col z-50 transform transition-transform duration-500
      ${isOpen ? "translate-x-0" : "translate-x-full"}
    `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shadow-sm">
        <p className="font-semibold text-lg truncate">{targetUserName}</p>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          <i className="bx bx-right-arrow" />
        </button>
      </div>

      {/* Message list */}
      <div
        ref={messageRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50"
      >
        {messages?.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-400">
            <i className="mdi mdi-message-outline text-4xl mb-2 animate-pulse" />
            <p>No messages yet!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages?.map((msg) => {
              const isMine = msg.senderId._id === currentUser._id;

              return (
                <div key={msg._id} className="px-1">
                  {/* Text message */}
                  {msg.content && (
                    <div
                      className={`flex items-center gap-2 ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      {isMine && (
                        <p className="text-[10px] text-gray-400">
                          {formatTime(msg.createdAt)}
                        </p>
                      )}

                      <div
                        className={`px-3 py-2 rounded-lg max-w-[70%] whitespace-pre-wrap break-words ${
                          isMine
                            ? "bg-indigo-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.content}
                      </div>

                      {!isMine && (
                        <p className="text-[10px] text-gray-400">
                          {formatTime(msg.createdAt)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Attachments */}
                  {msg.attachments?.length > 0 && (
                    <div
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="max-w-[70%] flex items-center gap-2">
                        {isMine && (
                          <p className="text-[10px] text-gray-400">
                            {formatTime(msg.createdAt)}
                          </p>
                        )}

                        <MessageAttachments
                          attachments={msg.attachments}
                          isMine={isMine}
                        />

                        {!isMine && (
                          <p className="text-[10px] text-gray-400">
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

      {/* Preview selected files */}
      {selectedFiles.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-2 bg-white border-t">
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
      <div className="px-4 py-3 flex items-end gap-2 border-t bg-white">
        <label
          htmlFor="fileInputSide"
          className="bg-gray-200 text-gray-600 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-300"
        >
          📎
        </label>
        <input
          id="fileInputSide"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <textarea
          ref={textareaRef}
          value={message}
          rows={rows}
          onChange={handleChange}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm resize-none focus:ring-indigo-200 focus:outline-none"
        />

        <button
          onClick={handleSend}
          className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default React.memo(MessageSideBar);
