import User from "./user.model";
import Media from "../media/media.model";
import fs from "node:fs";
import path from "node:path";
import userUtils, { getFeed } from "../utils/user";
import userValidators from "../validators/user";
import { DatabaseError } from "../errors";
import { setToCache } from "../redis";
import { ASSETS_DIR } from "@rupture/constants";
import type {
    UserDocument,
    UsersFollowerList,
    UsersFollowingList,
    possibleUserUpdateValues,
    signingUpUser,
    MediaDocument,
    RequestWithToken,
    Posts
} from "@rupture/types";

export const getOneUser = async function (userName: string): Promise<UserDocument> {
    const userExists = await userUtils.getUserInfo(userName);

    if (userExists === null) {
        throw new DatabaseError("That user doesnt exist", 404);
    }
    await setToCache(userName, JSON.stringify(userExists));

    return userExists;
};

export const createOneUser = async function (userInfo: signingUpUser): Promise<UserDocument> {
    const { userName, email, password } = userInfo;
    await userValidators.validateSignUpCredentials(userInfo);

    const userExists = await User.findOne({ $or: [{ userName }, { email }] });

    if (userExists !== null) {
        throw new DatabaseError("That username or email is already in use, please use a new username or email", 409);
    }

    userInfo.password = await userUtils.hashPass(password);

    return await new User({ ...userInfo }).save();
};

export const loginOneUser = async function (loginInfo: { email: string; password: string }): Promise<string> {
    await userValidators.validateLoginCredentials(loginInfo);
    const accountToLoginTo = await User.findOne({ email: loginInfo.email });

    userUtils.userExists(accountToLoginTo);
    await userValidators.passwordMatches(loginInfo.password, accountToLoginTo!.password);

    return userUtils.createToken({
        user: { id: accountToLoginTo!._id, userName: accountToLoginTo!.userName }
    });
};

export const followOneUser = async function (req: RequestWithToken): Promise<void> {
    const { requestingUser } = req;
    const userToFollow = await User.findOne({ userName: req.params.userName });

    userUtils.userExists(userToFollow);

    userUtils.tryingToFollowUnfollowSelf(requestingUser, userToFollow);
    userUtils.alreadyFollowing(requestingUser, userToFollow);

    await userUtils.followTheUser(requestingUser, userToFollow);
};

export const unFollowOneUser = async function (req: RequestWithToken): Promise<void> {
    const { requestingUser } = req;
    const userToUnfollow = await User.findOne({ userName: req.params.userName });

    userUtils.userExists(userToUnfollow);

    userUtils.tryingToFollowUnfollowSelf(requestingUser, userToUnfollow);
    userUtils.alreadyUnfollowing(requestingUser, userToUnfollow);

    await userUtils.unFollowTheUser(requestingUser, userToUnfollow);
};

export const patchOneUser = async function (req: RequestWithToken): Promise<void> {
    const { requestingUser } = req;
    const toUpdate: possibleUserUpdateValues = req.body;

    await userValidators.validateToUpdate(toUpdate);
    await userValidators.updateUserWithValidValues(requestingUser, toUpdate);

    const userProfilePicture: MediaDocument = (await requestingUser!.populate("profilePicture"))?.profilePicture as any;

    if (req.file !== undefined) {
        const userHasDefaultPicture = userProfilePicture?.filename === "default.png";

        if (!userHasDefaultPicture) {
            // this means that if the user has already uploaded a pfp before, delete that.
            const userPrevImage = await Media.findOne({ userId: requestingUser?._id });
            fs.unlinkSync(path.join(ASSETS_DIR, userPrevImage!.path));
            await userPrevImage?.deleteOne();
        }

        const newImage = await new Media({
            originalname: req.file?.originalname,
            filename: req.file?.filename,
            path: `/assets/${req.file!.filename}`,
            userId: requestingUser?._id
        }).save();

        requestingUser!.profilePicture = String(newImage._id);
        await requestingUser?.save();
    }

    const updatedUser = await userUtils.getUserInfo(requestingUser!.userName);

    await setToCache(requestingUser!.userName, JSON.stringify(updatedUser));
};

export const getUserFollowers = async function (req: RequestWithToken): Promise<UsersFollowerList> {
    const { requestedUser } = req.params;
    const { skip, limit } = req.query;

    const followerIds = (await User.findOne({ userName: requestedUser }))?.followers;
    const followers = await userUtils.paginateUsersFollowersOrFollowing(followerIds!, Number(skip), Number(limit));

    await setToCache(userUtils.userFollowCacheKey(req, "followers"), JSON.stringify(followers), 300);

    return followers;
};

export const getUserFollowing = async function (req: RequestWithToken): Promise<UsersFollowingList> {
    const { requestedUser } = req.params;
    const { skip, limit } = req.query;

    const followingIds = (await User.findOne({ userName: requestedUser }))?.following;
    const following = await userUtils.paginateUsersFollowersOrFollowing(followingIds!, Number(skip), Number(limit));

    await setToCache(userUtils.userFollowCacheKey(req, "following"), JSON.stringify(following), 300);

    return following;
};

export const deleteOneUser = async function (userToDelete: UserDocument): Promise<void> {
    await userToDelete?.deleteOne();
};

export const getUserFeed = async function (req: RequestWithToken): Promise<Posts> {
    const { requestingUser } = req;
    const { skip, limit } = req.query;

    const followingIds: string[] = (await User.findOne({ userName: requestingUser?.userName }))?.following as string[];
    const posts = await getFeed(followingIds, Number(skip), Number(limit));

    return posts;
};

export const userServices = {
    getOneUser,
    createOneUser,
    loginOneUser,
    followOneUser,
    unFollowOneUser,
    patchOneUser,
    getUserFollowers,
    getUserFollowing,
    deleteOneUser,
    getUserFeed
};

export default userServices;
