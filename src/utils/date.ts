import relativeTime from 'dayjs/plugin/relativeTime'

function formatDateToNow (value: string, locale: string, dayjs: any, timezone: string): string {
  dayjs.extend(relativeTime)
  if (timezone) {
    return dayjs(value, 'YYYY-MM-DD HH:mm:ss')
      .add(timezone.split(':')[0], 'hour')
      .locale(locale)
      .fromNow()
  }
  return dayjs(value, 'YYYY-MM-DD HH:mm:ss')
    .locale(locale)
    .fromNow()
}

function getTimeZone (): string {
  const offset = new Date().getTimezoneOffset()
  const o = Math.abs(offset)
  return `${(offset < 0 ? '' : '') +
      `00${Math.floor(o / 60)}`.slice(-2)}:${`00${o % 60}`.slice(-2)}:00`
}

export {
  formatDateToNow,
  getTimeZone
}
