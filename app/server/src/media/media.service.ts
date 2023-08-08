import Media from "./media.model";
import { Types } from "mongoose";
import { DatabaseError } from "../errors";
import type { MediaCreationValues, MediaDocument, RequestWithToken } from "@rupture/types";

export const getMediaById = async function (id: string): Promise<MediaDocument | void> {
    Types.ObjectId.isValid(id);
    const mediaExists = await Media.findById({ _id: id });

    if (mediaExists === null) {
        throw new DatabaseError("This media does not exist", 404);
    }

    return mediaExists;
};

export async function createMedia(req: RequestWithToken): Promise<MediaDocument> {
    const values: MediaCreationValues = {
        originalname: req.file!.originalname,
        filename: req.file!.filename,
        path: `/assets/${req.file?.filename}`,
        userId: req.requestingUser!._id
    };

    return await new Media({ ...values }).save();
}

const mediaServices = {
    getMediaById,
    createMedia
};

export default mediaServices;
