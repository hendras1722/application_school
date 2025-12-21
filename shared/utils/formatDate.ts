import { fromDate, getLocalTimeZone } from '@internationalized/date'

type Token =
  | 'dd'
  | 'MM'
  | 'MMM'
  | 'MMMM'
  | 'yyyy'
  | 'HH'
  | 'mm'

const MONTHS_ID_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
] as const

const MONTHS_ID_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
] as const

function monthShort(month: number): string {
  return MONTHS_ID_SHORT[month - 1]
}

function monthFull(month: number): string {
  return MONTHS_ID_FULL[month - 1]
}

export function formatIntlDate(
  date: string | Date,
  format = 'dd MMMM yyyy',
) {
  const dv = fromDate(
    date instanceof Date ? date : new Date(date),
    getLocalTimeZone(),
  )

  const map: Record<Token, string> = {
    dd: String(dv.day).padStart(2, '0'),
    MM: String(dv.month).padStart(2, '0'),
    MMM: monthShort(dv.month),
    MMMM: monthFull(dv.month),
    yyyy: String(dv.year),
    HH: String(dv.hour).padStart(2, '0'),
    mm: String(dv.minute).padStart(2, '0'),
  }

  return format.replace(/MMMM|MMM|MM|dd|yyyy|HH|mm/g, (token) => {
    return map[token as Token]
  })
}
