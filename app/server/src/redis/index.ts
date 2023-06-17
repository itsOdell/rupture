import { createClient } from "redis";
import type { NextFunction, Request, Response } from "express";

const DEFAULT_EXPIRATION = 3600;
const redisClient = createClient();

export async function redisConnect(): Promise<void> {
    try {
        await redisClient.connect();
        console.log("Successfully connected to redis");
    } catch (error) {
        console.log("error connecting to redis");
        console.error(error);
    }
}

export async function redisDisconnect(): Promise<void> {
    try {
        await redisClient.disconnect();
        console.log("Successfully disconected from redis");
    } catch (error) {
        console.log("error disconnecting from redis");
        console.error(error);
    }
}

// make this a closure
export async function getFromCache(req: Request, res: Response, next: NextFunction, key: string): Promise<Response | void> {
    const data = await redisClient.get(key);

    if (data !== null) {
        return res.status(200).json(JSON.parse(data));
    }

    next();
}

export async function setToCache(key: string, val: string, expiration = DEFAULT_EXPIRATION): Promise<void> {
    await redisClient.setEx(key, expiration, val);
}

export default redisClient;
