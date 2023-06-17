import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import apiRouter from "./api/v1/api.router";
import { ASSETS_DIR } from "@rupture/constants";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== "test") app.use(morgan("common"));
app.use(helmet({ crossOriginResourcePolicy: true }));
app.use("/assets", express.static(ASSETS_DIR));
app.use(compression());
app.use("/api/v1", apiRouter);

export default app;
