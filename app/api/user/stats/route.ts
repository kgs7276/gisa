import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getCurrentUser } from '../../../../lib/auth'
import { SUBJECTS } from '../../../../lib/constants'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [userData, subjectStats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { totalAnswered: true, totalCorrect: true, currentStreak: true, longestStreak: true },
    }),
    // 과목별 정답률
    Promise.all(
      SUBJECTS.map(async (subject) => {
        const [total, correct] = await Promise.all([
          prisma.userAnswer.count({
            where: { userId: user.id, question: { subject } },
          }),
          prisma.userAnswer.count({
            where: { userId: user.id, isCorrect: true, question: { subject } },
          }),
        ])
        return { subject, total, correct }
      })
    ),
  ])

  const wrongCount = await prisma.userAnswer.count({
    where: { userId: user.id, isCorrect: false },
  })

  return NextResponse.json({ ...userData, subjectStats, wrongCount })
}
