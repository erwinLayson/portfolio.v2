import { memo, useEffect, useRef, useState } from "react";
import { useEnvironmentNav } from "../state/environmentNav";
import { normalizeCompassDeg } from "./cameraMath";
import { worldStations } from "./worldConfig";

const CompassReadout = memo(function CompassReadout({
  showBadge,
}: {
  showBadge: boolean;
}) {
  const { subscribeTelemetry } = useEnvironmentNav();
  const degRef = useRef<HTMLSpanElement>(null);
  const posRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return subscribeTelemetry(({ yawDeg, posX, posY, posZ }) => {
      const normalized = Math.round(normalizeCompassDeg(yawDeg));
      const formatted = `${String(normalized).padStart(3, "0")}°`;
      if (degRef.current) {
        degRef.current.textContent = formatted;
      }
      if (posRef.current) {
        posRef.current.textContent = `X${posX} · Y${posY} · Z${posZ}`;
      }
    });
  }, [subscribeTelemetry]);

  if (showBadge) {
    return (
      <span className="env-compass-readout" aria-hidden="true">
        <span ref={degRef} className="env-compass-deg">
          000°
        </span>
        <span ref={posRef} className="env-compass-sector">
          X0 · Y-1520 · Z1960
        </span>
      </span>
    );
  }

  return <span ref={degRef} className="env-radar-menu__az">000°</span>;
});

function EnvironmentHUDInner() {
  const {
    activeSection,
    hasInteracted,
    openSection,
    resetCamera,
    aimAtSection,
  } = useEnvironmentNav();

  const [indexOpen, setIndexOpen] = useState(false);
  const effectiveIndexOpen = indexOpen;
  const indexWrapRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!effectiveIndexOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (
        indexWrapRef.current &&
        !indexWrapRef.current.contains(event.target as Node)
      ) {
        setIndexOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !activeSection) {
        setIndexOpen(false);
        toggleBtnRef.current?.focus();
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [effectiveIndexOpen, activeSection]);

  return (
    <div
      className="env-hud"
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      {!hasInteracted && !activeSection && (
        <div className="env-intro-hint" role="status" aria-live="polite">
          <span className="env-intro-hint__dot" aria-hidden="true" />
          <span className="env-intro-hint__desktop">
            DRAG TO LOOK · WASD / QE TO MOVE · SCROLL TO FLY · CLICK STATIONS
          </span>
          <span className="env-intro-hint__mobile">
            DRAG TO LOOK · PINCH TO FLY · TAP STATIONS
          </span>
        </div>
      )}

      <div className="env-controls" ref={indexWrapRef}>
        {effectiveIndexOpen && (
          <div
            id="spatial-station-index"
            className="env-radar-menu"
            role="region"
            aria-label="360-degree environment stations"
          >
            <div className="env-radar-menu__head">
              <span>SPATIAL STATIONS · 360°</span>
              <CompassReadout showBadge={false} />
            </div>
            <ul className="env-radar-menu__list">
              <li key="center">
                <button
                  type="button"
                  className="env-radar-menu__item"
                  onClick={() => {
                    setIndexOpen(false);
                    resetCamera();
                  }}
                >
                  <span className="env-radar-menu__az">000°</span>
                  <span className="env-radar-menu__label">CENTER VIEW</span>
                </button>
              </li>
              {worldStations.map((station) => (
                <li key={station.section}>
                  <button
                    type="button"
                    className="env-radar-menu__item"
                    onMouseEnter={() => {
                      if (!activeSection) aimAtSection(station.section);
                    }}
                    onFocus={() => {
                      if (!activeSection) aimAtSection(station.section);
                    }}
                    onClick={() => {
                      setIndexOpen(false);
                      openSection(station.section);
                    }}
                  >
                    <span className="env-radar-menu__az">
                      {String(station.azimuthDeg).padStart(3, "0")}°
                    </span>
                    <span className="env-radar-menu__label">{station.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="env-control-pill">
          <CompassReadout showBadge />

          <button
            ref={toggleBtnRef}
            type="button"
            className="env-control-btn"
            aria-expanded={effectiveIndexOpen}
            aria-controls="spatial-station-index"
            onClick={() => setIndexOpen((prev) => !prev)}
          >
            Stations
          </button>

          <button
            type="button"
            className="env-control-btn"
            onClick={() => {
              setIndexOpen(false);
              resetCamera();
            }}
            aria-label="Reset camera to elevated view"
          >
            Reset View
          </button>
        </div>
      </div>
    </div>
  );
}

const EnvironmentHUD = memo(EnvironmentHUDInner);
export default EnvironmentHUD;
