import { LoadingCustom } from "@/components/base/loading";
import { useSocketMessages } from "@/pkg/socket/handler/message.handler";
import { getSocket } from "@/pkg/socket/socket";
import type {
  ConversationInterface,
  MessageInterface,
} from "@/pkg/types/interfaces/conversation";
import type { PagyInterface } from "@/pkg/types/interfaces/pagy";
import type { UserInterface } from "@/pkg/types/interfaces/user.type";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  currentUser: UserInterface;
  userId: string;
  handleGetConversation: (userId: string) => Promise<ConversationInterface>;
  handleGetMessages: (
    conversationId: string,
    page: number
  ) => Promise<[MessageInterface[], PagyInterface]>;
  handleSendMessage: (
    conversationId: string,
    message: string,
    userId: string,
    files?: File[]
  ) => Promise<MessageInterface>;
}

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
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [pagy, setPagy] = useState<PagyInterface>();
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [rows, setRows] = useState(1);
  const maxRows = 5;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();

  // Load conversation + messages
  useEffect(() => {
    if (!userId || !isOpen) return;

    const loadConversation = async () => {
      try {
        setLoading(true);
        const conv = await handleGetConversation(userId);
        if (conv) {
          setConversation(conv);
          const [msgs, pg] = await handleGetMessages(conv._id, 1);
          setMessages(msgs || []);
          setPagy(pg || {});

          if (socket && socket.connected) {
            socket.emit("join_conversation", conv._id);
            console.log("emit join_conversation immediately");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [userId, isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle message input
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

  // Handle file selection
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

    if (res) {
      if (!socket || (socket && !socket.connected)) {
        setMessages((prev) => [res, ...(prev || [])]);
      }
    }
    setMessage("");
    setSelectedFiles([]);
    setRows(1);
    textareaRef.current?.focus();
  }, [conversation, message, selectedFiles, userId]);

  useSocketMessages(conversation?._id || "", (newMessage) => {
    // if(socket && socket.connected)
    if (socket && socket.connected) {
      setMessages((prev) => [newMessage, ...(prev || [])]);
    }
  });

  const targetUserName = useMemo(() => {
    if (!conversation || !currentUser) return "Unknown";
    return currentUser._id === conversation.user1._id
      ? conversation.user2.name
      : conversation.user1.name;
  }, [conversation, currentUser]);

  // Sidebar slide-in/out classes
  const sidebarClasses = `
    fixed top-0 right-0 h-screen w-full sm:w-[360px] z-50 flex flex-col bg-white
    shadow-xl transition-transform duration-500 ease-in-out
    ${isOpen ? "translate-x-0" : "translate-x-full"}
  `;

  const messageItemClasses = (isMine: boolean) =>
    `px-3 py-2 rounded-lg max-w-[70%] break-words whitespace-pre-wrap
     transition-colors duration-300
     ${
       isMine
         ? "bg-indigo-500 text-white rounded-br-none"
         : "bg-gray-200 text-gray-800 rounded-bl-none"
     }`;

  const fileItemClasses =
    "flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm border transition-colors duration-200 hover:bg-gray-200";

  return (
    <div className={sidebarClasses}>
      {/* Header */}
      <div className="flex-none flex items-center justify-between px-4 py-3 border-b shadow-sm">
        <p className="font-semibold text-lg truncate">{targetUserName}</p>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-xl transition-colors duration-200 cursor-pointer"
        >
          <i className="bx bx-right-arrow"></i>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col px-4 py-3 bg-gray-50 overflow-y-auto transition-all duration-300">
        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <LoadingCustom />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
            <i className="mdi mdi-message-outline text-4xl mb-2 animate-pulse"></i>
            <p>No messages yet!</p>
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-2">
            <div ref={bottomRef} />
            {messages.map((msg) => {
              const isMine = msg.senderId._id === currentUser._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isMine ? "justify-end" : "justify-start"
                  } transition-all duration-300`}
                >
                  <div className={messageItemClasses(isMine)}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-none px-4 py-3 border-t flex flex-col gap-2 bg-white transition-all duration-300">
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className={fileItemClasses}>
                <span className="truncate max-w-[100px]">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(idx)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <label
            htmlFor="fileInput"
            className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-200 resize-none overflow-y-auto transition-all duration-200"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-200 text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageSideBar;
