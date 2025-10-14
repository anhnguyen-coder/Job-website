import express from "express";
import workerAuth from "../middleware/worker.auth.js";
import workerController from "../controllers/worker/index.js";

const workRouter = express.Router();

// job routes

// GET
workRouter.get("/jobs", workerAuth, workerController.jobList);
workRouter.get("/job/:jobId", workerAuth, workerController.jobDetail);
workRouter.get("/jobs/bookmark", workerAuth, workerController.bookmarJobList);
workRouter.get("/jobs/accepted", workerAuth, workerController.jobAcceptedList);


// POST
workRouter.post("/job/:jobId/bookmark", workerAuth, workerController.makeBookmarkJob);

// PUT
workRouter.post("/job/:jobId/request", workerAuth, workerController.makeRequestJob);
workRouter.put("/job/:jobId", workerAuth, workerController.updateJobStatus);

export default workRouter;