import { Response, NextFunction } from "express";

import jwt from "jsonwebtoken"

import { config } from "../config/config";
import { AuthRequest } from "./schemas/authRequestDto";

const JWT_SECRET = config.jwtSecret

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user']

    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}