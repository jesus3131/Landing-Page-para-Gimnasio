import { useState, useEffect, useCallback, useMemo } from 'react'
import * as contactModel from '../models/contact.model'

export default function useAdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | unread | read

  const loadMessages = useCallback(async () => {
    setLoading(true)
    try {
      const data = await contactModel.getContactMessages()
      setMessages(data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadMessages() }, [loadMessages])

  async function markRead(id) {
    await contactModel.markMessageRead(id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  async function remove(id) {
    await contactModel.deleteContactMessage(id)
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  const filtered = useMemo(() => {
    let list = messages
    if (filter === 'unread') list = list.filter(m => !m.read)
    if (filter === 'read') list = list.filter(m => m.read)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(m =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q)
      )
    }
    return list
  }, [messages, search, filter])

  const unreadCount = messages.filter(m => !m.read).length

  return { messages: filtered, allMessages: messages, loading, search, setSearch, filter, setFilter, markRead, remove, unreadCount }
}
