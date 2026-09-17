import { useEffect, useState } from 'react'
import { workshop } from '@/config/workshop'
import { hoursStrings, useT } from '@/i18n'
import { getWorkshopStatus, getZonedNow, type HoursStrings, type WorkshopStatus, type ZonedNow } from '@/lib/hours'

export interface LiveStatus {
  status: WorkshopStatus
  now: ZonedNow
}

function compute(strings: HoursStrings): LiveStatus {
  const now = getZonedNow(workshop.timeZone, new Date(), strings)
  return { status: getWorkshopStatus(workshop.schedule, now, strings), now }
}

/**
 * Live open/closed status in the workshop's time zone (Asia/Dubai),
 * re-evaluated every 30 seconds so the badge flips exactly on schedule.
 */
export function useWorkshopStatus(refreshMs = 30_000): LiveStatus {
  const t = useT()
  const [live, setLive] = useState<LiveStatus>(() => compute(hoursStrings(t)))

  useEffect(() => {
    const strings = hoursStrings(t)
    setLive(compute(strings))
    const id = window.setInterval(() => setLive(compute(strings)), refreshMs)
    return () => window.clearInterval(id)
  }, [refreshMs, t])

  return live
}
