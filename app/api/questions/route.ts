import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/auth'
import { createQuestionSchema } from '../../../lib/validation'
import { stringifyJson } from '../../../lib/utils'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject')
  const year = searchParams.get('year')
  const round = searchParams.get('round')
  const difficulty = searchParams.get('difficulty')
  const topic = searchParams.get('topic')
  const isGenerated = searchParams.get('isGenerated')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const offset = parseInt(searchParams.get('offset') ?? '0')

  const where: Record<string, unknown> = {}
  if (subject) where.subject = subject
  if (year) where.year = parseInt(year)
  if (round) where.round = parseInt(round)
  if (difficulty) where.difficulty = difficulty
  if (topic) where.topic = topic
  if (isGenerated !== null) where.isGenerated = isGenerated === 'true'

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: [{ year: 'desc' }, { round: 'desc' }, { questionNo: 'asc' }],
    }),
    prisma.question.count({ where }),
  ])

  return NextResponse.json({ questions, total, limit, offset })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = createQuestionSchema.parse(body)

    const question = await prisma.question.create({
      data: {
        ...data,
        tags: stringifyJson(data.tags),
      },
    })

    return NextResponse.json(question, { status: 201 })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
