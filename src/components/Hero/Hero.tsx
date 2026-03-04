'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import styles from './Hero.module.css'

/* ─── Types ──────────────────────────────────────────────── */

interface Detection {
  id: number
  x: number
  y: number
  w: number
  h: number
  label: string
  confidence: number
  color: string
  phase: 'drawing' | 'labeled' | 'fading'
  progress: number
  opacity: number
  age: number
}

interface ExcludeRect {
  left: number
  right: number
}

/* ─── Constants ──────────────────────────────────────────── */

const DETECTION_LABELS = [
  'DEFECT',
  'SCRATCH',
  'WELD_GAP',
  'BURR',
  'CRACK',
  'CONTAM',
  'MISMATCH',
]

const DETECTION_COLORS = ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7']

/* ─── Dot Grid Canvas ────────────────────────────────────── */

function drawDotGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tick: number,
  exclude?: ExcludeRect,
) {
  ctx.clearRect(0, 0, width, height)

  if (exclude) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, exclude.left, height)
    ctx.rect(exclude.right, 0, width - exclude.right, height)
    ctx.clip()
  }

  const spacing = 28
  const cols = Math.ceil(width / spacing)
  const rows = Math.ceil(height / spacing)

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const x = col * spacing
      const y = row * spacing
      const wave = Math.sin((col + row) * 0.3 + tick * 0.02) * 0.5 + 0.5
      const alpha = 0.06 + wave * 0.08

      ctx.beginPath()
      ctx.arc(x, y, 1, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`
      ctx.fill()
    }
  }

  if (exclude) ctx.restore()
}

/* ─── CV Inference Canvas ────────────────────────────────── */

function drawCVCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  detections: Detection[],
  tick: number,
  exclude?: ExcludeRect,
) {
  ctx.clearRect(0, 0, width, height)

  if (exclude) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, exclude.left, height)
    ctx.rect(exclude.right, 0, width - exclude.right, height)
    ctx.clip()
  }

  // Subtle scan line
  const scanY = ((tick * 1.5) % (height + 40)) - 20
  const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20)
  scanGrad.addColorStop(0, 'rgba(245, 158, 11, 0)')
  scanGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.06)')
  scanGrad.addColorStop(1, 'rgba(245, 158, 11, 0)')
  ctx.fillStyle = scanGrad
  ctx.fillRect(0, scanY - 20, width, 40)

  // Crosshair reticle — center it in the right side band
  const cx = exclude ? exclude.right + (width - exclude.right) / 2 : width / 2
  const cy = height / 2
  const reticleSize = 20
  const reticleAlpha = 0.25 + Math.sin(tick * 0.05) * 0.1
  ctx.strokeStyle = `rgba(245, 158, 11, ${reticleAlpha})`
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(cx - reticleSize - 8, cy)
  ctx.lineTo(cx - 4, cy)
  ctx.moveTo(cx + 4, cy)
  ctx.lineTo(cx + reticleSize + 8, cy)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, cy - reticleSize - 8)
  ctx.lineTo(cx, cy - 4)
  ctx.moveTo(cx, cy + 4)
  ctx.lineTo(cx, cy + reticleSize + 8)
  ctx.stroke()
  ctx.setLineDash([])

  // Corner brackets around reticle
  const bracketSize = 12
  ctx.strokeStyle = `rgba(245, 158, 11, ${reticleAlpha * 0.7})`
  const corners = [
    [cx - reticleSize, cy - reticleSize],
    [cx + reticleSize, cy - reticleSize],
    [cx + reticleSize, cy + reticleSize],
    [cx - reticleSize, cy + reticleSize],
  ] as [number, number][]
  corners.forEach(([bx, by], i) => {
    const dx = i === 0 || i === 3 ? bracketSize : -bracketSize
    const dy = i === 0 || i === 1 ? bracketSize : -bracketSize
    ctx.beginPath()
    ctx.moveTo(bx + dx, by)
    ctx.lineTo(bx, by)
    ctx.lineTo(bx, by + dy)
    ctx.stroke()
  })

  // Draw detections
  for (const det of detections) {
    const { x, y, w, h, label, confidence, color, phase, progress, opacity } = det

    if (opacity <= 0) continue

    const alpha = opacity
    const drawProgress = phase === 'drawing' ? progress : 1

    ctx.strokeStyle = color.replace(')', `, ${alpha})`).replace('rgb', 'rgba')
    ctx.lineWidth = 1.5
    ctx.setLineDash([])

    const perimeter = 2 * (w + h)
    const drawn = drawProgress * perimeter

    const topLen = Math.min(drawn, w)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + topLen, y)
    ctx.stroke()

    if (drawn > w) {
      const rightLen = Math.min(drawn - w, h)
      ctx.beginPath()
      ctx.moveTo(x + w, y)
      ctx.lineTo(x + w, y + rightLen)
      ctx.stroke()
    }
    if (drawn > w + h) {
      const bottomLen = Math.min(drawn - w - h, w)
      ctx.beginPath()
      ctx.moveTo(x + w, y + h)
      ctx.lineTo(x + w - bottomLen, y + h)
      ctx.stroke()
    }
    if (drawn > 2 * w + h) {
      const leftLen = Math.min(drawn - 2 * w - h, h)
      ctx.beginPath()
      ctx.moveTo(x, y + h)
      ctx.lineTo(x, y + h - leftLen)
      ctx.stroke()
    }

    if (drawProgress > 0.5 && phase !== 'drawing') {
      ctx.font = `500 10px var(--font-ibm-plex-mono, monospace)`
      const labelText = `${label} ${(confidence * 100).toFixed(0)}%`
      const textW = ctx.measureText(labelText).width
      ctx.fillStyle = `rgba(10, 10, 10, ${alpha * 0.8})`
      ctx.fillRect(x, y - 18, textW + 8, 16)
      ctx.fillStyle = color.replace(')', `, ${alpha})`).replace('rgb', 'rgba')
      ctx.fillText(labelText, x + 4, y - 6)
    }

    if (phase === 'labeled') {
      const bsz = 6
      ctx.strokeStyle = color.replace(')', `, ${alpha * 0.6})`).replace('rgb', 'rgba')
      ctx.lineWidth = 1
      ;[
        [x, y, bsz, bsz],
        [x + w, y, -bsz, bsz],
        [x + w, y + h, -bsz, -bsz],
        [x, y + h, bsz, -bsz],
      ].forEach(([bx, by, dx, dy]) => {
        ctx.beginPath()
        ctx.moveTo(bx + dx, by)
        ctx.lineTo(bx, by)
        ctx.lineTo(bx, by + dy)
        ctx.stroke()
      })
    }
  }

  // HUD overlay text — left band bottom-left, right band bottom-right
  ctx.font = `400 9px var(--font-ibm-plex-mono, monospace)`
  const hudAlpha = 0.35
  ctx.fillStyle = `rgba(245, 158, 11, ${hudAlpha})`
  ctx.fillText(
    `INFERENCE  ${(tick % 1000).toString().padStart(6, '0')}`,
    10,
    height - 28,
  )
  ctx.fillText(
    `DETECTIONS  ${detections.filter((d) => d.phase === 'labeled').length.toString().padStart(3, '0')}`,
    10,
    height - 14,
  )
  ctx.fillStyle = `rgba(34, 197, 94, ${hudAlpha})`
  ctx.fillText('● LIVE', width - 44, height - 14)

  if (exclude) ctx.restore()
}

/* ─── Hero Component ─────────────────────────────────────── */

export default function Hero() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)
  const cvCanvasRef = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const excludeRectRef = useRef<ExcludeRect | undefined>(undefined)
  const detectionsRef = useRef<Detection[]>([])
  const tickRef = useRef(0)
  const nextIdRef = useRef(0)
  const frameRef = useRef<number>(0)

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  /* ─── Canvas Setup ──────────────────────────────────── */

  const spawnDetection = useCallback(
    (width: number, height: number, exclude?: ExcludeRect) => {
      const edgeMargin = 16
      const minDetW = 40

      // Build list of horizontal bands (left side, right side of content)
      const zones: Array<{ minX: number; maxX: number }> = []

      const leftBandW = (exclude?.left ?? 0) - edgeMargin
      if (leftBandW >= minDetW) {
        zones.push({ minX: edgeMargin, maxX: (exclude?.left ?? 0) - edgeMargin })
      }

      const rightBandW = exclude ? width - exclude.right - edgeMargin : 0
      if (rightBandW >= minDetW) {
        zones.push({ minX: exclude!.right + edgeMargin, maxX: width - edgeMargin })
      }

      // Fallback: no exclude set yet, spawn anywhere
      if (zones.length === 0) {
        zones.push({ minX: edgeMargin, maxX: width - edgeMargin })
      }

      const zone = zones[Math.floor(Math.random() * zones.length)]
      const bandW = zone.maxX - zone.minX

      // Clamp detection width to the available band
      const w = Math.min(40 + Math.random() * 120, bandW - 8)
      const h = 28 + Math.random() * 80
      const x = zone.minX + Math.random() * Math.max(0, bandW - w)
      const y = edgeMargin + Math.random() * Math.max(0, height - h - edgeMargin * 2)

      const color = DETECTION_COLORS[Math.floor(Math.random() * DETECTION_COLORS.length)]
      const label = DETECTION_LABELS[Math.floor(Math.random() * DETECTION_LABELS.length)]
      const confidence = 0.72 + Math.random() * 0.27

      detectionsRef.current = [
        ...detectionsRef.current,
        {
          id: nextIdRef.current++,
          x,
          y,
          w,
          h,
          label,
          confidence,
          color,
          phase: 'drawing',
          progress: 0,
          opacity: 1,
          age: 0,
        },
      ]

      if (detectionsRef.current.length > 6) {
        detectionsRef.current = detectionsRef.current.slice(-6)
      }
    },
    [],
  )

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current
    const cvCanvas = cvCanvasRef.current
    if (!bgCanvas || !cvCanvas) return

    const bgCtx = bgCanvas.getContext('2d')
    const cvCtx = cvCanvas.getContext('2d')
    if (!bgCtx || !cvCtx) return

    const updateExcludeRect = (canvasRect: DOMRect) => {
      const contentEl = contentRef.current
      if (!contentEl) return
      const contentRect = contentEl.getBoundingClientRect()
      excludeRectRef.current = {
        left: Math.max(0, contentRect.left - canvasRect.left),
        right: Math.min(canvasRect.width, contentRect.right - canvasRect.left),
      }
    }

    const resize = () => {
      const canvasRect = bgCanvas.getBoundingClientRect()
      const { width, height } = canvasRect
      const dpr = window.devicePixelRatio || 1

      bgCanvas.width = width * dpr
      bgCanvas.height = height * dpr
      bgCtx.scale(dpr, dpr)
      bgCanvas.style.width = `${width}px`
      bgCanvas.style.height = `${height}px`

      cvCanvas.width = width * dpr
      cvCanvas.height = height * dpr
      cvCtx.scale(dpr, dpr)
      cvCanvas.style.width = `${width}px`
      cvCanvas.style.height = `${height}px`

      updateExcludeRect(canvasRect)
    }

    resize()
    window.addEventListener('resize', resize)

    let spawnCooldown = 0

    const animate = () => {
      const tick = tickRef.current++
      const canvasRect = bgCanvas.getBoundingClientRect()
      const w = canvasRect.width
      const h = canvasRect.height
      const exclude = excludeRectRef.current

      drawDotGrid(bgCtx, w, h, tick, exclude)

      const DRAW_SPEED = 0.045
      const LABEL_DURATION = 90
      const FADE_SPEED = 0.025

      detectionsRef.current = detectionsRef.current
        .map((det) => {
          const updated = { ...det, age: det.age + 1 }
          if (updated.phase === 'drawing') {
            updated.progress = Math.min(1, updated.progress + DRAW_SPEED)
            if (updated.progress >= 1) updated.phase = 'labeled'
          } else if (updated.phase === 'labeled') {
            if (updated.age > LABEL_DURATION) updated.phase = 'fading'
          } else {
            updated.opacity = Math.max(0, updated.opacity - FADE_SPEED)
          }
          return updated
        })
        .filter((d) => d.opacity > 0)

      spawnCooldown--
      if (spawnCooldown <= 0 && detectionsRef.current.length < 5) {
        spawnDetection(w, h, exclude)
        spawnCooldown = 40 + Math.floor(Math.random() * 60)
      }

      drawCVCanvas(cvCtx, w, h, detectionsRef.current, tick, exclude)

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [spawnDetection])

  /* ─── Email Submit ──────────────────────────────────── */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  /* ─── Render ────────────────────────────────────────── */

  return (
    <section className={styles.hero} id="hero">
      {/* Canvas layers */}
      <canvas ref={bgCanvasRef} className={styles.bgCanvas} aria-hidden="true" />
      <canvas ref={cvCanvasRef} className={styles.cvCanvas} aria-hidden="true" />

      {/* Gradient vignette */}
      <div className={styles.vignette} aria-hidden="true" />

      <div ref={contentRef} className={`container ${styles.content}`}>
        <div className={styles.badge}>
          <span className="tag">Vision AI</span>
          <span className={styles.badgeText}>For Manufacturers</span>
        </div>

        <h1 className={styles.headline}>
          <span className={styles.headlineAccent}>See Every</span>
          <br />
          Defect Before
          <br />
          It Ships
        </h1>

        <p className={styles.subhead}>
          Replace costly end-of-line rejects with real-time computer vision that
          catches defects at the source — on your existing hardware, deployed in
          weeks.
        </p>

        {/* Trust signals */}
        <div className={styles.signals}>
          <div className={styles.signal}>
            <span className={styles.signalValue}>$23B+</span>
            <span className={styles.signalLabel}>Annual scrap cost in US manufacturing</span>
          </div>
          <div className={styles.signalDivider} aria-hidden="true" />
          <div className={styles.signal}>
            <span className={styles.signalValue}>$50–120K</span>
            <span className={styles.signalLabel}>Average cost per recall event</span>
          </div>
          <div className={styles.signalDivider} aria-hidden="true" />
          <div className={styles.signal}>
            <span className={styles.signalValue}>Weeks</span>
            <span className={styles.signalLabel}>Typical deployment timeline</span>
          </div>
        </div>

        {/* Email capture */}
        {status === 'success' ? (
          <div className={styles.successState}>
            <div className={styles.successIcon} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10l4 4 8-8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className={styles.successText}>
              <strong>You&apos;re on the list.</strong> We&apos;ll be in touch soon.
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formRow}>
              <label htmlFor="hero-email" className="sr-only">
                Work email
              </label>
              <input
                id="hero-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@company.com"
                className={styles.emailInput}
                required
                autoComplete="email"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                className={`btn-primary ${styles.submitBtn}`}
                disabled={status === 'loading' || !email}
              >
                {status === 'loading' ? (
                  <span className={styles.spinner} aria-hidden="true" />
                ) : null}
                {status === 'loading' ? 'Sending...' : 'Get Early Access'}
              </button>
            </div>
            {status === 'error' && (
              <p className={styles.errorMsg} role="alert">
                {errorMsg}
              </p>
            )}
            <p className={styles.formDisclaimer}>
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>

      {/* Bottom fade */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  )
}
