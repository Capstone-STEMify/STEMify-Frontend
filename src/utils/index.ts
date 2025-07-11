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
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  })
}

/**
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
export const getOptions = (data: any[] | undefined, labelKey: string): { value: string; label: string }[] =>
  data?.map((item) => ({
    value: item.id.toString(),
    label: item[labelKey]
  })) || []
