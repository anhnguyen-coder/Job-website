import express from "express";
import customerAuth from "../middleware/customer.auth.js";
import customerController from "../controllers/customer/index.js";

const router = express.Router();

// Auth routes
router.post("/signin", customerController.signIn);
router.post("/signup", customerController.signUp);
router.put("/reset-password", customerController.resetPassword);
router.get("/find-by-email", customerController.findByEmail);
router.post("/signout", customerAuth, customerController.signOut);
router.get("/profile", customerAuth, customerController.profile);

// Job routes (private)
router.use(customerAuth);

// Job routes
router.get("/jobs", customerController.jobList);
router.get("/job/requests", customerController.jobRequestList);
router.get("/job/:jobId", customerController.jobDetail);
router.post("/job", customerController.jobCreate);
router.put("/job/:jobId", customerController.jobUpdate);
router.put("/job/approve/:jobId", customerController.jobApproval);
router.put("/job/complete/:jobId", customerController.makeJobComplete);
router.delete("/job/:jobId", customerController.jobDelete);
router.put("/job/publish/:jobId", customerController.publishJob);

// message routes
router.get("/message/list", customerController.listConversations);
router.get(
  "/message/conversation/messages",
  customerController.conversationMessages
);
router.post("/message/send", customerController.sendMessage);
router.put("/message/update", customerController.updateMessage);
router.get("/message/conversation", customerController.getConverByUserId);
router.delete("/message/delete/:messageId", customerController.deleteMessage);

// rating routes
router.post("/rating", customerController.makeRatingWorker);
router.get("/rating/stats", customerController.ratingStats);
router.get("/rating/self", customerController.viewSelfRatingsController);
router.put("/rating/:ratingId", customerController.updateRatingWorker);
router.get("/rating/:workerId", customerController.viewWorkerRatings);

// customer dashboard
router.get("/dashboard/stats", customerController.customerStats);

// worker
router.get("/worker", customerController.findWorkerByName);
export default router;
