"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Shuffle, BookOpen, RotateCcw, ClipboardList, BarChart2 } from 'lucide-react'
import StatsCard from './components/dashboard/StatsCard'
import SubjectAccuracyChart from './components/dashboard/SubjectAccuracyChart'
import RecentSessionsList from './components/dashboard/RecentSessionsList'
import MotivationCard from './components/dashboard/MotivationCard'
import AchievementList from './components/dashboard/AchievementList'
import LoadingSpinner from './components/common/LoadingSpinner'
import { accuracyPercent } from '../lib/utils'

interface Stats {
  totalAnswered: number
  totalCorrect: number
  currentStreak: number
  longestStreak: number
  wrongCount: number
  subjectStats: Array<{ subject: string; total: number; correct: number }>
}

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

const QUICK_ACTIONS = [
  { label: '랜덤 퀴즈', icon: <Shuffle size={20} />, color: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
  { label: '과목별 학습', icon: <BookOpen size={20} />, color: 'bg-green-600 hover:bg-green-700 text-white' },
  { label: '오답 복습', icon: <RotateCcw size={20} />, color: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { label: '모의고사', icon: <ClipboardList size={20} />, color: 'bg-red-500 hover:bg-red-600 text-white' },
  { label: '출제경향', icon: <BarChart2 size={20} />, color: 'bg-purple-600 hover:bg-purple-700 text-white' },
]

export default function HomePage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) return
    setLoading(true)
    Promise.all([
      fetch('/api/user/stats').then((r) => r.json()),
      fetch('/api/sessions?limit=5').then((r) => r.json()),
    ]).then(([s, sess]) => {
      setStats(s)
      setSessions(Array.isArray(sess) ? sess : [])
      setLoading(false)
    })
  }, [session])

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">정보처리기사</h1>
          <p className="text-xl text-gray-500 mb-2">AI 기반 시험 대비 앱</p>
          <p className="text-gray-400 text-sm">기출문제 데이터베이스 · 출제경향 분석 · AI 해설</p>
        </div>
        <Link
          href="/signin"
          className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          시작하기
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          안녕하세요, {session.user?.name ?? session.user?.email?.split('@')[0]}님 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">오늘도 열공하세요!</p>
      </div>

      {/* 빠른 시작 */}
      <div className="grid grid-cols-3 gap-2 mb-8 sm:grid-cols-5">
        {QUICK_ACTIONS.map((a, i) => (
          <Link
            key={a.label}
            href={i === 4 ? '/trends' : '/quiz'}
            className={`flex flex-col items-center gap-1.5 py-4 rounded-xl text-sm font-medium transition ${a.color}`}
          >
            {a.icon}
            <span className="text-xs">{a.label}</span>
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" text="통계 불러오는 중..." />
        </div>
      ) : stats ? (
        <>
          {/* 통계 카드 */}
          <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
            <StatsCard label="총 풀이" value={stats.totalAnswered} sub="문제" />
            <StatsCard
              label="정답률"
              value={`${accuracyPercent(stats.totalCorrect, stats.totalAnswered)}%`}
              sub={`${stats.totalCorrect}/${stats.totalAnswered}`}
              color={accuracyPercent(stats.totalCorrect, stats.totalAnswered) >= 60 ? 'text-green-600' : 'text-red-500'}
            />
            <StatsCard label="연속 정답" value={stats.currentStreak} sub="문제 연속" color="text-orange-500" />
            <StatsCard label="오답 누적" value={stats.wrongCount} sub="복습 필요" color="text-red-500" />
          </div>

          <div className="grid gap-6">
            <MotivationCard />
            <AchievementList />
            <SubjectAccuracyChart data={stats.subjectStats} />
            <RecentSessionsList sessions={sessions} />
          </div>
        </>
      ) : null}
    </div>
  )
}
