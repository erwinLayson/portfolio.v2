/**
 * Global invisible SVG sprite and gradient sheet shared across isometric station
 * buildings and arena floor connections to avoid duplicated nodes and blur filters.
 */
export default function SceneSvgDefs() {
  return (
    <svg
      className="env-svg-defs"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="env-grad-dark-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#13223b" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#070e1c" stopOpacity="0.98" />
        </linearGradient>

        <linearGradient id="env-grad-dark-side" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d182d" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#050a14" stopOpacity="0.98" />
        </linearGradient>

        <linearGradient id="env-grad-cyan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.92" />
          <stop offset="52%" stopColor="#18b9e8" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.92" />
        </linearGradient>

        <linearGradient id="env-grad-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#1683f7" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#0a254d" stopOpacity="0.94" />
        </linearGradient>

        <linearGradient id="env-grad-holo-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#18b9e8" stopOpacity="0.48" />
          <stop offset="65%" stopColor="#1683f7" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#18b9e8" stopOpacity="0" />
        </linearGradient>

        <radialGradient id="env-grad-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#18b9e8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#18b9e8" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="env-floor-core-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.42" />
          <stop offset="48%" stopColor="#18b9e8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#18b9e8" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="env-floor-vignette" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#18b9e8" stopOpacity="0.16" />
          <stop offset="28%" stopColor="#060c18" stopOpacity="0.48" />
          <stop offset="97.5%" stopColor="#060c18" stopOpacity="0.52" />
          <stop offset="100%" stopColor="#18b9e8" stopOpacity="0.18" />
        </radialGradient>

        <pattern id="env-floor-grid-pat" width="72" height="72" patternUnits="userSpaceOnUse">
          <path d="M 72 0 L 0 0 0 72" fill="none" stroke="#18b9e8" strokeOpacity="0.15" strokeWidth="1" />
          <circle cx="0" cy="0" r="1.5" fill="#18b9e8" fillOpacity="0.34" />
        </pattern>

        <symbol id="env-sym-pad" viewBox="0 0 160 44">
          <polygon
            points="80,2 156,18 80,34 4,18"
            fill="#0d1b32"
            stroke="#18b9e8"
            strokeOpacity="0.58"
            strokeWidth="1.2"
          />
          <polygon
            points="4,18 80,34 80,42 4,26"
            fill="url(#env-grad-dark-front)"
            stroke="#18b9e8"
            strokeOpacity="0.32"
            strokeWidth="1"
          />
          <polygon
            points="156,18 80,34 80,42 156,26"
            fill="url(#env-grad-dark-side)"
            stroke="#18b9e8"
            strokeOpacity="0.28"
            strokeWidth="1"
          />
        </symbol>

        <symbol id="env-sym-cube" viewBox="0 0 40 40">
          <polygon
            points="20,4 36,12 20,20 4,12"
            fill="#1e3a5f"
            fillOpacity="0.95"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <polygon
            points="4,12 20,20 20,36 4,28"
            fill="currentColor"
            fillOpacity="0.45"
            stroke="currentColor"
            strokeWidth="1"
          />
          <polygon
            points="36,12 20,20 20,36 36,28"
            fill="#091529"
            fillOpacity="0.92"
            stroke="currentColor"
            strokeOpacity="0.6"
            strokeWidth="1"
          />
        </symbol>

        <symbol id="env-sym-beacon" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="url(#env-grad-glow)" />
          <circle
            cx="16"
            cy="16"
            r="6.5"
            fill="#67e8f9"
            stroke="#a5f3fc"
            strokeWidth="1.2"
          />
        </symbol>

        <symbol id="env-sym-ring" viewBox="0 0 120 44">
          <ellipse
            cx="60"
            cy="22"
            rx="54"
            ry="15"
            fill="none"
            stroke="#18b9e8"
            strokeOpacity="0.65"
            strokeWidth="1.4"
          />
          <ellipse
            cx="60"
            cy="22"
            rx="44"
            ry="10"
            fill="none"
            stroke="#38bdf8"
            strokeOpacity="0.32"
            strokeWidth="1"
            strokeDasharray="6 4"
          />
        </symbol>

        <symbol id="env-sym-floor-pad" viewBox="-40 -40 80 80">
          <circle cx="0" cy="0" r="34" fill="url(#env-floor-core-grad)" />
          <circle
            cx="0"
            cy="0"
            r="32"
            fill="none"
            stroke="#18b9e8"
            strokeOpacity="0.52"
            strokeWidth="1.4"
          />
        </symbol>
      </defs>
    </svg>
  );
}
