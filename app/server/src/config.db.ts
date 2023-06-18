import Media from "./media/media.model";
import User from "./user/user.model";
import Post from "./post/post.model";
import { seedDefaultPfpOrGetId, seedDefaultPostOrGetId, seedDefaultUserOrGetId } from "@rupture/scripts";

export async function seedDB(): Promise<void> {
    try {
        const defaultPfpExists = await Media.findOne({ filename: "default.png" });
        const defaultUserExists = await User.findOne({
            userName: "test1",
            email: "test1@gmail.com"
        });
        const defaultPostExists = await Post.findOne({
            userId: await seedDefaultUserOrGetId()
        });

        if (defaultPfpExists === null) {
            await seedDefaultPfpOrGetId();
        }
        if (defaultUserExists === null) {
            await seedDefaultUserOrGetId();
        }
        if (defaultPostExists === null) {
            await seedDefaultPostOrGetId();
        }
        console.log("seeding was successful");
    } catch (error) {
        console.log("There was an error seeding the database");
        console.error(error);
    }
}

export async function deleteSeed(): Promise<void> {
    try {
        await User.deleteMany();
        await Media.deleteMany();
        await Post.deleteMany();
        console.log("seed deleted successfully");
    } catch (error) {
        console.error(error);
    }
}
