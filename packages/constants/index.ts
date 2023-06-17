import dotenv from "dotenv";
dotenv.config({ path: `.env.${String(process.env.NODE_ENV)}` });

export const PORT = Number(process.env.PORT);
export const MONGODB_URI = String(process.env.MONGODB_URI);
export const SALT = Number(process.env.SALT);
export const JWT_SECRET = String(process.env.JWT_SECRET);
export const ASSETS_DIR = String(process.env.ASSETS_DIR);
export const REDIS_PASSWORD = String(process.env.REDIS_PASSWORD);
export const REDIS_HOST = String(process.env.REDIS_HOST);
export const REDIS_PORT = String(process.env.REDIS_PORT);

const CONSTANTS = {
    PORT,
    MONGODB_URI,
    SALT,
    JWT_SECRET,
    ASSETS_DIR,
    REDIS_PASSWORD,
    REDIS_HOST,
    REDIS_PORT
};

export default CONSTANTS;
