import useTeam from '../controllers/useTeam'

export default function Team() {
  const { team } = useTeam()

  return (
    <section id="equipo" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[150px] opacity-20" />

      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="text-center mb-16">
          <p className="font-mono text-primary text-xs tracking-[0.2em] uppercase mb-4">Equipo</p>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            EQUIPO DE TRABAJO
          </h2>
          <p className="font-body text-white/50 text-base max-w-xl mx-auto mt-4">
            Personas comprometidas con tu bienestar y experiencia en ZonaFit.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-surface-card border border-white/5 rounded-2xl overflow-hidden scroll-reveal hover:border-white/20 transition-all duration-500 group"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-card/80 via-transparent to-transparent" />
              </div>

              <div className="p-5 -mt-12 relative">
                <h3 className="font-heading font-bold text-lg text-white mb-0.5">{member.name}</h3>
                <p className="font-mono text-primary text-xs uppercase tracking-wider mb-2">{member.role}</p>
                {member.bio && (
                  <p className="font-body text-white/50 text-sm leading-relaxed">{member.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
