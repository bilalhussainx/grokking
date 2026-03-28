import { useEffect, useRef } from 'react'

interface Node {
  x: number; y: number
  vx: number; vy: number
  r: number; ph: number; ps: number
}

const NODE_COUNT = 90
const CONNECT_DIST = 145
const SPEED_CAP = 1.1
const MOUSE_RADIUS = 220
const MOUSE_FORCE = 0.000035

export function useNeuralCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialise
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      r:  Math.random() * 1.6 + 0.8,
      ph: Math.random() * Math.PI * 2,
      ps: 0.018 + Math.random() * 0.024,
    }))

    // Default mouse to centre
    mouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onTouchMove = (e: TouchEvent) => {
      mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('resize', resize)

    let rafId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { x: mx, y: my } = mouseRef.current

      // Update positions
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy; n.ph += n.ps
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1

        // Mouse attraction
        const dx = mx - n.x, dy = my - n.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < MOUSE_RADIUS) {
          n.vx += dx * MOUSE_FORCE
          n.vy += dy * MOUSE_FORCE
        }

        // Speed cap
        const sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
        if (sp > SPEED_CAP) { n.vx *= 0.94; n.vy *= 0.94 }
      }

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.22
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(212,168,75,${alpha})`
            ctx.lineWidth   = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const p = (Math.sin(n.ph) + 1) / 2
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212,168,75,${0.28 + p * 0.52})`
        ctx.fill()
      }

      rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', resize)
    }
  }, [canvasRef])
}
