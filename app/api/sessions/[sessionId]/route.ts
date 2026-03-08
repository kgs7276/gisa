import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getCurrentUser } from '../../../../lib/auth'
import { parseJsonArray } from '../../../../lib/utils'

export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessionId } = params
  const session = await prisma.quizSession.findFirst({
    where: { id: sessionId, userId: user.id },
    include: {
      answers: {
        include: {
          question: true,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const questionIds = parseJsonArray<string>(session.questionIds)
  return NextResponse.json({ ...session, questionIdsList: questionIds })
}

export async function PATCH(req: NextRequest, { params }: { params: { sessionId: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessionId } = params
  const body = await req.json()
  const { status, score, totalTime } = body

  const session = await prisma.quizSession.updateMany({
    where: { id: sessionId, userId: user.id },
    data: { status, score, totalTime },
  })

  return NextResponse.json(session)
}
