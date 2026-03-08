import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject')

  const where: Record<string, unknown> = {}
  if (subject) where.subject = subject

  const trends = await prisma.examTrend.findMany({
    where,
    orderBy: [
      { importance: 'asc' }, // HIGH first (alphabetically: HIGH < LOW < MEDIUM but we handle in frontend)
      { totalCount: 'desc' },
    ],
  })

  // importance 정렬: HIGH > MEDIUM > LOW
  const ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 }
  const sorted = trends.sort((a, b) => {
    const aOrd = ORDER[a.importance as keyof typeof ORDER] ?? 1
    const bOrd = ORDER[b.importance as keyof typeof ORDER] ?? 1
    return aOrd - bOrd
  })

  return NextResponse.json(sorted)
}
