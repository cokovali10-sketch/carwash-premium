/**
 * Performance Tier Detection - Adapted from webcraft
 * Auto-detects device capabilities for adaptive quality
 */

const LOW_GPU_PATTERN = /(adreno|mali|powervr|videotoolbox|swiftshader|llvmpipe|software|angle \(google|angle \(microsoft)/i
const MOBILE_UA_PATTERN = /(android|iphone|ipad|ipod|mobile|samsung|huawei|xiaomi|redmi|oppo|vivo|pixel)/i

function probeRenderer() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return ''
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    return ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ''
  } catch {
    return ''
  }
}

export function detectPerformanceTier() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : ''
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  const touchPoints = navigator.maxTouchPoints || 0

  const isMobileUA = MOBILE_UA_PATTERN.test(ua)
  const renderer = probeRenderer()
  const weakGPU = LOW_GPU_PATTERN.test(renderer)
  const weakHardware = touchPoints > 1 && (cores <= 4 || memory <= 4)
  const noWebGL = !renderer

  const low = isMobileUA || weakGPU || weakHardware || noWebGL

  if (import.meta.env.DEV) {
    console.log(
      '[carwash] Performance tier:',
      low ? 'LOW (adaptive quality)' : 'HIGH (ultra quality)',
      `| GPU: ${renderer || 'unknown'} | cores: ${cores} | memory: ${memory}GB | mobile: ${isMobileUA}`
    )
  }

  return {
    tier: low ? 'low' : 'high',
    isMobile: isMobileUA || touchPoints > 1,

    // Post-processing
    postFX: !low && memory >= 6,
    postFXScale: low ? 0.5 : 0.8,

    // Pixel density
    dpr: low ? [0.75, 1.0] : [1, 1.5],

    // Target FPS
    targetFPS: low ? 30 : 60,

    // Particle counts
    waterParticles: low ? 600 : 1500,
    foamParticles: low ? 150 : 400,
    ambientParticles: low ? 200 : 800,
    splashParticles: low ? 80 : 200,
    mistParticles: low ? 300 : 800,

    // Water quality
    waterSegments: low ? 64 : 128,
    waterSimResolution: low ? 128 : 256,

    // Geometry detail
    carLOD: low ? 'low' : 'high',
    foamDetail: low ? 'low' : 'high',

    // Effects
    enableCaustics: !low,
    enableRefraction: !low && memory >= 8,
    enableSSR: !low && memory >= 8,
    enableBloom: !low && memory >= 6,
  }
}

export const PERF = detectPerformanceTier()