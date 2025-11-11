import { findByEmail } from "./auth/findByEmail.controller.js";
import { register } from "./auth/register.controller.js";
import { resetPassword } from "./auth/resetPassword.controller.js";
import { signIn } from "./auth/signin.controller.js";
import { signOut } from "./auth/signout.controller.js";
import { bookmarkJob } from "./job/bookmarkJob.controller.js";
import { bookmarkList } from "./job/bookmarkList.controller.js";
import { jobDetails } from "./job/jobDetail.controller.js";
import { myCurrentJobs } from "./job/myCurrentJobs.controller.js";
import { listJobs } from "./job/jobs.controller.js";
import { requestJob } from "./job/requestJob.controller.js";
import { updateJob } from "./job/updateJob.controller.js";

import { viewProfileRating } from "./rating/viewProfileRating.controller.js";
import { profile } from "./auth/profile.controller.js";
import { bookmarkJobRemove } from "./job/bookmarkRemove.controller.js";
import { updateJobTaskStatus } from "./job/updateJobTaskStatus.controller.js";
import { makeRateCustomer } from "./rating/makeRateCustomer.controller.js";
import { viewCustomerRating } from "./rating/viewCustomerRating.controller.js";
import { ratingStatsController } from "./rating/ratingStats.controller.js";
import { getConversations } from "./messages/getConversations.controller.js";
import { getConversationMessages } from "./messages/getConversationMessages.controller.js";
import { sendMessage } from "./messages/sendMessage.controller.js";
import { updateMessageController } from "./messages/updateMessage.controller.js";
import { deleteMessageController } from "./messages/deleteMessage.controller.js";
import { getConversation } from "./messages/getConversation.controller.js";

const workerController = {
  // Auth
  register: register,
  signIn: signIn,
  signOut: signOut,
  findByEmail: findByEmail,
  resetPassword: resetPassword,
  profile: profile,

  // job
  jobList: listJobs,
  jobDetail: jobDetails,
  bookmarJobList: bookmarkList,
  myCurrentJobs: myCurrentJobs,

  makeBookmarkJob: bookmarkJob,
  makeRequestJob: requestJob,
  updateJobStatus: updateJob,
  removeJobBookmarked: bookmarkJobRemove,
  updateJobTaskStatus: updateJobTaskStatus,

  // message
  listConversations: getConversations,
  conversationMessages: getConversationMessages,
  sendMessage: sendMessage,
  updateMessage: updateMessageController,
  deleteMessage: deleteMessageController,
  getConverByUserId: getConversation,

  // rating
  viewProfileRating: viewProfileRating,
  makeRateCustomer: makeRateCustomer,
  viewCustomerRating: viewCustomerRating,
  ratingStats: ratingStatsController,
};

export default workerController;
