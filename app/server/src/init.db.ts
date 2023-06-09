import mongoose from "mongoose";
import { MONGODB_URI } from "@rupture/constants";

let connection: any = null;

export async function connect(): Promise<void> {
    try {
        connection = await mongoose.connect(MONGODB_URI);
        console.log("Successfully connected to Mongo Database");
    } catch (error) {
        console.error("Failed to connect to Mongo Database");
        console.error(error);
    }
}

export async function disconnect(): Promise<void> {
    if (connection !== null) {
        await connection.disconnect();
        console.log("Disconnected from Mongo Database");
    }
}
