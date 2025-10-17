import { z } from 'zod';
import { Request } from 'express';

export const userTokenSchema = z.object({
  id: z.number(),
  role: z.enum(['admin', 'user']),
  email: z.string().email(),
});

export type UserFromToken = z.infer<typeof userTokenSchema>;

export interface AuthRequest extends Request {
  user?: UserFromToken;
}
