import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronUp } from 'lucide-react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const btnRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top -300',
        onEnter: () => setVisible(true),
        onLeaveBack: () => setVisible(false),
      })

      gsap.set(btnRef.current, { y: 20, opacity: 0 })
    }, btnRef)

    return () => ctx.revert()
  }, [])

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: false })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!visible) return null

  return (
    <motion.button
      ref={btnRef}
      onClick={scrollToTop}
      className="back-to-top fixed bottom-8 right-8 z-50 glass-water rounded-full p-3 data-magnetic"
      whileHover={{ scale: 1.1, rotate: 180 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-label="Наверх"
    >
      <ChevronUp className="w-6 h-6 text-carwash-accent" />
    </motion.button>
  )
}