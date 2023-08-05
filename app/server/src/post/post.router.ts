import upload from "../multer";
import { Router } from "express";
import postController from "./post.controller";
import { verifyTokenAndUser } from "../middleware";

const postRouter = Router();

postRouter.post("/", verifyTokenAndUser, upload.single("post"), postController.uploadPost);
postRouter.delete("/:postId", verifyTokenAndUser, upload.single("post"), postController.deletePost);
postRouter.get("/:userName");

export default postRouter;
