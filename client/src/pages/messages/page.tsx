import { PageHeading } from "@/components/customer/pageheading";
import useHook from "./hook";
import MessageList from "@/components/message/list";
import { useCustomerAuth } from "@/contexts/customer";
import { useEffect, useState } from "react";
import type { UserInterface } from "@/pkg/types/interfaces/user.type";
import Message from "@/components/message/message";

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
  } = useHook();

  const { user, profile } = useCustomerAuth();

  useEffect(() => {
    if (!user) profile();
  }, []);

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  return (
    <div className="flex flex-col gap-5 h-[calc(100vh-4rem)]">
      <PageHeading title="Messages" />

      <div className="flex flex-1 gap-4 min-h-0">
        <div className="w-1/4 min-h-0 overflow-y-auto">
          <MessageList
            conversations={conversations || []}
            pagy={conPagy ?? {}}
            currentUser={user || ({} as UserInterface)}
            onPageChange={setConPage}
            setUserId={setUserId}
            userId={userId}
            setFirstTimeLoad={setFirstTimeLoad}
          />
        </div>
        {/* Right column */}
        <div className="flex-1 min-h-0 flex flex-col">
          <Message
            sending={sending}
            loading={loadingMessages}
            currentUser={user || ({} as UserInterface)}
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
