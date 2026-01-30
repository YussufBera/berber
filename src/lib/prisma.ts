// Prisma client disabled for prototype build to avoid DB connection errors.
// Uncomment and configure when database is ready.

/*
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
*/

export const prisma = null;
