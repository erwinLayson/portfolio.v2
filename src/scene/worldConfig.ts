import type { SectionId } from "../state/environmentNav";

export type WorldStationConfig = {
  section: SectionId;
  label: string;
  code: string;
  tagline: string;
  azimuthDeg: number;
  radiusPx: number;
  elevationY: number;
  widthPx: number;
  heightPx: number;
  hologramForwardPx: number;
  traceHighlight?: boolean;
};

/**
 * Spatial distribution of the 8 interactive portfolio stations around the
 * full 360-degree exhibition arena. Angles use clockwise compass azimuth
 * (0deg = North/Front, 90deg = East/Right, 180deg = South/Back, 270deg = West/Left).
 */
export const worldStations: WorldStationConfig[] = [
  {
    section: "about",
    label: "ABOUT ME",
    code: "01 · IDENTITY",
    tagline: "Developer profile & background",
    azimuthDeg: 0,
    radiusPx: 880,
    elevationY: -10,
    widthPx: 170,
    heightPx: 148,
    hologramForwardPx: 165,
    traceHighlight: true,
  },
  {
    section: "projects",
    label: "PROJECTS",
    code: "02 · SYSTEMS",
    tagline: "Featured full-stack applications",
    azimuthDeg: 45,
    radiusPx: 980,
    elevationY: -78,
    widthPx: 174,
    heightPx: 162,
    hologramForwardPx: 170,
    traceHighlight: true,
  },
  {
    section: "tech",
    label: "TECH STACK",
    code: "03 · MATRIX",
    tagline: "Frontend, backend, databases & tools",
    azimuthDeg: 90,
    radiusPx: 910,
    elevationY: 22,
    widthPx: 150,
    heightPx: 146,
    hologramForwardPx: 160,
  },
  {
    section: "experience",
    label: "EXPERIENCE",
    code: "04 · TIMELINE",
    tagline: "Academic & engineering milestones",
    azimuthDeg: 135,
    radiusPx: 960,
    elevationY: -40,
    widthPx: 158,
    heightPx: 152,
    hologramForwardPx: 165,
  },
  {
    section: "resume",
    label: "RESUME",
    code: "05 · DOCUMENT",
    tagline: "ATS preview & PDF export",
    azimuthDeg: 180,
    radiusPx: 930,
    elevationY: -50,
    widthPx: 148,
    heightPx: 166,
    hologramForwardPx: 165,
    traceHighlight: true,
  },
  {
    section: "contact",
    label: "CONTACT",
    code: "06 · UPLINK",
    tagline: "Direct email & social channels",
    azimuthDeg: 225,
    radiusPx: 950,
    elevationY: -84,
    widthPx: 156,
    heightPx: 148,
    hologramForwardPx: 165,
  },
  {
    section: "backstage",
    label: "BACKSTAGE",
    code: "07 · ARCHIVE",
    tagline: "Engineering workflow & OJT gallery",
    azimuthDeg: 270,
    radiusPx: 900,
    elevationY: 16,
    widthPx: 154,
    heightPx: 156,
    hologramForwardPx: 160,
  },
  {
    section: "testimonial",
    label: "TESTIMONIAL",
    code: "08 · FEEDBACK",
    tagline: "Verified endorsements status",
    azimuthDeg: 315,
    radiusPx: 990,
    elevationY: -48,
    widthPx: 148,
    heightPx: 146,
    hologramForwardPx: 165,
  },
];

export const stationMap = Object.fromEntries(
  worldStations.map((station) => [station.section, station]),
) as Record<SectionId, WorldStationConfig>;

export const HORIZON_PANELS = 24;
export const HORIZON_RADIUS_PX = 1850;
export const FLOOR_ELEVATION_Y = 180;
export const CEILING_ELEVATION_Y = -540;

/**
 * Elevated top-down initial perspective positioned above the exhibition arena
 * and angled downward so the floor grid, central hub, and stations are visible.
 */
export const DEFAULT_CAMERA = {
  yaw: 0,
  pitch: -27,
  zoom: -380,
  x: 0,
  y: -320,
  z: 0,
} as const;

export const CAMERA_LIMITS = {
  minPitch: -42,
  maxPitch: 14,
  minZoom: -560,
  maxZoom: 240,
} as const;
