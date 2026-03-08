"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Shuffle, BookOpen, RotateCcw, ClipboardList, ChevronRight } from 'lucide-react'
import { SUBJECTS, SUBJECT_COLORS } from '../../lib/constants'

const MODES = [
  { id: 'RANDOM', label: '랜덤 퀴즈', desc: '전 과목 랜덤 문제', icon: <Shuffle size={22} />, color: 'border-indigo-200 bg-indigo-50 hover:border-indigo-400' },
  { id: 'BY_SUBJECT', label: '과목별 퀴즈', desc: '과목을 선택하여 집중 학습', icon: <BookOpen size={22} />, color: 'border-green-200 bg-green-50 hover:border-green-400' },
  { id: 'WRONG_REVIEW', label: '오답 복습', desc: '틀린 문제만 다시 풀기', icon: <RotateCcw size={22} />, color: 'border-orange-200 bg-orange-50 hover:border-orange-400' },
  { id: 'MOCK_EXAM', label: '모의고사', desc: '실제 시험과 동일한 100문제', icon: <ClipboardList size={22} />, color: 'border-red-200 bg-red-50 hover:border-red-400' },
]

export default function QuizSetupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [mode, setMode] = useState('')
  const [subject, setSubject] = useState('')
  const [totalQ, setTotalQ] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">퀴즈를 시작하려면 로그인이 필요합니다.</p>
        <Link href="/signin" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
          로그인
        </Link>
      </div>
    )
  }

  async function startQuiz() {
    if (!mode) { setError('퀴즈 모드를 선택해주세요.'); return }
    if (mode === 'BY_SUBJECT' && !subject) { setError('과목을 선택해주세요.'); return }

    setLoading(true)
    setError('')

    const body: Record<string, unknown> = { mode }
    if (mode === 'BY_SUBJECT') body.subject = subject
    if (mode !== 'MOCK_EXAM') body.totalQ = totalQ

    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? '세션 생성 실패')
      return
    }

    router.push(`/quiz/${data.session.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">퀴즈 시작</h1>
      <p className="text-gray-500 mb-8 text-sm">모드를 선택하고 학습을 시작하세요.</p>

      {/* 모드 선택 */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setError('') }}
            className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition ${m.color} ${mode === m.id ? 'ring-2 ring-indigo-400' : ''}`}
          >
            <div className="text-indigo-700">{m.icon}</div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{m.label}</p>
              <p className="text-xs text-gray-500">{m.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 과목 선택 */}
      {mode === 'BY_SUBJECT' && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">과목 선택</h3>
          <div className="flex flex-col gap-2">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm text-left transition ${
                  subject === s ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${SUBJECT_COLORS[s]}`}>{s}</span>
                {subject === s && <ChevronRight size={16} className="text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 문제 수 선택 */}
      {mode && mode !== 'MOCK_EXAM' && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">문제 수</h3>
          <div className="flex gap-2">
            {[5, 10, 20, 40].map((n) => (
              <button
                key={n}
                onClick={() => setTotalQ(n)}
                className={`px-4 py-2 rounded-lg text-sm border-2 transition ${
                  totalQ === n ? 'border-indigo-400 bg-indigo-50 text-indigo-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-indigo-200'
                }`}
              >
                {n}문제
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <button
        onClick={startQuiz}
        disabled={loading || !mode}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {loading ? '준비 중...' : '퀴즈 시작 →'}
      </button>
    </div>
  )
}
