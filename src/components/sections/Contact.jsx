import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Mail, Clock, Car, Star, MessageSquare, Navigation, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function Contact() {
  const sectionRef = useRef(null)
  const mapRef = useRef(null)

  const locations = [
    {
      id: 1,
      name: 'АкваПремиум Центр',
      address: 'ул. Ленина, 123 (ТЦ «МегаМол», паркинг -1)',
      phone: '+7 (900) 123-45-67',
      hours: 'Ежедневно 08:00–23:00',
      features: ['6 мойных постов', 'Зона ожидания с Wi-Fi', 'Кофе-бар', 'Детский уголок'],
      coords: [55.7558, 37.6176],
      main: true,
    },
    {
      id: 2,
      name: 'АкваПремиум Экспресс',
      address: 'пр. Мира, 45 (АЗС «Лукойл», въезд справа)',
      phone: '+7 (900) 123-45-68',
      hours: 'Круглосуточно 24/7',
      features: ['2 портативных поста', 'Самообслуживание', 'Оплата картой/телефоном', 'За 30 минут'],
      coords: [55.7847, 37.6398],
      main: false,
    },
    {
      id: 3,
      name: 'АкваПремиум Юг',
      address: 'ул. Гагарина, 12 (Авторынок «Южный», бокс 15)',
      phone: '+7 (900) 123-45-69',
      hours: 'Ежедневно 09:00–21:00',
      features: ['4 мойных постов', 'Детейлинг-бокс', 'Керамика на месте', 'ППФ пленка'],
      coords: [55.7123, 37.6012],
      main: false,
    },
  ]

  const faqs = [
    {
      q: 'Нужно ли записываться заранее?',
      a: 'Для экспресс-мойки — не нужно, заезжайте в любое время. Для Премиум и детейлинга рекомендуем запись — так вы гарантированно попадете в удобный слот без ожидания.',
    },
    {
      q: 'Какие способы оплаты принимаете?',
      a: 'Наличные, все банковские карты (Visa, MasterCard, МИР), СБП (по QR-коду), Apple Pay / Google Pay / Samsung Pay. Для корпоративных клиентов — безналичный расчет по договору.',
    },
    {
      q: 'Даете ли гарантию на керамику?',
      a: 'Да, официальную гарантию от производителя (Gyeon / CarPro) на 2–5 лет в зависимости от покрытия. Выдаем сертификат с уникальным номером, действующий во всех сертифицированных центрах.',
    },
    {
      q: 'Можно ли оставить машину на весь день?',
      a: 'Да, у нас есть охраняемая парковка для клиентов. При заказе детейлинга или керамики — парковка бесплатна на все время работ. Зона ожидания с Wi-Fi, кофе и зарядками для телефонов.',
    },
    {
      q: 'Работаете ли вы в дождь/снег?',
      a: 'Да, все посты под навесом с отоплением зимой. Мойка в любую погоду — это наша особенность. Экспресс-посты работают 24/7 в любых условиях.',
    },
    {
      q: 'Есть ли скидки для постоянных клиентов?',
      a: 'Да! Подписки Silver/Gold/Platinum дают до 20% скидки на все услуги + бесплатные бонусы. Также скидка 10% на 2-е и последующие авто в семье, 15% для таксистов и каршеринга.',
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

      // Локации — поочерёдно слева/справа
      gsap.fromTo('.location-card',
        { y: 60, x: (i) => (i % 2 === 0 ? -80 : 80), rotateY: (i) => (i % 2 === 0 ? -12 : 12), opacity: 0 },
        {
          y: 0, x: 0, rotateY: 0, opacity: 1,
          duration: 1, stagger: 0.15, ease: 'power3.out', clearProps: 'transform',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      )

      // Карта — всплытие с масштабом
      gsap.fromTo('.map-card',
        { y: 60, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: '.map-card', start: 'top 85%' } }
      )

      gsap.fromTo('.faq-item',
        { y: 36, opacity: 0, x: 40 },
        { y: 0, x: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'back.out(1.3)', clearProps: 'transform', scrollTrigger: { trigger: '.faq-section', start: 'top 80%' } }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-20" id="contact">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="section-title text-carwash-accent font-semibold text-sm tracking-widest uppercase mb-4">
            Контакты и адреса
          </p>
          <h2 className="section-title font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Приезжайте или<br /><span className="text-gradient-water">закажите выезд</span>
          </h2>
          <p className="section-subtitle text-lg md:text-xl text-carwash-muted leading-relaxed">
            Три локации в городе, работаем 24/7. Выездная мойка в радиусе 15 км от МКАД.
          </p>
        </div>

        {/* Locations */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16 md:mb-24">
          {locations.map((loc) => (
            <motion.div
              key={loc.id}
              className={`location-card glass-water-card rounded-forge-xl overflow-hidden relative data-magnetic ${loc.main ? 'ring-2 ring-carwash-accent/30' : 'ring-1 ring-carwash-border/30'}`}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {loc.main && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-carwash-bg bg-gradient-to-r from-carwash-accent to-carwash-accentLight">
                  Главная
                </div>
              )}

              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-forge bg-gradient-to-br from-carwash-accent/20 to-carwash-accentLight/20 flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-6 h-6 text-carwash-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white mb-1">{loc.name}</h3>
                    <p className="text-carwash-muted text-sm">{loc.address}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-5 h-5 text-carwash-accent flex-shrink-0" />
                    <a href={`tel:${loc.phone.replace(/\D/g, '')}`} className="text-white hover:text-carwash-accent transition-colors">{loc.phone}</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-carwash-accent flex-shrink-0" />
                    <span className="text-carwash-muted">{loc.hours}</span>
                  </div>
                </div>

                <div className="border-t border-carwash-border/30 pt-4 mb-6">
                  <h4 className="font-medium text-white mb-3">Что на месте:</h4>
                  <ul className="grid grid-cols-2 gap-2 text-sm text-carwash-muted">
                    {loc.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-carwash-accent/60 flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <a 
                  href="#booking" 
                  className={`w-full py-3 rounded-forge-lg font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 ${loc.main ? 'btn-water' : 'glass-water text-carwash-text hover:text-carwash-accent'}`}
                >
                  {loc.main ? 'Записаться сюда' : 'Выбрать эту точку'}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="map-card glass-water-card rounded-forge-xl overflow-hidden mb-16 md:mb-24">
          <div ref={mapRef} className="aspect-video relative bg-gradient-to-br from-carwash-bgDeep via-carwash-bg to-carwash-bgDeep">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-carwash-accent/20 to-carwash-accentLight/20 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-carwash-accent" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Интерактивная карта</h3>
                <p className="text-carwash-muted mb-6">Нажмите, чтобы открыть в Яндекс.Картах или Google Maps</p>
                <div className="flex justify-center gap-4">
                  <a href="https://yandex.ru/maps" target="_blank" rel="noopener" className="glass-water px-6 py-3 rounded-forge-sm font-medium text-carwash-text hover:text-carwash-accent transition-colors data-magnetic">
                    Яндекс.Карты
                  </a>
                  <a href="https://maps.google.com" target="_blank" rel="noopener" className="glass-water px-6 py-3 rounded-forge-sm font-medium text-carwash-text hover:text-carwash-accent transition-colors data-magnetic">
                    Google Maps
                  </a>
                </div>
              </div>
            </div>
            {/* Decorative grid overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2264%22 height=%2264%22 viewBox=%220 0 64 64%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h64v64H0z%22 fill=%22none%22/%3E%3Cpath d=%22M0 32h64M32 0v64%22 stroke=%22%230ea5e9%22 stroke-width=%220.5%22 opacity=%220.08%22/%3E%3C/svg%3E')] opacity-50 pointer-events-none" />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Частые вопросы</h3>
            <p className="text-carwash-muted">Не нашли ответ? Напишите нам — ответим за 5 минут</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <a 
              href="#booking" 
              className="btn-water px-10 py-4 rounded-forge-sm font-semibold text-base inline-flex items-center gap-3 data-magnetic"
            >
              Записаться на мойку
              <Navigation className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="faq-item glass-water-card rounded-forge overflow-hidden data-magnetic"
      whileHover={{ boxShadow: '0 0 24px rgba(14, 165, 233, 0.15)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 flex items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-white pr-10">{faq.q}</span>
        <Star 
          className={`w-5 h-5 text-carwash-accent flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} 
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 text-carwash-muted leading-relaxed"
          >
            {faq.a}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

import { AnimatePresence } from 'framer-motion'