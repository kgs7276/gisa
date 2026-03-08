import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getCurrentUser } from '../../../../lib/auth'
import { generateQuestions } from '../../../../lib/claude'
import { seedQuestionsSchema } from '../../../../lib/validation'
import { stringifyJson } from '../../../../lib/utils'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { subject, topic, count, difficulty } = seedQuestionsSchema.parse(body)

    const generated = await generateQuestions({ subject, topic, count, difficulty })

    if (generated.length === 0) {
      return NextResponse.json({ error: 'AI가 문제를 생성하지 못했습니다.' }, { status: 500 })
    }

    // 기존 AI 생성 문제 중 같은 과목/주제 것들의 번호 계산
    const existingCount = await prisma.question.count({
      where: { subject, topic, isGenerated: true },
    })

    const created = await Promise.all(
      generated.map(async (q, idx) => {
        try {
          return await prisma.question.create({
            data: {
              year: new Date().getFullYear(),
              round: 0,  // 0 = 예상문제
              subject,
              topic: q.topic || topic,
              questionNo: existingCount + idx + 1,
              content: q.content,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              answer: q.answer,
              explanation: q.explanation,
              difficulty: q.difficulty || difficulty,
              tags: stringifyJson(q.tags || []),
              isGenerated: true,
              sourceNote: `AI 생성 예상문제 (${subject} - ${topic})`,
            },
          })
        } catch {
          return null  // 중복 등 오류 무시
        }
      })
    )

    const savedCount = created.filter(Boolean).length

    return NextResponse.json({ generated: generated.length, saved: savedCount })
  } catch (e: unknown) {
    console.error('Seed questions error:', e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
