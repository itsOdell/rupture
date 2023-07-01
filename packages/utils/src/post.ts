import Media from "@rupture/server/src/media/media.model";
import Post from "@rupture/server/src/post/post.model";
import type { RequestWithToken } from "@rupture/types/src/express";
import type { Types } from "mongoose";

export async function createNewPost(req: RequestWithToken): Promise<Types.ObjectId> {
    const mediaForPost = await new Media({
        originalname: req.file?.originalname,
        filename: req.file?.filename,
        path: `/assets/${req.file?.filename}`,
        userId: req.requestingUser?._id
    }).save();
    const uploadedPost = await new Post({
        userId: req.requestingUser!._id,
        mediaId: mediaForPost._id,
        caption: req.body.caption
    }).save();
    return uploadedPost._id;
}

const postUtils = {
    createNewPost
};

export default postUtils;
