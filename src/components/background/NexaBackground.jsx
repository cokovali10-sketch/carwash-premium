import { useEffect, useRef } from 'react'
import { getDevice, budgetFor } from '../../nexa/device'
import { Scheduler } from '../../nexa/scheduler'
import { Adaptive } from '../../nexa/adaptive'
import { ParticleField } from '../../nexa/particles'
import { GlassCubeField } from '../../background/glassfield'

/**
 * NexaBackground — лёгкий 3D-фон на ядре NEXA Core:
 *  - стеклянное поле кубов (1 draw call), пролетает сквозь экран при прокрутке;
 *  - облако частиц (1 draw call), реагирует на курсор.
 * Adaptive сам держит FPS: при просадке режет частицы/кубы и pixelRatio.
 * Тяжёлый three.js-стек здесь больше не нужен.
 */
export function NexaBackground({ isMobile = false }) {
  const cubeRef = useRef(null)
  const dustRef = useRef(null)

  useEffect(() => {
    const cubeCanvas = cubeRef.current
    const dustCanvas = dustRef.current
    if (!cubeCanvas || !dustCanvas) return undefined

    const device = getDevice()
    const budget = budgetFor(device.tier)
    const adaptive = new Adaptive(device.tier)
    const scheduler = new Scheduler()

    let cubes = null
    let dust = null
    try {
      cubes = new GlassCubeField({ canvas: cubeCanvas, count: isMobile ? 90 : 260 })
      dust = new ParticleField({
        canvas: dustCanvas,
        count: Math.min(budget.particles, isMobile ? 6000 : 20000),
      })
    } catch (err) {
      console.warn('[nexa] WebGL недоступен, 3D-фон отключён:', err?.message || err)
      return undefined
    }

    const applyQuality = () => {
      const state = adaptive.state
      const pr = state.pixelRatio
      const w = window.innerWidth
      const h = window.innerHeight
      cubes.resize(w, h, pr)
      dust.resize(w, h, pr)
      const cubeMax = isMobile ? 90 : 260
      const cubeCount = state.particles >= 20000 ? cubeMax : state.particles >= 8000 ? Math.round(cubeMax * 0.7) : Math.round(cubeMax * 0.45)
      cubes.setQuality(cubeCount)
      dust.setQuality(state.particles)
    }

    adaptive.onChange = applyQuality
    applyQuality()

    const onResize = () => applyQuality()
    window.addEventListener('resize', onResize, { passive: true })

    let smooth = 0
    let last = performance.now()

    scheduler.add('nexa-bg', (dt) => {
      const now = performance.now()
      adaptive.tick(now - last)
      last = now

      const docH = document.documentElement.scrollHeight - window.innerHeight
      const p = docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0
      smooth += (p - smooth) * 0.12
      cubes.setScroll(smooth)

      dust.update(Math.min(dt, 0.05))
      cubes.render(now)
      dust.render()
    }, cubeCanvas)

    return () => {
      scheduler.remove('nexa-bg')
      window.removeEventListener('resize', onResize)
      adaptive.onChange = undefined
      cubes?.dispose()
      dust?.dispose()
    }
  }, [isMobile])

  return (
    <div className="nexa-bg" aria-hidden="true">
      <canvas ref={cubeRef} className="nexa-bg__layer nexa-bg__layer--glass" />
      <canvas ref={dustRef} className="nexa-bg__layer nexa-bg__layer--dust" />
    </div>
  )
}
