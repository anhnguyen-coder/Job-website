import { PageHeading } from "@/components/base/pageheading";
import MessageList from "@/components/message/listConversation";
import MessageBox from "@/components/message/messageBox";
import useHook from "./hook";
import { useWorkerAuth } from "@/context/context";
import { useEffect } from "react";
import type { UserInterface } from "@/pkg/interfaces/user.type";

function Page() {
  const {
    conversations,
    conPagy,
    setConPage,
    setUserId,
    userId,
    messages,
    handleGetConversationMessage,
    messPage,
    setMessPage,
    handleGetConversation,
    handleSendMessage,
    loadingMessages,
    setMessages,
  } = useHook();

  const { worker, profile } = useWorkerAuth();
  useEffect(() => {
    if (!worker) profile();
  }, []);
  return (
    <div className="flex flex-col gap-5 h-[calc(100vh-4rem)]">
      <PageHeading title="Messages" />

      <div className="flex flex-1 gap-4 min-h-0">
        {/* Left column */}
        <div className="w-1/4 min-h-0 overflow-y-auto">
          <MessageList
            conversations={conversations || []}
            pagy={conPagy ?? {}}
            currentUser={worker || ({} as UserInterface)}
            onPageChange={setConPage}
            setUserId={setUserId}
            userId={userId}
          />
        </div>

        {/* Right column */}
        <div className="flex-1 min-h-0 flex flex-col">
          <MessageBox
            loading={loadingMessages}
            currentUser={worker || ({} as UserInterface)}
            messages={messages}
            handleGetMessages={handleGetConversationMessage}
            page={messPage}
            setPage={setMessPage}
            userId={userId}
            handleGetConversation={handleGetConversation}
            handleSendMessage={handleSendMessage}
            setMessages={setMessages}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
