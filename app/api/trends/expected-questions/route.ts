import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject')
  const limit = parseInt(searchParams.get('limit') ?? '20')

  const where: Record<string, unknown> = { isGenerated: true }
  if (subject) where.subject = subject

  const questions = await prisma.question.findMany({
    where,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      subject: true,
      topic: true,
      content: true,
      optionA: true,
      optionB: true,
      optionC: true,
      optionD: true,
      answer: true,
      explanation: true,
      difficulty: true,
    },
  })

  return NextResponse.json(questions)
}
