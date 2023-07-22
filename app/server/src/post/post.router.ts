import upload from "../multer";
import { Router } from "express";
import { uploadPost } from "./post.controller";
import { verifyTokenAndUser } from "../middleware";

const postRouter = Router();

postRouter.post("/", verifyTokenAndUser, upload.single("post"), uploadPost);
// postRouter.delete("/:postId", [verifyToken, verifyUser, upload.single("post")], postPost);
postRouter.get("/:userName");

export default postRouter;
