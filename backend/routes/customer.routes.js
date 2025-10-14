import express from "express";
import customerAuth from "../middleware/customer.auth.js";
import customerController from "../controllers/customer/index.js";

const customerRouter = express.Router();

// job routes

// GET
customerRouter.get("/jobs", customerAuth, customerController.jobList)
customerRouter.get("/job/pending-requests", customerAuth, customerController.jobPendingList)
customerRouter.get("/job/:jobId", customerAuth, customerController.jobDetail)

// POST
customerRouter.post("/job", customerAuth, customerController.jobCreate)

// PUT
customerRouter.put("/job/:jobId", customerAuth, customerController.jobUpdate),
customerRouter.put("/job/approve/:jobId", customerController.jobApproval)

// DELETE
customerRouter.delete("/job/:jobId", customerAuth, customerController.jobDelete)

export default customerRouter;
