"use client"

import { useEffect, useRef } from "react"

const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uMix;
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
  vec3 colA = texture(uTexA, uv).rgb;
  vec3 colB = texture(uTexB, uv).rgb;
  vec3 col = mix(colA, colB, uMix);
  col.r *= 1.05;
  col.b *= 0.95;
  vec2 center = uv - 0.5;
  float vignette = 1.0 - dot(center, center) * 0.8;
  col *= vignette;
  float grain = hash(gl_FragCoord.xy + uTime * 100.0) * 0.06 - 0.03;
  col += grain;
  fragColor = vec4(col, 1.0);
}`

function setupTexture(gl: WebGL2RenderingContext): WebGLTexture {
  const tex = gl.createTexture()!
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
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const canvas = document.createElement("canvas")
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.display = "block"
    container.appendChild(canvas)

    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: false })
    if (!gl) return

    const vs = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vs, VERT)
    gl.compileShader(vs)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, FRAG)
    gl.compileShader(fs)
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Shader frag:", gl.getShaderInfoLog(fs))
      return
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Shader link:", gl.getProgramInfoLog(prog))
      return
    }

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "position")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, "uResolution")
    const uTexALoc = gl.getUniformLocation(prog, "uTexA")
    const uTexBLoc = gl.getUniformLocation(prog, "uTexB")
    const uMixLoc = gl.getUniformLocation(prog, "uMix")
    const uTimeLoc = gl.getUniformLocation(prog, "uTime")
    const texA = setupTexture(gl)
    const texB = setupTexture(gl)

    let ready = false
    let duration = 8
    const FADE = 0.6

    const makeVid = (url: string) => {
      const v = document.createElement("video")
      v.crossOrigin = "anonymous"
      v.loop = true
      v.muted = true
      v.playsInline = true
      v.preload = "auto"
      v.src = url
      return v
    }
    const videoA = makeVid(videoSrc)
    const videoB = makeVid(videoSrc)

    let loaded = 0
    const onReady = () => {
      loaded++
      if (loaded < 2) return
      ready = true
      duration = videoA.duration || 8
      videoA.play()
      videoB.currentTime = FADE
      videoB.play()
    }
    videoA.addEventListener("canplay", onReady, { once: true })
    videoB.addEventListener("canplay", onReady, { once: true })
    videoA.load()
    videoB.load()

    let alive = true
    let rafId = 0
    const startTime = performance.now()

    const tick = () => {
      if (!alive) return
      if (ready && canvas.clientWidth > 0) {
        const dpr = Math.min(devicePixelRatio, 2)
        const w = canvas.clientWidth * dpr
        const h = canvas.clientHeight * dpr
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        let mix = 0
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texA)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoA)
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, texB)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoB)

        const t = videoA.currentTime
        if (t > duration - FADE) mix = (t - (duration - FADE)) / FADE
        else if (t < FADE) mix = 1 - t / FADE
        mix = Math.max(0, Math.min(1, mix))

        gl.useProgram(prog)
        gl.uniform2f(uRes, w, h)
        gl.uniform1i(uTexALoc, 0)
        gl.uniform1i(uTexBLoc, 1)
        gl.uniform1f(uMixLoc, mix)
        gl.uniform1f(uTimeLoc, (performance.now() - startTime) / 1000)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        if (!container.dataset.rendered) container.dataset.rendered = "true"
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
      for (const v of [videoA, videoB]) {
        v.pause()
        v.src = ""
      }
      canvas.remove()
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteTexture(texA)
      gl.deleteTexture(texB)
      gl.deleteBuffer(buf)
    }
  }, [videoSrc])

  return <div ref={containerRef} className={className} />
}
