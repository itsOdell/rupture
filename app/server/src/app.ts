import app from "./app.server";
import seedDB from "./seed.db";
import { PORT } from "@rupture/constants";
import { connect } from "./init.db";
import { redisConnect } from "./redis/";

async function main(): Promise<void> {
    await connect();
    await seedDB();
    await redisConnect();
    app.listen(PORT, function () {
        console.log(`Server has started on port ${PORT}`);
    });
}

void main();
