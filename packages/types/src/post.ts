/* eslint-disable @typescript-eslint/ban-types */
import type { Types, Document } from "mongoose";
import type { MediaSchema } from "./media";
export interface PostSchema {
    mediaId: MediaSchema;
    likes: string[];
    caption: string;
    comments: string[];
    likeCount: number;
    commentCount: number;
    userId: Types.ObjectId;
}

export type PostDocument =
    | (Document<unknown, {}, PostSchema> &
          Omit<
              PostSchema & {
                  _id: Types.ObjectId;
              },
              never
          >)
    | null;

export type Posts = Post[];

export interface Post {
    commentCount: number;
    userId: UserId;
    mediaId: MediaId;
    caption: string;
    likeCount: number;
    likes: any[];
    comments: any[];
    createdAt: string;
    updatedAt: string;
}

export interface UserId {
    userName: string;
    profilePicture: ProfilePicture;
}

export interface ProfilePicture {
    path: string;
}

export interface MediaId {
    path: string;
}
