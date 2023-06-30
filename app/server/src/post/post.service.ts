import { AppError } from "../errors";
import { createNewPost } from "@rupture/utils";
import type { RequestWithToken } from "@rupture/types";

const postServices = {
    postOnePost: async function (req: RequestWithToken): Promise<void> {
        if (req.file === undefined) {
            throw new AppError("No Media was sent", 400);
        }
        const postId = await createNewPost(req);
        req.requestingUser?.posts.push(String(postId));
        await req.requestingUser?.save();
    }
};

export default postServices;
