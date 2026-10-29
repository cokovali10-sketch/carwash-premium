import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Car, Sparkles, Shield, Clock, Star, ArrowRight } from 'lucide-react'

export function Hero({ scrollRef }) {
  const heroRef = useRef(null)
  const badgeRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)
  const statsRef = useRef(null)
  const scrollIndicatorRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Бейдж въезжает слева
      gsap.fromTo(badgeRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.15, ease: 'power3.out', clearProps: 'transform' }
      )

      // Title animation
      gsap.fromTo(titleRef.current?.children || [], 
        { y: 60, opacity: 0, rotateX: -15 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out' }
      )

      // Карточки справа — въезд справа с 3D-разворотом
      gsap.fromTo('.hero-cards > *',
        { x: 90, opacity: 0, rotateY: -14 },
        { x: 0, opacity: 1, rotateY: 0, duration: 1, stagger: 0.12, delay: 0.75, ease: 'power3.out', clearProps: 'transform' }
      )

      // Subtitle
      gsap.fromTo(subtitleRef.current, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' }
      )

      // CTA buttons
      gsap.fromTo(ctaRef.current?.children || [], 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.8, ease: 'power3.out' }
      )

      // Stats
      gsap.fromTo(statsRef.current?.children || [], 
        { y: 40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, delay: 1, ease: 'back.out(1.7)' }
      )

      // Scroll indicator
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 2
      })

      // Counter animation for stats
      const counters = statsRef.current?.querySelectorAll('[data-count]')
      counters?.forEach((counter) => {
        const target = parseInt(counter.dataset.count || '0')
        const suffix = counter.dataset.suffix || ''
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          delay: 1.2,
          onUpdate: () => {
            counter.textContent = Math.round(proxy.val) + suffix
          }
        })
      })

      // Fade out hero content on scroll
      gsap.to([badgeRef.current, titleRef.current, subtitleRef.current, ctaRef.current, statsRef.current], {
        opacity: 0,
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'center top',
          end: 'bottom top',
          scrub: 1,
        }
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const stats = [
    { value: 15, suffix: '+', label: 'Лет опыта' },
    { value: 50, suffix: 'к+', label: 'Авто в год' },
    { value: 99, suffix: '%', label: 'Довольных' },
    { value: 24, suffix: '/7', label: 'Работаем' },
  ]

  const services = [
    { icon: Sparkles, title: 'Премиум мойка', desc: 'Ручная мойка двухфазным шампунем с восковым покрытием' },
    { icon: Shield, title: 'Керамика', desc: 'Нанесение керамического покрытия до 5 лет защиты' },
    { icon: Star, title: 'Детейлинг', desc: 'Полный детейлинг салона и кузова с полировкой' },
    { icon: Clock, title: 'Экспресс', desc: 'Быстрая мойка за 30 минут без записи' },
  ]

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" id="hero">
      {/* Page Aura Glow */}
      <div className="page-aura page-aura--left" aria-hidden="true" />
      <div className="page-aura page-aura--right" aria-hidden="true" />

      {/* Foreground Content */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-16" data-magnetic>
            <div className="flex items-center gap-3 glass-water px-6 py-3 rounded-forge">
              <div className="w-2 h-2 rounded-full bg-carwash-accent animate-pulse-glow" />
              <span className="text-sm font-medium text-carwash-muted">АкваПремиум — Автомойка и детейлинг</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-carwash-muted text-sm font-medium">
              <a href="#services" className="hover:text-carwash-accent transition-colors">Услуги</a>
              <a href="#pricing" className="hover:text-carwash-accent transition-colors">Цены</a>
              <a href="#booking" className="hover:text-carwash-accent transition-colors">Записаться</a>
              <a href="#contact" className="hover:text-carwash-accent transition-colors">Контакты</a>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: Text Content */}
            <div className="relative">
              <p className="text-carwash-accent font-semibold text-sm tracking-widest uppercase mb-6" ref={badgeRef}>
                <span className="text-gradient-water">Новый стандарт</span> чистоты
              </p>
              
              <h1 ref={titleRef} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-white mb-8">
                <span className="block">Автомойка</span>
                <span className="block text-gradient-water">премиум класса</span>
              </h1>

              <p ref={subtitleRef} className="text-lg md:text-xl text-carwash-muted max-w-xl mb-12 leading-relaxed">
                Профессиональная мойка, керамическое покрытие и детейлинг. 
                Используем только сертифицированные материалы и современное оборудование.
                Качественно. Быстро. С гарантией результата.
              </p>

              {/* CTA Buttons */}
              <div ref={ctaRef} className="flex flex-wrap gap-4 mb-16">
                <a 
                  href="#booking" 
                  className="btn-water text-white px-10 py-4 rounded-forge-sm font-semibold text-base flex items-center gap-3 group data-magnetic"
                >
                  Записаться на мойку
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a 
                  href="#services" 
                  className="glass-water px-10 py-4 rounded-forge-sm font-semibold text-base flex items-center gap-3 text-carwash-text hover:text-carwash-accent transition-colors data-magnetic"
                >
                  Наши услуги
                </a>
              </div>

              {/* Stats */}
              <div ref={statsRef} className="grid grid-cols-2 gap-6 md:gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="glass-water-card p-6 rounded-forge">
                    <div className="font-display text-3xl md:text-4xl font-bold text-white mb-1" data-count={stat.value} data-suffix={stat.suffix}>
                      0{stat.suffix}
                    </div>
                    <div className="text-carwash-muted text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Service Cards Preview */}
            <div className="relative hidden lg:block">
              <div className="hero-cards grid grid-cols-2 gap-4" style={{ perspective: '1000px' }}>
                {services.map((service, i) => (
                  <motion.div
                    key={i}
                    className="glass-water-card p-6 rounded-forge group relative overflow-hidden data-magnetic"
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="w-12 h-12 rounded-forge-sm bg-gradient-to-br from-carwash-accent/20 to-carwash-accentLight/20 flex items-center justify-center mb-4 group-hover:from-carwash-accent/40 group-hover:to-carwash-accentLight/40 transition-all duration-300">
                      <service.icon className="w-6 h-6 text-carwash-accent" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-white mb-2">{service.title}</h3>
                    <p className="text-carwash-muted text-sm leading-relaxed">{service.desc}</p>
                    <div className="absolute inset-0 bg-gradient-to-t from-carwash-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-forge" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div ref={scrollIndicatorRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-carwash-muted/50 animate-fade-in">
            <span className="text-xs tracking-widest uppercase">Прокрутите</span>
            <motion.div
              className="w-1 h-10 bg-gradient-to-b from-carwash-accent/50 to-transparent rounded-full overflow-hidden"
              animate={{ scaleY: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div className="w-full h-full bg-carwash-accent" animate={{ y: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}