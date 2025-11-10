import { ENDPOINT } from "@/constant/constant";

const RATING_GET_API = {
  SELF_RAING: `${ENDPOINT.WORKER_ENPOINT}/ratings`,
  CUSTOMER_RATINGS: `${ENDPOINT.WORKER_ENPOINT}/rating/customer`,
  STATS: `${ENDPOINT.WORKER_ENPOINT}/rating/stats`,
};

const RATING_POST_API = {
  RATE_CUSTOMER: `${ENDPOINT.WORKER_ENPOINT}/rating/customer`,
};

export { RATING_GET_API, RATING_POST_API };
