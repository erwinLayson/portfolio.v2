import {
  CAMERA_BOUNDS,
  CENTRAL_PRESENTATION,
  worldStations,
} from "./worldConfig";

const DEG_TO_RAD = Math.PI / 180;

export type Vec3 = {
  x: number;
  y: number;
  z: number;
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Normalizes any angle in degrees to [0, 360) for compass readout.
 */
export function normalizeCompassDeg(deg: number): number {
  const mod = deg % 360;
  return mod < 0 ? mod + 360 : mod;
}

/**
 * Shortest angular distance in degrees between two headings in [-180, 180].
 */
export function shortestAngleDelta(fromDeg: number, toDeg: number): number {
  let delta = (toDeg - fromDeg) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

/**
 * Returns the continuous target angle closest to `currentDeg` matching `targetCompassDeg`,
 * preventing sudden jumps across the 0/360 boundary.
 */
export function shortestAngleTarget(currentDeg: number, targetCompassDeg: number): number {
  return currentDeg + shortestAngleDelta(currentDeg, targetCompassDeg);
}

/**
 * Computes world coordinates for a point at compass azimuth (deg), radius, and Y.
 * Matches CSS placement `rotateY(-az) translate3d(0, y, -radius)`.
 */
export function polarToWorld(
  azimuthDeg: number,
  radiusPx: number,
  elevationY: number,
): Vec3 {
  const rad = azimuthDeg * DEG_TO_RAD;
  return {
    x: radiusPx * Math.sin(rad),
    y: elevationY,
    z: -radiusPx * Math.cos(rad),
  };
}

/**
 * Computes horizontal forward and right basis vectors from camera yaw (deg).
 */
export function getHorizontalBasis(yawDeg: number) {
  const rad = yawDeg * DEG_TO_RAD;
  return {
    forwardX: Math.sin(rad),
    forwardZ: -Math.cos(rad),
    rightX: Math.cos(rad),
    rightZ: Math.sin(rad),
  };
}

/**
 * Computes full 3D camera gaze unit vector from yaw & pitch (CSS Y-down coordinates).
 */
export function getViewDirection(yawDeg: number, pitchDeg: number): Vec3 {
  const yawRad = yawDeg * DEG_TO_RAD;
  const pitchRad = pitchDeg * DEG_TO_RAD;
  const cosPitch = Math.cos(pitchRad);
  return {
    x: Math.sin(yawRad) * cosPitch,
    y: -Math.sin(pitchRad),
    z: -Math.cos(yawRad) * cosPitch,
  };
}

/**
 * Computes the Z coordinate in eye space after world translation, yaw, and pitch.
 * Negative values are strictly in front of the camera eye; >= 0 is at or behind the eye.
 */
export function worldToEyeZ(
  worldX: number,
  worldY: number,
  worldZ: number,
  camX: number,
  camY: number,
  camZ: number,
  yawDeg: number,
  pitchDeg: number,
): number {
  const dx = worldX - camX;
  const dy = worldY - camY;
  const dz = worldZ - camZ;
  const yawRad = yawDeg * DEG_TO_RAD;
  const pitchRad = pitchDeg * DEG_TO_RAD;
  const zYaw = -dx * Math.sin(yawRad) + dz * Math.cos(yawRad);
  return dy * Math.sin(pitchRad) + zYaw * Math.cos(pitchRad);
}

/**
 * Computes a safe near-Z offset for horizontal planes (floor & ceiling) so their
 * vertices never cross the camera eye plane (z_eye = 0) at any pitch or camera height.
 */
export function computeSafePlaneNearZ(
  planeOffsetFromCamY: number,
  pitchDeg: number,
  minClearancePx = 155,
): number {
  const rad = pitchDeg * DEG_TO_RAD;
  const cosPitch = Math.max(0.25, Math.cos(rad));
  const numerator = planeOffsetFromCamY * Math.sin(rad) + minClearancePx;
  return Math.max(120, Math.ceil(numerator / cosPitch));
}

/**
 * Resolves vertical bounds, radial arena boundary, and smooth cylindrical slide
 * collision around all 8 solid station structures without trapping the camera.
 */
export function resolveFreeCameraCollision(
  candidate: Vec3,
  radiusScale: number,
): Vec3 {
  let x = candidate.x;
  let y = clamp(candidate.y, CAMERA_BOUNDS.minY, CAMERA_BOUNDS.maxY);
  let z = candidate.z;

  // Prevent flying directly through the central floating AI presentation column
  if (y > CENTRAL_PRESENTATION.minY && y < CENTRAL_PRESENTATION.maxY) {
    const centerDist = Math.hypot(x, z);
    if (centerDist < CENTRAL_PRESENTATION.collisionRadiusPx) {
      if (centerDist > 0.001) {
        const pushScale = CENTRAL_PRESENTATION.collisionRadiusPx / centerDist;
        x *= pushScale;
        z *= pushScale;
      } else {
        z = CENTRAL_PRESENTATION.collisionRadiusPx;
      }
    }
  }

  // Resolve solid station cylindrical bounds (smooth push-out along radial normal)
  for (const station of worldStations) {
    const scaledR = Math.round(station.radiusPx * radiusScale);
    const center = polarToWorld(station.azimuthDeg, scaledR, station.elevationY);
    const dy = y - center.y;

    if (Math.abs(dy) >= station.collisionHalfHeightPx) continue;

    const dx = x - center.x;
    const dz = z - center.z;
    const horizDist = Math.hypot(dx, dz);

    if (horizDist < station.collisionRadiusPx) {
      if (horizDist > 0.001) {
        const pushScale = station.collisionRadiusPx / horizDist;
        x = center.x + dx * pushScale;
        z = center.z + dz * pushScale;
      } else {
        // Fallback push inward toward center if coincident with exact cylinder axis
        const inward = polarToWorld(
          station.azimuthDeg,
          scaledR - station.collisionRadiusPx,
          station.elevationY,
        );
        x = inward.x;
        z = inward.z;
      }
    }
  }

  // Clamp within outer circular exhibition arena boundary
  const arenaLimit = Math.round(CAMERA_BOUNDS.maxArenaRadius * radiusScale);
  const radialDist = Math.hypot(x, z);
  if (radialDist > arenaLimit) {
    const scale = arenaLimit / radialDist;
    x *= scale;
    z *= scale;
  }

  return { x, y, z };
}

export function computeResponsivePerspective(viewportWidth: number): number {
  if (viewportWidth < 560) return 440;
  if (viewportWidth < 960) return 640;
  return 780;
}

export function computeRadiusScale(viewportWidth: number): number {
  if (viewportWidth < 520) return 0.84;
  if (viewportWidth < 900) return 0.92;
  return 1;
}
