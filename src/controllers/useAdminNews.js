import { useState, useEffect, useCallback } from 'react'
import * as newsModel from '../models/news.model'

export default function useAdminNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await newsModel.getAllNews()
      setNews(data || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function create(fields) {
    await newsModel.createNewsItem(fields)
    await load()
  }

  async function update(id, fields) {
    await newsModel.updateNewsItem(id, fields)
    setNews(prev => prev.map(n => n.id === id ? { ...n, ...fields } : n))
  }

  async function remove(id) {
    await newsModel.deleteNewsItem(id)
    setNews(prev => prev.filter(n => n.id !== id))
  }

  return { news, loading, create, update, remove, refresh: load }
}
