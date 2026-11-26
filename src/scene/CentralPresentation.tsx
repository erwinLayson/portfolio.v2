import type { RefObject } from "react";
import mePortrait from "../assets/me.png";
import { profile } from "../constants/profile";

const presenterParticles = Array.from({ length: 16 }, (_, i) => {
  const x = ((i * 83) % 440) - 220;
  const y = ((i * 67) % 420) - 260;
  const z = ((i * 47) % 140) - 70;
  const size = i % 3 === 0 ? 3 : 2;
  const delay = -((i % 8) * 0.85);
  return { id: i, x, y, z, size, delay };
});

export default function CentralPresentation({
  presenterRef,
}: {
  presenterRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={presenterRef} className="ai-presenter">
      {/* Soft volumetric light cone descending to the conference room floor */}
      <div className="ai-presenter__beam" aria-hidden="true" />

      {/* Atmospheric navy-cyan studio backlight aura */}
      <div className="ai-presenter__aura" aria-hidden="true" />

      {/* Horizontal projector ring arcs floating near presenter base */}
      <div className="ai-presenter__base-ring ai-presenter__base-ring--outer" aria-hidden="true" />
      <div className="ai-presenter__base-ring ai-presenter__base-ring--inner" aria-hidden="true" />

      {/* Subtle volumetric light motes in 3D depth layers */}
      <div className="ai-presenter__particles" aria-hidden="true">
        {presenterParticles.map((p) => (
          <span
            key={p.id}
            className="ai-presenter__particle"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px)`,
            }}
          />
        ))}
      </div>

      {/* Floating frameless cutout portrait */}
      <div className="ai-presenter__figure">
        <img
          src={mePortrait}
          alt={`${profile.name} — ${profile.role}`}
          className="ai-presenter__portrait"
          draggable={false}
        />
      </div>

      {/* 3D dimensional typography floating directly beneath the portrait */}
      <div className="ai-presenter__identity">
        <h1 className="ai-presenter__name">ERWIN B. LAYSON</h1>
        <span className="ai-presenter__rule" aria-hidden="true" />
        <p className="ai-presenter__role">FULL-STACK WEB DEVELOPER</p>
      </div>
    </div>
  );
}
