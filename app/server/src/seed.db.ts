import Media from "./media/media.model";
import User from "./user/user.model";
import Post from "./post/post.model";
import seedingScripts from "@rupture/scripts/src/seeding";
import { connect, disconnect } from "./init.db";

async function seedDB(): Promise<void> {
    try {
        await connect();
        const defaultPfpExists = await Media.findOne({ filename: "default.png" });
        const defaultUserExists = await User.findOne({
            userName: "test1",
            email: "test1@gmail.com"
        });
        const defaultPostExists = await Post.findOne({
            userId: await seedingScripts.populateWithDefaultUser()
        });

        if (defaultPfpExists === null) {
            await seedingScripts.populateWithDefaultPfp();
        }
        if (defaultUserExists === null) {
            await seedingScripts.populateWithDefaultUser();
        }
        if (defaultPostExists === null) {
            await seedingScripts.populateWithDefaultPost();
        }
    } catch (error) {
        console.log("There was an error seeding the database");
        console.error(error);
    } finally {
        await disconnect();
    }
}

void seedDB();
