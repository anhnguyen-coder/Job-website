import express from "express";
import { shareController } from "../controllers/shared/index.controller.js";

const router = express.Router();

router.get("/categories", shareController.categories);

export default router