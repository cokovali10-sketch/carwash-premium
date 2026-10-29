/**
 * Car Wash 3D Scene Configuration
 * Water, foam, and car-themed parameters
 */
export const SCENE = {
  colors: {
    background: '#030712',
    water: '#0ea5e9',
    waterLight: '#38bdf8',
    waterDeep: '#0369a1',
    foam: '#f0fdf4',
    foamMuted: '#dcfce7',
    accent: '#06b6d4',
    accentWarm: '#22d3ee',
    metal: '#1e293b',
    chrome: '#94a3b8',
  },

  camera: {
    fov: 50,
    near: 0.1,
    far: 100,
    position: [0, 1.5, 8],
    target: [0, 0.5, 0],
  },

  lights: {
    ambient: { intensity: 0.8, color: '#ffffff' },
    key: { position: [8, 10, 6], intensity: 3.2, color: '#ffffff' },
    fill: { position: [-6, 4, 4], intensity: 1.2, color: '#38bdf8' },
    rim: { position: [-4, 6, -8], intensity: 3, color: '#06b6d4' },
    waterCaustic: { position: [0, 15, 0], intensity: 1.5, color: '#0ea5e9' },
  },

  water: {
    // Water surface
    size: 40,
    segments: 128,
    waveSpeed: 0.8,
    waveAmplitude: 0.15,
    waveFrequency: 0.5,
    // Droplets
    dropletCount: 150,
    dropletSize: { min: 0.02, max: 0.08 },
    dropletSpeed: { min: 0.5, max: 2 },
    // Foam
    foamCount: 300,
    foamSize: { min: 0.05, max: 0.3 },
    foamLifetime: { min: 3, max: 8 },
  },

  car: {
    // Car model settings
    modelPath: '/models/car.glb',
    useDraco: false,
    targetSize: 4.5,
    position: [0, 0.2, 0],
    rotation: [0, -Math.PI / 6, 0],
    // Paint material — насыщенный металлик, чтобы авто читалось на тёмном фоне
    paintColor: '#0e7fc0',
    paintMetalness: 0.75,
    paintRoughness: 0.22,
    paintClearcoat: 1.0,
    paintClearcoatRoughness: 0.05,
    // Вращение авто при прокрутке страницы (радианы на полный скролл)
    scrollRotation: Math.PI * 0.9,
    // Windows
    windowTint: '#061628',
    windowOpacity: 0.3,
    windowMetalness: 0.1,
    windowRoughness: 0.05,
    // Chrome accents
    chromeColor: '#e2e8f0',
    chromeMetalness: 1.0,
    chromeRoughness: 0.02,
  },

  particles: {
    // Ambient water particles
    ambientCount: 500,
    ambientSize: 0.02,
    ambientSpeed: 0.3,
    // Splash particles
    splashCount: 200,
    splashSize: { min: 0.03, max: 0.1 },
    splashVelocity: 5,
    splashGravity: -9.8,
    // Mist
    mistCount: 800,
    mistSize: 0.15,
    mistOpacity: 0.15,
  },

  mobile: {
    breakpoint: 768,
    scaleFactor: 0.7,
    fov: 60,
    cameraZ: 12,
    particleReduction: 0.4,
    waterSegments: 64,
    parallaxFactor: 0.5,
  },

  // Animation timings
  animation: {
    carEntry: 2.5,
    waterRise: 2.0,
    foamAppear: 1.5,
    dropletStart: 1.0,
    scrollParallax: 0.5,
    hoverTransition: 0.6,
  },
}