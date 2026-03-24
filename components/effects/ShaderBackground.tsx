'use client'

import { useEffect, useRef } from 'react'

const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform sampler2D uTex;
uniform float uTime;
out vec4 fragColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv.y = 1.0 - uv.y;
  vec3 col = texture(uTex, uv).rgb;
  col.r *= 1.05;
  col.b *= 0.95;
  vec2 center = uv - 0.5;
  float vignette = 1.0 - dot(center, center) * 0.8;
  col *= vignette;
  float grain = hash(gl_FragCoord.xy + uTime * 100.0) * 0.06 - 0.03;
  col += grain;
  fragColor = vec4(col, 1.0);
}`

function setupTexture(gl: WebGL2RenderingContext): WebGLTexture | null {
  const tex = gl.createTexture()
  if (!tex) return null
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return tex
}

interface Props {
  videoSrc: string
  className?: string
}

export function ShaderBackground({ videoSrc, className }: Props) {
  'use no memo'
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const canvas = document.createElement('canvas')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    container.appendChild(canvas)

    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false })
    if (!gl) {
      canvas.remove()
      return
    }

    const vs = gl.createShader(gl.VERTEX_SHADER)
    if (!vs) {
      canvas.remove()
      return
    }
    gl.shaderSource(vs, VERT)
    gl.compileShader(vs)
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      gl.deleteShader(vs)
      canvas.remove()
      return
    }
    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    if (!fs) {
      gl.deleteShader(vs)
      canvas.remove()
      return
    }
    gl.shaderSource(fs, FRAG)
    gl.compileShader(fs)
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      canvas.remove()
      return
    }
    const prog = gl.createProgram()
    if (!prog) {
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      canvas.remove()
      return
    }
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      canvas.remove()
      return
    }

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'position')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uResolution')
    const uTexLoc = gl.getUniformLocation(prog, 'uTex')
    const uTimeLoc = gl.getUniformLocation(prog, 'uTime')
    const tex = setupTexture(gl)
    if (!tex) {
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
      canvas.remove()
      return
    }

    let ready = false

    // Single video element — the previous dual-video crossfade doubled GPU
    // memory and network bandwidth for a subtle loop seam that is invisible
    // under the vignette + grain + 70% opacity overlay.
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.preload = 'metadata'
    video.src = videoSrc

    video.addEventListener(
      'canplay',
      () => {
        ready = true
        video.play()
      },
      { once: true },
    )
    video.load()

    // Alias gl.useProgram to avoid React Compiler mistaking it for a hook call
    const activateProgram = gl.useProgram.bind(gl)

    let alive = true
    let rafId = 0
    let paused = false
    const startTime = performance.now()
    let prevW = 0
    let prevH = 0
    let lastTime = -1

    // Pause rendering when tab is hidden to save GPU cycles
    const onVisChange = () => {
      paused = document.hidden
      if (!paused && alive) {
        rafId = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', onVisChange)

    const tick = () => {
      if (!alive || paused) return
      if (ready && canvas.clientWidth > 0) {
        // Background shader: cap DPR at 1.5 (blurred/vignetted content)
        const dpr = Math.min(devicePixelRatio, 1.5)
        const w = Math.round(canvas.clientWidth * dpr)
        const h = Math.round(canvas.clientHeight * dpr)
        if (w !== prevW || h !== prevH) {
          canvas.width = w
          canvas.height = h
          gl.viewport(0, 0, w, h)
          prevW = w
          prevH = h
        }
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        // Only upload texture when video frame has changed
        const curTime = video.currentTime
        if (curTime !== lastTime) {
          gl.activeTexture(gl.TEXTURE0)
          gl.bindTexture(gl.TEXTURE_2D, tex)
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
          lastTime = curTime
        }

        activateProgram(prog)
        gl.uniform2f(uRes, w, h)
        gl.uniform1i(uTexLoc, 0)
        gl.uniform1f(uTimeLoc, (performance.now() - startTime) / 1000)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        if (!container.dataset.rendered) container.dataset.rendered = 'true'
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
      document.removeEventListener('visibilitychange', onVisChange)
      video.pause()
      video.removeAttribute('src')
      video.load()
      canvas.remove()
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteTexture(tex)
      gl.deleteBuffer(buf)
    }
  }, [videoSrc])

  return <div ref={containerRef} className={className} />
}
