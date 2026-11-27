import type { SectionId } from "../state/environmentNav";

type IsoColumnProps = {
  x: number;
  topY: number;
  bottomY: number;
  width: number;
  depth?: number;
  fill?: string;
  topFill?: string;
  stroke?: string;
};

function IsoColumn({
  x,
  topY,
  bottomY,
  width,
  depth = 10,
  fill = "url(#env-grad-dark-front)",
  topFill = "#1a3357",
  stroke = "#18b9e8",
}: IsoColumnProps) {
  const half = width / 2;
  return (
    <g>
      <polygon
        points={`${x},${topY} ${x + half},${topY + depth} ${x},${topY + depth * 2} ${x - half},${topY + depth}`}
        fill={topFill}
        stroke={stroke}
        strokeOpacity="0.72"
        strokeWidth="1.1"
      />
      <polygon
        points={`${x - half},${topY + depth} ${x},${topY + depth * 2} ${x},${bottomY} ${x - half},${bottomY - depth}`}
        fill={fill}
        stroke={stroke}
        strokeOpacity="0.48"
        strokeWidth="1"
      />
      <polygon
        points={`${x},${topY + depth * 2} ${x + half},${topY + depth} ${x + half},${bottomY - depth} ${x},${bottomY}`}
        fill="url(#env-grad-dark-side)"
        stroke={stroke}
        strokeOpacity="0.36"
        strokeWidth="1"
      />
    </g>
  );
}

export default function ObjectSculpture({ section }: { section: SectionId }) {
  switch (section) {
    case "about":
      return (
        <svg className="sculpture-svg" viewBox="0 0 176 160" aria-hidden="true">
          <use href="#env-sym-pad" x="8" y="112" width="160" height="44" />
          <IsoColumn x={28} topY={24} bottomY={132} width={22} depth={7} />
          <IsoColumn x={148} topY={24} bottomY={132} width={22} depth={7} />
          <rect
            x="54"
            y="24"
            width="68"
            height="80"
            rx="4"
            fill="url(#env-grad-cyan)"
            fillOpacity="0.35"
            stroke="#38bdf8"
            strokeOpacity="0.78"
            strokeWidth="1.3"
          />
          <rect
            x="66"
            y="36"
            width="44"
            height="56"
            rx="3"
            fill="url(#env-grad-cyan)"
            fillOpacity="0.52"
          />
          <use href="#env-sym-ring" x="28" y="40" width="120" height="44" className="sculpture-svg__ring" />
          <rect
            x="54"
            y="32"
            width="68"
            height="3"
            rx="1.5"
            fill="#a5f3fc"
            className="sculpture-svg__scan"
          />
        </svg>
      );

    case "projects":
      return (
        <svg className="sculpture-svg" viewBox="0 0 176 168" aria-hidden="true">
          <rect
            x="16"
            y="14"
            width="144"
            height="112"
            fill="url(#env-grad-holo-beam)"
            stroke="#18b9e8"
            strokeOpacity="0.34"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <use href="#env-sym-pad" x="6" y="122" width="164" height="44" />
          <IsoColumn x={34} topY={58} bottomY={140} width={28} depth={8} fill="url(#env-grad-dark-front)" />
          <IsoColumn
            x={70}
            topY={22}
            bottomY={144}
            width={32}
            depth={9}
            fill="url(#env-grad-cyan)"
            topFill="#38bdf8"
          />
          <IsoColumn
            x={108}
            topY={42}
            bottomY={144}
            width={28}
            depth={8}
            fill="url(#env-grad-blue)"
            topFill="#60a5fa"
          />
          <IsoColumn
            x={142}
            topY={68}
            bottomY={140}
            width={26}
            depth={7}
            fill="url(#env-grad-cyan)"
            topFill="#38bdf8"
          />
        </svg>
      );

    case "tech":
      return (
        <svg className="sculpture-svg" viewBox="0 0 176 160" aria-hidden="true">
          <use href="#env-sym-pad" x="14" y="110" width="148" height="44" />
          <path
            d="M44 48 L88 32 L132 50 M42 86 L88 74 L132 88 M88 32 L88 74"
            fill="none"
            stroke="#18b9e8"
            strokeOpacity="0.42"
            strokeWidth="1.2"
          />
          <use href="#env-sym-cube" x="24" y="28" width="40" height="40" style={{ color: "#18b9e8" }} />
          <use href="#env-sym-cube" x="68" y="14" width="40" height="40" style={{ color: "#3b82f6" }} />
          <use href="#env-sym-cube" x="112" y="30" width="40" height="40" style={{ color: "#1683f7" }} />
          <use href="#env-sym-cube" x="24" y="68" width="40" height="40" style={{ color: "#38bdf8" }} />
          <use href="#env-sym-cube" x="68" y="56" width="42" height="42" style={{ color: "#22d3ee" }} />
          <use href="#env-sym-cube" x="112" y="70" width="40" height="40" style={{ color: "#3b82f6" }} />
        </svg>
      );

    case "experience":
      return (
        <svg className="sculpture-svg" viewBox="0 0 176 160" aria-hidden="true">
          <use href="#env-sym-pad" x="12" y="114" width="152" height="44" />
          <IsoColumn x={38} topY={90} bottomY={134} width={22} depth={6} fill="url(#env-grad-dark-front)" />
          <IsoColumn x={68} topY={70} bottomY={136} width={22} depth={6} fill="url(#env-grad-dark-front)" />
          <IsoColumn
            x={98}
            topY={48}
            bottomY={136}
            width={24}
            depth={7}
            fill="url(#env-grad-blue)"
            topFill="#60a5fa"
          />
          <IsoColumn
            x={130}
            topY={26}
            bottomY={134}
            width={26}
            depth={8}
            fill="url(#env-grad-cyan)"
            topFill="#67e8f9"
          />
          <use href="#env-sym-beacon" x="116" y="0" width="28" height="28" className="sculpture-svg__orb" />
        </svg>
      );

    case "resume":
      return (
        <svg className="sculpture-svg" viewBox="0 0 160 168" aria-hidden="true">
          <use href="#env-sym-pad" x="16" y="122" width="128" height="42" />
          <IsoColumn x={80} topY={16} bottomY={146} width={78} depth={14} />
          <rect
            x="64"
            y="38"
            width="32"
            height="40"
            rx="3"
            fill="url(#env-grad-cyan)"
            fillOpacity="0.68"
            stroke="#67e8f9"
            strokeWidth="1.2"
          />
          <g className="sculpture-svg__sheets">
            <rect
              x="44"
              y="76"
              width="62"
              height="40"
              rx="2"
              fill="#0d223c"
              fillOpacity="0.88"
              stroke="#18b9e8"
              strokeOpacity="0.55"
              transform="rotate(-5 75 96)"
            />
            <rect
              x="50"
              y="82"
              width="62"
              height="40"
              rx="2"
              fill="#112c4d"
              fillOpacity="0.88"
              stroke="#38bdf8"
              strokeOpacity="0.72"
              transform="rotate(3 81 102)"
            />
            <line x1="60" y1="94" x2="100" y2="96" stroke="#a5f3fc" strokeOpacity="0.8" strokeWidth="1.5" />
            <line x1="60" y1="102" x2="94" y2="104" stroke="#38bdf8" strokeOpacity="0.65" strokeWidth="1.2" />
          </g>
        </svg>
      );

    case "contact":
      return (
        <svg className="sculpture-svg" viewBox="0 0 160 160" aria-hidden="true">
          <use href="#env-sym-pad" x="22" y="112" width="116" height="42" />
          <IsoColumn
            x={80}
            topY={62}
            bottomY={132}
            width={36}
            depth={10}
            fill="url(#env-grad-blue)"
            topFill="#60a5fa"
          />
          <ellipse
            cx="80"
            cy="42"
            rx="44"
            ry="24"
            fill="url(#env-grad-cyan)"
            fillOpacity="0.38"
            stroke="#38bdf8"
            strokeWidth="1.4"
          />
          <ellipse
            cx="80"
            cy="38"
            rx="28"
            ry="14"
            fill="none"
            stroke="#67e8f9"
            strokeOpacity="0.55"
            strokeWidth="1.1"
          />
          <ellipse
            cx="80"
            cy="32"
            rx="44"
            ry="16"
            fill="none"
            stroke="#18b9e8"
            strokeOpacity="0.45"
            strokeWidth="1.2"
            className="sculpture-svg__signal"
          />
          <circle cx="80" cy="40" r="4" fill="#a5f3fc" />
        </svg>
      );

    case "backstage":
      return (
        <svg className="sculpture-svg" viewBox="0 0 168 164" aria-hidden="true">
          <use href="#env-sym-pad" x="8" y="120" width="152" height="42" />
          <ellipse cx="84" cy="84" rx="44" ry="52" fill="url(#env-grad-holo-beam)" />
          <rect
            x="40"
            y="30"
            width="88"
            height="108"
            fill="url(#env-grad-holo-beam)"
            stroke="#18b9e8"
            strokeOpacity="0.46"
            strokeWidth="1.2"
          />
          <IsoColumn x={26} topY={18} bottomY={140} width={24} depth={8} />
          <IsoColumn x={142} topY={18} bottomY={140} width={24} depth={8} />
          <IsoColumn
            x={84}
            topY={8}
            bottomY={32}
            width={136}
            depth={8}
            fill="url(#env-grad-cyan)"
            topFill="#67e8f9"
          />
        </svg>
      );

    case "testimonial":
      return (
        <svg className="sculpture-svg" viewBox="0 0 160 160" aria-hidden="true">
          <use href="#env-sym-pad" x="22" y="112" width="116" height="42" />
          <IsoColumn
            x={80}
            topY={56}
            bottomY={132}
            width={38}
            depth={10}
            fill="url(#env-grad-cyan)"
            topFill="#67e8f9"
          />
          <use href="#env-sym-ring" x="20" y="34" width="120" height="44" className="sculpture-svg__ring" />
          <use href="#env-sym-beacon" x="64" y="14" width="32" height="32" className="sculpture-svg__orb" />
        </svg>
      );
  }
}
