import { memo, useMemo } from "react";
import type { RefObject } from "react";
import me480Avif from "../assets/portrait/me-480.avif";
import me680Avif from "../assets/portrait/me-680.avif";
import me960Avif from "../assets/portrait/me-960.avif";
import me480Webp from "../assets/portrait/me-480.webp";
import me680Webp from "../assets/portrait/me-680.webp";
import me960Webp from "../assets/portrait/me-960.webp";
import me680Png from "../assets/portrait/me-680.png";
import { profile } from "../constants/profile";

const allPresenterParticles = Array.from({ length: 12 }, (_, i) => {
  const x = ((i * 83) % 440) - 220;
  const y = ((i * 67) % 420) - 260;
  const z = ((i * 47) % 140) - 70;
  const size = i % 3 === 0 ? 3 : 2;
  const delay = -((i % 8) * 0.85);
  return { id: i, x, y, z, size, delay };
});

function CentralPresentationInner({
  presenterRef,
  particleCount = 12,
}: {
  presenterRef: RefObject<HTMLDivElement | null>;
  particleCount?: number;
}) {
  const particles = useMemo(
    () => allPresenterParticles.slice(0, particleCount),
    [particleCount],
  );

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
        {particles.map((p) => (
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
        <picture className="ai-presenter__picture">
          <source
            type="image/avif"
            srcSet={`${me480Avif} 480w, ${me680Avif} 680w, ${me960Avif} 960w`}
            sizes="(max-width: 767px) 360px, 620px"
          />
          <source
            type="image/webp"
            srcSet={`${me480Webp} 480w, ${me680Webp} 680w, ${me960Webp} 960w`}
            sizes="(max-width: 767px) 360px, 620px"
          />
          <img
            src={me680Png}
            width={680}
            height={680}
            alt={`${profile.name} — ${profile.role}`}
            className="ai-presenter__portrait"
            fetchPriority="high"
            loading="eager"
            draggable={false}
          />
        </picture>
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

const CentralPresentation = memo(CentralPresentationInner);
export default CentralPresentation;
