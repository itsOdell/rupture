/* eslint-disable @typescript-eslint/ban-types */
import type { Types, Document } from "mongoose";

export interface MediaSchema {
    originalname: string;
    filename: string;
    path: string;
    userId: Types.ObjectId;
}

export type MediaDocument =
    | (Document<unknown, {}, MediaSchema> &
          Omit<
              MediaSchema & {
                  _id: Types.ObjectId;
              },
              never
          >)
    | null;
