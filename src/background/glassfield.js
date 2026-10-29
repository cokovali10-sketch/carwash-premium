// Стеклянное кристаллическое поле.
// Инстансированные кубы: 1 draw call на всю сцену, вращение и пролёт по глубине
// считаются В ШЕЙДЕРЕ — CPU в кадре не делает ничего.
// Построено на хелперах ядра NEXA Core (compileProg / attrBuf / instanced / srand / palette / trackPointer).
import { compileProg, attrBuf, instanced, srand, palette, trackPointer } from '../nexa/gl'

const VS = `
attribute vec3 a_v;
attribute vec3 a_n;
attribute vec3 a_p;
attribute vec3 a_c;
attribute vec2 a_rr; // x = базовый угол, y = скорость вращения
attribute vec2 a_se; // x = масштаб, y = фаза качания
uniform float u_time;
uniform float u_aspect;
uniform float u_scroll;
uniform float u_mx;
uniform float u_my;
uniform float u_fov;
varying vec3 v_c;
varying float v_fres;
varying float v_depth;

void main(){
  float a = a_rr.x + u_time * a_rr.y + u_scroll * 1.6;
  float ca = cos(a), sa = sin(a);
  vec3 v = vec3(a_v.x * ca + a_v.z * sa, a_v.y, -a_v.x * sa + a_v.z * ca) * a_se.x;
  vec3 n = normalize(vec3(a_n.x * ca + a_n.z * sa, a_n.y, -a_n.x * sa + a_n.z * ca));

  // Пролёт сквозь поле при прокрутке: z уходит вперёд и зацикливается
  float z = mod(a_p.z - u_scroll * 13.0 - 2.0, 7.0) + 2.5;
  float spread = 7.5 - z;

  float bob = sin(u_time * 0.7 + a_se.y) * 0.3;
  vec3 wp = vec3(
    v.x + a_p.x + u_mx * 0.16 * spread,
    v.y + a_p.y + bob + u_my * 0.12 * spread,
    v.z + z
  );

  float persp = u_fov / max(wp.z, 0.6);
  gl_Position = vec4(wp.x * persp / u_aspect, wp.y * persp, 0.0, 1.0);

  vec3 V = normalize(-wp);
  v_fres = pow(1.0 - abs(dot(n, V)), 2.0);
  v_c = a_c;
  v_depth = clamp(spread / 7.5, 0.0, 1.0);
}`

const FS = `
precision mediump float;
varying vec3 v_c;
varying float v_fres;
varying float v_depth;
void main(){
  float rim = v_fres;
  vec3 col = v_c * (0.20 + rim * 1.6);
  col += vec3(0.55, 0.85, 1.0) * pow(rim, 3.0) * 1.1; // яркая стеклянная кромка
  float alpha = 0.10 + rim * 0.9;
  alpha *= mix(0.25, 1.0, v_depth); // дальние кристаллы тают в дымке
  gl_FragColor = vec4(col, alpha);
}`

// Куб: 36 вершин (12 треугольников) — позиции и нормали
function cubeGeo() {
  const F = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]
  const v = [], n = []
  const quad = (a, b, c, d, fn) => {
    for (const p of [a, b, c, a, c, d]) {
      v.push(p[0] * 0.5, p[1] * 0.5, p[2] * 0.5)
      n.push(fn[0], fn[1], fn[2])
    }
  }
  quad([1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, -1], F[0])
  quad([-1, 1, -1], [-1, -1, -1], [-1, -1, 1], [-1, 1, 1], F[1])
  quad([-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1], F[2])
  quad([-1, -1, 1], [1, -1, 1], [1, -1, -1], [-1, -1, -1], F[3])
  quad([-1, 1, 1], [1, 1, 1], [1, -1, 1], [-1, -1, 1], F[4])
  quad([1, 1, -1], [-1, 1, -1], [-1, -1, -1], [1, -1, -1], F[5])
  return { v: new Float32Array(v), n: new Float32Array(n) }
}

export class GlassCubeField {
  constructor({ canvas, count = 220 }) {
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: true,
      depth: false,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    })
    if (!gl) throw new Error('WebGL not supported')

    this.canvas = canvas
    this.gl = gl
    this.maxCount = count
    this.activeCount = count
    this.scroll = 0
    this.mx = 0
    this.my = 0

    this.prog = compileProg(gl, VS, FS)
    gl.useProgram(this.prog)

    const { v, n } = cubeGeo()
    const B = (loc, size, data) => attrBuf(gl, this.prog, loc, size, data)
    B('a_v', 3, v)
    B('a_n', 3, n)
    B('a_p', 3, instanced(count, 36, 3, (i) => [srand(i, 1) * 2 - 1, srand(i, 2) * 2 - 1, 2.5 + srand(i, 3) * 5]))
    B('a_c', 3, instanced(count, 36, 3, palette))
    B('a_rr', 2, instanced(count, 36, 2, (i) => [srand(i, 6) * 6.28, 0.25 + srand(i, 7) * 0.9]))
    B('a_se', 2, instanced(count, 36, 2, (i) => [0.85 + srand(i, 8) * 1.7, srand(i, 9) * 6.28]))

    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE) // аддитивное стекло — не требует сортировки

    trackPointer(canvas, (x, y) => { this.mx = x; this.my = y })

    this._u = {}
    for (const name of ['u_time', 'u_aspect', 'u_scroll', 'u_mx', 'u_my', 'u_fov']) {
      this._u[name] = gl.getUniformLocation(this.prog, name)
    }
  }

  resize(w, h, pr) {
    const c = this.canvas
    c.width = Math.max(1, Math.floor(w * pr))
    c.height = Math.max(1, Math.floor(h * pr))
    this.gl.viewport(0, 0, c.width, c.height)
  }

  setQuality(n) { this.activeCount = Math.max(0, Math.min(n | 0, this.maxCount)) }
  setScroll(p) { this.scroll = p }

  render(time) {
    const gl = this.gl, u = this._u
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    if (this.activeCount <= 0) return
    gl.useProgram(this.prog)
    gl.uniform1f(u.u_time, time / 1000)
    gl.uniform1f(u.u_aspect, this.canvas.width / Math.max(this.canvas.height, 1))
    gl.uniform1f(u.u_scroll, this.scroll)
    gl.uniform1f(u.u_mx, this.mx * 0.15)
    gl.uniform1f(u.u_my, this.my * 0.15)
    gl.uniform1f(u.u_fov, 1.35)
    gl.drawArrays(gl.TRIANGLES, 0, this.activeCount * 36)
  }

  dispose() {
    const gl = this.gl
    if (!gl) return
    gl.deleteProgram(this.prog)
    this.gl = null
  }
}
