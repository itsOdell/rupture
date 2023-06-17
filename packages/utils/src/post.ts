import Media from "@rupture/server/src/media/media.model";
import Post from "@rupture/server/src/post/post.model";
import type { RequestWithToken } from "@rupture/types/src/express";

export async function createNewPost(req: RequestWithToken): Promise<void> {
    const mediaForPost = await new Media({
        originalname: req.file?.originalname,
        filename: req.file?.filename,
        path: `/assets/${req.file?.filename}`,
        userId: req.requestingUser?._id
    }).save();
    await new Post({
        userId: req.requestingUser!._id,
        mediaId: mediaForPost._id,
        caption: req.body.caption
    }).save();
}

const postUtils = {
    createNewPost
};

export default postUtils;
