import Media from "./media/media.model";
import User from "./user/user.model";
import Post from "./post/post.model";
import { connect, disconnect } from "./init.db";
import { seedDefaultPfpOrGetId, seedDefaultPostOrGetId, seedDefaultUserOrGetId } from "@rupture/scripts";

async function seedDB(): Promise<void> {
    try {
        await connect();
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
    } catch (error) {
        console.log("There was an error seeding the database");
        console.error(error);
    } finally {
        await disconnect();
    }
}

void seedDB();
