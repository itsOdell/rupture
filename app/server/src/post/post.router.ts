import upload from "../multer";
import { Router } from "express";
import { uploadPost } from "./post.controller";
import { verifyToken, verifyUser } from "@rupture/middleware";

const postRouter = Router();

postRouter.post("/", [verifyToken, verifyUser, upload.single("post")], uploadPost);
// postRouter.delete("/:postId", [verifyToken, verifyUser, upload.single("post")], postPost);
postRouter.get("/:userName");

export default postRouter;
