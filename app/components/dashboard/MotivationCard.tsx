'use client'

import { useEffect, useState } from 'react'
import { Flame, Target, Trophy, TrendingUp } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

interface MotivationData {
  currentStreak: number
  longestStreak: number
  totalAnswered: number
  accuracy: number
  dailyGoal: number
  todayAnswered: number
  todayCorrect: number
  goalProgress: number
  goalMet: boolean
  recentActivity: { date: string; answered: number; correct: number }[]
}

function StreakFlame({ streak }: { streak: number }) {
  const color = streak >= 30 ? 'text-purple-500' : streak >= 7 ? 'text-orange-500' : streak >= 3 ? 'text-yellow-500' : 'text-gray-400'
  return (
    <div className="flex items-center gap-1">
      <Flame className={color} size={28} />
      <span className="text-3xl font-bold">{streak}</span>
      <span className="text-sm text-gray-500 self-end mb-1">일 연속</span>
    </div>
  )
}

function WeekCalendar({ activity }: { activity: { date: string; answered: number }[] }) {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const actMap = Object.fromEntries(activity.map(a => [a.date, a.answered]))

  return (
    <div className="flex gap-1 mt-2">
      {Array.from({ length: 7 }, (_, i) => {
        const d = new Date(Date.now() - (6 - i) * 86400000)
        const dateStr = d.toISOString().slice(0, 10)
        const count = actMap[dateStr] ?? 0
        const isToday = i === 6
        const active = count > 0
        return (
          <div key={dateStr} className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors
              ${active ? 'bg-blue-500 text-white' : isToday ? 'bg-blue-100 text-blue-400 border-2 border-blue-300' : 'bg-gray-100 text-gray-400'}`}>
              {count > 0 ? count : days[d.getDay()]}
            </div>
            <span className="text-[10px] text-gray-400">{days[d.getDay()]}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function MotivationCard() {
  const [data, setData] = useState<MotivationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [goalInput, setGoalInput] = useState('')
  const [editingGoal, setEditingGoal] = useState(false)

  useEffect(() => {
    fetch('/api/user/motivation')
      .then(r => r.json())
      .then(d => { setData(d); setGoalInput(String(d.dailyGoal)) })
      .finally(() => setLoading(false))
  }, [])

  const saveGoal = async () => {
    const g = parseInt(goalInput)
    if (!g || g < 1 || g > 100) return
    await fetch('/api/user/motivation', { method: 'PATCH', body: JSON.stringify({ dailyGoal: g }), headers: { 'Content-Type': 'application/json' } })
    setData(prev => prev ? { ...prev, dailyGoal: g, goalProgress: Math.min(100, Math.round((prev.todayAnswered / g) * 100)) } : prev)
    setEditingGoal(false)
  }

  if (loading) return <div className="flex justify-center py-8"><LoadingSpinner /></div>
  if (!data) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 스트릭 카드 */}
      <div className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <Flame size={18} className="text-orange-500" />
            연속 학습 스트릭
          </h3>
          <span className="text-xs text-gray-400">최장 {data.longestStreak}일</span>
        </div>
        <StreakFlame streak={data.currentStreak} />
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">최근 7일 학습 현황</p>
          <WeekCalendar activity={data.recentActivity} />
        </div>
        {data.currentStreak === 0 && (
          <p className="mt-3 text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
            💪 오늘 학습을 시작하면 스트릭이 시작됩니다!
          </p>
        )}
        {data.currentStreak >= 7 && (
          <p className="mt-3 text-xs text-purple-600 bg-purple-50 rounded-lg px-3 py-2">
            🔥 대단해요! {data.currentStreak}일 연속 학습 중!
          </p>
        )}
      </div>

      {/* 오늘의 목표 */}
      <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <Target size={18} className="text-blue-500" />
            오늘의 목표
          </h3>
          <button onClick={() => setEditingGoal(!editingGoal)} className="text-xs text-blue-500 hover:underline">
            {editingGoal ? '취소' : '목표 변경'}
          </button>
        </div>

        {editingGoal ? (
          <div className="flex gap-2 mb-3">
            <input type="number" value={goalInput} onChange={e => setGoalInput(e.target.value)}
              className="border rounded-lg px-3 py-1 text-sm w-20" min={1} max={100} />
            <button onClick={saveGoal} className="bg-blue-500 text-white rounded-lg px-3 py-1 text-sm">저장</button>
          </div>
        ) : (
          <div className="flex items-end gap-2 mb-3">
            <span className="text-3xl font-bold text-blue-600">{data.todayAnswered}</span>
            <span className="text-gray-400 mb-1">/ {data.dailyGoal}문제</span>
            {data.goalMet && <span className="text-green-500 text-xl mb-1">✅</span>}
          </div>
        )}

        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className={`h-3 rounded-full transition-all ${data.goalMet ? 'bg-green-400' : 'bg-blue-400'}`}
            style={{ width: `${data.goalProgress}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-2">{data.goalProgress}% 달성</p>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-gray-700">{data.totalAnswered}</div>
            <div className="text-xs text-gray-500">누적 문제</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{data.accuracy}%</div>
            <div className="text-xs text-gray-500">정확도</div>
          </div>
        </div>
      </div>
    </div>
  )
}
