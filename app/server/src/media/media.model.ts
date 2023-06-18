import { model, Schema } from "mongoose";
import type { MediaSchema } from "@rupture/types";

const mediaSchema = new Schema<MediaSchema>({
    originalname: {
        type: String,
        required: true,
        default: "default.png"
    },
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true,
        default: "/assets/default.png"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    }
});

const Media = model("Media", mediaSchema);

export default Media;
