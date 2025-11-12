import { MESSAGE_GET_API, MESSAGE_POST_API } from "@/apis/customer/message";
import axiosInstance from "@/pkg/axios/axiosInstance";
import { useErrorHandler } from "@/pkg/helpers/errorHandler";
import { buildQueryParams } from "@/pkg/helpers/query";
import { refreshListConv } from "@/pkg/socket/handler/message.handler";
import type {
  ConversationInterface,
  MessageInterface,
} from "@/pkg/types/interfaces/conversation";
import type { PagyInterface } from "@/pkg/types/interfaces/pagy";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

const useHook = () => {
  /** ----- STATE ----- */
  const [conPagy, setConPagy] = useState<PagyInterface>();
  const [conPage, setConPage] = useState<number>(1);
  const [conversations, setConversations] = useState<ConversationInterface[]>(
    []
  );

  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [messPagy, setMessPagy] = useState<PagyInterface>();
  const [messPage, setMessPage] = useState<number>(1);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [sending, setSending] = useState(false);

  const [userId, setUserId] = useState("");
  const [err, setErr] = useState<string>("");

  const handleError = useErrorHandler();
  const controllerRef = useRef<AbortController | null>(null);

  const handleGetConversations = useCallback(
    async (page = 1, isLoadMore?: boolean) => {
      try {
        const pagyInput = { page, limit: 10 };
        const queryStr = buildQueryParams({}, pagyInput);
        const res = await axiosInstance.get(
          `${MESSAGE_GET_API.CONVERSATIONS}${queryStr}`
        );

        if (res.data.success) {
          const newData: ConversationInterface[] = res.data.data;
          setConversations((prev) =>
            isLoadMore ? [...(prev || []), ...newData] : newData
          );
          setConPagy(res.data.pagy);
        }
      } catch (error) {
        handleError(error as AxiosError, setErr);
      }
    },
    [userId]
  );

  /** ----- FETCH MESSAGES IN A CONVERSATION ----- */
  const handleGetConversationMessage = useCallback(
    async (conversationId: string, page = 1, isLoadMore = false) => {
      setLoadingMessages(true);

      try {
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();

        const query = { conversationId };
        const pagyInput = { page, limit: 20 };
        const queryStr = buildQueryParams(query, pagyInput);

        const res = await axiosInstance.get(
          `${MESSAGE_GET_API.MESSAGES}${queryStr}`,
          { signal: controllerRef.current.signal }
        );

        if (res.data.success) {
          setMessages((prev) =>
            isLoadMore ? [...res.data.data, ...(prev || [])] : res.data.data
          );
          setMessPagy(res.data.pagy);
        }
      } catch (error) {
        if ((error as any).name !== "CanceledError") {
          handleError(error as AxiosError, setErr);
        }
      } finally {
        setLoadingMessages(false);
      }
    },
    [loadingMessages]
  );

  /** ----- GET CONVERSATION WITH SPECIFIC USER ----- */
  const handleGetConversation = useCallback(
    async (userId: string): Promise<ConversationInterface> => {
      try {
        const res = await axiosInstance.get(
          `${MESSAGE_GET_API.CONVERSATION}?userId=${userId}`
        );
        return res.data.success ? res.data.data : ({} as ConversationInterface);
      } catch (error) {
        handleError(error as AxiosError, setErr);
        return {} as ConversationInterface;
      }
    },
    []
  );

  /** ----- SEND MESSAGE ----- */
  const handleSendMessage = useCallback(
    async (
      conversationId: string,
      message: string,
      userId: string,
      files?: File[]
    ): Promise<MessageInterface> => {
      setSending(true);

      try {
        const formData = new FormData();
        formData.append("conversationId", conversationId);
        formData.append("message", message);
        formData.append("userId", userId);

        if (files?.length) {
          files.forEach((file) => {
            if (file instanceof File) {
              formData.append("files", file);
            } else {
              console.warn("Invalid file skipped:", file);
            }
          });
        }

        const res = await axiosInstance.post(MESSAGE_POST_API.SEND, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) {
          return res.data.data as MessageInterface;
        }
        return {} as MessageInterface;
      } catch (error) {
        handleError(error as AxiosError, setErr);
        return {} as MessageInterface;
      } finally {
        setSending(false);
      }
    },
    [sending]
  );

  /** ----- EFFECT: LOAD CONVERSATIONS WHEN PAGE CHANGES ----- */
  useEffect(() => {
    handleGetConversations(conPage, conPage > 1);
  }, [conPage]);

  refreshListConv(() => {
    handleGetConversations();
  });

  /** ----- RETURN API ----- */
  return {
    // conversation states
    conPagy,
    conPage,
    setConPage,
    conversations,

    // message states
    messPagy,
    messPage,
    setMessPage,
    messages,
    loadingMessages,
    setMessages,

    // user context
    userId,
    setUserId,

    // actions
    handleGetConversations,
    handleGetConversationMessage,
    handleGetConversation,
    handleSendMessage,

    // others
    sending,
    err,
  };
};

export default useHook;
