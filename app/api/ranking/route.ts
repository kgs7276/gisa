import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const searchParams = req.nextUrl.searchParams
  const type = searchParams.get('type') ?? 'overall' // overall | growth | streak

  if (type === 'overall') {
    // 종합 랭킹: 정확도 기준 (최소 10문제 이상)
    const users = await prisma.user.findMany({
      where: { totalAnswered: { gte: 10 } },
      select: { id: true, name: true, email: true, totalAnswered: true, totalCorrect: true, currentStreak: true },
      orderBy: [{ totalCorrect: 'desc' }, { totalAnswered: 'asc' }],
      take: 50,
    })

    const ranked = users.map((u, i) => ({
      rank: i + 1,
      id: u.id,
      name: u.name ?? u.email.split('@')[0],
      totalAnswered: u.totalAnswered,
      totalCorrect: u.totalCorrect,
      accuracy: u.totalAnswered > 0 ? Math.round((u.totalCorrect / u.totalAnswered) * 100) : 0,
      currentStreak: u.currentStreak,
      isMe: u.id === user.id,
    }))

    return NextResponse.json({ type: 'overall', ranking: ranked })
  }

  if (type === 'growth') {
    // 급성장 랭킹: 최근 7일 정답 수 기준
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)

    const stats = await prisma.userDailyStat.groupBy({
      by: ['userId'],
      where: { date: { gte: sevenDaysAgo } },
      _sum: { answered: true, correct: true },
      orderBy: { _sum: { correct: 'desc' } },
      take: 50,
    })

    const userIds = stats.map(s => s.userId)
    const userMap = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    })
    const nameMap = Object.fromEntries(userMap.map(u => [u.id, { name: u.name ?? u.email.split('@')[0], isMe: u.id === user.id }]))

    const ranked = stats.map((s, i) => ({
      rank: i + 1,
      id: s.userId,
      name: nameMap[s.userId]?.name ?? '익명',
      weeklyAnswered: s._sum.answered ?? 0,
      weeklyCorrect: s._sum.correct ?? 0,
      weeklyAccuracy: (s._sum.answered ?? 0) > 0 ? Math.round(((s._sum.correct ?? 0) / (s._sum.answered ?? 0)) * 100) : 0,
      isMe: nameMap[s.userId]?.isMe ?? false,
    }))

    return NextResponse.json({ type: 'growth', ranking: ranked })
  }

  if (type === 'streak') {
    // 연속학습 랭킹
    const users = await prisma.user.findMany({
      where: { currentStreak: { gt: 0 } },
      select: { id: true, name: true, email: true, currentStreak: true, longestStreak: true },
      orderBy: [{ currentStreak: 'desc' }, { longestStreak: 'desc' }],
      take: 50,
    })

    const ranked = users.map((u, i) => ({
      rank: i + 1,
      id: u.id,
      name: u.name ?? u.email.split('@')[0],
      currentStreak: u.currentStreak,
      longestStreak: u.longestStreak,
      isMe: u.id === user.id,
    }))

    return NextResponse.json({ type: 'streak', ranking: ranked })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
