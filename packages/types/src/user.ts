/* eslint-disable @typescript-eslint/ban-types */
import type { Types, Document } from "mongoose";

export interface UserSchema {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    posts: string[];
    followers: string[];
    following: string[];
    profilePicture?: string;
    saved?: string[];
    website?: string;
    bio?: string;
    phoneNumber?: string;
    postCount: number;
    followerCount: number;
    followingCount: number;
}

export type UserDocument =
    | (Document<unknown, {}, UserSchema> &
          Omit<
              UserSchema & {
                  _id: Types.ObjectId;
              },
              never
          >)
    | null;

export type signingUpUser = Pick<UserSchema, "firstName" | "lastName" | "userName" | "email" | "password">;

export interface possibleUserUpdateValues {
    firstName?: string;
    lastName?: string;
    userName?: string;
    email?: string;
    profilePicture?: string;
    website?: string;
    bio?: string;
    phoneNumber?: string;
}
export interface FollowerOrFollowing {
    userName: string;
    profilePicture: {
        path: string;
    };
}

export type UserFollowersOrFollowing = FollowerOrFollowing[] | FollowerOrFollowing;
