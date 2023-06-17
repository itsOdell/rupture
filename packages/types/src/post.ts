/* eslint-disable @typescript-eslint/ban-types */
import type { Types, Document } from "mongoose";
import type { MediaSchema } from "./media";
export interface PostSchema {
    mediaId: MediaSchema;
    likes: string[];
    caption: string;
    comments: string[];
    likeCount: number;
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
