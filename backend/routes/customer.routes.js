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
router.get("/validate-token", customerAuth, customerController.validateToken);

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

// message routes
router.get("/message/:jobId", customerController.fetchMessagesWithWorkerByJob);
router.post("/message", customerController.sendMessage);
router.put("/message/:messageId", customerController.updateMessage);
router.delete("/message/:messageId", customerController.deleteMessage);

// rating routes
router.post("/rating", customerController.makeRatingWorker);
router.put("/rating/:ratingId", customerController.updateRatingWorker);
router.get("/rating/:workerId", customerController.viewWorkerRatings);

// customer dashboard
router.get("/dashboard/stats", customerController.customerStats);
export default router;
