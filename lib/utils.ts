export function parseJsonArray<T>(value: string): T[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function parseJsonObject<T extends Record<string, unknown>>(value: string): T {
  try {
    const parsed = JSON.parse(value)
    return typeof parsed === 'object' && parsed !== null ? parsed as T : {} as T
  } catch {
    return {} as T
  }
}

export function stringifyJson(value: unknown): string {
  return JSON.stringify(value)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getOptionText(question: {
  optionA: string
  optionB: string
  optionC: string
  optionD: string
}, option: number): string {
  const map: Record<number, string> = {
    1: question.optionA,
    2: question.optionB,
    3: question.optionC,
    4: question.optionD,
  }
  return map[option] ?? ''
}

export function getOptionLabel(option: number): string {
  const labels: Record<number, string> = { 1: '①', 2: '②', 3: '③', 4: '④' }
  return labels[option] ?? ''
}

export function accuracyPercent(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}
