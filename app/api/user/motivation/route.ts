import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getCurrentUser } from '../../../../lib/auth'
import { getToday } from '../../../../lib/achievements'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { totalAnswered: true, totalCorrect: true, currentStreak: true, longestStreak: true, dailyGoal: true },
  })
  if (!userData) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const today = getToday()
  const todayStat = await prisma.userDailyStat.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  })

  // 최근 7일 학습 달력
  const sevenDaysAgo = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10)
  const recentStats = await prisma.userDailyStat.findMany({
    where: { userId: user.id, date: { gte: sevenDaysAgo } },
    orderBy: { date: 'asc' },
  })

  const accuracy = userData.totalAnswered > 0
    ? Math.round((userData.totalCorrect / userData.totalAnswered) * 100)
    : 0

  const todayAnswered = todayStat?.answered ?? 0
  const goalProgress = Math.min(100, Math.round((todayAnswered / userData.dailyGoal) * 100))

  return NextResponse.json({
    currentStreak: userData.currentStreak,
    longestStreak: userData.longestStreak,
    totalAnswered: userData.totalAnswered,
    totalCorrect: userData.totalCorrect,
    accuracy,
    dailyGoal: userData.dailyGoal,
    todayAnswered,
    todayCorrect: todayStat?.correct ?? 0,
    goalProgress,
    goalMet: todayAnswered >= userData.dailyGoal,
    recentActivity: recentStats.map(s => ({ date: s.date, answered: s.answered, correct: s.correct })),
  })
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { dailyGoal } = await req.json()
  if (!dailyGoal || dailyGoal < 1 || dailyGoal > 100) {
    return NextResponse.json({ error: 'Invalid dailyGoal (1-100)' }, { status: 400 })
  }

  await prisma.user.update({ where: { id: user.id }, data: { dailyGoal } })
  return NextResponse.json({ success: true })
}
