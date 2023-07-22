import postServices from "./post.service";
import { asyncHandler } from "../utils";
import type { RequestWithToken } from "@rupture/types";
import type { Request, Response } from "express";

export const uploadPost = asyncHandler(async function (req: RequestWithToken, res) {
    await postServices.postOnePost(req);

    return res.status(200).json({
        message: "Successfully posted post"
    });
} as (req: Request, res: Response) => Promise<Response>);
