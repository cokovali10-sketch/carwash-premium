import { useEffect, useRef, useState } from 'react'
import { MapPin, Clock } from 'lucide-react'
import { Hero } from './components/sections/Hero'
import { Services } from './components/sections/Services'
import { Pricing } from './components/sections/Pricing'
import { Booking } from './components/sections/Booking'
import { Contact } from './components/sections/Contact'
import { Overlay } from './components/ui/Overlay'
import { SmoothScroll } from './components/ui/SmoothScroll'
import { CustomCursor } from './components/ui/CustomCursor'
import { Preloader } from './components/ui/Preloader'
import { BackToTop } from './components/ui/BackToTop'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { NexaBackground } from './components/background/NexaBackground'
import { useIsMobile } from './hooks/useIsMobile'
import { SCENE } from './config/scene'
import { audio } from './lib/audioEngine'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const scrollRef = useRef(null)
  const isMobile = useIsMobile(SCENE.mobile.breakpoint)
  const [mounted, setMounted] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)

  // Даём браузеру отрисовать первый экран, затем подгружаем 3D
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const idle = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 200))
    const handle = idle(() => setSceneReady(true), { timeout: 1200 })
    return () => {
      if (window.cancelIdleCallback && typeof handle === 'number') window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
    }
  }, [])

  useEffect(() => {
    setMounted(true)

    // Audio unlock
    const unlock = () => audio.unlock()
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })

    const onMouseOver = (e) => {
      const el = e.target.closest?.('[data-magnetic], button, a[href]')
      if (el) audio.hover()
    }
    document.addEventListener('mouseover', onMouseOver)

    const onClick = (e) => {
      if (e.target.closest?.('button, a[href]')) audio.click()
    }
    document.addEventListener('click', onClick)

// Dev: Toggle wash effect with 'W' key
    const onKeyDown = (event) => {
      if (!import.meta.env.DEV) return
      if (event.key.toLowerCase() === 'w') {
        console.log('[carwash] Wash toggle')
      }
    }
    window.addEventListener('keydown', onKeyDown)

    // Make lenis globally accessible for BackToTop
    if (scrollRef.current && scrollRef.current._lenis) {
      window.lenis = scrollRef.current._lenis
    }

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // Initialize ScrollTrigger after mount
  useEffect(() => {
    if (!mounted) return
    ScrollTrigger.refresh()
  }, [mounted])

  return (
    <div className="relative min-h-screen">
      {/* 3D Background — лёгкий WebGL на ядре NEXA Core, грузится после первого экрана */}
      <div className="fixed inset-0 z-0 bg-carwash-bgDeep">
        {sceneReady && <NexaBackground isMobile={isMobile} />}
      </div>

      {/* Page Aura Glow */}
      <div className="page-aura page-aura--left" aria-hidden="true" />
      <div className="page-aura page-aura--right" aria-hidden="true" />

      {/* Smooth Scroll Wrapper */}
      <SmoothScroll scrollRef={scrollRef}>
        <Overlay />
        <main id="main">
          <Hero scrollRef={scrollRef} />
          <Services />
          <Pricing />
          <Booking />
          <Contact />
        </main>
      </SmoothScroll>

      {/* UI Components */}
      <ScrollProgress />
      <BackToTop />
      <CustomCursor />
      <Preloader />

      {/* Footer */}
      <footer className="relative z-10 border-t border-carwash-border/30 bg-carwash-bgDeep/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <a href="#hero" className="flex items-center gap-3 text-white font-display font-bold text-xl mb-4 data-magnetic">
                <div className="w-10 h-10 rounded-forge bg-gradient-to-br from-carwash-accent to-carwash-accentLight flex items-center justify-center">
                  <svg className="w-6 h-6 text-carwash-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20M12 2a10 10 0 100 20M12 2a10 10 0 110 20" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 12h20" />
                  </svg>
                </div>
                <span>АкваПремиум</span>
              </a>
              <p className="text-carwash-muted text-base max-w-md leading-relaxed mb-6">
                Профессиональная автомойка и детейлинг премиум-класса. 
                Качественно. Быстро. С гарантией результата.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="glass-water px-4 py-2 rounded-forge-sm text-sm text-carwash-muted hover:text-carwash-accent transition-colors data-magnetic">Политика конфиденциальности</a>
                <a href="#" className="glass-water px-4 py-2 rounded-forge-sm text-sm text-carwash-muted hover:text-carwash-accent transition-colors data-magnetic">Публичная оферта</a>
                <a href="#" className="glass-water px-4 py-2 rounded-forge-sm text-sm text-carwash-muted hover:text-carwash-accent transition-colors data-magnetic">Вакансии</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Услуги</h4>
              <ul className="space-y-3">
                {['Премиум мойка', 'Керамика', 'Детейлинг', 'Экспресс', 'Антидождь', 'Полировка фар'].map((item, i) => (
                  <li key={i}>
                    <a href="#services" className="text-carwash-muted hover:text-carwash-accent transition-colors text-sm data-magnetic">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Контакты</h4>
              <ul className="space-y-3 text-carwash-muted text-sm">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> г. Москва, 3 локации</li>
                <li className="flex items-center gap-2"><a href="tel:+79001234567" className="hover:text-carwash-accent transition-colors">+7 (900) 123-45-67</a></li>
                <li className="flex items-center gap-2"><a href="mailto:booking@aquapremium.ru" className="hover:text-carwash-accent transition-colors">booking@aquapremium.ru</a></li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> Ежедневно 08:00–23:00</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-carwash-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-carwash-muted/60 text-sm">
              © 2024 АкваПремиум. Все права защищены.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-carwash-muted/60 hover:text-carwash-accent transition-colors data-magnetic" aria-label="VK">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 4H3a2 2 0 00-2 2v16a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zm-10 8.5c0 1.5-1 2.5-2.5 2.5S11 14 11 12.5 12 10 13.5 10s2.5 1 2.5 2.5v3.5h-4v-3.5zm5 0c0 1.5-1 2.5-2.5 2.5s-2.5-1-2.5-2.5 1-2.5 2.5-2.5 2.5 1 2.5 2.5v3.5h-4v-3.5zM8 16h8v-2H8v2z"/></svg>
              </a>
              <a href="#" className="text-carwash-muted/60 hover:text-carwash-accent transition-colors data-magnetic" aria-label="Telegram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-11.5L8.5 14.5 7 13l5-5 5 5-1.5 1.5-3.5-3.5z"/></svg>
              </a>
              <a href="#" className="text-carwash-muted/60 hover:text-carwash-accent transition-colors data-magnetic" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-1.45 0-2.82-.33-4-.92L2 22l5.92-1.92C6.33 19.82 6 18.45 6 17c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8zm4.5-11c-.6 0-1.1.3-1.3.7-.3.5-.7 1.2-.7 1.4 0 .3.3.5.6.7.3.2.6.4.8.5.2.1.3.1.5 0 .2-.1.7-.6.9-1.1.2-.5.2-1 0-1.4-.2-.5-.7-1.2-1.2-1.5-.5-.3-1-.3-1.5-.3H9c-.6 0-1.1.4-1.3.7-.2.2-.4.5-.5.8-.1.3-.1.6 0 .8.1.2.3.5.5.7.3.3.7.5 1.2.5.4 0 .7-.2 1-.4.4-.3 1.1-1.1 1.1-2.1 0-.9-.3-1.5-.5-1.8-.2-.3-.4-.4-.6-.5-.3-.2-.7-.3-1-.3-.3 0-.6.1-.8.3-.2.2-.5.5-.7.8-.2.3-.4.6-.4.8 0 .3.2.6.5.8.3.2.7.3 1.1.3h1.5c.5 0 1-.2 1.3-.4.3-.2.5-.5.5-.9 0-.4-.2-.7-.5-.9-.3-.2-.7-.3-1-.3z"/></svg>
              </a>
              <a href="#" className="text-carwash-muted/60 hover:text-carwash-accent transition-colors data-magnetic" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
            <p className="text-carwash-muted/40 text-xs font-mono">
              Сделано с ❤️ на FORGE + THREE.JS + GSAP
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}