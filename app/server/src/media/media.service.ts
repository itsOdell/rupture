import Media from "./media.model";
import { Types } from "mongoose";
import { DatabaseError } from "../errors";
import type { MediaDocument } from "@rupture/types/src/media";

export const getMediaById = async function (id: string): Promise<MediaDocument | void> {
    Types.ObjectId.isValid(id);
    const mediaExists = await Media.findById({ _id: id });

    if (mediaExists === null) {
        throw new DatabaseError("This media does not exist", 404);
    }

    return mediaExists;
};
