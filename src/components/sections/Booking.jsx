import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calendar, Clock, MapPin, Car, Phone, Mail, CheckCircle, Loader2, AlertCircle, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Booking() {
  const sectionRef = useRef(null)
  const formRef = useRef(null)
  const [formState, setFormState] = useState('idle') // idle, submitting, success, error
  const [formData, setFormData] = useState({
    service: 'premium',
    name: '',
    phone: '',
    car: '',
    date: '',
    time: '',
    comment: '',
  })
  const [errors, setErrors] = useState({})

  const services = [
    { id: 'express', name: 'Экспресс-мойка (30 мин)', price: 'от 800 ₽' },
    { id: 'premium', name: 'Премиум ручная мойка (1.5ч)', price: 'от 3 500 ₽' },
    { id: 'ceramic', name: 'Керамическое покрытие (2-3 дня)', price: 'от 35 000 ₽' },
    { id: 'detailing', name: 'Полный детейлинг (3-5 дней)', price: 'от 55 000 ₽' },
    { id: 'antrain', name: 'Антидождь на стекла (40 мин)', price: 'от 3 000 ₽' },
    { id: 'polish', name: 'Полировка фар (1-2 ч)', price: 'от 4 500 ₽' },
  ]

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current?.querySelectorAll('.section-title'),
        { y: 46, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.14, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      gsap.fromTo(sectionRef.current?.querySelector('.section-subtitle'),
        { y: 30, x: 60, opacity: 0 },
        { y: 0, x: 0, opacity: 1, duration: 1, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      // Инфо-панель въезжает слева
      gsap.fromTo('.booking-info',
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.05, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' } }
      )

      // Форма въезжает справа
      gsap.fromTo(formRef.current,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.05, delay: 0.1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' } }
      )

      // Service cards stagger
      gsap.fromTo('.service-option',
        { y: 30, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.4)', clearProps: 'transform', scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' } }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Введите имя'
    if (!formData.phone.trim()) newErrors.phone = 'Введите телефон'
    if (!formData.car.trim()) newErrors.car = 'Укажите автомобиль'
    if (!formData.date) newErrors.date = 'Выберите дату'
    if (!formData.time) newErrors.time = 'Выберите время'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setFormState('submitting')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate success (in real app, check API response)
    setFormState('success')
    setFormData({
      service: 'premium',
      name: '',
      phone: '',
      car: '',
      date: '',
      time: '',
      comment: '',
    })
    
    // Reset after 5 seconds
    setTimeout(() => setFormState('idle'), 5000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-20" id="booking">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="section-title text-carwash-accent font-semibold text-sm tracking-widest uppercase mb-4">
            Запись на мойку
          </p>
          <h2 className="section-title font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Забронируйте<br /><span className="text-gradient-water">удобное время</span>
          </h2>
          <p className="section-subtitle text-lg md:text-xl text-carwash-muted leading-relaxed">
            Заполните форму — менеджер подтвердит запись за 15 минут. Оплата на месте после проверки качества.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Info Panel */}
          <div className="booking-info relative">
            <div className="glass-water-card p-8 rounded-forge-xl sticky top-24 data-magnetic">
              <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-carwash-accent" />
                Почему удобно записываться к нам
              </h3>
              
              <ul className="space-y-4 mb-8">
                {[
                  { icon: Clock, title: 'Работаем 24/7', desc: 'Мойка доступна круглосуточно без выходных' },
                  { icon: CheckCircle, title: 'Подтверждение за 15 мин', desc: 'Менеджер перезвонит и зафиксирует слот' },
                  { icon: Car, title: 'Любой автомобиль', desc: 'От смарта до внедорожника — считаем стоимость точно' },
                  { icon: Shield, title: 'Гарантия качества', desc: 'Оплата только после проверки результата вами' },
                  { icon: MapPin, title: 'Удобное расположение', desc: 'Легкий подъезд, парковка, зона ожидания с Wi-Fi' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 group data-magnetic">
                    <div className="w-10 h-10 rounded-forge bg-gradient-to-br from-carwash-accent/20 to-carwash-accentLight/20 flex items-center justify-center flex-shrink-0 group-hover:from-carwash-accent/40 group-hover:to-carwash-accentLight/40 transition-all duration-300">
                      <item.icon className="w-5 h-5 text-carwash-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-carwash-muted text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="border-t border-carwash-border/30 pt-6 space-y-4">
                <h4 className="font-semibold text-white">Связаться напрямую:</h4>
                <div className="flex flex-wrap gap-4">
                  <a href="tel:+79001234567" className="glass-water px-4 py-2 rounded-forge-sm text-sm font-medium text-carwash-text hover:text-carwash-accent transition-colors flex items-center gap-2 data-magnetic">
                    <Phone className="w-4 h-4" /> +7 (900) 123-45-67
                  </a>
                  <a href="mailto:booking@aquapremium.ru" className="glass-water px-4 py-2 rounded-forge-sm text-sm font-medium text-carwash-text hover:text-carwash-accent transition-colors flex items-center gap-2 data-magnetic">
                    <Mail className="w-4 h-4" /> booking@aquapremium.ru
                  </a>
                </div>
                <p className="text-carwash-muted text-sm">Или напишите в WhatsApp/Telegram по номеру выше</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="relative">
            <form ref={formRef} onSubmit={handleSubmit} className="glass-water-card p-8 rounded-forge-xl data-magnetic" noValidate>
              <AnimatePresence mode="wait">
                {formState === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold text-white mb-2">Заявка принята!</h3>
                    <p className="text-carwash-muted mb-6">Менеджер свяжется с вами в течение 15 минут для подтверждения времени.</p>
                    <button
                      type="button"
                      onClick={() => setFormState('idle')}
                      className="btn-water px-8 py-3 rounded-forge-sm inline-flex items-center gap-2"
                    >
                      Записать другое авто
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Service Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-carwash-muted mb-3">Выберите услугу</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3" role="radiogroup">
                        {services.map((svc) => (
                          <label
                            key={svc.id}
                            className={`service-option relative cursor-pointer p-4 rounded-forge transition-all duration-300 ${
                              formData.service === svc.id
                                ? 'ring-2 ring-carwash-accent bg-carwash-accent/10'
                                : 'glass-water-card hover:ring-1 hover:ring-carwash-accent/30'
                            }`}
                          >
                            <input
                              type="radio"
                              name="service"
                              value={svc.id}
                              checked={formData.service === svc.id}
                              onChange={handleChange}
                              className="absolute inset-0 opacity-0"
                            />
                            <div className="font-medium text-white">{svc.name}</div>
                            <div className="text-carwash-accent text-sm font-semibold mt-1">{svc.price}</div>
                            <div className="absolute inset-0 rounded-forge bg-gradient-to-br from-carwash-accent/10 to-carwash-accentLight/10 opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </label>
                        ))}
                      </div>
                      {errors.service && <p className="text-red-400 text-sm mt-2">{errors.service}</p>}
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-carwash-muted mb-2">Имя *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Иван Иванов"
                          className="w-full glass-water px-4 py-3 rounded-forge-sm text-white placeholder-carwash-muted/40 focus:outline-none focus:ring-2 focus:ring-carwash-accent/50 transition-all"
                        />
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-carwash-muted mb-2">Телефон *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+7 (999) 000-00-00"
                          className="w-full glass-water px-4 py-3 rounded-forge-sm text-white placeholder-carwash-muted/40 focus:outline-none focus:ring-2 focus:ring-carwash-accent/50 transition-all"
                        />
                        {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-carwash-muted mb-2">Автомобиль (марка, модель, год) *</label>
                      <input
                        type="text"
                        name="car"
                        value={formData.car}
                        onChange={handleChange}
                        placeholder="Toyota Camry 2022, белый"
                        className="w-full glass-water px-4 py-3 rounded-forge-sm text-white placeholder-carwash-muted/40 focus:outline-none focus:ring-2 focus:ring-carwash-accent/50 transition-all"
                      />
                      {errors.car && <p className="text-red-400 text-sm mt-1">{errors.car}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-carwash-muted mb-2">Дата *</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          min={today}
                          max={maxDate}
                          className="w-full glass-water px-4 py-3 rounded-forge-sm text-white focus:outline-none focus:ring-2 focus:ring-carwash-accent/50 transition-all"
                        />
                        {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-carwash-muted mb-2">Время *</label>
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full glass-water px-4 py-3 rounded-forge-sm text-white focus:outline-none focus:ring-2 focus:ring-carwash-accent/50 transition-all appearance-none bg-none"
                        >
                          <option value="">Выберите время</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                        {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time}</p>}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-carwash-muted mb-2">Комментарий (пожелания, доп. услуги)</label>
                      <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Например: нужен антидождь на все стекла, пожелание по воску..."
                        className="w-full glass-water px-4 py-3 rounded-forge-sm text-white placeholder-carwash-muted/40 focus:outline-none focus:ring-2 focus:ring-carwash-accent/50 transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={formState === 'submitting'}
                      className={`w-full py-4 rounded-forge-lg font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 ${formState === 'submitting' ? 'glass-water text-carwash-muted/50 cursor-not-allowed' : 'btn-water'}`}
                    >
                      {formState === 'submitting' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        'Забронировать время'
                      )}
                    </button>

                    <p className="text-center text-carwash-muted/50 text-xs mt-4">
                      Нажимая кнопку, вы соглашаетесь с <a href="#" className="text-carwash-accent hover:underline">обработкой персональных данных</a>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}