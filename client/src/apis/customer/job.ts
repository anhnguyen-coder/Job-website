import { USER_ENDPOINT } from "@/constant/constant";

const GET = {
  GET_JOBS: `${USER_ENDPOINT.CUSTOMER_ENDPOINT}/jobs`,
  GET_JOB_ID: `${USER_ENDPOINT.CUSTOMER_ENDPOINT}/job`, // jobid after
};

export { GET };
