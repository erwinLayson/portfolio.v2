import { memo, useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import type { WorldStationConfig } from "./worldConfig";
import { useEnvironmentNav, type SectionId } from "../state/environmentNav";
import ObjectSculpture from "./ObjectSculpture";

type WorldObjectProps = {
  station: WorldStationConfig;
  radiusScale: number;
  shouldSuppressClick: () => boolean;
  registerElement: (section: SectionId, el: HTMLButtonElement | null) => void;
};

function WorldObjectInner({
  station,
  radiusScale,
  shouldSuppressClick,
  registerElement,
}: WorldObjectProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { activeSection, openSection, aimAtSection, registerObjectTrigger } =
    useEnvironmentNav();

  const isSelected = activeSection === station.section;
  const scaledRadius = Math.round(station.radiusPx * radiusScale);

  useEffect(() => {
    const el = buttonRef.current;
    registerElement(station.section, el);
    registerObjectTrigger(station.section, el);
    return () => {
      registerElement(station.section, null);
      registerObjectTrigger(station.section, null);
    };
  }, [station.section, registerElement, registerObjectTrigger]);

  const objectStyle = useMemo<CSSProperties>(
    () => ({
      width: `${station.widthPx}px`,
      height: `${station.heightPx}px`,
      marginLeft: `${-station.widthPx / 2}px`,
      marginTop: `${-station.heightPx / 2}px`,
      transform: `rotateY(${-station.azimuthDeg}deg) translate3d(0px, ${station.elevationY}px, ${-scaledRadius}px)`,
    }),
    [
      station.widthPx,
      station.heightPx,
      station.azimuthDeg,
      station.elevationY,
      scaledRadius,
    ],
  );

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`env-object env-object--${station.section} ${
        isSelected ? "is-selected" : ""
      }`}
      style={objectStyle}
      data-section={station.section}
      onClick={() => {
        if (shouldSuppressClick()) return;
        openSection(station.section);
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible") && !activeSection) {
          aimAtSection(station.section);
        }
      }}
      aria-label={`Inspect ${station.label}: ${station.tagline}`}
      aria-haspopup="dialog"
      aria-expanded={isSelected}
    >
      <span className="env-object__pedestal" aria-hidden="true" />
      <span className="env-object__beacon-beam" aria-hidden="true" />
      <span className="env-object__model" aria-hidden="true">
        <ObjectSculpture section={station.section} />
      </span>
      <span className="env-object__tag" aria-hidden="true">
        <span className="env-object__code">{station.code}</span>
        <span className="env-object__name">{station.label}</span>
        <span className="env-object__cue">Select to inspect</span>
      </span>
    </button>
  );
}

const WorldObject = memo(WorldObjectInner);
export default WorldObject;
