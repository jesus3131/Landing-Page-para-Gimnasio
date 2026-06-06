import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getTeam } from '../models/team.model'

const fallback = [
  { id: 1, name: 'María Fernández', photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', role: 'Gerente General', bio: 'Lidera ZonaFit con visión estratégica y pasión por el bienestar.' },
  { id: 2, name: 'Roberto Sánchez', photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', role: 'Recepcionista', bio: 'La primera sonrisa que ves al llegar. Atención al cliente de primer nivel.' },
  { id: 3, name: 'Diana López', photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', role: 'Nutrióloga', bio: 'Planes alimenticios personalizados para complementar tu entrenamiento.' },
]

export default function useTeam() {
  const [team, setTeam] = useState(fallback)
  const [loading, setLoading] = useState(false)

  const loadTeam = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTeam()
      if (data?.length > 0) setTeam(data)
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadTeam() }, [loadTeam])

  useEffect(() => {
    const channel = supabase.channel('team-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team' }, () => loadTeam())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [loadTeam])

  return { team, loading }
}