// NEXA Core v0.2 — фасад "чип". Одна строка на любом сайте:
//   Nexa.boot({ canvas: '#bg', particles: true, hud: true, profiler: true })
// Ядро само: тир, adaptive, единый цикл, GPU-бэкенд, стриминг, WASM-физика.

import { getDevice } from './device';
import { Scheduler } from './scheduler';
import { Adaptive } from './adaptive';
import { ParticleField } from './particles';
import { initGpu, applyResolution } from './gpu';
import { Profiler } from './profiler';
import { StreamQueue } from './stream';

export interface NexaOpts {
  canvas?: string | HTMLCanvasElement;
  particles?: boolean;
  hud?: boolean;
  profiler?: boolean;
  wasmUrl?: string;
}

export class Nexa {
  static async boot(opts: NexaOpts = {}): Promise<Nexa> {
    const device = getDevice();
    const scheduler = new Scheduler();
    const adaptive = new Adaptive(device.tier);
    const stream = StreamQueue.forTier(device.tier);
    const app = new Nexa(device.label, scheduler, adaptive);

    let field: ParticleField | null = null;
    let canvas: HTMLCanvasElement | null = null;

    if (opts.particles !== false) {
      canvas = typeof opts.canvas === 'string'
        ? document.querySelector(opts.canvas) as HTMLCanvasElement
        : (opts.canvas as HTMLCanvasElement) ?? Nexa.makeCanvas();
      if (canvas) {
        const gpu = await initGpu(canvas, adaptive.state.pixelRatio);
        (app as any).gpuApi = gpu.api;
        field = new ParticleField({ canvas, count: adaptive.state.particles });
        const fit = () => {
          applyResolution({ ...gpu, pixelRatio: adaptive.state.pixelRatio } as any, innerWidth, innerHeight, adaptive.state.pixelRatio);
          field!.resize(innerWidth, innerHeight, adaptive.state.pixelRatio);
        };
        fit(); addEventListener('resize', fit, { passive: true });
        adaptive.onChange = (s) => { field!.setQuality(s.particles); fit(); };
      }
    }

    let hud: HTMLElement | null = null;
    if (opts.hud) hud = Nexa.makeHud();
    let prof: Profiler | null = null;
    if (opts.profiler) prof = new Profiler();

    let last = performance.now();
    scheduler.add('nexa-core', (dt) => {
      const now = performance.now();
      adaptive.tick(now - last);
      const dtMs = now - last; last = now;
      field?.update(Math.min(dt, 0.05));
      field?.render();
      if (prof) { prof.drawCalls = 1; prof.triangles = (field?.activeCount ?? 0); prof.frame(dtMs, { api: (app as any).gpuApi ?? 'webgl', tier: device.label, level: adaptive.level, active: field?.activeCount ?? 0 }); }
      if (hud) hud.textContent = `${adaptive.fps.toFixed(0)} FPS · ${device.label} · L${adaptive.level} · ${(field?.activeCount ?? 0) / 1000}k✦ · q:${stream.pending}`;
    }, canvas ?? undefined);

    console.log(`%c⚡ NEXA Core v0.2 — ${device.label} (${device.cores} cores, GPU:${(app as any).gpuApi}) — мировой уровень`, 'color:#22d3ee;font-weight:bold');
    return app;
  }

  private static makeCanvas(): HTMLCanvasElement {
    const c = document.createElement('canvas');
    c.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:-1;pointer-events:none';
    document.body.prepend(c);
    return c;
  }

  private static makeHud(): HTMLElement {
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;font:12px/1.4 monospace;background:rgba(0,0,0,.6);color:#22d3ee;padding:6px 10px;border-radius:8px;border:1px solid #22d3ee44';
    document.body.appendChild(d);
    return d;
  }

  constructor(public tier: string, public scheduler: Scheduler, public adaptive: Adaptive) {}
}

export { getDevice } from './device';
export { compileProg, attrBuf, srand, palette, instanced, flat, fitCanvas, trackPointer } from './gl';
export { Scheduler } from './scheduler';
export { Adaptive } from './adaptive';
export { ParticleField } from './particles';
export { SmartLoader } from './loader';
export { initGpu } from './gpu';
export { PostFx } from './postfx';
export { Profiler } from './profiler';
export { StreamQueue } from './stream';
export { ModelManager, loadGltf } from './models';
export { Atlas } from './textures';
export { createPhysics, JsPhysics } from './physics';
export { Scene } from './scene';
export { Design, THEMES } from './design';
export { planMigration, adoptLoop } from './migrate';
export { decimate, weld } from './decimate';
export { detectCompressed, pickTextureUrl } from './ktx2';
export { createWorkerPhysics } from './physics-worker';
export { GLCubeField } from './gl3d';
export { GLModelLayer } from './glmodel';
export { GLVoxelField } from './glvoxels';
