import { useEffect, useRef, useState } from 'react'

const HOVER_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-magnetic]'

export function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)

  const pos = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const target = useRef({ x: -100, y: -100 })
  const pressed = useRef(false)
  const hovering = useRef(false)
  const rafRef = useRef(null)

  useEffect(() => {
    setEnabled(window.matchMedia('(pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ringEl = ringRef.current
    if (!dot || !ringEl) return

    const onMove = (e) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
      setVisible(true)
    }
    const onDown = () => { pressed.current = true }
    const onUp = () => { pressed.current = false }
    const onOver = (e) => {
      hovering.current = !!(e.target instanceof Element && e.target.closest(HOVER_SELECTOR))
    }
    const onWindowLeave = () => setVisible(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onWindowLeave)

    let hoverClassApplied = false

    const animate = () => {
      // Точка — быстрая, кольцо — с инерцией
      pos.current.x += (target.current.x - pos.current.x) * 0.4
      pos.current.y += (target.current.y - pos.current.y) * 0.4
      ring.current.x += (target.current.x - ring.current.x) * 0.16
      ring.current.y += (target.current.y - ring.current.y) * 0.16

      const scale = pressed.current ? 0.7 : hovering.current ? 1.8 : 1

      dot.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`
      ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${scale})`

      if (hoverClassApplied !== hovering.current) {
        ringEl.classList.toggle('active', hovering.current)
        hoverClassApplied = hovering.current
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOver)
      document.documentElement.removeEventListener('mouseleave', onWindowLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={ringRef} className="custom-cursor__ring" style={{ opacity: visible ? 1 : 0 }} aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor__dot" style={{ opacity: visible ? 1 : 0 }} aria-hidden="true" />
    </>
  )
}
