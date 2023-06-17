import userRouter from "../../user/user.router";
import postRouter from "../../post/post.router";
import { errorHandler } from "@rupture/utils/src/errorHandler";
import { Router } from "express";

const apiRouter = Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/post", postRouter);
apiRouter.use(errorHandler);

export default apiRouter;
