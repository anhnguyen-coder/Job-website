import express from "express";
import customerAuth from "../middleware/customer.auth.js";
import customerController from "../controllers/customer/index.js";

const router = express.Router();

// Auth routes
router.post("/signin", customerController.signIn);
router.post("/signup", customerController.signUp);
router.post("/reset-password", customerController.resetPassword);
router.get("/find-by-email", customerController.findByEmail);
router.post("/signout", customerAuth, customerController.signOut);

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

export default router;
