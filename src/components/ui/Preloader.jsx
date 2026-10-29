import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef(null)
  const barRef = useRef(null)
  const textRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    // Create canvas for particle animation
    const canvas = document.createElement('canvas')
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1'
    containerRef.current?.appendChild(canvas)
    
    const ctx = canvas.getContext('2d')
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Particle system
    const particles = []
    const particleCount = 80
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        hue: 190 + Math.random() * 30,
      })
    }
    particlesRef.current = particles

    let lastTime = 0
    const animate = (time) => {
      const dt = (time - lastTime) / 1000
      lastTime = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.vx * dt * 60
        p.y += p.vy * dt * 60

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.opacity})`
        ctx.fill()

        // Connections
        particles.forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${0.1 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    // Simulate loading progress
    let currentProgress = 0
    const loadingInterval = setInterval(() => {
      currentProgress += Math.random() * 18 + 12
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(loadingInterval)
        
        // Complete animation
        gsap.to(barRef.current, {
          scaleX: 1,
          duration: 0.5,
          ease: 'power2.out',
        })
        gsap.to(textRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          delay: 0.3,
        })
        
        setTimeout(() => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => setLoaded(true),
          })
        }, 500)
      }
      setProgress(currentProgress)
    }, 140)

    // Audio unlock on first interaction
    const unlockAudio = () => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      if (audioCtx.state === 'suspended') audioCtx.resume()
      document.removeEventListener('click', unlockAudio)
      document.removeEventListener('keydown', unlockAudio)
    }
    document.addEventListener('click', unlockAudio, { once: true })
    document.addEventListener('keydown', unlockAudio, { once: true })

    return () => {
      clearInterval(loadingInterval)
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      canvas.remove()
      document.removeEventListener('click', unlockAudio)
      document.removeEventListener('keydown', unlockAudio)
    }
  }, [])

  if (loaded) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-carwash-bgDeep"
      role="status"
      aria-label="Загрузка сайта"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-carwash-accent/10 via-transparent to-carwash-accentLight/10" />
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo/Animation */}
        <div className="relative">
          <motion.div
            className="w-24 h-24 rounded-forge bg-gradient-to-br from-carwash-accent to-carwash-accentLight flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <svg className="w-12 h-12 text-carwash-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20M12 2a10 10 0 100 20M12 2a10 10 0 110 20" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 12h20" />
            </svg>
          </motion.div>
          
          {/* Pulsing rings */}
          <motion.div
            className="absolute inset-0 rounded-forge border-2 border-carwash-accent/30"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 rounded-forge border-2 border-carwash-accentLight/30"
            animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
          />
        </div>

        {/* Progress Bar */}
        <div className="w-80 h-2 bg-carwash-border/30 rounded-full overflow-hidden">
          <motion.div
            ref={barRef}
            className="h-full bg-gradient-to-r from-carwash-accent to-carwash-accentLight rounded-full"
            style={{ transformOrigin: 'left center', scaleX: progress / 100 }}
          />
        </div>

        {/* Progress Text */}
        <motion.span
          ref={textRef}
          className="font-mono text-lg text-carwash-accent tabular-nums"
        >
          {Math.round(progress)}%
        </motion.span>

        {/* Loading messages */}
        <motion.p
          className="text-carwash-muted/60 text-sm max-w-md text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Загружаем 3D-сцену и стеклянный фон...
        </motion.p>
      </div>

      {/* Bottom credits */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-carwash-muted/40 text-xs font-mono">
        AQUA PREMIUM · FORGE WEB STUDIO · THREE.JS · GSAP
      </div>
    </div>
  )
}