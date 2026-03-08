'use client'

import { useEffect, useState } from 'react'
import { Trophy, Flame, TrendingUp, Medal } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'

type RankType = 'overall' | 'growth' | 'streak'

interface OverallEntry {
  rank: number; id: string; name: string; totalAnswered: number; totalCorrect: number; accuracy: number; currentStreak: number; isMe: boolean
}
interface GrowthEntry {
  rank: number; id: string; name: string; weeklyAnswered: number; weeklyCorrect: number; weeklyAccuracy: number; isMe: boolean
}
interface StreakEntry {
  rank: number; id: string; name: string; currentStreak: number; longestStreak: number; isMe: boolean
}

const TAB_CONFIG: { type: RankType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: 'overall', label: '종합 랭킹', icon: <Trophy size={16} />, desc: '누적 정답 수 기준' },
  { type: 'growth', label: '급성장 랭킹', icon: <TrendingUp size={16} />, desc: '최근 7일 정답 수 기준' },
  { type: 'streak', label: '연속학습 랭킹', icon: <Flame size={16} />, desc: '현재 연속 학습일 기준' },
]

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>
  if (rank === 2) return <span className="text-2xl">🥈</span>
  if (rank === 3) return <span className="text-2xl">🥉</span>
  return <span className="text-sm font-bold text-gray-500 w-8 text-center">{rank}</span>
}

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<RankType>('overall')
  const [ranking, setRanking] = useState<(OverallEntry | GrowthEntry | StreakEntry)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch(`/api/ranking?type=${activeTab}`)
      .then(r => r.json())
      .then(d => setRanking(d.ranking ?? []))
      .catch(() => setError('랭킹 데이터를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Medal className="text-yellow-500" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">학습 랭킹</h1>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
          {TAB_CONFIG.map(tab => (
            <button
              key={tab.type}
              onClick={() => setActiveTab(tab.type)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.type
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}>
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0, 2)}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mb-4">
          {TAB_CONFIG.find(t => t.type === activeTab)?.desc}
        </p>

        {loading && <div className="flex justify-center py-12"><LoadingSpinner /></div>}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}

        {!loading && !error && ranking.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Trophy size={48} className="mx-auto mb-3 opacity-30" />
            <p>아직 데이터가 없습니다.<br />학습을 시작하면 랭킹에 등록됩니다!</p>
            <p className="text-xs mt-2">(종합/연속학습 랭킹은 최소 10문제 이상 필요)</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-2">
            {activeTab === 'overall' && (ranking as OverallEntry[]).map(entry => (
              <div key={entry.id} className={`flex items-center gap-4 bg-white rounded-xl px-4 py-3 border shadow-sm ${entry.isMe ? 'border-blue-300 bg-blue-50' : 'border-gray-100'}`}>
                <RankBadge rank={entry.rank} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 truncate">{entry.name}</span>
                    {entry.isMe && <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">나</span>}
                  </div>
                  <div className="text-xs text-gray-500">{entry.totalCorrect}/{entry.totalAnswered}문제</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{entry.accuracy}%</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                    <Flame size={10} className="text-orange-400" />{entry.currentStreak}일
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'growth' && (ranking as GrowthEntry[]).map(entry => (
              <div key={entry.id} className={`flex items-center gap-4 bg-white rounded-xl px-4 py-3 border shadow-sm ${entry.isMe ? 'border-blue-300 bg-blue-50' : 'border-gray-100'}`}>
                <RankBadge rank={entry.rank} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 truncate">{entry.name}</span>
                    {entry.isMe && <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">나</span>}
                  </div>
                  <div className="text-xs text-gray-500">이번 주 {entry.weeklyAnswered}문제</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">+{entry.weeklyCorrect}정답</div>
                  <div className="text-xs text-gray-400">{entry.weeklyAccuracy}% 정확도</div>
                </div>
              </div>
            ))}

            {activeTab === 'streak' && (ranking as StreakEntry[]).map(entry => (
              <div key={entry.id} className={`flex items-center gap-4 bg-white rounded-xl px-4 py-3 border shadow-sm ${entry.isMe ? 'border-blue-300 bg-blue-50' : 'border-gray-100'}`}>
                <RankBadge rank={entry.rank} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 truncate">{entry.name}</span>
                    {entry.isMe && <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">나</span>}
                  </div>
                  <div className="text-xs text-gray-500">최장 {entry.longestStreak}일</div>
                </div>
                <div className="text-right flex items-center gap-1.5">
                  <Flame className="text-orange-500" size={18} />
                  <div className="text-lg font-bold text-orange-600">{entry.currentStreak}일</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
