import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/auth'
import { createSessionSchema } from '../../../lib/validation'
import { stringifyJson } from '../../../lib/utils'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') ?? '10')

  const sessions = await prisma.quizSession.findMany({
    where: { userId: user.id, ...(status ? { status } : {}) },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { _count: { select: { answers: true } } },
  })

  return NextResponse.json(sessions)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = createSessionSchema.parse(body)

    // 모드별로 문제 선택
    const where: Record<string, unknown> = {}

    if (data.mode === 'BY_SUBJECT' && data.subject) {
      where.subject = data.subject
    }

    if (data.mode === 'WRONG_REVIEW') {
      // 사용자가 틀린 문제들의 ID 조회
      const wrongAnswers = await prisma.userAnswer.findMany({
        where: { userId: user.id, isCorrect: false },
        select: { questionId: true },
        distinct: ['questionId'],
      })
      const wrongIds = wrongAnswers.map((a) => a.questionId)
      if (wrongIds.length === 0) {
        return NextResponse.json({ error: '틀린 문제가 없습니다.' }, { status: 400 })
      }
      where.id = { in: wrongIds }
    }

    if (data.yearFilter) where.year = data.yearFilter
    if (data.roundFilter) where.round = data.roundFilter

    const totalQ = data.mode === 'MOCK_EXAM' ? 100 : (data.totalQ ?? 10)

    // 문제 랜덤 선택 (SQLite shuffle trick)
    const allQuestions = await prisma.question.findMany({
      where,
      select: { id: true },
    })

    if (allQuestions.length === 0) {
      return NextResponse.json({ error: '해당 조건의 문제가 없습니다.' }, { status: 400 })
    }

    // 섞기
    const shuffled = allQuestions.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(totalQ, shuffled.length))
    const questionIds = selected.map((q) => q.id)

    const session = await prisma.quizSession.create({
      data: {
        mode: data.mode,
        subject: data.subject,
        totalQ: questionIds.length,
        userId: user.id,
        questionIds: stringifyJson(questionIds),
        yearFilter: data.yearFilter,
        roundFilter: data.roundFilter,
        timeLimit: data.mode === 'MOCK_EXAM' ? 7200 : null,
      },
      include: { answers: true },
    })

    // 첫 번째 문제 포함해서 반환
    const firstQuestion = await prisma.question.findUnique({
      where: { id: questionIds[0] },
      select: { id: true, content: true, optionA: true, optionB: true, optionC: true, optionD: true, subject: true, topic: true, difficulty: true },
    })

    return NextResponse.json({ session, firstQuestion }, { status: 201 })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
