import { findByEmail } from "./auth/findByEmail.controller.js";
import { register } from "./auth/register.controller.js";
import { resetPassword } from "./auth/resetPassword.controller.js";
import { signIn } from "./auth/signin.controller.js";
import { signOut } from "./auth/signout.controller.js";
import { bookmarkJob } from "./job/bookmarkJob.controller.js";
import { bookmarkList } from "./job/bookmarkList.controller.js";
import { jobListaccepted } from "./job/JobAcceptedList.controller.js";
import { jobDetails } from "./job/jobDetail.controller.js";
import { myCurrentJobs } from "./job/myCurrentJobs.controller.js";
import { listJobs } from "./job/jobs.controller.js";
import { requestJob } from "./job/requestJob.controller.js";
import { updateJob } from "./job/updateJob.controller.js";

const workerController = {
  // Auth
  register: register,
  signIn: signIn,
  signOut: signOut,
  findByEmail: findByEmail,
  resetPassword: resetPassword,

  // job
  jobList: listJobs,
  jobDetail: jobDetails,
  bookmarJobList: bookmarkList,
  myCurrentJobs: myCurrentJobs,

  makeBookmarkJob: bookmarkJob,
  makeRequestJob: requestJob,
  updateJobStatus: updateJob,
};

export default workerController;
