import Box3D from "./Box3D";
import type { SectionId } from "../state/environmentNav";

export default function ObjectSculpture({ section }: { section: SectionId }) {
  switch (section) {
    case "about":
      return (
        <div className="sculpture sculpture--about">
          <Box3D w={146} h={14} d={76} style={{ left: 12, top: 112 }} />
          <Box3D w={16} h={90} d={16} style={{ left: 20, top: 24 }} />
          <Box3D w={16} h={90} d={16} style={{ left: 134, top: 24 }} />
          <Box3D w={66} h={76} d={10} tone="cyan" style={{ left: 52, top: 20 }} />
          <div className="sculpture-ring sculpture-ring--identity" />
          <div className="sculpture-scanline" />
        </div>
      );

    case "projects":
      return (
        <div className="sculpture sculpture--projects">
          <Box3D w={156} h={12} d={84} style={{ left: 9, top: 128 }} />
          <Box3D w={26} h={74} d={26} tone="dark" style={{ left: 18, top: 54 }} />
          <Box3D w={28} h={108} d={28} tone="cyan" style={{ left: 52, top: 20 }} />
          <Box3D w={26} h={86} d={26} tone="blue" style={{ left: 88, top: 42 }} />
          <Box3D w={24} h={64} d={24} tone="cyan" style={{ left: 124, top: 64 }} />
          <div className="sculpture-holo-grid" />
        </div>
      );

    case "tech":
      return (
        <div className="sculpture sculpture--tech">
          <Box3D w={116} h={10} d={116} style={{ left: 17, top: 114 }} />
          <Box3D w={26} h={26} d={26} tone="cyan" style={{ left: 24, top: 26, transform: "translateZ(20px)" }} />
          <Box3D w={26} h={26} d={26} tone="dark" style={{ left: 62, top: 16, transform: "translateZ(-12px)" }} />
          <Box3D w={26} h={26} d={26} tone="blue" style={{ left: 100, top: 28, transform: "translateZ(14px)" }} />
          <Box3D w={26} h={26} d={26} tone="dim" style={{ left: 26, top: 68, transform: "translateZ(-16px)" }} />
          <Box3D w={28} h={28} d={28} tone="cyan" style={{ left: 61, top: 60, transform: "translateZ(26px)" }} />
          <Box3D w={26} h={26} d={26} tone="dark" style={{ left: 98, top: 70, transform: "translateZ(-8px)" }} />
        </div>
      );

    case "experience":
      return (
        <div className="sculpture sculpture--experience">
          <Box3D w={132} h={12} d={74} style={{ left: 13, top: 120 }} />
          <Box3D w={18} h={34} d={18} tone="dim" style={{ left: 24, top: 86 }} />
          <Box3D w={18} h={54} d={18} tone="dark" style={{ left: 50, top: 66 }} />
          <Box3D w={18} h={76} d={18} tone="blue" style={{ left: 76, top: 44 }} />
          <Box3D w={20} h={98} d={20} tone="cyan" style={{ left: 102, top: 22 }} />
          <div className="sculpture-orb sculpture-orb--timeline" />
        </div>
      );

    case "resume":
      return (
        <div className="sculpture sculpture--resume">
          <Box3D w={82} h={134} d={46} style={{ left: 33, top: 16 }} />
          <Box3D w={30} h={38} d={10} tone="cyan" style={{ left: 59, top: 34 }} />
          <div className="sculpture-sheets">
            <span />
            <span />
            <span />
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="sculpture sculpture--contact">
          <Box3D w={88} h={26} d={88} style={{ left: 34, top: 102 }} />
          <Box3D w={32} h={42} d={32} tone="blue" style={{ left: 62, top: 64 }} />
          <div className="sculpture-dish" />
          <div className="sculpture-signal sculpture-signal--inner" />
          <div className="sculpture-signal sculpture-signal--outer" />
        </div>
      );

    case "backstage":
      return (
        <div className="sculpture sculpture--backstage">
          <Box3D w={18} h={128} d={24} style={{ left: 14, top: 14 }} />
          <Box3D w={18} h={128} d={24} style={{ left: 122, top: 14 }} />
          <Box3D w={126} h={16} d={26} tone="cyan" style={{ left: 14, top: 8 }} />
          <Box3D w={132} h={10} d={54} style={{ left: 11, top: 138 }} />
          <div className="sculpture-portal-core" />
        </div>
      );

    case "testimonial":
      return (
        <div className="sculpture sculpture--testimonial">
          <Box3D w={96} h={14} d={78} style={{ left: 26, top: 112 }} />
          <Box3D w={34} h={52} d={34} tone="cyan" style={{ left: 57, top: 56 }} />
          <div className="sculpture-orb sculpture-orb--beacon" />
          <div className="sculpture-ring sculpture-ring--halo" />
        </div>
      );
  }
}
