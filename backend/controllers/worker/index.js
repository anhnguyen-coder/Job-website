import { bookmarkJob } from "./job/bookmarkJob.controller.js";
import { bookmarkList } from "./job/bookmarkList.controller.js";
import { jobListaccepted } from "./job/JobAcceptedList.controller.js";
import { jobDetails } from "./job/jobDetail.controller.js";
import { listJobs } from "./job/jobs.controller.js";
import { requestJob } from "./job/requestJob.controller.js";
import { updateJob } from "./job/updateJob.controller.js";

const workerController = {
  // job
  jobList: listJobs,
  jobDetail: jobDetails,
  bookmarJobList: bookmarkList,
  jobAcceptedList: jobListaccepted,

  makeBookmarkJob: bookmarkJob,
  makeRequestJob: requestJob,
  updateJobStatus: updateJob,
};

export default workerController;
