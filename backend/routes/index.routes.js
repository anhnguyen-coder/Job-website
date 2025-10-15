import customerRouter from "./customer.routes.js";
import workerRouter from "./worker.routes.js";

const initAppRouter = (app) => {
  app.use("/api/v1/customer", customerRouter);
  app.use("/api/v1/worker", workerRouter);
}

export default initAppRouter;