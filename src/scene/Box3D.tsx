import type { CSSProperties } from "react";

type Box3DProps = {
  w: number;
  h: number;
  d: number;
  className?: string;
  style?: CSSProperties;
  tone?: "dark" | "cyan" | "blue" | "dim";
};

export default function Box3D({
  w,
  h,
  d,
  className = "",
  style,
  tone = "dark",
}: Box3DProps) {
  const boxStyle = {
    ...style,
    "--bw": `${w}px`,
    "--bh": `${h}px`,
    "--bd": `${d}px`,
  } as CSSProperties;

  return (
    <div className={`box3d box3d--${tone} ${className}`} style={boxStyle}>
      <span className="box3d__face box3d__face--front" />
      <span className="box3d__face box3d__face--back" />
      <span className="box3d__face box3d__face--left" />
      <span className="box3d__face box3d__face--right" />
      <span className="box3d__face box3d__face--top" />
      <span className="box3d__face box3d__face--bottom" />
    </div>
  );
}
