import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../lib/prisma'
import { getCurrentUser } from '../../../../../lib/auth'
import { submitAnswerSchema } from '../../../../../lib/validation'
import { evaluateAnswer } from '../../../../../lib/claude'
import { updateDailyStatAndStreak, checkAndAwardAchievements } from '../../../../../lib/achievements'

export async function POST(req: NextRequest, { params }: { params: { sessionId: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessionId } = params

  try {
    const body = await req.json()
    const { questionId, selectedOption, timeSpent } = submitAnswerSchema.parse(body)

    // 세션 확인
    const session = await prisma.quizSession.findFirst({
      where: { id: sessionId, userId: user.id, status: 'IN_PROGRESS' },
    })
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

    // 문제 확인
    const question = await prisma.question.findUnique({ where: { id: questionId } })
    if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })

    const isCorrect = question.answer === selectedOption

    // 답변 저장 (AI 평가는 백그라운드에서)
    const userAnswer = await prisma.userAnswer.upsert({
      where: { sessionId_questionId: { sessionId, questionId } },
      create: {
        sessionId,
        questionId,
        userId: user.id,
        selectedOption,
        isCorrect,
        timeSpent,
        aiEvalStatus: 'PENDING',
      },
      update: {
        selectedOption,
        isCorrect,
        timeSpent,
        aiEvalStatus: 'PENDING',
      },
    })

    // 유저 통계 업데이트
    const statsUpdate: Record<string, unknown> = { totalAnswered: { increment: 1 } }
    if (isCorrect) {
      statsUpdate.totalCorrect = { increment: 1 }
    }
    await prisma.user.update({ where: { id: user.id }, data: statsUpdate })

    // 일일 통계 및 스트릭 업데이트 (백그라운드)
    Promise.resolve().then(async () => {
      try {
        await updateDailyStatAndStreak(prisma, user.id, isCorrect)
        const updatedUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { totalAnswered: true, totalCorrect: true, currentStreak: true },
        })
        if (updatedUser) {
          await checkAndAwardAchievements(prisma, user.id, updatedUser)
        }
      } catch (err) {
        console.error('Daily stat update error:', err)
      }
    })

    // 세션 currentIdx 업데이트
    await prisma.quizSession.update({
      where: { id: sessionId },
      data: { currentIdx: { increment: 1 } },
    })

    // Claude AI 평가 - 비동기 백그라운드 실행
    Promise.resolve().then(async () => {
      try {
        const result = await evaluateAnswer({
          isCorrect,
          subject: question.subject,
          topic: question.topic,
          content: question.content,
          optionA: question.optionA,
          optionB: question.optionB,
          optionC: question.optionC,
          optionD: question.optionD,
          answer: question.answer,
          selectedOption,
        })

        await prisma.userAnswer.update({
          where: { id: userAnswer.id },
          data: {
            aiSummary: result.aiSummary,
            aiAnalysis: result.aiAnalysis,
            aiExplanation: result.aiExplanation,
            aiEvalStatus: 'DONE',
          },
        })
      } catch (err) {
        console.error('AI evaluation error:', err)
        await prisma.userAnswer.update({
          where: { id: userAnswer.id },
          data: { aiEvalStatus: 'ERROR' },
        })
      }
    })

    return NextResponse.json({
      isCorrect,
      correctAnswer: question.answer,
      userAnswerId: userAnswer.id,
      question: {
        content: question.content,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        explanation: question.explanation,
      },
    })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
