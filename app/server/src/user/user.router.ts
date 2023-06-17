import upload from "../multer/";
import userController from "./user.controller";
import { Router } from "express";
import { getFromCache } from "../redis";
import { verifyToken, verifyUser } from "@rupture/middleware";
import { userFollowCacheKey } from "@rupture/utils/src/user";

const userRouter = Router();

/* LOGGING IN */
userRouter.post("/signup", userController.createUser);
userRouter.post("/login", userController.loginUser);

/* GET USER AND FOLLOWERS/FOLLOWING */
userRouter.get(
    "/:userName",
    async (req, res, next) => await getFromCache(req, res, next, req.params.userName),
    userController.getUser
);
userRouter.get(
    "/followers/:requestedUser",
    async (req, res, next) => await getFromCache(req, res, next, userFollowCacheKey(req, "followers")),
    userController.getFollowers
);
userRouter.get(
    "/following/:requestedUser",
    async (req, res, next) => await getFromCache(req, res, next, userFollowCacheKey(req, "following")),
    userController.getFollowing
);

/* USER SELF UPDATES */
userRouter.post("/follow/:userName", [verifyToken, verifyUser], userController.followUser);
userRouter.post("/unfollow/:userName", [verifyToken, verifyUser], userController.unFollowUser);
userRouter.patch("/", [verifyToken, verifyUser, upload.single("profilePicture")], userController.patchUser);
// ^ fix media still being uploaded even if falsy values

export default userRouter;
