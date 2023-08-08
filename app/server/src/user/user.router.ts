import upload from "../multer/";
import userController from "./user.controller";
import { Router } from "express";
import { getFromCache } from "../redis";
import { verifyTokenAndUser } from "../middleware";
import { userFollowCacheKey } from "../utils";

const userRouter = Router();

/* MAIN */
userRouter.get("/feed", verifyTokenAndUser, userController.getFeed);
// add caching to this route

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
userRouter.post("/follow/:userName", verifyTokenAndUser, userController.followUser);
userRouter.post("/unfollow/:userName", verifyTokenAndUser, userController.unFollowUser);
userRouter.patch("/", verifyTokenAndUser, upload.single("profilePicture"), userController.patchUser);
// ^ fix media still being uploaded even if falsy values, i can do this by adding more middleware before it
userRouter.delete("/", verifyTokenAndUser, userController.deleteUser);

export default userRouter;
