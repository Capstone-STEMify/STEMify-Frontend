import { useTranslations } from 'next-intl'

export const formatDuration = (minutes: number) => {
  if (typeof minutes !== 'number' || isNaN(minutes) || minutes <= 0) return '00:00'
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0')
  const m = Math.floor(minutes % 60)
    .toString()
    .padStart(2, '0')
  return `${h}:${m}`
}

/**
 *
 * @param endDateStr - The end date in string format (e.g., '2023-12-31')
 * @description This function calculates the number of days remaining from today to the given end date.
 * It sets the time to midnight for both today and the end date to ensure accurate day calculation.
 * @example getDaysRemaining('2023-12-31') ==> 30 (if
 * @returns {number} - The number of days remaining until the end date.
 * If the end date is in the past, it returns a negative number.
 */
export function getDaysRemaining(endDateStr: string): number {
  const endDate = new Date(endDateStr)
  const today = new Date()

  today.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)

  const diffInMilliseconds = endDate.getTime() - today.getTime()
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))

  return diffInDays
}

/**
 * Format date string
 * @param dateString
 * @returns string
 * @description This function formats a date string into a more readable format, e.g., "Jan 1, 2023".
 * @example formatDate('2023-01-01') ==> 'Jan 1, 2023'
 */
export type DateFormatPattern = 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd'
export interface FormatDateOptions {
  locale?: string
  showTime?: boolean
  pattern?: DateFormatPattern
  year?: 'numeric' | '2-digit'
  month?: 'numeric' | '2-digit' | 'short' | 'long'
  day?: 'numeric' | '2-digit'
}
export const formatDate = (date?: string | Date | null, options: FormatDateOptions = {}) => {
  if (!date) return 'N/A'

  const { locale, showTime = false, pattern, year = 'numeric', month = 'short', day = 'numeric' } = options

  const d = typeof date === 'string' ? new Date(date) : date

  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return 'N/A'
  }

  // custom pattern
  if (pattern) {
    const dd = String(d.getDate()).padStart(2, '0')
    const MM = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()

    switch (pattern) {
      case 'dd/MM/yyyy':
        return `${dd}/${MM}/${yyyy}`
      case 'MM/dd/yyyy':
        return `${MM}/${dd}/${yyyy}`
      case 'yyyy-MM-dd':
        return `${yyyy}-${MM}-${dd}`
    }
  }

  return d.toLocaleDateString(locale, { year, month, day })
}
export function formatDateV2(date: Date | undefined) {
  if (!date) {
    return ''
  }
  return date.toLocaleDateString('en-SG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
} /**
 *
 * Get label from options based on id
 * @param id
 * @param options
 * @description This function retrieves the label corresponding to a given id from an array of options.
 * @returns
 * @example getLabel(1, [{ value: '1', label: 'Son tung MTP' }, { value: '2', label: 'Mono' }])  ==> 'Son tung MTP'
 */
export const getLabel = (id: number | undefined, options: { value: string; label: string }[]) => {
  return options.find((o) => o.value === id?.toString())?.label || ''
}

/**
 *
 * @param data
 * @param labelKey
 * @returns
 * @example
 * getOptions([{ id: 1, categoryName: 'Math' }, { id: 2, categoryName: 'Science' }], 'categoryName')
 * ==> [{ value: '1', label: 'Math' }, { value: '2', label: 'Science' }]
 * @description Converts an array of objects into an array of options with value and label properties.
 */
export const getOptions = (
  data: any[] | undefined,
  labelKey: string,
  imageKey?: string,
  subLabelKey?: string,
  statusKey?: string,
  startDateKey?: string,
  endDateKey?: string
): { value: string; label: string; imageUrl?: string; subLabel?: string; status?: string; date?: string }[] =>
  data?.map((item) => ({
    value: item.id ? item.id.toString() : item.userId ? item.userId.toString() : '',
    label: item[labelKey],
    imageUrl: imageKey ? item[imageKey] : undefined,
    subLabel: subLabelKey ? item[subLabelKey] : undefined,
    status: statusKey ? item[statusKey] : undefined,
    date:
      startDateKey && endDateKey
        ? 'Start Date: ' +
          (item[startDateKey] ? new Date(item[startDateKey]).toLocaleDateString() : 'N/A') +
          ' - End Date: ' +
          (item[endDateKey] ? new Date(item[endDateKey]).toLocaleDateString() : 'N/A')
        : undefined
  })) || []

type OptionResult = {
  value: string
  label: string
  imageUrl?: string
  subLabel?: string
  status?: string
  date?: string
}

export const getOptionsV2 = (
  data: any[] | undefined,
  labelKey: string,
  valueKey: string, // ✅ THÊM
  imageKey?: string,
  subLabelKey?: string,
  statusKey?: string,
  startDateKey?: string,
  endDateKey?: string
): OptionResult[] =>
  data?.map((item) => ({
    value: item[valueKey]?.toString() ?? '',
    label: item[labelKey],
    imageUrl: imageKey ? item[imageKey] : undefined,
    subLabel: subLabelKey ? item[subLabelKey] : undefined,
    status: statusKey ? item[statusKey] : undefined,
    date:
      startDateKey && endDateKey
        ? 'Start Date: ' +
          (item[startDateKey] ? new Date(item[startDateKey]).toLocaleDateString() : 'N/A') +
          ' - End Date: ' +
          (item[endDateKey] ? new Date(item[endDateKey]).toLocaleDateString() : 'N/A')
        : undefined
  })) || []

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
  })
}

export const capitalizeFirst = (text: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : ''

export function normalizeMarkdown(text: string): string {
  return text.replace(/\\n/g, '\n')
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(price)
}

export const useStatusTranslation = () => {
  const tc = useTranslations('common.status')

  return (status: string) => {
    return tc(status.toLowerCase())
  }
}

export const useOrgUserStatusTranslation = () => {
  const tc = useTranslations('common.orgUserStatus')
  return (status: string) => {
    return tc(status.toLowerCase())
  }
}

export const useLevelTranslation = () => {
  const tc = useTranslations('common.level')
  return (level: string) => {
    return tc(level.toLowerCase())
  }
}

export const useGradeTranslation = () => {
  const tc = useTranslations('common.grade')
  return (grade: string) => {
    return tc(grade.toLowerCase().replace(' ', '_'))
  }
}

export const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '')

export function getColorByInitial(initial: string) {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500'
  ]

  // Lấy ASCII để random màu theo chữ cái
  const index = (initial.charCodeAt(0) - 65) % colors.length
  return colors[index] || 'bg-gray-500'
}
