import express from "express";
import workerAuth from "../middleware/worker.auth.js";
import workerController from "../controllers/worker/index.js";

const workerRouter = express.Router();

// auth routes
workerRouter.post("/register", workerController.register);
workerRouter.post("/signin", workerController.signIn);
workerRouter.post("/find-by-email", workerController.findByEmail);
workerRouter.put("/reset-password", workerController.resetPassword);

workerRouter.post("/signout", workerAuth, workerController.signOut);

// job routes

workerRouter.get("/jobs", workerAuth, workerController.jobList);
workerRouter.get("/job/:jobId", workerAuth, workerController.jobDetail);
workerRouter.get("/jobs/bookmark", workerAuth, workerController.bookmarJobList);
workerRouter.get("/jobs/accepted", workerAuth, workerController.jobAcceptedList);
workerRouter.post("/job/:jobId/bookmark", workerAuth, workerController.makeBookmarkJob);
workerRouter.post("/job/:jobId/request", workerAuth, workerController.makeRequestJob);
workerRouter.put("/job/:jobId", workerAuth, workerController.updateJobStatus);

export default workerRouter;