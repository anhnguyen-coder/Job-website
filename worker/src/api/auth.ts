import { ENDPOINT } from "@/constant/constant";

const POST_API = {
  SIGN_IN: `${ENDPOINT.WORKER_ENPOINT}/signin`,
  SIGN_UP: `${ENDPOINT.WORKER_ENPOINT}/signup`,
  SIGN_OUT: `${ENDPOINT.WORKER_ENPOINT}/signout`,
};

const PUT_API = {
  RESET_PASSWORD: `${ENDPOINT.WORKER_ENPOINT}/reset-password`,
};

const GET_API = {
  FIND_BY_EMAIL: `${ENDPOINT.WORKER_ENPOINT}/find-by-email`,
  VALIDATE_TOKEN: `${ENDPOINT.WORKER_ENPOINT}/validate-token`,
  PROFILE: `${ENDPOINT.WORKER_ENPOINT}/profile`,
};

export { GET_API, POST_API, PUT_API };
