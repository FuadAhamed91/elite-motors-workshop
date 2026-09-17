import { useEffect, useState } from 'react'
import { workshop } from '@/config/workshop'
import { getWorkshopStatus, getZonedNow, type WorkshopStatus, type ZonedNow } from '@/lib/hours'

export interface LiveStatus {
  status: WorkshopStatus
  now: ZonedNow
}

function compute(): LiveStatus {
  const now = getZonedNow(workshop.timeZone)
  return { status: getWorkshopStatus(workshop.schedule, now), now }
}

/**
 * Live open/closed status in the workshop's time zone (Asia/Dubai),
 * re-evaluated every 30 seconds so the badge flips exactly on schedule.
 */
export function useWorkshopStatus(refreshMs = 30_000): LiveStatus {
  const [live, setLive] = useState<LiveStatus>(compute)

  useEffect(() => {
    const id = window.setInterval(() => setLive(compute()), refreshMs)
    return () => window.clearInterval(id)
  }, [refreshMs])

  return live
}
