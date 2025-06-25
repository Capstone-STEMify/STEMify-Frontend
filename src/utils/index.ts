export const formatDuration = (minutes: number) => {
  if (typeof minutes !== 'number' || isNaN(minutes) || minutes < 0) return '00:00:00'
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0')
  const m = Math.floor(minutes % 60)
    .toString()
    .padStart(2, '0')
  return `${h}:${m}:00`
}

export function getDaysRemaining(endDateStr: string): number {
  const endDate = new Date(endDateStr)
  const today = new Date()

  today.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)

  const diffInMilliseconds = endDate.getTime() - today.getTime()
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))

  return diffInDays
}
