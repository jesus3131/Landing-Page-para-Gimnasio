import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Services from './components/Services'
import Plans from './components/Plans'
import Coaches from './components/Coaches'
import Testimonials from './components/Testimonials'
import Team from './components/Team'
import Events from './components/Events'
import News from './components/News'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import WhatsApp from './components/WhatsApp'
import ScrollReveal from './components/ScrollReveal'
import Login from './components/Login'
import Admin from './components/Admin'

function AppContent() {
  const { loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (showAdmin) {
    return (
      <>
        <Admin onLogout={() => setShowAdmin(false)} />
        <Chatbot />
        <WhatsApp />
      </>
    )
  }

  return (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)} onAdminClick={() => setShowAdmin(true)} />
      <Hero />
      <Benefits />
      <Services />
      <Plans />
      <Coaches />
      <Testimonials />
      <Team />
      <Events />
      <News />
      <Gallery />
      <Contact />
      <Footer />
      <Chatbot />
      <WhatsApp />
      <ScrollReveal />
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
