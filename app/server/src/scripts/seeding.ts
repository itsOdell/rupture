import Media from "../media/media.model";
import type { Types } from "mongoose";
import { createMedia } from "../media/media.service";

export async function seedDefaultPfpOrGetId(): Promise<Types.ObjectId> {
    let defaultPfp = await Media.findOne({ filename: "default.png" });

    if (defaultPfp === null) {
        defaultPfp = await createMedia({
            originalname: "default.png",
            filename: "default.png",
            path: "/assets/default.png"
        });
    }

    return defaultPfp!._id;
}

const seedingcripts = {
    seedDefaultPfpOrGetId
};

export default seedingcripts;
