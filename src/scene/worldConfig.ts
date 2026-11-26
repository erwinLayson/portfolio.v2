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
 * central AI presentation chamber in the 360-degree environment.
 */
export const worldStations: WorldStationConfig[] = [
  {
    section: "about",
    label: "ABOUT ME",
    code: "01 · IDENTITY",
    tagline: "Developer profile & background",
    azimuthDeg: 0,
    radiusPx: 1040,
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
    radiusPx: 1130,
    elevationY: -70,
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
    radiusPx: 1060,
    elevationY: 18,
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
    radiusPx: 1110,
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
    radiusPx: 1040,
    elevationY: -44,
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
    radiusPx: 1090,
    elevationY: -74,
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
    radiusPx: 1060,
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
    radiusPx: 1130,
    elevationY: -46,
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
export const HORIZON_RADIUS_PX = 1850;
export const FLOOR_ELEVATION_Y = 180;
export const CEILING_ELEVATION_Y = -580;

export const CENTRAL_PRESENTATION = {
  y: -210,
  collisionRadiusPx: 210,
  minY: -500,
  maxY: 180,
} as const;

/**
 * Elevated cinematic conference chamber perspective presenting the central
 * floating AI portrait and name alongside all 8 surrounding portfolio stations.
 */
export const DEFAULT_CAMERA = {
  x: 0,
  y: -1520,
  z: 1960,
  yaw: 0,
  pitch: -38,
} as const;

export const CAMERA_BOUNDS = {
  minPitch: -74,
  maxPitch: 36,
  minY: -2200,
  maxY: 95,
  maxArenaRadius: 2450,
  baseMoveSpeed: 760,
  sprintMultiplier: 2.2,
} as const;
