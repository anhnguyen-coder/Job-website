import express, { json } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser  from "cookie-parser";


import connectDB from "./config/mongodb.js";
import initAppRouter from "./routes/index.routes.js";


const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

//API Endpoints
initAppRouter(app);

app.listen(port, ()=>{ console.log(`Server started on PORT: ${port}`)});





 