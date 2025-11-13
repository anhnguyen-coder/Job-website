import { ENDPOINT } from "@/constant/constant";

const NOTI_GET = {
  LIST: `${ENDPOINT.WORKER_ENPOINT}/noti/list`,
};

const NOTI_POST = {
  MAKE_READ: `${ENDPOINT.WORKER_ENPOINT}/noti/make-read`,
};

const NOTI_DEL = {
  DELETE: `${ENDPOINT.WORKER_ENPOINT}/noti/delete`,
};

export { NOTI_DEL, NOTI_GET, NOTI_POST };
