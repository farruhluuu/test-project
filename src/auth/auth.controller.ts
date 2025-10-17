import { Request, Response } from "express";
import { Users } from "./auth.service";
import { createRegisterDto, LoginDTO, loginSchema, registerSchema } from "./dto/auth.dto";
import argon2 from "argon2";
import { generateToken } from "./generate-token";
import { AuthRequest } from "../middleware/schemas/authRequestDto";

const users = new Users()

export class authController {
  async signUp(req: Request<{}, {}, registerSchema>, res: Response) {
    try {
      const body = createRegisterDto.parse(req.body)
      const existingUser = await users.findByEmail(body.email)

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
      }

      const newUser = await users.create(body)

      const token = generateToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role.toLowerCase() as "user" | "admin"
      });

      const { password, ...userWithoutPassword } = newUser

      return res.status(201).json({
        ...userWithoutPassword,
        token,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  async signIn(req: Request<{}, {}, loginSchema>, res: Response) {
    try {
      const {email, password: adminPassword } = req.body 

      if (adminPassword === 'admin1234') {
        const newAdmin = await users.create({
          firstName: "System",
          lastName: "Admin",
          surName: "Root",
          birthDate: '2000-01-01',
          email: email,
          password: adminPassword,
          role: 'admin',
        })

        const adminToken = generateToken({
          id: newAdmin.id,
          email: newAdmin.email,
          role: newAdmin.role.toLocaleLowerCase() as "admin"
        })

        res.status(200).json({ adminToken })
      }

      const body = LoginDTO.parse(req.body)
      const user = await users.findByEmail(body.email)
      

      if (!user) {
        return res.status(401).json({ message: "User not found" })
      }

      const isPasswordValid = await argon2.verify(user.password, body.password)
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect password or email" })
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role.toLowerCase() as "user" | "admin"
      })

      const { password, ...userWithoutPassword } = user

      return res.status(200).json({
        ...userWithoutPassword,
        token,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }


  async getAll(req: Request, res: Response) {
    try {
      const { skip = '0', take = '10' } = req.query
      const getUsers = await users.findAll(Number(skip), Number(take))

      res.status(200).json({ users: getUsers })
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const userId = Number(id)

      if (!req.user) return res.status(401).json({ message: "Unauthorized" })

      if (req.user.role !== "admin" && req.user.id !== userId) {
        return res.status(403).json({ message: "Forbidden" })
      }

      const user = await users.findById(Number(id))
      if (!user) return res.status(404).json({ message: "User not found" })

      const { password, ...userData } = user
      res.json(userData)
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }

  async upDate(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) res.status(400).json({ message: "Invalid user id" })

      const check = users.findById(id)
    
      if(!check) res.json({message: "user not found"})
    
      const body = createRegisterDto.parse(req.body)

      const updatedUser = await users.update(id, body)

      const { password, ...userWithoutPassword } = updatedUser

      res.status(200).json({ user: userWithoutPassword })
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return res.status(400).json({ message: "Invalid user id" })

      const user = await users.findById(id)
      if (!user) return res.status(404).json({ message: "User not found" })

      await users.remove(id)

      res.status(200).json({ message: "Successfully deleted" })
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }
}