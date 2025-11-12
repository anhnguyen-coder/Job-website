import { formatTime } from "@/pkg/helper/formatter";
import type { ConversationInterface } from "@/pkg/interfaces/conversation";
import type { PagyInterface } from "@/pkg/interfaces/pagy";
import type { UserInterface } from "@/pkg/interfaces/user.type";
import { useEffect, useRef } from "react";

type Props = {
  conversations: ConversationInterface[];
  pagy: PagyInterface;
  currentUser: UserInterface;
  onPageChange: (page: number) => void;
  setUserId: (id: string) => void;
  userId: string;
  setFirstTimeLoad: (val: boolean) => void;
};

function MessageList({
  conversations,
  pagy,
  currentUser,
  onPageChange,
  setUserId,
  userId,
  setFirstTimeLoad,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  // ✅ Auto-select conversation đầu tiên khi conversations thay đổi
  useEffect(() => {
    if (conversations && conversations.length > 0 && !userId) {
      const firstConv = conversations[0];
      const otherUserId =
        firstConv.user1._id === currentUser._id
          ? firstConv.user2._id
          : firstConv.user1._id;
      setUserId(otherUserId);
    }
  }, [conversations, currentUser, userId, setUserId]);

  // ✅ Xử lý scroll để load thêm
  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    if (
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10 &&
      pagy?.nextPage
    ) {
      onPageChange(pagy.nextPage);
    }
  };

  // ✅ Hàm lấy tên người còn lại
  const getOtherUserName = (conv: ConversationInterface) =>
    conv.user1._id === currentUser._id ? conv.user2?.name : conv.user1?.name;

  // ✅ Avatar chữ cái đầu
  const getOtherUserAvt = (conv: ConversationInterface) =>
    conv.user1._id === currentUser._id
      ? conv.user2?.name?.charAt(0)
      : conv.user1?.name?.charAt(0);

  const handleViewMessages = (conv: ConversationInterface) => {
    const otherUserId =
      conv.user1._id === currentUser._id ? conv.user2._id : conv.user1._id;
    setUserId(otherUserId);
    setFirstTimeLoad(true);
  };

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      className="h-full bg-white overflow-y-auto rounded-lg"
    >
      {/* 📨 Danh sách hội thoại */}
      {conversations && conversations.length > 0 ? (
        conversations.map((conv) => {
          const otherUserId =
            conv.user1._id === currentUser._id
              ? conv.user2._id
              : conv.user1._id;
          const isActive = userId === otherUserId;
          return (
            <div
              key={conv._id}
              onClick={() => handleViewMessages(conv)}
              className={`p-4 cursor-pointer flex flex-col hover:bg-gray-50 ${
                isActive ? "bg-indigo-50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                    {getOtherUserAvt(conv)?.toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-gray-800">
                      {getOtherUserName(conv)}
                    </div>
                    <div className="text-gray-600 text-sm truncate max-w-[200px]">
                      {conv.lastMessage?.content || "No messages yet"}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {conv.lastMessage && formatTime(conv.updatedAt)}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-400 py-6">No conversations</div>
      )}
    </div>
  );
}

export default MessageList;
