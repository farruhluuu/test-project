import z from "zod"

export const createRegisterDto = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  surName: z.string().min(3),
  birthDate: z.string().refine(s => !Number.isNaN(Date.parse(s)), { message: 'Invalid date' }),
  email: z.string().email(),
  password: z.string().min(6),
  isActive: z.boolean().optional()
}) 

export type registerSchema = z.infer<typeof createRegisterDto>


export const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export type loginSchema = z.infer<typeof LoginDTO>;
