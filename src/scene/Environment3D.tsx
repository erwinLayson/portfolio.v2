import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useEnvironmentNav, type SectionId } from "../state/environmentNav";
import { computeRadiusScale } from "./cameraMath";
import {
  HORIZON_PANELS,
  HORIZON_RADIUS_PX,
  worldStations,
} from "./worldConfig";
import { useFreeCameraController } from "./FreeCameraController";
import CentralPresentation from "./CentralPresentation";
import WorldObject from "./WorldObject";
import StationProjection from "./StationProjection";
import EnvironmentHUD from "./EnvironmentHUD";
import "../style/Environment3D.css";
import "../style/Environment.css";

const horizonIndices = Array.from({ length: HORIZON_PANELS }, (_, i) => i);

const cylinderParticles = Array.from({ length: 48 }, (_, i) => {
  const azimuthDeg = (i * 137.508) % 360;
  const radius = 1460 + ((i * 89) % 300);
  const y = -520 + ((i * 53) % 440);
  const size = i % 4 === 0 ? 3 : 2;
  const delay = -((i % 7) * 0.9);
  return { id: i, azimuthDeg, radius, y, size, delay };
});

export default function Environment3D() {
  const { activeSection, isTransitioning, closeSection } = useEnvironmentNav();

  const viewportRef = useRef<HTMLDivElement>(null);
  const ceilingStageRef = useRef<HTMLDivElement>(null);
  const presenterRef = useRef<HTMLDivElement>(null);
  const stationAnchorRef = useRef<HTMLDivElement>(null);
  const objectElsRef = useRef<Partial<Record<SectionId, HTMLButtonElement | null>>>(
    {},
  );
  const horizonElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const particleElsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );
  const radiusScale = computeRadiusScale(viewportWidth);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const registerObjectElement = useCallback(
    (section: SectionId, el: HTMLButtonElement | null) => {
      objectElsRef.current[section] = el;
    },
    [],
  );

  const {
    isDraggingUI,
    shouldSuppressClick,
    handlePointerDown,
    handlePointerMove,
    endPointer,
  } = useFreeCameraController({
    viewportRef,
    ceilingStageRef,
    presenterRef,
    stationAnchorRef,
    objectElsRef,
    horizonElsRef,
    particleElsRef,
    particleCoords: cylinderParticles,
    radiusScale,
  });

  const panelWidthPx =
    Math.ceil(2 * HORIZON_RADIUS_PX * Math.tan(Math.PI / HORIZON_PANELS)) + 16;

  const horizonNodes = useMemo(
    () =>
      horizonIndices.map((idx) => {
        const az = (idx * 360) / HORIZON_PANELS;
        const hasMonolith = idx % 3 === 0;
        return { idx, az, hasMonolith };
      }),
    [],
  );

  return (
    <main
      className={`env-viewport ${isDraggingUI ? "is-dragging" : ""} ${
        activeSection ? "is-station-open" : ""
      } ${isTransitioning ? "is-transitioning" : ""}`}
      ref={viewportRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      {/* Click outside station panel backdrop to restore previous exploration pose */}
      {activeSection && (
        <div
          className="env-focus-backdrop"
          onClick={closeSection}
          aria-hidden="true"
        />
      )}

      {/* Fixed-perspective stage; camera eye sits cleanly at (camX, camY, camZ) */}
      <div className="env-camera-perspective">
        <div className="env-camera-rig">
          {/* World-locked 3D Digital Exhibition Floor */}
          <div className="env-floor-stage" aria-hidden="true">
            <div className="env-floor-world">
              <div className="env-floor-grid" />
              <div className="env-floor-hub">
                <span className="env-floor-hub__ring env-floor-hub__ring--outer" />
                <span className="env-floor-hub__ring env-floor-hub__ring--mid" />
                <span className="env-floor-hub__ring env-floor-hub__ring--inner" />
                <span className="env-floor-hub__core" />
              </div>
              {worldStations.map((station) => {
                const r = Math.round(station.radiusPx * radiusScale);
                return (
                  <div
                    key={`trace-${station.section}`}
                    className={`env-floor-spoke ${
                      station.traceHighlight ? "is-bright" : ""
                    }`}
                    style={{
                      transform: `rotate(${station.azimuthDeg}deg)`,
                    }}
                  >
                    <span
                      className="env-floor-spoke__line"
                      style={{ height: `${r}px` }}
                    />
                    <span
                      className="env-floor-spoke__pad"
                      style={{ bottom: `${r}px` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overhead Holographic Canopy */}
          <div className="env-ceiling-stage" ref={ceilingStageRef} aria-hidden="true">
            <div className="env-ceiling-world">
              <div className="env-ceiling-grid" />
              <div className="env-ceiling-ring env-ceiling-ring--inner" />
              <div className="env-ceiling-ring env-ceiling-ring--outer" />
            </div>
          </div>

          {/* Independent Yaw + World Translation Stage */}
          <div className="env-world">
            {/* 360-Degree Architectural Horizon Cylinder */}
            <div className="env-horizon-ring" aria-hidden="true">
              {horizonNodes.map(({ idx, az, hasMonolith }) => (
                <div
                  key={idx}
                  ref={(el) => {
                    horizonElsRef.current[idx] = el;
                  }}
                  className={`env-horizon-panel ${
                    hasMonolith ? "has-monolith" : ""
                  }`}
                  style={
                    {
                      width: `${panelWidthPx}px`,
                      marginLeft: `${-panelWidthPx / 2}px`,
                      transform: `rotateY(${-az}deg) translateZ(${-HORIZON_RADIUS_PX}px)`,
                    } as CSSProperties
                  }
                >
                  <span className="env-horizon-panel__band" />
                  {hasMonolith && (
                    <>
                      <span className="env-horizon-panel__pillar" />
                      <span className="env-horizon-panel__beacon" />
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* 360-Degree Spatial Light Nodes */}
            <div className="env-stars-cylinder" aria-hidden="true">
              {cylinderParticles.map((star, idx) => (
                <span
                  key={star.id}
                  ref={(el) => {
                    particleElsRef.current[idx] = el;
                  }}
                  className="env-star-node"
                  style={
                    {
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      animationDelay: `${star.delay}s`,
                      transform: `rotateY(${-star.azimuthDeg}deg) translate3d(0px, ${star.y}px, ${-star.radius}px)`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>

            {/* Central Cinematic AI Presentation in 3D World Coordinates */}
            <CentralPresentation presenterRef={presenterRef} />

            {/* 8 Interactive Portfolio Stations Distributed Around the Arena */}
            <div
              className="env-objects"
              inert={Boolean(activeSection || isTransitioning)}
            >
              {worldStations.map((station) => (
                <WorldObject
                  key={station.section}
                  station={station}
                  radiusScale={radiusScale}
                  shouldSuppressClick={shouldSuppressClick}
                  registerElement={registerObjectElement}
                />
              ))}
            </div>

            {/* In-World Holographic Content Projection at Active Station */}
            <StationProjection
              radiusScale={radiusScale}
              anchorRef={stationAnchorRef}
            />
          </div>
        </div>
      </div>

      {/* Minimal Environmental HUD */}
      <EnvironmentHUD />
    </main>
  );
}
