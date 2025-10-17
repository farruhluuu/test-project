import jwt from "jsonwebtoken";
import { config } from "../config/config";

interface JWTPayload {
  id: number;
  email: string;
  role: "admin" | "user";
}


export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
};
