import express from "express";
import workerAuth from "../middleware/worker.auth.js";
import workerController from "../controllers/worker/index.js";
import { upload } from "../middleware/upload.js";

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
router.get("/profile", workerController.profile);
router.post("/signout", workerController.signOut);
// 💼 Job routes
router.get("/jobs", workerController.jobList);
router.get("/jobs/bookmark", workerController.bookmarJobList);
router.get("/jobs/current-job", workerController.myCurrentJobs);
router.get("/job/:jobId", workerController.jobDetail);
router.put("/job/:jobId", workerController.updateJobStatus);
router.post("/job/bookmark/:jobId", workerController.makeBookmarkJob);
router.post("/job/request/:jobId", workerController.makeRequestJob);
router.delete(
  "/job/bookmark/remove/:jobId",
  workerController.removeJobBookmarked
);
router.put("/job/task/:taskId", workerController.updateJobTaskStatus);

// 💬 Message routes
router.get("/message/list", workerController.listConversations);
router.get(
  "/message/conversation/messages",
  workerController.conversationMessages
);
router.post(
  "/message/send",
  upload.array("files", 5),
  workerController.sendMessage
);
router.put("/message/update", workerController.updateMessage);
router.get("/message/conversation", workerController.getConverByUserId);
router.delete("/message/delete/:messageId", workerController.deleteMessage);

// 🌟 Rating routes
router.get("/ratings", workerController.viewProfileRating);
router.post("/rating/customer", workerController.makeRateCustomer);
router.get("/rating/customer", workerController.viewCustomerRating);
router.get("/rating/stats", workerController.ratingStats);

export default router;
