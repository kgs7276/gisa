import { getServerSession } from 'next-auth'
import authOptions from './authOptions'
import prisma from './prisma'

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.email) {
      return prisma.user.findUnique({ where: { email: session.user.email } })
    }
    return null
  } catch {
    return null
  }
}

export default getCurrentUser
