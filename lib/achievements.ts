export const ACHIEVEMENT_DEFS: Record<string, { label: string; description: string; icon: string }> = {
  FIRST_QUIZ:      { icon: '🎯', label: '첫 도전',       description: '첫 번째 퀴즈를 완료했습니다!' },
  FIRST_CORRECT:   { icon: '✅', label: '첫 정답',       description: '첫 번째 정답을 맞췄습니다!' },
  TOTAL_10:        { icon: '📝', label: '10문제 달성',   description: '누적 10문제를 풀었습니다!' },
  TOTAL_50:        { icon: '📚', label: '50문제 달성',   description: '누적 50문제를 풀었습니다!' },
  TOTAL_100:       { icon: '💯', label: '100문제 달성',  description: '누적 100문제를 풀었습니다!' },
  TOTAL_300:       { icon: '🔥', label: '300문제 달성',  description: '누적 300문제를 풀었습니다!' },
  TOTAL_500:       { icon: '🏅', label: '500문제 달성',  description: '누적 500문제를 풀었습니다!' },
  STREAK_3:        { icon: '⚡', label: '3일 연속',      description: '3일 연속 학습을 완료했습니다!' },
  STREAK_7:        { icon: '🌟', label: '일주일 완주',   description: '7일 연속 학습을 완료했습니다!' },
  STREAK_14:       { icon: '🔑', label: '2주 완주',      description: '14일 연속 학습을 완료했습니다!' },
  STREAK_30:       { icon: '👑', label: '한달 완주',     description: '30일 연속 학습을 완료했습니다!' },
  ACCURACY_70:     { icon: '🎖️', label: '정확도 70%',   description: '누적 정확도 70% 달성!' },
  ACCURACY_80:     { icon: '🥈', label: '정확도 80%',   description: '누적 정확도 80% 달성!' },
  ACCURACY_90:     { icon: '🥇', label: '정확도 90%',   description: '누적 정확도 90% 달성!' },
  PERFECT_SESSION: { icon: '💎', label: '완벽한 세션',   description: '세션에서 100% 정답을 기록했습니다!' },
  MOCK_PASS:       { icon: '🎓', label: '모의고사 합격', description: '모의고사에서 60점 이상을 획득했습니다!' },
}

export async function checkAndAwardAchievements(
  prisma: any,
  userId: string,
  stats: { totalAnswered: number; totalCorrect: number; currentStreak: number; sessionScore?: number; sessionTotal?: number }
) {
  const newAchievements: string[] = []

  const existing = await prisma.achievement.findMany({ where: { userId }, select: { type: true } })
  const earned = new Set(existing.map((a: any) => a.type))

  const check = async (type: string, condition: boolean) => {
    if (condition && !earned.has(type)) {
      await prisma.achievement.create({ data: { userId, type } })
      newAchievements.push(type)
      earned.add(type)
    }
  }

  const { totalAnswered, totalCorrect, currentStreak, sessionScore, sessionTotal } = stats
  const accuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0

  await check('FIRST_QUIZ',      totalAnswered >= 1)
  await check('FIRST_CORRECT',   totalCorrect >= 1)
  await check('TOTAL_10',        totalAnswered >= 10)
  await check('TOTAL_50',        totalAnswered >= 50)
  await check('TOTAL_100',       totalAnswered >= 100)
  await check('TOTAL_300',       totalAnswered >= 300)
  await check('TOTAL_500',       totalAnswered >= 500)
  await check('STREAK_3',        currentStreak >= 3)
  await check('STREAK_7',        currentStreak >= 7)
  await check('STREAK_14',       currentStreak >= 14)
  await check('STREAK_30',       currentStreak >= 30)
  await check('ACCURACY_70',     totalAnswered >= 20 && accuracy >= 70)
  await check('ACCURACY_80',     totalAnswered >= 20 && accuracy >= 80)
  await check('ACCURACY_90',     totalAnswered >= 20 && accuracy >= 90)

  if (sessionScore !== undefined && sessionTotal !== undefined && sessionTotal > 0) {
    await check('PERFECT_SESSION', sessionScore === sessionTotal)
    if (sessionTotal >= 60) {
      await check('MOCK_PASS', (sessionScore / sessionTotal) >= 0.6)
    }
  }

  return newAchievements
}

export function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export async function updateDailyStatAndStreak(
  prisma: any,
  userId: string,
  isCorrect: boolean
) {
  const today = getToday()

  // 오늘의 통계 업데이트
  await prisma.userDailyStat.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, answered: 1, correct: isCorrect ? 1 : 0 },
    update: { answered: { increment: 1 }, correct: isCorrect ? { increment: 1 } : undefined },
  })

  // 스트릭 업데이트
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { lastStudyDate: true, currentStreak: true, longestStreak: true } })
  if (!user) return

  const last = user.lastStudyDate
  let newStreak = user.currentStreak

  if (last !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    if (last === yesterday) {
      newStreak = user.currentStreak + 1
    } else if (!last || last < yesterday) {
      newStreak = 1
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastStudyDate: today,
        currentStreak: newStreak,
        longestStreak: Math.max(user.longestStreak, newStreak),
      },
    })
  }

  return newStreak
}
