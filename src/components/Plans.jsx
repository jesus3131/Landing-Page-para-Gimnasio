import usePlans from '../controllers/usePlans'

export default function Plans() {
  const { plans, loading } = usePlans()

  if (loading || plans.length === 0) return null

  return (
    <section id="planes" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <p className="font-mono text-primary text-xs tracking-[0.2em] uppercase mb-4">Planes</p>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            PLANES DE MEMBRESÍA
          </h2>
          <p className="font-body text-white/50 text-base max-w-xl mx-auto mt-4">
            Elige el plan que mejor se adapte a ti. Sin permanencia ni sorpresas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl flex flex-col scroll-reveal overflow-hidden ${
                plan.featured
                  ? 'border-2 border-primary shadow-xl shadow-primary/10 scale-[1.02] lg:scale-105'
                  : 'border border-white/5'
              }`}
            >
              {plan.image_url && (
                <div className="h-40 overflow-hidden">
                  <img src={plan.image_url} alt={plan.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              )}

              <div className={`p-8 lg:p-10 flex flex-col flex-1 ${plan.featured ? 'bg-surface-card' : 'bg-surface-card'}`}>
                {plan.featured && (
                  <span className="self-start bg-primary text-surface-dark font-mono font-semibold text-2xs px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
                    Más popular
                  </span>
                )}

                <p className="font-mono text-primary text-xs uppercase tracking-[0.15em] mb-4 mt-2">
                  {plan.name}
                </p>
                <p className="font-heading font-black text-4xl text-white mb-1">
                  ${plan.price}
                  <span className="font-body font-normal text-white/40 text-sm"> /{plan.period === 'month' ? 'mes' : plan.period}</span>
                </p>
                {plan.description && (
                  <p className="font-body text-white/40 text-xs mt-2">{plan.description}</p>
                )}

                <ul className="mt-8 mb-10 space-y-4 flex-1">
                  {(plan.features || []).map((feature) => (
                    <li key={feature.id} className="flex items-start gap-3">
                      <span className={`material-symbols-outlined text-sm mt-0.5 ${feature.included ? 'text-primary' : 'text-white/20'}`}>
                        {feature.included ? 'check' : 'close'}
                      </span>
                      <span className={`font-body text-sm ${feature.included ? 'text-white/80' : 'text-white/20'}`}>
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contacto"
                  className={`block text-center font-body font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${
                    plan.featured
                      ? 'bg-primary text-surface-dark hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30'
                      : 'bg-surface-elevated text-white hover:bg-white/20'
                  }`}
                >
                  Elegir plan
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
