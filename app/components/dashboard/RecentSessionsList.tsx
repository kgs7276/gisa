import Link from 'next/link'
import { formatDate, accuracyPercent } from '../../../lib/utils'

interface Session {
  id: string
  mode: string
  subject: string | null
  totalQ: number
  score: number | null
  status: string
  createdAt: string
  _count: { answers: number }
}

const MODE_LABELS: Record<string, string> = {
  RANDOM: '랜덤',
  BY_SUBJECT: '과목별',
  WRONG_REVIEW: '오답복습',
  MOCK_EXAM: '모의고사',
}

export default function RecentSessionsList({ sessions }: { sessions: Session[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-semibold text-gray-900 mb-4">최근 세션</h3>
      {sessions.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">아직 퀴즈 기록이 없습니다.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-50">
          {sessions.map((s) => {
            const pct = s.score !== null ? accuracyPercent(s.score, s.totalQ) : null
            return (
              <Link key={s.id} href={`/quiz/${s.id}/results`} className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-lg transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      {MODE_LABELS[s.mode] ?? s.mode}
                    </span>
                    {s.subject && <span className="text-xs text-gray-400">{s.subject}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(s.createdAt)} · {s.totalQ}문제</p>
                </div>
                {pct !== null ? (
                  <span className={`text-lg font-bold ${pct >= 60 ? 'text-green-600' : 'text-red-500'}`}>{pct}점</span>
                ) : (
                  <span className="text-xs text-gray-400">진행중</span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
