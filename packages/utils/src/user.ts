import fs from "fs";
import jwt from "jsonwebtoken";
import Media from "@rupture/server/src/media/media.model";
import path from "path";
import User from "@rupture/server/src/user/user.model";
import bcrypt from "bcrypt";
import { ASSETS_DIR, JWT_SECRET, SALT } from "@rupture/constants";
import { AppError, DatabaseError } from "@rupture/server/src/errors";
import type { Types } from "mongoose";
import type { UserDocument, UserFollowersOrFollowing } from "@rupture/types/src/user";
import type { RequestWithToken } from "@rupture/types/src/express";
import type { MediaDocument } from "@rupture/types/src/media";
import type { Request } from "express";

export async function updateProfilePicture(req: RequestWithToken, userProfilePicture: MediaDocument): Promise<void> {
    const { requestingUser } = req;
    const userHasDefaultPicture = userProfilePicture?.filename === "default.png";

    if (!userHasDefaultPicture) {
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

export function tryingToFollowUnfollowSelf(requestingUser: UserDocument, userToTest: UserDocument): void {
    if (requestingUser!._id.equals(userToTest!._id)) {
        throw new Error("You cannot follow/unfollow yourself");
    }
}

export async function unFollowTheUser(requestingUser: UserDocument, userToUnfollow: UserDocument): Promise<void> {
    const requestingUserIndex = userToUnfollow?.followers.indexOf(String(requestingUser?._id));
    const userToUnfollowIndex = requestingUser?.following.indexOf(String(userToUnfollow?._id));

    userToUnfollow?.followers.splice(requestingUserIndex!, 1);
    await userToUnfollow?.save();
    requestingUser?.following.splice(userToUnfollowIndex!, 1);
    await requestingUser?.save();
}

export function alreadyUnfollowing(requestingUser: UserDocument, userToFollow: UserDocument): void {
    const isFollowed: boolean = userToFollow?.followers.includes(String(requestingUser?._id)) as boolean;

    if (!isFollowed) {
        throw new AppError(`You are already unfollowing ${userToFollow!.userName}`, 400);
    }
}

export async function followTheUser(requestingUser: UserDocument, userToFollow: UserDocument): Promise<void> {
    userToFollow?.followers.push(String(requestingUser?._id));
    await userToFollow?.save();
    requestingUser?.following.push(String(userToFollow?._id));
    await requestingUser?.save();
}

export function createToken(value: { user: { id: Types.ObjectId; userName: string } }): string {
    return jwt.sign(value, JWT_SECRET);
}

export function userExists(userToCheck: UserDocument): void {
    if (userToCheck === null) {
        throw new DatabaseError("User doesn't exist", 404);
    }
}

export function alreadyFollowing(requestingUser: UserDocument, userToFollow: UserDocument): void {
    const isFollowed: boolean = userToFollow?.followers.includes(String(requestingUser?._id)) as boolean;

    if (isFollowed) {
        throw new AppError(`You are already following ${userToFollow!.userName}`, 400);
    }
}

export const userFollowCacheKey = (req: Request, followersOrFollowing: "followers" | "following"): string =>
    `${req.params.requestedUser}?${followersOrFollowing}=${req.query.skip}:${req.query.limit}`;

export const getUserInfo = async function (userName: string): Promise<UserDocument | null> {
    return await User.findOne({ userName })
        .populate({
            path: "profilePicture",
            select: "path -_id"
        })
        .select("firstName lastName userName profilePicture bio website postCount followerCount followingCount");
};

export async function hashPass(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT);
}

export async function paginateFollowersFollowing(
    ids: string[],
    skip: number,
    limit: number
): Promise<UserFollowersOrFollowing | []> {
    // returns the query result of poeple who are following or are followed
    return (await User.find({ _id: { $in: ids } })
        .skip(skip)
        .limit(limit)
        .populate({ path: "profilePicture", select: "path -_id" })
        .select("userName -_id")) as any;
}

const userUtils = {
    updateProfilePicture,
    tryingToFollowUnfollowSelf,
    unFollowTheUser,
    alreadyUnfollowing,
    followTheUser,
    createToken,
    userExists,
    alreadyFollowing,
    userFollowCacheKey,
    getUserInfo,
    hashPass,
    paginateFollowersFollowing
};

export default userUtils;
