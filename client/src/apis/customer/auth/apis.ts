const BASE_URL_CUSTOMER = `/customer`;

const GET = {
  FIND_BY_EMAIL: `${BASE_URL_CUSTOMER}/find-by-email`,
  PROFILE: `${BASE_URL_CUSTOMER}/profile`,
};

const POST = {
  SIGNUP: `${BASE_URL_CUSTOMER}/signup`,
  SIGNIN: `${BASE_URL_CUSTOMER}/signin`,
  SIGNOUT: `${BASE_URL_CUSTOMER}/signout`,
};

const PUT = {
  RESET_PASSWORD: `${BASE_URL_CUSTOMER}/reset-password`,
};

export { GET, POST, PUT };
