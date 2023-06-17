import { Schema, model } from "mongoose";
import type { PostSchema } from "@rupture/types/src/post";

const postSchema = new Schema<PostSchema>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },
        mediaId: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: "Media"
        },
        caption: {
            required: false,
            type: String
        },
        likeCount: {
            type: Number,
            default: 0
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Users"
            }
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comments"
            }
        ]
    },
    { timestamps: true }
);

postSchema.pre<PostSchema>("validate", async function (next) {
    this.likeCount = this.likes.length;
});

const Post = model("Posts", postSchema);

export default Post;
