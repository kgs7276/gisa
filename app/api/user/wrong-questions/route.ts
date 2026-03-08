import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getCurrentUser } from '../../../../lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject')
  const limit = parseInt(searchParams.get('limit') ?? '20')

  const wrongAnswers = await prisma.userAnswer.findMany({
    where: {
      userId: user.id,
      isCorrect: false,
      ...(subject ? { question: { subject } } : {}),
    },
    include: {
      question: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    distinct: ['questionId'],
  })

  return NextResponse.json(wrongAnswers)
}
