import { useState, useEffect, useCallback } from 'react'
import * as attendanceModel from '../models/attendance.model'

export default function useAdminAttendance() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [data, s] = await Promise.all([
        attendanceModel.getTodayAttendance(),
        attendanceModel.getAttendanceStats(),
      ])
      setAttendance(data || [])
      setStats(s)
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function checkIn(memberId) {
    await attendanceModel.checkIn(memberId)
    await load()
  }

  return { attendance, loading, stats, checkIn, refresh: load }
}
