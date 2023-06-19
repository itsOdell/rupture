import Media from "@rupture/server/src/media/media.model";
import type { Types } from "mongoose";

export async function seedDefaultPfpOrGetId(): Promise<Types.ObjectId> {
    let defaultPfp = await Media.findOne({ filename: "default.png" });

    if (defaultPfp === null) {
        defaultPfp = await new Media({
            originalname: "default.png",
            filename: "default.png",
            path: "/assets/default.png"
        }).save();
    }

    return defaultPfp?._id;
}

const seedingcripts = {
    seedDefaultPfpOrGetId
};

export default seedingcripts;
