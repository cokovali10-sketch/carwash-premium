import { forwardRef, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, X, Star, Truck, Shield, Clock, Sparkles, Award, Car, Layers } from 'lucide-react'
import { motion } from 'framer-motion'

// Tailwind-токены из данных -> реальные CSS-цвета
const COLOR_HEX = {
  'carwash-accent': '#38bdf8',
  'carwash-accentLight': '#7dd3fc',
  'purple-500': '#a855f7',
  'pink-500': '#ec4899',
  'gray-400': '#9ca3af',
  'gray-500': '#6b7280',
  'yellow-500': '#eab308',
  'orange-500': '#f97316',
}

// 'from-purple-500/20 to-pink-500/20' -> linear-gradient(rgba(...), rgba(...))
function gradientFromColor(color = '') {
  const tokens = String(color).trim().split(/\s+/).filter(Boolean)
  const toRgba = (token, fallbackAlpha = 0.2) => {
    const cleaned = token.replace(/^(from|to)-/, '')
    const [name, alphaRaw] = cleaned.split('/')
    const hex = COLOR_HEX[name] || '#38bdf8'
    const alpha = alphaRaw ? Math.min(1, Number(alphaRaw) / 100) : fallbackAlpha
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${Number.isFinite(alpha) ? alpha : fallbackAlpha})`
  }
  const from = toRgba(tokens[0] || 'from-carwash-accent/20')
  const to = toRgba(tokens[1] || 'to-carwash-accentLight/20')
  return `linear-gradient(145deg, ${from}, ${to})`
}

// ring color из borderColor/color токена
function ringFromColor(color = '') {
  const first = String(color).trim().split(/\s+/)[0] || ''
  const cleaned = first.replace(/^(from|to)-/, '')
  const [name] = cleaned.split('/')
  return name ? `ring-${name}/30` : 'ring-carwash-accent/30'
}

export function Pricing() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])
  const [activeTab, setActiveTab] = useState('packages')

  const packages = [
    {
      id: 'express',
      name: 'Экспресс',
      subtitle: 'Быстрая мойка за 30 мин',
      price: '800',
      oldPrice: '1 200',
      period: '/ заезд',
      description: 'Идеально для еженедельного поддержания чистоты',
      features: [
        { text: 'Контактная мойка портативным аппаратом', included: true },
        { text: 'Активная пена', included: true },
        { text: 'Поливаемый воск', included: true },
        { text: 'Сушка микрофиброй', included: true },
        { text: 'Чистка колес', included: false },
        { text: 'Удаление битума', included: false },
        { text: 'Восковое покрытие кузова', included: false },
        { text: 'Обработка салона', included: false },
      ],
      cta: 'Заказать экспресс',
      popular: false,
      color: 'from-carwash-accent/20 to-carwash-accentLight/20',
      borderColor: 'carwash-accent/30',
    },
    {
      id: 'premium',
      name: 'Премиум',
      subtitle: 'Полная ручная мойка + защита',
      price: '3 500',
      oldPrice: '4 500',
      period: '/ заезд',
      description: 'Наш бестселлер — глубокая чистота и защита на месяц',
      features: [
        { text: 'Двухфазная ручная мойка', included: true },
        { text: 'Удаление битума и насекомых', included: true },
        { text: 'Глубокая чистка колес и арок', included: true },
        { text: 'Сушка премиальной микрофиброй', included: true },
        { text: 'Восковое покрытие кузова (Carnauba)', included: true },
        { text: 'Быстрая уборка салона', included: true },
        { text: 'Антидождь на лобовое стекло', included: true },
        { text: 'Чернение шин', included: true },
      ],
      cta: 'Выбрать Премиум',
      popular: true,
      color: 'from-carwash-accent/30 to-carwash-accentLight/30',
      borderColor: 'carwash-accent/50',
    },
    {
      id: 'detailing',
      name: 'Детейлинг',
      subtitle: 'Полный цикл ухода за авто',
      price: '55 000',
      oldPrice: '68 000',
      period: '/ комплекс',
      description: 'Максимальная защита и эстетика на годы вперед',
      features: [
        { text: 'Трехстадийная полировка кузова', included: true },
        { text: 'Керамическое покрытие (3-5 лет)', included: true },
        { text: 'Полная химчистка салона', included: true },
        { text: 'Обработка кожи и пластика', included: true },
        { text: 'Озонование салона', included: true },
        { text: 'Антидождь на все стекла', included: true },
        { text: 'Керамика на колеса', included: true },
        { text: 'Полировка фар и хрома', included: true },
        { text: 'Защита порогов и бамперов (ППФ)', included: true },
        { text: 'Сертификат и гарантия', included: true },
      ],
      cta: 'Рассчитать детейлинг',
      popular: false,
      color: 'from-purple-500/20 to-carwash-accent/20',
      borderColor: 'purple-500/30',
    },
  ]

  const membershipTiers = [
    {
      name: 'Silver',
      price: '2 900',
      period: '/ мес',
      description: 'Для регулярной еженедельной мойки',
      features: [
        '4 Премиум мойки в месяц',
        'Приоритетная запись',
        '10% на доп. услуги',
        'Бесплатный антидождь на лобовое (1 раз/мес)',
        'Персональный менеджер',
      ],
      cta: 'Подключить Silver',
      icon: Award,
      color: 'from-gray-400/20 to-gray-500/20',
    },
    {
      name: 'Gold',
      price: '5 500',
      period: '/ мес',
      description: 'Максимальная выгода для автолюбителей',
      features: [
        '8 Премиум мойок в месяц',
        '2 Экспресс мойки в подарок',
        '20% на все доп. услуги',
        'Антидождь на все стекла (раз в 3 мес)',
        'Чернение шин при каждой мойке',
        'Приоритет 24/7 без очереди',
        'Хранение сезонного комплекта колес',
      ],
      cta: 'Подключить Gold',
      icon: Star,
      color: 'from-yellow-500/20 to-orange-500/20',
      popular: true,
    },
    {
      name: 'Platinum',
      price: '12 000',
      period: '/ мес',
      description: 'VIP-уход: детейлинг + регулярная мойка',
      features: [
        'Все включено из Gold',
        'Полный детейлинг 1 раз в год',
        'Керамика на колеса (раз в год)',
        'ППФ пленка на бамперы (раз в 2 года)',
        'Персональный детальер',
        'Выездная мойка (в радиусе 15 км)',
        'Замена расходников (щетки, жидкости)',
        'Консьерж-сервис: забираем/возвращаем авто',
      ],
      cta: 'Связаться для Platinum',
      icon: Car,
      color: 'from-purple-500/20 to-pink-500/20',
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current?.querySelectorAll('.section-title'),
        { y: 46, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.14, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      gsap.fromTo(sectionRef.current?.querySelector('.section-subtitle'),
        { y: 30, x: -70, opacity: 0 },
        { y: 0, x: 0, opacity: 1, duration: 1, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      gsap.fromTo('.pricing-tabs',
        { y: 30, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: 'back.out(1.4)', clearProps: 'transform', scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } }
      )

      gsap.fromTo(cardsRef.current.map(r => r.current).filter(Boolean),
        { y: 70, x: (i) => (i % 2 === 0 ? -80 : 80), rotateY: (i) => (i % 2 === 0 ? -12 : 12), opacity: 0 },
        {
          y: 0, x: 0, rotateY: 0, opacity: 1,
          duration: 1.05, stagger: 0.15, ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Переключение таба — карточки въезжают заново
  const firstTabRun = useRef(true)
  useEffect(() => {
    if (firstTabRun.current) {
      firstTabRun.current = false
      return
    }
    const cards = cardsRef.current.map(r => r.current).filter(Boolean)
    if (!cards.length) return
    gsap.fromTo(cards,
      { y: 44, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.09, ease: 'power3.out', clearProps: 'transform' }
    )
  }, [activeTab])

  const setCardRef = (index) => (el) => {
    cardsRef.current[index] = { current: el }
  }

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-20" id="pricing">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="section-title text-carwash-accent font-semibold text-sm tracking-widest uppercase mb-4">
            Цены и пакеты
          </p>
          <h2 className="section-title font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Прозрачные цены<br /><span className="text-gradient-water">без скрытых доплат</span>
          </h2>
          <p className="section-subtitle text-lg md:text-xl text-carwash-muted leading-relaxed">
            Выбирайте разовый визит или выгодную подписку. Все материалы и работа включены в цену.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="pricing-tabs flex justify-center gap-2 mb-12 glass-water rounded-forge p-1 w-fit mx-auto data-magnetic">
          {[
            { id: 'packages', label: 'Разовые услуги' },
            { id: 'membership', label: 'Подписки' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-forge-sm font-medium text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-carwash-accent to-carwash-accentLight text-carwash-bg shadow-lg shadow-carwash-accent/30'
                  : 'text-carwash-muted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8" role="tablist">
          {activeTab === 'packages' ? (
            packages.map((pkg, i) => (
              <PricingCard key={pkg.id} pkg={pkg} index={i} ref={setCardRef(i)} />
            ))
          ) : (
            membershipTiers.map((tier, i) => (
              <MembershipCard key={tier.name} tier={tier} index={i} ref={setCardRef(i)} />
            ))
          )}
        </div>

        {/* Note */}
        <p className="text-center text-carwash-muted/60 text-sm mt-12">
          * Все цены указаны для седанов. Кроссоверы +20%, минивэны/внедорожники +35%. 
          Точную стоимость уточняйте при записи — менеджер рассчитает по фото/видео.
        </p>
      </div>
    </section>
  )
}

const PricingCard = forwardRef(function PricingCard({ pkg, index }, ref) {
  const cardRef = useRef(null)

  const gradientBg = gradientFromColor(pkg.color)

  return (
    <motion.div
      ref={(el) => {
        cardRef.current = el
        if (typeof ref === 'function') ref(el)
        else if (ref) ref.current = el
      }}
      className={`relative glass-water-card rounded-forge-xl overflow-hidden group data-magnetic ${pkg.popular ? 'ring-2' : 'ring-1'} ${ringFromColor(pkg.borderColor || pkg.color)}`}
      whileHover={{ y: -8, scale: pkg.popular ? 1.015 : 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', background: gradientBg }}
    >
      {pkg.popular && (
        <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-carwash-accent to-carwash-accentLight" style={{ transformStyle: 'flat' }} />
      )}

      {pkg.popular && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-full text-xs font-semibold text-carwash-bg bg-gradient-to-r from-carwash-accent to-carwash-accentLight" style={{ transformStyle: 'flat' }}>
          Лучший выбор
        </div>
      )}

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-2">{pkg.name}</h3>
          <p className="text-carwash-muted text-sm">{pkg.subtitle}</p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-4xl md:text-5xl font-bold text-white">{pkg.price}</span>
            <span className="text-carwash-muted text-lg">{pkg.period}</span>
          </div>
          {pkg.oldPrice && (
            <span className="text-carwash-muted/50 line-through text-sm">{pkg.oldPrice} ₽</span>
          )}
        </div>

        <p className="text-carwash-muted/80 text-sm mb-6">{pkg.description}</p>

        {/* Features */}
        <ul className="space-y-3 mb-8" role="list">
          {pkg.features.map((feature, fi) => (
            <li key={fi} className="flex items-start gap-3">
              <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${feature.included ? 'bg-carwash-accent/20 text-carwash-accent' : 'bg-white/5 text-carwash-muted/40'}`}>
                {feature.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </span>
              <span className={`${feature.included ? 'text-white' : 'text-carwash-muted/60'}`}>{feature.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a 
          href="#booking" 
          className={`w-full py-4 rounded-forge-lg font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 ${pkg.popular ? 'btn-water' : 'glass-water text-carwash-text hover:text-carwash-accent'}`}
        >
          {pkg.cta}
        </a>
      </div>

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-carwash-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-forge-xl pointer-events-none" />
    </motion.div>
  )
})

const MembershipCard = forwardRef(function MembershipCard({ tier, index }, ref) {
  const cardRef = useRef(null)

  const gradientBg = gradientFromColor(tier.color)

  return (
    <motion.div
      ref={(el) => {
        cardRef.current = el
        if (typeof ref === 'function') ref(el)
        else if (ref) ref.current = el
      }}
      className={`relative glass-water-card rounded-forge-xl overflow-hidden group data-magnetic ${tier.popular ? 'ring-2' : 'ring-1'} ${ringFromColor(tier.color)}`}
      whileHover={{ y: -8, scale: tier.popular ? 1.015 : 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', background: gradientBg }}
    >
      {tier.popular && (
        <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500" style={{ transformStyle: 'flat' }} />
      )}

      <div className="p-6 md:p-8">
        {/* Icon */}
        <div className="w-14 h-14 rounded-forge bg-gradient-to-br from-carwash-accent/20 to-carwash-accentLight/20 flex items-center justify-center mb-6 mx-auto">
          <tier.icon className="w-7 h-7 text-carwash-accent" />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-2">{tier.name}</h3>
          <p className="text-carwash-muted text-sm">{tier.description}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span className="font-display text-4xl md:text-5xl font-bold text-white">{tier.price}</span>
            <span className="text-carwash-muted text-lg">{tier.period}</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8" role="list">
          {tier.features.map((feature, fi) => (
            <li key={fi} className="flex items-center gap-3 text-sm text-white">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-carwash-accent/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-carwash-accent" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a 
          href="#contact" 
          className={`w-full py-4 rounded-forge-lg font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 ${tier.popular ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 hover:from-yellow-400 hover:to-orange-400' : 'glass-water text-carwash-text hover:text-carwash-accent'}`}
        >
          {tier.cta}
        </a>
      </div>
    </motion.div>
  )
})