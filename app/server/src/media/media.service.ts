import Media from "./media.model";
import { Types } from "mongoose";
import { DatabaseError } from "../errors";
import type { MediaDocument, MediaCreationValues } from "@rupture/types";

export const getMediaById = async function (id: string): Promise<MediaDocument | void> {
    Types.ObjectId.isValid(id);
    const mediaExists = await Media.findById({ _id: id });

    if (mediaExists === null) {
        throw new DatabaseError("This media does not exist", 404);
    }

    return mediaExists;
};

export async function createMedia({
    originalname,
    filename,
    path,
    userId
}: MediaCreationValues): Promise<MediaDocument> {
    const values = {
        originalname,
        filename,
        path
    };

    if (userId !== undefined) {
        Object.assign(values, { userId });
    }

    return await new Media({ ...values }).save();
}

const mediaServices = {
    getMediaById,
    createMedia
};

export default mediaServices;
