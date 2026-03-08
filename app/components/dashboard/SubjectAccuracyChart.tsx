import { SUBJECT_COLORS } from '../../../lib/constants'
import { accuracyPercent } from '../../../lib/utils'

interface SubjectStat {
  subject: string
  total: number
  correct: number
}

export default function SubjectAccuracyChart({ data }: { data: SubjectStat[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-semibold text-gray-900 mb-4">과목별 정답률</h3>
      <div className="flex flex-col gap-3">
        {data.map((s) => {
          const pct = accuracyPercent(s.correct, s.total)
          const color = SUBJECT_COLORS[s.subject] ?? 'bg-gray-100 text-gray-700'
          return (
            <div key={s.subject}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{s.subject}</span>
                <span className="text-sm font-semibold text-gray-700">
                  {s.total > 0 ? `${pct}%` : '-'}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: s.total > 0 ? `${pct}%` : '0%' }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{s.total}문제 중 {s.correct}개 정답</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
