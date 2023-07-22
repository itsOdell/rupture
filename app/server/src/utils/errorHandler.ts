import jwt from "jsonwebtoken";
import { ValidationError } from "joi";
import { AppError, AuthError, DatabaseError } from "../errors";
import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): Response {
    console.log(err);
    if (err instanceof ValidationError) {
        return res.status(403).json({
            name: err.name,
            message: err.message
        });
    }
    if (err instanceof DatabaseError) {
        return res.status(err.code).json({
            name: err.name,
            message: err.message
        });
    }
    if (err instanceof AuthError || err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
            name: err.name,
            message: err.message
        });
    }
    if (err instanceof AppError) {
        return res.status(err.code).json({
            name: err.name,
            message: err.message
        });
    }
    return res.status(500).json({
        name: err.name,
        message: err.message
    });
}
