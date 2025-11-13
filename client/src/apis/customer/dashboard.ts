import { USER_ENDPOINT } from "@/constant/constant";

const GET = {
  GET_DASHBOARD_STATS: `${USER_ENDPOINT.CUSTOMER_ENDPOINT}/dashboard/stats`,
  PAYMENT_HISTORY: `${USER_ENDPOINT.CUSTOMER_ENDPOINT}/payment/history`,
};

export { GET };
