import express from "express";
import workerAuth from "../middleware/worker.auth.js";
import workerController from "../controllers/worker/index.js";

const router = express.Router();

// ==============================
// 🔐 PUBLIC AUTH ROUTES
// ==============================
router.get("/find-by-email", workerController.findByEmail);
router.post("/signup", workerController.register);
router.post("/signin", workerController.signIn);
router.put("/reset-password", workerController.resetPassword);

// ==============================
// 🔒 PROTECTED ROUTES (require authentication)
// ==============================

// Apply auth middleware to everything below this line
router.use(workerAuth);

// 🔐 Sign out
router.post("/signout", workerController.signOut);

// 💼 Job routes
router.get("/jobs", workerController.jobList);
router.get("/jobs/bookmark", workerController.bookmarJobList);
router.get("/jobs/current-job", workerController.myCurrentJobs);
router.get("/job/:jobId", workerController.jobDetail);
router.put("/job/:jobId", workerController.updateJobStatus);
router.post("/job/:jobId/bookmark", workerController.makeBookmarkJob);
router.post("/job/:jobId/request", workerController.makeRequestJob);

// 💬 Message routes
router
  .route("/messages/:jobId")
  .get(workerController.fetchMessagesJob)
  .post(workerController.sendMessage);

router
  .route("/messages/:messageId")
  .put(workerController.updateMessage)
  .delete(workerController.deleteMessage);

export default router;
