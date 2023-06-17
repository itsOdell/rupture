import type { Request, Response, NextFunction } from "express";

type controller = (req: Request, res: Response, next?: NextFunction) => Promise<Response | void>;

export const asyncHandler = (controller: controller) => async (req: Request, res: Response, next?: NextFunction) => {
    try {
        await controller(req, res, next);
    } catch (error) {
        if (next !== undefined) {
            return next(error);
        }
    }
};
