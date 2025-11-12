import { useWorkerAuth } from "@/context/context";
import useHook from "./hook";
import { useEffect, useState } from "react";
import { PageHeading } from "@/components/base/pageheading";
import MessageList from "@/components/message/listConversation";
import type { UserInterface } from "@/pkg/interfaces/user.type";
import MessageBox from "@/components/message/messageBox";
import { refreshListConv } from "@/pkg/socket/handler/message.handler";

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
    sending,
    messPagy,
    handleGetConversations,
  } = useHook();

  const { worker, profile } = useWorkerAuth();

  useEffect(() => {
    if (!worker) profile();
  }, []);

  refreshListConv(() => {
    console.log("Socket triggered refresh!");
    handleGetConversations();
  });

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  return (
    <div className="flex flex-col gap-5 h-[calc(100vh-4rem)]">
      <PageHeading title="Messages" />

      <div className="flex flex-1 gap-4 min-h-0">
        <div className="w-1/4 min-h-0 overflow-y-auto">
          <MessageList
            conversations={conversations || []}
            pagy={conPagy ?? {}}
            currentUser={worker || ({} as UserInterface)}
            onPageChange={setConPage}
            setUserId={setUserId}
            userId={userId}
            setFirstTimeLoad={setFirstTimeLoad}
          />
        </div>
        {/* Right column */}
        <div className="flex-1 min-h-0 flex flex-col">
          <MessageBox
            sending={sending}
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
            pagy={messPagy ?? {}}
            firstTimeLoad={firstTimeLoad}
            setFirstTimeLoad={setFirstTimeLoad}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
