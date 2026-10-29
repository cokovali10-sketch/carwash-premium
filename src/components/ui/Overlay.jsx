import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, X, Phone, MapPin, Mail, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Overlay() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef(null)
  const mobileNavRef = useRef(null)

  const navLinks = [
    { href: '#hero', label: 'Главная' },
    { href: '#services', label: 'Услуги' },
    { href: '#pricing', label: 'Цены' },
    { href: '#booking', label: 'Записаться' },
    { href: '#contact', label: 'Контакты' },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Nav entrance animation
      gsap.fromTo(navRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
      )

      // Nav background on scroll
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top -100',
        onEnter: () => gsap.to(navRef.current, { background: 'rgba(3, 7, 18, 0.95)', backdropFilter: 'blur(20px)', duration: 0.3 }),
        onLeaveBack: () => gsap.to(navRef.current, { background: 'rgba(3, 7, 18, 0.7)', backdropFilter: 'blur(20px)', duration: 0.3 }),
      })
    }, navRef)

    return () => ctx.revert()
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      {/* Desktop Navigation */}
      <header ref={navRef} className="nav fixed top-0 left-0 right-0 z-40 glass-water border-b border-carwash-border/30" data-magnetic>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between h-18 md:h-20">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-3 text-white font-display font-bold text-xl data-magnetic">
              <div className="w-8 h-8 rounded-forge bg-gradient-to-br from-carwash-accent to-carwash-accentLight flex items-center justify-center">
                <svg className="w-5 h-5 text-carwash-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M12 2a10 10 0 100 20M12 2a10 10 0 110 20" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h20" />
                </svg>
              </div>
              <span className="hidden sm:block">АкваПремиум</span>
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="group text-carwash-muted hover:text-carwash-accent transition-colors font-medium text-sm relative data-magnetic"
                >
                  {link.label}
                  <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-carwash-accent scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              ))}
              <a href="#booking" className="btn-water px-6 py-2.5 rounded-forge-sm text-sm font-semibold data-magnetic">
                Записаться
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-forge glass-water text-carwash-text hover:text-carwash-accent transition-colors data-magnetic"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Открыть меню"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileNavRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-carwash-bgDeep/98 backdrop-blur-xl flex flex-col"
            onClick={closeMobileMenu}
          >
            {/* Close Button */}
            <button
              onClick={(e) => { e.stopPropagation(); closeMobileMenu() }}
              className="absolute top-6 right-6 p-2 rounded-forge glass-water text-carwash-text hover:text-carwash-accent transition-colors data-magnetic"
              aria-label="Закрыть меню"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Nav Links */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-6" aria-label="Mobile navigation">
              {navLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="font-display text-3xl md:text-4xl font-bold text-white hover:text-carwash-accent transition-colors data-magnetic"
                  whileHover={{ x: 10 }}
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.a
                href="#booking"
                onClick={closeMobileMenu}
                className="btn-water px-10 py-4 rounded-forge-sm font-semibold text-lg mt-4 w-auto data-magnetic"
              >
                Записаться на мойку
              </motion.a>

              {/* Contact Info */}
              <div className="flex flex-wrap justify-center gap-6 mt-12 text-carwash-muted text-sm">
                <a href="tel:+79001234567" className="flex items-center gap-2 hover:text-carwash-accent transition-colors data-magnetic">
                  <Phone className="w-4 h-4" /> +7 (900) 123-45-67
                </a>
                <a href="mailto:booking@aquapremium.ru" className="flex items-center gap-2 hover:text-carwash-accent transition-colors data-magnetic">
                  <Mail className="w-4 h-4" /> booking@aquapremium.ru
                </a>
              </div>
            </nav>

            {/* Bottom Info */}
            <div className="px-6 py-8 border-t border-carwash-border/30">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-display text-xl font-bold text-white">24/7</div>
                  <div className="text-carwash-muted">Работаем</div>
                </div>
                <div>
                  <div className="font-display text-xl font-bold text-white">15+</div>
                  <div className="text-carwash-muted">Лет опыта</div>
                </div>
                <div>
                  <div className="font-display text-xl font-bold text-white">50к+</div>
                  <div className="text-carwash-muted">Авто в год</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}