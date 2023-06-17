import type { NextFunction, Request, Response } from "express";
import type { UserDocument } from "./user";

export interface UserToken {
    user: { id: string; userName: string };
}

export interface RequestWithToken extends Request {
    token: UserToken;
    requestingUser: UserDocument;
}

export type NormalReqRes = (req: Request, res: Response, next?: NextFunction) => Promise<Response | void>;
