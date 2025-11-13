import { USER_ENDPOINT } from "@/constant/constant";

const NOTI_GET = {
  LIST: `${USER_ENDPOINT.CUSTOMER_ENDPOINT}/noti/list`,
};

const NOTI_POST = {
  MAKE_READ: `${USER_ENDPOINT.CUSTOMER_ENDPOINT}/noti/make-read`,
};

const NOTI_DEL = {
  DELETE: `${USER_ENDPOINT.CUSTOMER_ENDPOINT}/noti/delete`,
};

export { NOTI_DEL, NOTI_GET, NOTI_POST };
