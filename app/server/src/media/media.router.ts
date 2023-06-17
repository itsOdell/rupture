import { Router } from "express";
import { getMedia } from "./media.controller";

export const mediaRouter = Router();

mediaRouter.get("/:mediaId", getMedia);
