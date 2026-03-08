import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getCurrentUser } from '../../../../lib/auth'
import { ACHIEVEMENT_DEFS } from '../../../../lib/achievements'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const earned = await prisma.achievement.findMany({
    where: { userId: user.id },
    orderBy: { earnedAt: 'desc' },
  })

  const earnedTypes = new Set(earned.map(a => a.type))

  const all = Object.entries(ACHIEVEMENT_DEFS).map(([type, def]) => ({
    type,
    ...def,
    earned: earnedTypes.has(type),
    earnedAt: earned.find(a => a.type === type)?.earnedAt ?? null,
  }))

  return NextResponse.json({ achievements: all, totalEarned: earned.length })
}
