import { findByEmail } from "./auth/findByEmail.controller.js";
import { register } from "./auth/register.controller.js";
import { resetPassword } from "./auth/resetPassword.controller.js";
import { signIn } from "./auth/signin.controller.js";
import { signOut } from "./auth/signout.controller.js";
import { createJob } from "./job/createJob.controller.js";
import { deleteJob } from "./job/deleteJob.controller.js";
import { jobApproval } from "./job/jobApproval.controller.js";
import { jobDetails } from "./job/jobDetails.controller.js";
import { jobPendingRequestList } from "./job/jobPendingRequestList.controller.js";
import { jobs } from "./job/jobs.controller.js";
import { updateJob } from "./job/updateJob.controller.js";

const customerController = {
  // auth
  signIn: signIn,
  signUp: register,
  signOut: signOut,
  findByEmail: findByEmail,
  resetPassword: resetPassword,

  // job controllers
  jobList: jobs,
  jobDetail: jobDetails,
  jobCreate: createJob,
  jobUpdate: updateJob,
  jobDelete: deleteJob,
  jobPendingList: jobPendingRequestList,
  jobApproval: jobApproval,
};

export default customerController;
