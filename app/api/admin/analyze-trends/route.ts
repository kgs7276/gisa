import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getCurrentUser } from '../../../../lib/auth'
import { analyzeTrends } from '../../../../lib/claude'
import { SUBJECTS } from '../../../../lib/constants'
import { parseJsonObject, stringifyJson } from '../../../../lib/utils'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const targetSubject = searchParams.get('subject')
  const subjects = targetSubject ? [targetSubject] : SUBJECTS

  const results: Record<string, unknown>[] = []

  for (const subject of subjects) {
    try {
      // 과목별 실제 기출 문제를 주제별로 집계
      const questions = await prisma.question.findMany({
        where: { subject, isGenerated: false },
        select: { topic: true, year: true },
      })

      if (questions.length === 0) continue

      // { topic: { year: count } } 형태로 집계
      const topicData: Record<string, Record<string, number>> = {}
      for (const q of questions) {
        const topic = q.topic ?? '기타'
        const year = String(q.year)
        if (!topicData[topic]) topicData[topic] = {}
        topicData[topic][year] = (topicData[topic][year] ?? 0) + 1
      }

      const years = [...new Set(questions.map((q) => q.year))].sort()
      const analysisRange = `${years[0]}년 ~ ${years[years.length - 1]}년`

      const analysis = await analyzeTrends({ subject, topicData, analysisRange })

      // ExamTrend 레코드 업데이트/생성
      for (const trend of analysis.trends) {
        const topicFreq = topicData[trend.topic] ?? {}
        const totalCount = Object.values(topicFreq).reduce((s, v) => s + v, 0)
        const examCount = years.length || 1

        await prisma.examTrend.upsert({
          where: { subject_topic: { subject, topic: trend.topic } },
          create: {
            subject,
            topic: trend.topic,
            analysisYear: new Date().getFullYear(),
            yearlyFrequency: stringifyJson(topicFreq),
            totalCount,
            avgPerExam: totalCount / examCount,
            trendSummary: trend.trendSummary,
            predictedCount: trend.predictedCount,
            importance: trend.importance,
          },
          update: {
            analysisYear: new Date().getFullYear(),
            yearlyFrequency: stringifyJson(topicFreq),
            totalCount,
            avgPerExam: totalCount / examCount,
            trendSummary: trend.trendSummary,
            predictedCount: trend.predictedCount,
            importance: trend.importance,
          },
        })
      }

      results.push({ subject, trendsUpdated: analysis.trends.length, hotTopics: analysis.hotTopics })
    } catch (e) {
      console.error(`Trend analysis error for ${subject}:`, e)
      results.push({ subject, error: (e as Error).message })
    }
  }

  return NextResponse.json({ results })
}
