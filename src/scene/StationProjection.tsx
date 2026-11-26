import { useEffect, useRef } from "react";
import type { CSSProperties, RefObject } from "react";
import { CloseIcon } from "../components/icons";
import { sectionMeta, useEnvironmentNav } from "../state/environmentNav";
import { stationMap } from "./worldConfig";
import StationContent from "./StationContent";

export default function StationProjection({
  radiusScale,
  anchorRef,
}: {
  radiusScale: number;
  anchorRef: RefObject<HTMLDivElement | null>;
}) {
  const { activeSection, isClosing, closeSection } = useEnvironmentNav();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeSection && !isClosing) {
      closeButtonRef.current?.focus({ preventScroll: true });
    }
  }, [activeSection, isClosing]);

  if (!activeSection) return null;

  const station = stationMap[activeSection];
  const meta = sectionMeta[activeSection];
  const scaledRadius = Math.round(station.radiusPx * radiusScale);
  const hologramRadius = scaledRadius - station.hologramForwardPx;

  const projectionStyle = {
    transform: `rotateY(${-station.azimuthDeg}deg) translate3d(0px, ${station.elevationY}px, ${-hologramRadius}px)`,
  } as CSSProperties;

  return (
    <div
      ref={anchorRef}
      data-ready="false"
      className={`env-station-anchor env-station-anchor--${activeSection} ${
        isClosing ? "is-closing" : ""
      }`}
      style={projectionStyle}
    >
      <div className="env-station-emitter" aria-hidden="true" />
      <section
        className="env-station-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="station-dialog-title"
        onPointerDown={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
      >
        <span className="env-station-rail env-station-rail--left" aria-hidden="true" />
        <span className="env-station-rail env-station-rail--right" aria-hidden="true" />

        <header className="env-station-header">
          <div>
            <p className="env-station-code">[ {meta.code} ]</p>
            <h2 id="station-dialog-title">{meta.label}</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="env-station-close"
            onClick={closeSection}
            aria-label={`Close ${meta.label} and return to 3D environment`}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        <div className="env-station-body" key={activeSection}>
          <StationContent section={activeSection} />
        </div>

        <footer className="env-station-footer">
          <button
            type="button"
            className="env-station-return"
            onClick={closeSection}
          >
            <span aria-hidden="true">←</span>
            <span>Return to environment</span>
          </button>
          <span className="env-station-esc">ESC or click outside to exit</span>
        </footer>
      </section>
    </div>
  );
}
