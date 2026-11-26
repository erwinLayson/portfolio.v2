const DEG_TO_RAD = Math.PI / 180;

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
export function polarToWorld(azimuthDeg: number, radiusPx: number, elevationY: number) {
  const rad = azimuthDeg * DEG_TO_RAD;
  return {
    x: radiusPx * Math.sin(rad),
    y: elevationY,
    z: -radiusPx * Math.cos(rad),
  };
}

/**
 * Computes the Z coordinate in eye space after world translation, yaw, pitch, and zoom.
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
  camZoom: number,
): number {
  const dx = worldX - camX;
  const dy = worldY - camY;
  const dz = worldZ - camZ;
  const yawRad = yawDeg * DEG_TO_RAD;
  const pitchRad = pitchDeg * DEG_TO_RAD;
  const zYaw = -dx * Math.sin(yawRad) + dz * Math.cos(yawRad);
  const zPitch = dy * Math.sin(pitchRad) + zYaw * Math.cos(pitchRad);
  return zPitch + camZoom;
}

/**
 * Computes a safe near-Z offset for horizontal planes (floor & ceiling) so their
 * vertices never cross the camera eye plane (z_eye = 0) at any pitch, height, or zoom.
 */
export function computeSafePlaneNearZ(
  planeOffsetFromCamY: number,
  pitchDeg: number,
  camZoom: number,
  minClearancePx = 150,
): number {
  const rad = pitchDeg * DEG_TO_RAD;
  const cosPitch = Math.max(0.25, Math.cos(rad));
  const numerator = planeOffsetFromCamY * Math.sin(rad) + camZoom + minClearancePx;
  return Math.max(120, Math.ceil(numerator / cosPitch));
}

export function computeResponsivePerspective(viewportWidth: number): number {
  if (viewportWidth < 640) return 680;
  if (viewportWidth < 1024) return 800;
  return 920;
}

export function computeRadiusScale(viewportWidth: number): number {
  if (viewportWidth < 520) return 0.84;
  if (viewportWidth < 900) return 0.92;
  return 1;
}
