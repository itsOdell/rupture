import Media from "@rupture/server/src/media/media.model";
import User from "@rupture/server/src/user/user.model";
import Post from "@rupture/server/src/post/post.model";
import type { Types } from "mongoose";

export async function populateWithDefaultPfp(): Promise<Types.ObjectId> {
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

export async function populateWithDefaultUser(): Promise<Types.ObjectId> {
    let defaultUser = await User.findOne({ userName: "test1", email: "test1@gmail.com" });

    if (defaultUser === null) {
        defaultUser = await new User({
            firstName: "test",
            lastName: "test",
            email: "test1@gmail.com",
            password: "test123"
        }).save();
    }

    return defaultUser?._id;
}

export async function populateWithDefaultPost(): Promise<Types.ObjectId> {
    let defaultPost = await Post.findOne({ userId: await populateWithDefaultUser() });

    if (defaultPost === null) {
        defaultPost = await new Post({
            userId: await populateWithDefaultUser(),
            mediaId: await populateWithDefaultPfp()
        }).save();
    }

    return defaultPost?._id;
}

const seedingcripts = {
    populateWithDefaultPfp,
    populateWithDefaultUser,
    populateWithDefaultPost
};

export default seedingcripts;
