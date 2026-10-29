import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const clamp = (v, min = -1, max = 1) => Math.min(max, Math.max(min, v))

export function SmoothScroll({ children, scrollRef }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // Пробрасываем инстанс наружу: App кладёт его в window.lenis для BackToTop
    if (scrollRef?.current) scrollRef.current._lenis = lenis

    // Эффект скорости: страница слегка «наклоняется» по направлению прокрутки
    const skewTarget = document.getElementById('main')
    const canSkew = window.matchMedia('(pointer: fine)').matches
    const MAX_SKEW = 2.6
    let skew = 0
    if (skewTarget) skewTarget.style.willChange = 'transform'

    let rafId = 0
    function raf(time) {
      lenis.raf(time)
      ScrollTrigger.update()

      if (skewTarget && canSkew) {
        const desired = clamp(lenis.velocity / 40) * MAX_SKEW
        skew += (desired - skew) * 0.12
        skewTarget.style.transform = Math.abs(skew) < 0.01 ? '' : `skewY(${skew.toFixed(3)}deg)`
      }

      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Sync with GSAP ScrollTrigger
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    })

    // Refresh ScrollTrigger on lenis scroll
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      cancelAnimationFrame(rafId)
      if (skewTarget) skewTarget.style.transform = ''
      if (scrollRef?.current) scrollRef.current._lenis = null
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div ref={scrollRef} className="relative">
      {children}
    </div>
  )
}