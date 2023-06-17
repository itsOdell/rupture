import { AppError } from "../errors";
import { createNewPost } from "@rupture/utils/src/post";
import type { RequestWithToken } from "@rupture/types/src/express";

const postServices = {
    postOnePost: async function (req: RequestWithToken): Promise<void> {
        if (req.file === undefined) {
            throw new AppError("No Media was sent", 400);
        }
        await createNewPost(req);
    }
};

export default postServices;
