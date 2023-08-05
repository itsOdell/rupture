import postServices from "./post.service";
import { asyncHandler } from "../utils";
import type { NormalReqRes, RequestWithToken } from "@rupture/types";

export const uploadPost = asyncHandler(async function (req: RequestWithToken, res) {
    await postServices.postOnePost(req);

    return res.status(200).json({
        message: "Successfully posted post"
    });
} as NormalReqRes);

export const deletePost = asyncHandler(async function (req: RequestWithToken, res) {
    return res.status(200).json({
        message: "Successfully deleted post"
    });
} as NormalReqRes);

const postController = {
    uploadPost,
    deletePost
};

export default postController;
