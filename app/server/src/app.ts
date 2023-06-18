import app from "./app.server";
import { seedDB } from "./config.db";
import { PORT } from "@rupture/constants";
import { connect } from "./init.db";
import { redisConnect } from "./redis/";

async function main(): Promise<void> {
    await connect();
    // replace seedDB with deleteSeed if you want to delete all the seeded data
    await seedDB();
    await redisConnect();
    app.listen(PORT, function () {
        console.log(`Server has started on port ${PORT}`);
    });
}

void main();
