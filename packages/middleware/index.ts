import jwt from "jsonwebtoken";
import User from "@rupture/server/src/user/user.model";
import { AuthError } from "@rupture/server/src/errors";
import { JWT_SECRET } from "@rupture/constants";
import { asyncHandler } from "@rupture/utils";
import type { NextFunction, Response, Request } from "express";
import type { NormalReqRes, RequestWithToken, UserToken } from "@rupture/types";

export const verifyToken = asyncHandler(async function (req: RequestWithToken, res: Response, next: NextFunction) {
    const requestToken = req.headers.authorization?.split(" ")[1];

    if (requestToken === undefined) {
        throw new AuthError("No token sent", 401);
    }

    const decoded = jwt.verify(requestToken, JWT_SECRET) as UserToken;
    req.token = decoded;

    next();
} as (req: Request, res: Response) => Promise<void>);

export const verifyUser = asyncHandler(async function (req: RequestWithToken, res: Response, next: NextFunction) {
    const requestingUser = await User.findOne({ _id: req.token.user.id });

    if (requestingUser === null) {
        throw new AuthError("Not signed in", 401);
    }
    req.requestingUser = requestingUser;

    next();
} as NormalReqRes);

export const verifyTokenAndUser = [verifyToken, verifyUser];
