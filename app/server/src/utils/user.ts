import jwt from "jsonwebtoken";
import User from "../user/user.model";
import bcrypt from "bcrypt";
import { JWT_SECRET, SALT } from "@rupture/constants";
import { AppError, DatabaseError } from "../errors";
import type { Types } from "mongoose";
import type { Request } from "express";
import type { UserDocument, UsersFollowerList, UsersFollowingList } from "@rupture/types";

export async function followOrUnfollowUser(
    type: "follow" | "unfollow",
    requestingUser: UserDocument,
    targetUser: UserDocument
): Promise<void> {
    if (type === "follow") {
        targetUser?.followers.push(String(requestingUser?._id));
        await targetUser?.save();
        requestingUser?.following.push(String(targetUser?._id));
        await requestingUser?.save();
    } else {
        const requestingUserIndex = targetUser?.followers.indexOf(String(requestingUser?._id));
        const targetUserIndex = requestingUser?.following.indexOf(String(targetUser?._id));

        targetUser?.followers.splice(requestingUserIndex!, 1);
        await targetUser?.save();
        requestingUser?.following.splice(targetUserIndex!, 1);
        await requestingUser?.save();
    }
}

export function tryingToFollowUnfollowSelf(requestingUser: UserDocument, userToTest: UserDocument): void {
    if (requestingUser!._id.equals(userToTest!._id)) {
        throw new Error("You cannot follow/unfollow yourself");
    }
}

export function alreadyUnfollowing(requestingUser: UserDocument, userToFollow: UserDocument): void {
    const isFollowed: boolean = userToFollow?.followers.includes(String(requestingUser?._id)) as boolean;

    if (!isFollowed) {
        throw new AppError(`You are already unfollowing ${userToFollow!.userName}`, 400);
    }
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

export async function paginateUsersFollowersOrFollowing(
    ids: string[],
    skip: number,
    limit: number
): Promise<UsersFollowerList | UsersFollowingList> {
    // returns a paginated list of users from the specified user's followers/following list
    return (await User.find({ _id: { $in: ids } })
        .skip(skip)
        .limit(limit)
        .populate({ path: "profilePicture", select: "path -_id" })
        .select("userName -_id")) as any;
}

const userUtils = {
    tryingToFollowUnfollowSelf,
    followOrUnfollowUser,
    alreadyUnfollowing,
    createToken,
    userExists,
    alreadyFollowing,
    userFollowCacheKey,
    getUserInfo,
    hashPass,
    paginateUsersFollowersOrFollowing
};

export default userUtils;
