import { forwardRef, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles, Shield, Star, Clock, Droplets, Car, Wind, Gem, Award } from 'lucide-react'

export function Services() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  const services = [
    {
      id: 1,
      icon: Sparkles,
      title: 'Премиум ручная мойка',
      subtitle: 'Двухфазная система',
      description: 'Мойка двухфазным pH-нейтральным шампунем, удаление битума и насекомых, обработка колес специальным составом, сушка микрофиброй без разводов.',
      price: 'от 2 500 ₽',
      duration: '60–90 мин',
      features: ['Двухфазный шампунь', 'Удаление битума', 'Чистка колес', 'Сушка микрофиброй', 'Восковое покрытие'],
      popular: false,
    },
    {
      id: 2,
      icon: Shield,
      title: 'Керамическое покрытие',
      subtitle: 'Защита до 5 лет',
      description: 'Нанесение профессиональной керамики Gyeon / CarPro. Защита от УФ, химии, микрозагрязнений. Гидрофобный эффект, глубокий глянец, легкая мойка.',
      price: 'от 35 000 ₽',
      duration: '2–3 дня',
      features: ['Керамика Gyeon/CarPro', 'Полировка кузова', 'Подготовка поверхности', 'Гарантия до 5 лет', 'Сертификат'],
      popular: true,
    },
    {
      id: 3,
      icon: Star,
      title: 'Полный детейлинг',
      subtitle: 'Кузов + Салон',
      description: 'Комплексная работа: трехстадийная полировка, керамика/кварц, химчистка салона, озонование, обработка пластика и кожи, антидождь на стекла.',
      price: 'от 55 000 ₽',
      duration: '3–5 дней',
      features: ['3-стадийная полировка', 'Керамика/кварц', 'Химчистка салона', 'Озонование', 'Антидождь на стекла', 'Обработка кожи/пластика'],
      popular: false,
    },
    {
      id: 4,
      icon: Clock,
      title: 'Экспресс-мойка',
      subtitle: 'За 30 минут',
      description: 'Быстрая контактная мойка портативным аппаратом, активная пена, поливаемый воск, сушка. Без предварительной записи, работаем 24/7.',
      price: 'от 800 ₽',
      duration: '30 мин',
      features: ['Активная пена', 'Портативный аппарат', 'Поливаемый воск', 'Без записи', '24/7'],
      popular: false,
    },
    {
      id: 5,
      icon: Droplets,
      title: 'Антидождь на стекла',
      subtitle: 'Видимость при дожде',
      description: 'Нанесение гидрофобного покрытия на лобовое, боковые и заднее стекло. Вода собирается в капли и сдувается ветром на скорости от 60 км/ч.',
      price: 'от 3 000 ₽',
      duration: '40 мин',
      features: ['Все стекла', 'Действует 6–12 мес', 'Безопасно для стеклоочистителей', 'Мгновенный эффект'],
      popular: false,
    },
    {
      id: 6,
      icon: Car,
      title: 'Полировка фар',
      subtitle: 'Восстановление прозрачности',
      description: 'Удаление желтизны, царапин и поматов. Нанесение UV-защитного покрытия. Улучшает световой поток на 40–60%.',
      price: 'от 4 500 ₽',
      duration: '1–2 часа',
      features: ['Шлифовка и полировка', 'UV-защита', 'Действует 2+ года', 'Обе фары'],
      popular: false,
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section titles — поочерёдный подъём
      gsap.fromTo(sectionRef.current?.querySelectorAll('.section-title'),
        { y: 46, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.14, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      gsap.fromTo(sectionRef.current?.querySelector('.section-subtitle'),
        { y: 30, x: 70, opacity: 0 },
        { y: 0, x: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      // Cards stagger animation — поочерёдно слева/справа с 3D-разворотом
      gsap.fromTo(cardsRef.current.map(r => r.current).filter(Boolean),
        {
          y: 70,
          x: (i) => (i % 2 === 0 ? -90 : 90),
          rotateX: -12,
          rotateY: (i) => (i % 2 === 0 ? -14 : 14),
          opacity: 0,
        },
        {
          y: 0, x: 0, rotateX: 0, rotateY: 0, opacity: 1,
          duration: 1.05, stagger: 0.14, ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      )

      // Дополнительные услуги — всплытие снизу с пружинкой
      gsap.fromTo('.extra-service',
        { y: 46, opacity: 0, scale: 0.92 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.8, stagger: 0.1, ease: 'back.out(1.5)',
          clearProps: 'transform',
          scrollTrigger: { trigger: '.extra-services-grid', start: 'top 88%' },
        }
      )

      // Popular badge pulse
      gsap.to('.popular-badge', {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const setCardRef = (index) => (el) => {
    cardsRef.current[index] = { current: el }
  }

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-20" id="services">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <p className="section-title text-carwash-accent font-semibold text-sm tracking-widest uppercase mb-4">
            Наши услуги
          </p>
          <h2 className="section-title font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Комплексный уход<br /><span className="text-gradient-water">за автомобилем</span>
          </h2>
          <p className="section-subtitle text-lg md:text-xl text-carwash-muted leading-relaxed">
            От быстрой экспресс-мойки до полного детейлинга с керамической защитой. 
            Каждая услуга выполняется по строгим стандартам с использованием профессиональной химии.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={i}
              ref={setCardRef(i)}
            />
          ))}
        </div>

        {/* Additional Services Row */}
        <div className="extra-services-grid mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Wind, title: 'Сушка салона', desc: 'Промышленные 건조기', price: '500 ₽' },
            { icon: Gem, title: 'Обработка кожи', desc: 'Кондиционер + защита', price: '2 000 ₽' },
            { icon: Award, title: 'Хром полировка', desc: 'Зеркальный блеск', price: '1 500 ₽' },
            { icon: Droplets, title: 'Двигатель', desc: 'Чистка + консервация', price: '3 000 ₽' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="extra-service glass-water-card p-6 rounded-forge group data-magnetic"
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="w-10 h-10 rounded-forge-sm bg-gradient-to-br from-carwash-accent/20 to-carwash-accentLight/20 flex items-center justify-center mb-4 group-hover:from-carwash-accent/40 group-hover:to-carwash-accentLight/40 transition-all duration-300">
                <item.icon className="w-5 h-5 text-carwash-accent" />
              </div>
              <h4 className="font-display text-base font-semibold text-white mb-1">{item.title}</h4>
              <p className="text-carwash-muted text-xs mb-2">{item.desc}</p>
              <span className="text-carwash-accent font-semibold text-sm">{item.price}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'

const ServiceCard = forwardRef(function ServiceCard({ service, index }, ref) {
  const cardRef = useRef(null)
  const isHovered = useRef(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      el.style.transform = `perspective(1000px) rotateY(${x * 0.05}deg) rotateX(${-y * 0.05}deg) translateY(-8px) scale(1.02)`
    }

    const onMouseLeave = () => {
      el.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0) scale(1)'
    }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)
    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <motion.div
      ref={(el) => {
        cardRef.current = el
        if (typeof ref === 'function') ref(el)
        else if (ref) ref.current = el
      }}
      className={`relative glass-water-card rounded-forge-lg overflow-hidden group data-magnetic ${service.popular ? 'ring-1 ring-carwash-accent/30' : ''}`}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Popular Badge */}
      {service.popular && (
        <motion.div className="popular-badge absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold text-carwash-bg bg-gradient-to-r from-carwash-accent to-carwash-accentLight" style={{ transformStyle: 'flat' }}>
          Популярно
        </motion.div>
      )}

      {/* Icon */}
      <div className="p-6 md:p-8 pb-0">
        <div className="w-14 h-14 rounded-forge bg-gradient-to-br from-carwash-accent/20 to-carwash-accentLight/20 flex items-center justify-center mb-6 group-hover:from-carwash-accent/40 group-hover:to-carwash-accentLight/40 transition-all duration-300">
          <service.icon className="w-7 h-7 text-carwash-accent" />
        </div>

        <div className="mb-3">
          <h3 className="font-display text-xl font-bold text-white mb-1">{service.title}</h3>
          <p className="text-carwash-accent text-sm font-medium">{service.subtitle}</p>
        </div>

        <p className="text-carwash-muted text-sm leading-relaxed mb-6">{service.description}</p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {service.features.map((feature, fi) => (
            <li key={fi} className="flex items-center gap-2 text-sm text-carwash-muted/80">
              <span className="w-1.5 h-1.5 rounded-full bg-carwash-accent/50 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Price & Duration */}
        <div className="flex items-center justify-between pt-4 border-t border-carwash-border/30">
          <div>
            <span className="font-display text-2xl font-bold text-white">{service.price}</span>
            <span className="text-carwash-muted text-sm ml-2">/ {service.duration}</span>
          </div>
          <a 
            href="#booking" 
            className="glass-water px-5 py-2.5 rounded-forge-sm text-sm font-semibold text-carwash-text hover:text-carwash-accent transition-colors group data-magnetic"
          >
            Заказать
            <svg className="w-4 h-4 ml-1 inline group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </div>

      {/* Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-carwash-accent/5 via-carwash-accentLight/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-forge-lg pointer-events-none" />
    </motion.div>
  )
})