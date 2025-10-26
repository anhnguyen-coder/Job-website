import customerRouter from "./customer.routes.js";
import workerRouter from "./worker.routes.js";
import shareRouter from "./shared.routes.js";

const initAppRouter = (app) => {
  app.use("/api/v1/customer", customerRouter);
  app.use("/api/v1/worker", workerRouter);
  app.use("/api/v1/shared", shareRouter);
};

export default initAppRouter;
