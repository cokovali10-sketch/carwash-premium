import { useEffect, useRef } from 'react'

/**
 * ScrollProgress — светящаяся полоса прогресса прокрутки вверху страницы.
 * Полоса растёт через scaleX (без layout), «комета» едет через transform.
 */
export function ScrollProgress() {
  const fillRef = useRef(null)
  const headRef = useRef(null)

  useEffect(() => {
    let raf = 0
    let smooth = 0
    let viewport = window.innerWidth

    const onResize = () => { viewport = window.innerWidth }
    window.addEventListener('resize', onResize)

    const loop = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight
      const p = docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0
      smooth += (p - smooth) * 0.16

      if (fillRef.current) fillRef.current.style.transform = `scaleX(${smooth})`
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${smooth * viewport}px, -50%, 0)`
        headRef.current.style.opacity = smooth > 0.002 ? '1' : '0'
      }

      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden="true">
      {/* Трек */}
      <div className="absolute inset-0 bg-white/5" />
      {/* Заполнение */}
      <div
        ref={fillRef}
        className="absolute inset-0 origin-left bg-gradient-to-r from-carwash-accent via-carwash-accentLight to-white"
        style={{ transform: 'scaleX(0)', willChange: 'transform', boxShadow: '0 0 12px rgba(56,189,248,0.8)' }}
      />
      {/* Комета-голова */}
      <div
        ref={headRef}
        className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white"
        style={{
          transform: 'translate3d(0, -50%, 0)',
          opacity: 0,
          willChange: 'transform',
          boxShadow: '0 0 14px 3px rgba(125,211,252,0.9), 0 0 30px 8px rgba(56,189,248,0.45)',
        }}
      />
    </div>
  )
}
