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
  collisionRadiusPx: number;
  collisionHalfHeightPx: number;
  traceHighlight?: boolean;
};

/**
 * Spatial distribution of the 8 interactive portfolio stations around the
 * 360-degree free-roaming exhibition arena.
 */
export const worldStations: WorldStationConfig[] = [
  {
    section: "about",
    label: "ABOUT ME",
    code: "01 · IDENTITY",
    tagline: "Developer profile & background",
    azimuthDeg: 0,
    radiusPx: 1220,
    elevationY: -10,
    widthPx: 170,
    heightPx: 148,
    hologramForwardPx: 165,
    collisionRadiusPx: 145,
    collisionHalfHeightPx: 140,
    traceHighlight: true,
  },
  {
    section: "projects",
    label: "PROJECTS",
    code: "02 · SYSTEMS",
    tagline: "Featured full-stack applications",
    azimuthDeg: 45,
    radiusPx: 1340,
    elevationY: -78,
    widthPx: 174,
    heightPx: 162,
    hologramForwardPx: 170,
    collisionRadiusPx: 150,
    collisionHalfHeightPx: 145,
    traceHighlight: true,
  },
  {
    section: "tech",
    label: "TECH STACK",
    code: "03 · MATRIX",
    tagline: "Frontend, backend, databases & tools",
    azimuthDeg: 90,
    radiusPx: 1250,
    elevationY: 22,
    widthPx: 150,
    heightPx: 146,
    hologramForwardPx: 160,
    collisionRadiusPx: 140,
    collisionHalfHeightPx: 135,
  },
  {
    section: "experience",
    label: "EXPERIENCE",
    code: "04 · TIMELINE",
    tagline: "Academic & engineering milestones",
    azimuthDeg: 135,
    radiusPx: 1310,
    elevationY: -40,
    widthPx: 158,
    heightPx: 152,
    hologramForwardPx: 165,
    collisionRadiusPx: 145,
    collisionHalfHeightPx: 140,
  },
  {
    section: "resume",
    label: "RESUME",
    code: "05 · DOCUMENT",
    tagline: "ATS preview & PDF export",
    azimuthDeg: 180,
    radiusPx: 1270,
    elevationY: -50,
    widthPx: 148,
    heightPx: 166,
    hologramForwardPx: 165,
    collisionRadiusPx: 145,
    collisionHalfHeightPx: 145,
    traceHighlight: true,
  },
  {
    section: "contact",
    label: "CONTACT",
    code: "06 · UPLINK",
    tagline: "Direct email & social channels",
    azimuthDeg: 225,
    radiusPx: 1290,
    elevationY: -84,
    widthPx: 156,
    heightPx: 148,
    hologramForwardPx: 165,
    collisionRadiusPx: 145,
    collisionHalfHeightPx: 140,
  },
  {
    section: "backstage",
    label: "BACKSTAGE",
    code: "07 · ARCHIVE",
    tagline: "Engineering workflow & OJT gallery",
    azimuthDeg: 270,
    radiusPx: 1240,
    elevationY: 16,
    widthPx: 154,
    heightPx: 156,
    hologramForwardPx: 160,
    collisionRadiusPx: 145,
    collisionHalfHeightPx: 140,
  },
  {
    section: "testimonial",
    label: "TESTIMONIAL",
    code: "08 · FEEDBACK",
    tagline: "Verified endorsements status",
    azimuthDeg: 315,
    radiusPx: 1350,
    elevationY: -48,
    widthPx: 148,
    heightPx: 146,
    hologramForwardPx: 165,
    collisionRadiusPx: 140,
    collisionHalfHeightPx: 135,
  },
];

export const stationMap = Object.fromEntries(
  worldStations.map((station) => [station.section, station]),
) as Record<SectionId, WorldStationConfig>;

export const HORIZON_PANELS = 24;
export const HORIZON_RADIUS_PX = 2050;
export const FLOOR_ELEVATION_Y = 180;
export const CEILING_ELEVATION_Y = -580;

/**
 * Elevated downward-looking initial free-roaming camera coordinates.
 * Position is independent in world space (not constrained to world center).
 */
export const DEFAULT_CAMERA = {
  x: 0,
  y: -380,
  z: 420,
  yaw: 0,
  pitch: -27,
} as const;

export const CAMERA_BOUNDS = {
  minPitch: -52,
  maxPitch: 36,
  minY: -500,
  maxY: 95,
  maxArenaRadius: 1560,
  baseMoveSpeed: 540,
  sprintMultiplier: 2.1,
} as const;
