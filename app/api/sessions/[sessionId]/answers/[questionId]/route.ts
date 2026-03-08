import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../../lib/prisma'
import { getCurrentUser } from '../../../../../../lib/auth'

// AI 평가 폴링 엔드포인트
export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string; questionId: string } }
) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessionId, questionId } = params

  const answer = await prisma.userAnswer.findFirst({
    where: { sessionId, questionId, userId: user.id },
    select: {
      id: true,
      isCorrect: true,
      selectedOption: true,
      aiEvalStatus: true,
      aiSummary: true,
      aiAnalysis: true,
      aiExplanation: true,
    },
  })

  if (!answer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(answer)
}
