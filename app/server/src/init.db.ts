import mongoose from "mongoose";
import { MONGODB_URI } from "@rupture/constants";

export async function connect(): Promise<void> {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Successfully connected to Mongo Database");
    } catch (error) {
        console.error("Failed to connect to Mongo Database");
        console.error(error);
    }
}
