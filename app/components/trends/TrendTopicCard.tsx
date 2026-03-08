import { parseJsonObject } from '../../../lib/utils'

interface ExamTrend {
  id: string
  subject: string
  topic: string
  totalCount: number
  avgPerExam: number
  trendSummary: string | null
  predictedCount: number | null
  importance: string
  yearlyFrequency: string
}

const IMPORTANCE_COLORS: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700 border-red-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW: 'bg-gray-100 text-gray-600 border-gray-200',
}

const IMPORTANCE_LABELS: Record<string, string> = {
  HIGH: '핵심', MEDIUM: '중요', LOW: '일반',
}

export default function TrendTopicCard({ trend }: { trend: ExamTrend }) {
  const freq = parseJsonObject<Record<string, number>>(trend.yearlyFrequency)
  const years = Object.keys(freq).sort()
  const maxFreq = Math.max(...Object.values(freq), 1)

  return (
    <div className={`bg-white rounded-xl border-2 p-5 ${IMPORTANCE_COLORS[trend.importance] ?? 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{trend.topic}</h4>
          <p className="text-xs text-gray-400 mt-0.5">평균 {trend.avgPerExam.toFixed(1)}문제/회차 · 총 {trend.totalCount}문제</p>
        </div>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${IMPORTANCE_COLORS[trend.importance]}`}>
          {IMPORTANCE_LABELS[trend.importance] ?? trend.importance}
        </span>
      </div>

      {trend.trendSummary && (
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{trend.trendSummary}</p>
      )}

      {/* 연도별 출제 빈도 바 */}
      {years.length > 0 && (
        <div className="flex items-end gap-1 h-10 mb-3">
          {years.map((y) => (
            <div key={y} className="flex flex-col items-center gap-0.5 flex-1">
              <div
                className="w-full rounded-sm bg-indigo-300"
                style={{ height: `${Math.round(((freq[y] ?? 0) / maxFreq) * 32)}px`, minHeight: '2px' }}
              />
              <span className="text-[10px] text-gray-400">{y.slice(2)}</span>
            </div>
          ))}
        </div>
      )}

      {trend.predictedCount !== null && trend.predictedCount > 0 && (
        <div className="bg-indigo-50 rounded-lg px-3 py-2 text-xs text-indigo-700 font-medium">
          다음 시험 예상 출제: {trend.predictedCount}문제
        </div>
      )}
    </div>
  )
}
