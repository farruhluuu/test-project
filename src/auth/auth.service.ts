import { Role, User } from "@prisma/client";
import { prisma } from "../db/prisma";
import { registerSchema } from "./dto/auth.dto";
import argon2 from "argon2";

export class Users {
  async create(body: registerSchema & { role?: "user" | "admin" }): Promise<User> {
    const hashPassword = await argon2.hash(body.password)
    const birthdate = new Date(body.birthDate)

    const role: Role = body.role === "admin" ? Role.ADMIN : Role.USER

    const data = {
      firstName: body.firstName,
      lastName: body.lastName,
      surName: body.surName,
      birthDate: birthdate,
      email: body.email,
      password: hashPassword,
      role: role,
    };

    return await prisma.user.create({ data })
  }

  async update( id: number, data: registerSchema & { isActive?: boolean } ): Promise<User> {
    const updateData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      surName: data.surName,
      birthDate: new Date(data.birthDate),
      password: data.password
    };

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    return await prisma.user.update({
      where: { id },
      data: updateData
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } })
  }

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } })
  }

  async findAll(skip = 0, take = 10): Promise<User[]> {
    return await prisma.user.findMany({ skip, take })
  }


  async remove(id: number): Promise<User | null> {
    return await prisma.user.delete({ where: { id } })
  }
}