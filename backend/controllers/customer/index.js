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
import { publishJob } from "./job/publishJob.controller.js";
import { updateJob } from "./job/updateJob.controller.js";
import { deleteMessageController } from "./messages/deleteMessage.controller.js";
import { getConversation } from "./messages/getConversation.controller.js";
import { getConversationMessages } from "./messages/getConversationMessages.controller.js";
import { getConversations } from "./messages/getConversations.controller.js";
import { sendMessage } from "./messages/sendMessage.controller.js";
import { updateMessageController } from "./messages/updateMessage.controller.js";
import { deleteNotiController } from "./noti/deleteNoti..controller.js";
import { getNotiListController } from "./noti/getNotiList.controller.js";
import { makeReadNotiController } from "./noti/makeReadNoti.controller.js";
import { paymentList } from "./payment/getPaymentList.controller.js";

import { makeRatingWorker } from "./rating/makeRatingWorker.controller.js";
import { ratingStatsController } from "./rating/ratingStats.controller.js";
import { updateRatingWorker } from "./rating/updateRatingWorker.controller.js";
import { viewSelfRatingsController } from "./rating/viewSelfRatings.controller.js";
import { viewWorkerRates } from "./rating/viewWorkerRates.controller.js";
import { getWorkerByName } from "./worker/getWorkerByName.controller.js";

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
  publishJob: publishJob,

  // message controllers
  listConversations: getConversations,
  conversationMessages: getConversationMessages,
  sendMessage: sendMessage,
  updateMessage: updateMessageController,
  deleteMessage: deleteMessageController,
  getConverByUserId: getConversation,

  // rating
  makeRatingWorker: makeRatingWorker,
  updateRatingWorker: updateRatingWorker,
  viewWorkerRatings: viewWorkerRates,
  ratingStats: ratingStatsController,
  viewSelfRatingsController: viewSelfRatingsController,

  // dashboard
  customerStats: dashboardStats,

  // worker
  findWorkerByName: getWorkerByName,

  // noti
  getListNoti: getNotiListController,
  makeReadNoti: makeReadNotiController,
  deleteNoti: deleteNotiController,

  // payment
  listPayments: paymentList,
};

export default customerController;
