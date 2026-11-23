import { useEffect, useState } from 'react'
import '../style/Splash.css'

const SPLASH_MS = 3000

function checkIsResumeRoute(): boolean {
  if (typeof window === 'undefined') return false
  const path = window.location.pathname.replace(/\/$/, '')
  return path === '/resume' || window.location.hash === '#resume'
}

export default function SplashScreen() {
  const [isResume] = useState(checkIsResumeRoute)
  const [visible, setVisible] = useState(() => !checkIsResumeRoute())
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (isResume) return

    const start = performance.now()

    const tick = () => {
      const elapsed = performance.now() - start
      const next = Math.min(100, Math.round((elapsed / SPLASH_MS) * 100))
      setPct(next)

      if (next < 100) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => setVisible(false), 250)
      }
    }

    requestAnimationFrame(tick)
    return () => {}
  }, [isResume])

  if (!visible || isResume) return null

  return (
    <div className="splash-overlay" aria-hidden="true">
      <div className="splash-bar-track">
        <div className="splash-logo-ring">
          <img
            className="splash-logo"
            src="/my-logo.png"
            alt="Erwin B. Layson"
          />
        </div>
        <p className="splash-load-text">Loading</p>
        <div className="splash-bar-fill-wrap" role="progressbar" aria-label="Loading progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="splash-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="splash-pct">{pct}%</p>
      </div>
    </div>
  )
}
