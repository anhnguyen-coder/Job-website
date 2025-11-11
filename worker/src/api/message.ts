import { ENDPOINT } from "@/constant/constant";

const MESSAGE_GET_API = {
  CONVERSATIONS: `${ENDPOINT.WORKER_ENPOINT}/message/list`,
  CONVERSATION: `${ENDPOINT.WORKER_ENPOINT}/message/conversation`,
  MESSAGES: `${ENDPOINT.WORKER_ENPOINT}/message/conversation/messages`,
};

const MESSAGE_POST_API = {
  SEND: `${ENDPOINT.WORKER_ENPOINT}/message/send`,
};

const MESSAGE_PUT_API = {
  UPDATE: `${ENDPOINT.WORKER_ENPOINT}/message/update`,
};

const MESSAGE_DEL_API = {
  DELETE: `${ENDPOINT.WORKER_ENPOINT}/message/delete`,
};

export { MESSAGE_DEL_API, MESSAGE_GET_API, MESSAGE_POST_API, MESSAGE_PUT_API };
