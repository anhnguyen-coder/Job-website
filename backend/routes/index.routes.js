import customerRouter from "./customer.routes.js";
import workRouter from "./work.routes.js";

const initAppRouter = (app) => {
  app.use("/api/v1/customer", customerRouter);
  app.use("/api/v1/worker", workRouter);
}

export default initAppRouter;