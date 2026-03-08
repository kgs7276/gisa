'use client'

import { useEffect, useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

interface Achievement {
  type: string
  icon: string
  label: string
  description: string
  earned: boolean
  earnedAt: string | null
}

export default function AchievementList() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetch('/api/user/achievements')
      .then(r => r.json())
      .then(d => setAchievements(d.achievements ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-4"><LoadingSpinner size="sm" /></div>

  const earned = achievements.filter(a => a.earned)
  const unearned = achievements.filter(a => !a.earned)
  const displayed = showAll ? achievements : [...earned, ...unearned.slice(0, Math.max(0, 4 - earned.length))]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">🏆 업적 <span className="text-sm font-normal text-gray-400">({earned.length}/{achievements.length})</span></h3>
        <button onClick={() => setShowAll(!showAll)} className="text-xs text-blue-500 hover:underline">
          {showAll ? '접기' : '전체 보기'}
        </button>
      </div>

      {earned.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">아직 획득한 업적이 없습니다. 학습을 시작해보세요!</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {displayed.map(a => (
          <div key={a.type}
            className={`rounded-xl p-3 text-center border transition-all ${
              a.earned
                ? 'border-yellow-200 bg-yellow-50 shadow-sm'
                : 'border-gray-100 bg-gray-50 opacity-50'
            }`}
            title={a.description}>
            <div className="text-2xl mb-1">{a.earned ? a.icon : '🔒'}</div>
            <div className={`text-xs font-medium ${a.earned ? 'text-gray-700' : 'text-gray-400'}`}>{a.label}</div>
            {a.earned && a.earnedAt && (
              <div className="text-[10px] text-gray-400 mt-1">{new Date(a.earnedAt).toLocaleDateString('ko-KR')}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
