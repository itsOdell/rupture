import Post from "..//post/post.model";
import type { RequestWithToken } from "@rupture/types";
import type { Types } from "mongoose";
import { createMedia } from "../media/media.service";

export async function createNewPost(req: RequestWithToken): Promise<Types.ObjectId> {
    const mediaForPost = await createMedia(req);

    const uploadedPost = await new Post({
        userId: req.requestingUser!._id,
        mediaId: mediaForPost?._id,
        caption: req.body.caption
    }).save();
    return uploadedPost._id;
}

const postUtils = {
    createNewPost
};

export default postUtils;
