import { findByEmail } from "./auth/findByEmail.controller.js";
import { profile } from "./auth/profile.js";
import { register } from "./auth/register.controller.js";
import { resetPassword } from "./auth/resetPassword.controller.js";
import { signIn } from "./auth/signin.controller.js";
import { signOut } from "./auth/signout.controller.js";
import { dashboardStats } from "./dashboard/stats.controller.js";
import { createJob } from "./job/createJob.controller.js";
import { deleteJob } from "./job/deleteJob.controller.js";
import { jobApproval } from "./job/jobApproval.controller.js";
import { jobDetails } from "./job/jobDetails.controller.js";
import { jobRequestList } from "./job/jobRequestList.controller.js";
import { jobs } from "./job/jobs.controller.js";
import { makeJobComplete } from "./job/makeJobComplete.controller.js";
import { updateJob } from "./job/updateJob.controller.js";
import { deleteMessage } from "./messages/deleteMessage.controller.js";
import { fetchMessageJob } from "./messages/fetchMessageJob.controller.js";
import { sendMessage } from "./messages/sendMessage.controller.js";
import { updateMessage } from "./messages/updateMessage.controller.js";
import { makeRatingWorker } from "./rating/makeRatingWorker.controller.js";
import { updateRatingWorker } from "./rating/updateRatingWorker.controller.js";
import { viewWorkerRates } from "./rating/viewWorkerRates.controller.js";

const customerController = {
  // auth
  signIn: signIn,
  signUp: register,
  signOut: signOut,
  findByEmail: findByEmail,
  resetPassword: resetPassword,
  profile: profile,

  // job controllers
  jobList: jobs,
  jobDetail: jobDetails,
  jobCreate: createJob,
  jobUpdate: updateJob,
  jobDelete: deleteJob,
  jobRequestList: jobRequestList,
  jobApproval: jobApproval,
  makeJobComplete: makeJobComplete,

  // message controllers
  fetchMessagesWithWorkerByJob: fetchMessageJob,
  sendMessage: sendMessage,
  updateMessage: updateMessage,
  deleteMessage: deleteMessage,

  // rating
  makeRatingWorker: makeRatingWorker,
  updateRatingWorker: updateRatingWorker,
  viewWorkerRatings: viewWorkerRates,

  // dashboard
  customerStats: dashboardStats,
};

export default customerController;
