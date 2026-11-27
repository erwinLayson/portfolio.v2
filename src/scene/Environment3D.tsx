import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useEnvironmentNav, type SectionId } from "../state/environmentNav";
import { computeHorizonRadius, computeRadiusScale } from "./cameraMath";
import { useDeviceProfile } from "./deviceProfile";
import { worldStations } from "./worldConfig";
import { useFreeCameraController } from "./FreeCameraController";
import SceneSvgDefs from "./SceneSvgDefs";
import CentralPresentation from "./CentralPresentation";
import WorldObject from "./WorldObject";
import StationProjection from "./StationProjection";
import EnvironmentHUD from "./EnvironmentHUD";
import "../style/Environment3D.css";
import "../style/Environment.css";

const allCylinderParticles = Array.from({ length: 32 }, (_, i) => {
  const azimuthDeg = (i * 137.508) % 360;
  const radius = 1460 + ((i * 89) % 300);
  const y = -520 + ((i * 53) % 440);
  const size = i % 4 === 0 ? 3 : 2;
  const delay = -((i % 7) * 0.9);
  return { id: i, azimuthDeg, radius, y, size, delay };
});

export default function Environment3D() {
  const { activeSection, isTransitioning, closeSection } = useEnvironmentNav();
  const deviceProfile = useDeviceProfile();

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
  const horizonRadiusPx = computeHorizonRadius(radiusScale);

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

  const cylinderParticles = useMemo(
    () => allCylinderParticles.slice(0, deviceProfile.starCount),
    [deviceProfile.starCount],
  );

  const panelCount = deviceProfile.horizonPanels;
  const panelWidthPx =
    Math.ceil(2 * horizonRadiusPx * Math.tan(Math.PI / panelCount)) + 16;

  const horizonNodes = useMemo(
    () =>
      Array.from({ length: panelCount }, (_, idx) => {
        const az = (idx * 360) / panelCount;
        const hasMonolith = idx % 3 === 0;
        return { idx, az, hasMonolith };
      }),
    [panelCount],
  );

  const horizonAngles = useMemo(
    () => horizonNodes.map((node) => node.az),
    [horizonNodes],
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
    horizonAngles,
    horizonRadiusPx,
    particleElsRef,
    particleCoords: cylinderParticles,
    radiusScale,
  });

  const floorSpokes = useMemo(
    () =>
      worldStations.map((station) => {
        const rad = (station.azimuthDeg * Math.PI) / 180;
        return {
          section: station.section,
          bright: Boolean(station.traceHighlight),
          x: Math.round(station.radiusPx * Math.sin(rad)),
          y: Math.round(-station.radiusPx * Math.cos(rad)),
        };
      }),
    [],
  );

  return (
    <main
      className={`env-viewport ${isDraggingUI ? "is-dragging" : ""} ${
        activeSection ? "is-station-open" : ""
      } ${isTransitioning ? "is-transitioning" : ""}`}
      data-perf-tier={deviceProfile.tier}
      style={{ "--arena-scale": radiusScale } as CSSProperties}
      ref={viewportRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      <SceneSvgDefs />

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
              <svg
                className="env-floor-svg"
                viewBox="-1600 -1600 3200 3200"
                width="1600"
                height="1600"
              >
                <circle
                  cx="0"
                  cy="0"
                  r="1598"
                  fill="url(#env-floor-vignette)"
                  stroke="#18b9e8"
                  strokeOpacity="0.42"
                  strokeWidth="3"
                />
                <circle cx="0" cy="0" r="1596" fill="url(#env-floor-grid-pat)" />
                <circle cx="0" cy="0" r="46" fill="url(#env-floor-core-grad)" />
                <circle
                  cx="0"
                  cy="0"
                  r="90"
                  fill="none"
                  stroke="#18b9e8"
                  strokeOpacity="0.58"
                  strokeWidth="1.2"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="190"
                  fill="none"
                  stroke="#1683f7"
                  strokeOpacity="0.44"
                  strokeWidth="1.2"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="320"
                  fill="none"
                  stroke="#18b9e8"
                  strokeOpacity="0.26"
                  strokeDasharray="10 8"
                  strokeWidth="1.2"
                />
                {floorSpokes.map((spoke) => (
                  <g key={`trace-${spoke.section}`}>
                    <line
                      x1="0"
                      y1="0"
                      x2={spoke.x}
                      y2={spoke.y}
                      stroke="#18b9e8"
                      strokeOpacity={spoke.bright ? 0.62 : 0.32}
                      strokeWidth={spoke.bright ? 2.5 : 1.8}
                    />
                    <use
                      href="#env-sym-floor-pad"
                      x={spoke.x - 40}
                      y={spoke.y - 40}
                      width="80"
                      height="80"
                    />
                  </g>
                ))}
              </svg>
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
                      transform: `rotateY(${-az}deg) translateZ(${-horizonRadiusPx}px)`,
                    } as CSSProperties
                  }
                />
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
            <CentralPresentation
              presenterRef={presenterRef}
              particleCount={deviceProfile.presenterParticleCount}
            />

            {/* 8 Interactive Portfolio Stations Distributed Around the Arena */}
            <div className="env-objects">
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
