import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
}

export async function validateUserPassword(email: string, password: string): Promise<boolean> {
  const user = await findUserByEmail(email);
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function upsertAdminUser(email: string, password: string) {
  const passwordHash = await hashPassword(password);

  return prisma.user.upsert({
    where: { email: email.toLowerCase().trim() },
    update: { passwordHash },
    create: {
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "ADMIN",
    },
  });
}
