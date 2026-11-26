import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useEnvironmentNav, type SectionId } from "../state/environmentNav";
import {
  clamp,
  computeResponsivePerspective,
  computeSafePlaneNearZ,
  getHorizontalBasis,
  getViewDirection,
  normalizeCompassDeg,
  polarToWorld,
  resolveFreeCameraCollision,
  shortestAngleDelta,
  shortestAngleTarget,
  worldToEyeZ,
  type Vec3,
} from "./cameraMath";
import {
  CAMERA_BOUNDS,
  CEILING_ELEVATION_Y,
  CENTRAL_PRESENTATION,
  DEFAULT_CAMERA,
  FLOOR_ELEVATION_Y,
  HORIZON_PANELS,
  HORIZON_RADIUS_PX,
  stationMap,
  worldStations,
} from "./worldConfig";

const DRAG_THRESHOLD_PX = 6;
const TRANSITION_EPSILON_POS = 1.6;
const TRANSITION_EPSILON_DEG = 0.28;

type SavedCameraPose = {
  position: Vec3;
  yaw: number;
  pitch: number;
};

type CameraMode =
  | "explore"
  | "approaching"
  | "focused"
  | "returning"
  | "resetting";

type FreeCameraState = {
  position: {
    current: Vec3;
    target: Vec3;
  };
  orientation: {
    yaw: number;
    targetYaw: number;
    velYaw: number;
    pitch: number;
    targetPitch: number;
    velPitch: number;
  };
  navigation: {
    mode: CameraMode;
    targetSection: SectionId | null;
    previousPose: SavedCameraPose | null;
  };
};

type FreeCameraControllerArgs = {
  viewportRef: RefObject<HTMLDivElement | null>;
  ceilingStageRef: RefObject<HTMLDivElement | null>;
  presenterRef: RefObject<HTMLDivElement | null>;
  stationAnchorRef: RefObject<HTMLDivElement | null>;
  objectElsRef: RefObject<Partial<Record<SectionId, HTMLButtonElement | null>>>;
  horizonElsRef: RefObject<(HTMLDivElement | null)[]>;
  particleElsRef: RefObject<(HTMLSpanElement | null)[]>;
  particleCoords: { azimuthDeg: number; radius: number; y: number }[];
  radiusScale: number;
};

export function useFreeCameraController({
  viewportRef,
  ceilingStageRef,
  presenterRef,
  stationAnchorRef,
  objectElsRef,
  horizonElsRef,
  particleElsRef,
  particleCoords,
  radiusScale,
}: FreeCameraControllerArgs) {
  const {
    activeSection,
    isClosing,
    resetNonce,
    aimRequest,
    setIsTransitioning,
    publishTelemetry,
    markInteracted,
  } = useEnvironmentNav();

  const fixedPerspectiveRef = useRef<number>(
    computeResponsivePerspective(
      typeof window !== "undefined" ? window.innerWidth : 1280,
    ),
  );

  // Centralized Free-Roaming Camera State (ref-based for zero React rerenders per frame)
  const cameraRef = useRef<FreeCameraState>({
    position: {
      current: { x: DEFAULT_CAMERA.x, y: DEFAULT_CAMERA.y, z: DEFAULT_CAMERA.z },
      target: { x: DEFAULT_CAMERA.x, y: DEFAULT_CAMERA.y, z: DEFAULT_CAMERA.z },
    },
    orientation: {
      yaw: DEFAULT_CAMERA.yaw,
      targetYaw: DEFAULT_CAMERA.yaw,
      velYaw: 0,
      pitch: DEFAULT_CAMERA.pitch,
      targetPitch: DEFAULT_CAMERA.pitch,
      velPitch: 0,
    },
    navigation: {
      mode: "explore",
      targetSection: null,
      previousPose: null,
    },
  });

  // Input tracking refs
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    isDragging: false,
    pinchLastDist: null as number | null,
  });
  const suppressClickRef = useRef(false);
  const [isDraggingUI, setIsDraggingUI] = useState(false);

  const activeSectionRef = useRef<SectionId | null>(activeSection);
  const isClosingRef = useRef(isClosing);
  const radiusScaleRef = useRef(radiusScale);

  useEffect(() => {
    activeSectionRef.current = activeSection;
    isClosingRef.current = isClosing;
    radiusScaleRef.current = radiusScale;
  }, [activeSection, isClosing, radiusScale]);

  const shouldSuppressClick = useCallback(() => {
    const mode = cameraRef.current.navigation.mode;
    return (
      suppressClickRef.current ||
      mode === "approaching" ||
      mode === "returning" ||
      mode === "resetting"
    );
  }, []);

  // Fixed perspective calibrated per viewport width (never mutated on movement)
  useEffect(() => {
    const updateFixedPerspective = () => {
      const nextPersp = computeResponsivePerspective(window.innerWidth);
      fixedPerspectiveRef.current = nextPersp;
      viewportRef.current?.style.setProperty("--cam-persp", `${nextPersp}px`);
    };
    updateFixedPerspective();
    window.addEventListener("resize", updateFixedPerspective, { passive: true });
    return () => window.removeEventListener("resize", updateFixedPerspective);
  }, [viewportRef]);

  // Station Selection & Return transitions (saves & restores exact position + rotation)
  useEffect(() => {
    const cam = cameraRef.current;

    if (activeSection && !isClosing) {
      pressedKeysRef.current.clear();

      if (!cam.navigation.previousPose) {
        cam.navigation.previousPose = {
          position: { ...cam.position.target },
          yaw: cam.orientation.targetYaw,
          pitch: cam.orientation.targetPitch,
        };
      }

      const station = stationMap[activeSection];
      const scaledR = Math.round(station.radiusPx * radiusScale);
      const hologramR = scaledR - station.hologramForwardPx;
      const viewSpotRadius = hologramR - fixedPerspectiveRef.current;
      const destination = polarToWorld(
        station.azimuthDeg,
        viewSpotRadius,
        station.elevationY,
      );

      cam.orientation.velYaw = 0;
      cam.orientation.velPitch = 0;
      cam.orientation.targetYaw = shortestAngleTarget(
        cam.orientation.yaw,
        station.azimuthDeg,
      );
      cam.orientation.targetPitch = 0;
      cam.position.target = destination;

      cam.navigation.mode = "approaching";
      cam.navigation.targetSection = activeSection;
      setIsTransitioning(true);
    } else if ((!activeSection || isClosing) && cam.navigation.previousPose) {
      const prev = cam.navigation.previousPose;
      cam.orientation.velYaw = 0;
      cam.orientation.velPitch = 0;
      cam.orientation.targetYaw = shortestAngleTarget(
        cam.orientation.yaw,
        normalizeCompassDeg(prev.yaw),
      );
      cam.orientation.targetPitch = prev.pitch;
      cam.position.target = { ...prev.position };

      cam.navigation.mode = "returning";
      cam.navigation.targetSection = null;
      setIsTransitioning(true);

      if (!activeSection) {
        cam.navigation.previousPose = null;
      }
    }
  }, [activeSection, isClosing, radiusScale, setIsTransitioning]);

  // Explicit Reset Camera command -> restore initial elevated downward-looking pose
  useEffect(() => {
    if (resetNonce === 0) return;
    const cam = cameraRef.current;
    pressedKeysRef.current.clear();
    cam.navigation.previousPose = null;
    cam.orientation.velYaw = 0;
    cam.orientation.velPitch = 0;
    cam.orientation.targetYaw = shortestAngleTarget(
      cam.orientation.yaw,
      DEFAULT_CAMERA.yaw,
    );
    cam.orientation.targetPitch = DEFAULT_CAMERA.pitch;
    cam.position.target = {
      x: DEFAULT_CAMERA.x,
      y: DEFAULT_CAMERA.y,
      z: DEFAULT_CAMERA.z,
    };
    cam.navigation.mode = "resetting";
    cam.navigation.targetSection = null;
    setIsTransitioning(true);
  }, [resetNonce, setIsTransitioning]);

  // Keyboard Tab / Index aim orientation preview (rotates camera without locking orbit)
  useEffect(() => {
    if (!aimRequest || activeSection) return;
    const cam = cameraRef.current;
    if (cam.navigation.mode !== "explore") return;
    const station = stationMap[aimRequest.section];
    const scaledR = Math.round(station.radiusPx * radiusScale);
    const stationPos = polarToWorld(
      station.azimuthDeg,
      scaledR,
      station.elevationY,
    );
    const dx = stationPos.x - cam.position.current.x;
    const dz = stationPos.z - cam.position.current.z;
    const targetHeadingDeg = (Math.atan2(dx, -dz) * 180) / Math.PI;
    const dy = stationPos.y - cam.position.current.y;
    const horizDist = Math.max(1, Math.hypot(dx, dz));
    const targetPitchDeg = clamp(
      (-Math.atan2(dy, horizDist) * 180) / Math.PI,
      CAMERA_BOUNDS.minPitch,
      CAMERA_BOUNDS.maxPitch,
    );

    cam.orientation.velYaw = 0;
    cam.orientation.velPitch = 0;
    cam.orientation.targetYaw = shortestAngleTarget(
      cam.orientation.yaw,
      targetHeadingDeg,
    );
    cam.orientation.targetPitch = targetPitchDeg;
  }, [aimRequest, activeSection, radiusScale]);

  // Keyboard input listeners (WASD / QE / Arrows / Shift)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (activeSectionRef.current) return;
      if (cameraRef.current.navigation.mode !== "explore") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      if (
        key === "w" ||
        key === "a" ||
        key === "s" ||
        key === "d" ||
        key === "q" ||
        key === "e" ||
        key === "arrowup" ||
        key === "arrowdown" ||
        key === "arrowleft" ||
        key === "arrowright" ||
        key === "shift"
      ) {
        if (key.startsWith("arrow")) {
          event.preventDefault();
        }
        pressedKeysRef.current.add(key);
        if (key !== "shift") {
          markInteracted();
        }
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      pressedKeysRef.current.delete(event.key.toLowerCase());
    };

    const onBlur = () => {
      pressedKeysRef.current.clear();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [markInteracted]);

  // Mouse wheel: move forward/backward freely along viewing direction
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      if (activeSectionRef.current) return;
      if (cameraRef.current.navigation.mode !== "explore") return;
      event.preventDefault();
      markInteracted();

      const cam = cameraRef.current;
      const step = -event.deltaY * 1.45;
      const dir = getViewDirection(
        cam.orientation.targetYaw,
        cam.orientation.targetPitch,
      );

      const candidate: Vec3 = {
        x: cam.position.target.x + dir.x * step,
        y: cam.position.target.y + dir.y * step,
        z: cam.position.target.z + dir.z * step,
      };
      cam.position.target = resolveFreeCameraCollision(
        candidate,
        radiusScaleRef.current,
      );
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [markInteracted, viewportRef]);

  // Main 60fps Free-Flight simulation, collision resolution & GPU transform loop
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let lastTelemetryTime = 0;
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const cam = cameraRef.current;
      const reducedMotion = reducedMotionQuery.matches;
      const mode = cam.navigation.mode;
      const isDragging = dragRef.current.isDragging;
      const curScale = radiusScaleRef.current;

      if (mode === "explore") {
        // 1. Apply normalized WASD / QE / Arrow flight movement in camera heading space
        const keys = pressedKeysRef.current;
        const fwd =
          (keys.has("w") || keys.has("arrowup") ? 1 : 0) -
          (keys.has("s") || keys.has("arrowdown") ? 1 : 0);
        const strafe =
          (keys.has("d") || keys.has("arrowright") ? 1 : 0) -
          (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
        const vert = (keys.has("q") ? 1 : 0) - (keys.has("e") ? 1 : 0);

        if (fwd !== 0 || strafe !== 0 || vert !== 0) {
          const basis = getHorizontalBasis(cam.orientation.targetYaw);
          let mx = fwd * basis.forwardX + strafe * basis.rightX;
          let my = vert;
          let mz = fwd * basis.forwardZ + strafe * basis.rightZ;
          const mag = Math.hypot(mx, my, mz);
          if (mag > 0) {
            mx /= mag;
            my /= mag;
            mz /= mag;
          }

          const speed =
            CAMERA_BOUNDS.baseMoveSpeed *
            (keys.has("shift") ? CAMERA_BOUNDS.sprintMultiplier : 1);

          const candidate: Vec3 = {
            x: cam.position.target.x + mx * speed * dt,
            y: cam.position.target.y + my * speed * dt,
            z: cam.position.target.z + mz * speed * dt,
          };
          cam.position.target = resolveFreeCameraCollision(candidate, curScale);
        }

        // 2. Apply pointer drag release inertia strictly during exploration
        if (!isDragging && !reducedMotion) {
          if (
            Math.abs(cam.orientation.velYaw) > 0.08 ||
            Math.abs(cam.orientation.velPitch) > 0.08
          ) {
            cam.orientation.targetYaw += cam.orientation.velYaw * dt;
            cam.orientation.targetPitch = clamp(
              cam.orientation.targetPitch + cam.orientation.velPitch * dt,
              CAMERA_BOUNDS.minPitch,
              CAMERA_BOUNDS.maxPitch,
            );
            const damping = Math.exp(-6.4 * dt);
            cam.orientation.velYaw *= damping;
            cam.orientation.velPitch *= damping;
            if (
              cam.orientation.targetPitch <= CAMERA_BOUNDS.minPitch ||
              cam.orientation.targetPitch >= CAMERA_BOUNDS.maxPitch
            ) {
              cam.orientation.velPitch = 0;
            }
          } else {
            cam.orientation.velYaw = 0;
            cam.orientation.velPitch = 0;
          }
        }
      }

      // 3. Smoothly interpolate camera position and orientation
      if (reducedMotion) {
        cam.orientation.yaw = cam.orientation.targetYaw;
        cam.orientation.pitch = cam.orientation.targetPitch;
        cam.position.current = { ...cam.position.target };
      } else {
        const isProgrammatic =
          mode === "approaching" || mode === "returning" || mode === "resetting";
        const rotSpeed = isProgrammatic ? 7.4 : isDragging ? 26 : 14;
        const posSpeed = isProgrammatic ? 7.0 : 12;
        const rotAlpha = 1 - Math.exp(-rotSpeed * dt);
        const posAlpha = 1 - Math.exp(-posSpeed * dt);

        cam.orientation.yaw +=
          (cam.orientation.targetYaw - cam.orientation.yaw) * rotAlpha;
        cam.orientation.pitch +=
          (cam.orientation.targetPitch - cam.orientation.pitch) * rotAlpha;
        cam.position.current.x +=
          (cam.position.target.x - cam.position.current.x) * posAlpha;
        cam.position.current.y +=
          (cam.position.target.y - cam.position.current.y) * posAlpha;
        cam.position.current.z +=
          (cam.position.target.z - cam.position.current.z) * posAlpha;

        if (mode === "explore") {
          cam.position.current = resolveFreeCameraCollision(
            cam.position.current,
            curScale,
          );
        }
      }

      // 4. Transition completion checks
      if (mode === "approaching" || mode === "returning" || mode === "resetting") {
        const posErr =
          Math.abs(cam.position.target.x - cam.position.current.x) +
          Math.abs(cam.position.target.y - cam.position.current.y) +
          Math.abs(cam.position.target.z - cam.position.current.z);
        const rotErr =
          Math.abs(cam.orientation.targetYaw - cam.orientation.yaw) +
          Math.abs(cam.orientation.targetPitch - cam.orientation.pitch);

        if (
          reducedMotion ||
          (posErr < TRANSITION_EPSILON_POS && rotErr < TRANSITION_EPSILON_DEG)
        ) {
          cam.orientation.yaw = cam.orientation.targetYaw;
          cam.orientation.pitch = cam.orientation.targetPitch;
          cam.position.current = { ...cam.position.target };

          if (mode === "approaching") {
            cam.navigation.mode = "focused";
          } else {
            cam.navigation.mode = "explore";
            cam.navigation.targetSection = null;
          }
          setIsTransitioning(false);
        }
      }

      const cx = cam.position.current.x;
      const cy = cam.position.current.y;
      const cz = cam.position.current.z;
      const yaw = cam.orientation.yaw;
      const pitch = cam.orientation.pitch;

      const viewport = viewportRef.current;
      if (viewport) {
        const floorNearZ = computeSafePlaneNearZ(
          FLOOR_ELEVATION_Y - cy,
          pitch,
          155,
        );
        const ceilNearZ = computeSafePlaneNearZ(
          CEILING_ELEVATION_Y - cy,
          pitch,
          155,
        );

        viewport.style.setProperty("--cam-yaw", `${yaw.toFixed(3)}deg`);
        viewport.style.setProperty("--cam-pitch", `${pitch.toFixed(3)}deg`);
        viewport.style.setProperty("--cam-x", `${cx.toFixed(2)}px`);
        viewport.style.setProperty("--cam-y", `${cy.toFixed(2)}px`);
        viewport.style.setProperty("--cam-z", `${cz.toFixed(2)}px`);
        viewport.style.setProperty("--floor-near-z", `${floorNearZ}px`);
        viewport.style.setProperty("--ceil-near-z", `${ceilNearZ}px`);

        // Orient central AI presenter around its vertical Y axis toward camera XZ position
        if (Math.hypot(cx, cz) > 20) {
          const faceYawDeg = (Math.atan2(cx, cz) * 180) / Math.PI;
          viewport.style.setProperty("--presenter-yaw", `${faceYawDeg.toFixed(2)}deg`);
        }
      }

      // Cull central AI presentation when behind eye plane or when inspecting a station
      const presenterEl = presenterRef.current;
      if (presenterEl) {
        const presenterZEye = worldToEyeZ(
          0,
          CENTRAL_PRESENTATION.y,
          0,
          cx,
          cy,
          cz,
          yaw,
          pitch,
        );
        const hidePresenter =
          Boolean(activeSectionRef.current) || presenterZEye > -240;
        if (presenterEl.dataset.hidden !== String(hidePresenter)) {
          presenterEl.dataset.hidden = String(hidePresenter);
          presenterEl.style.visibility = hidePresenter ? "hidden" : "visible";
        }
      }

      // Hide ceiling canopy when viewing from above so top-down view is unobstructed
      const ceilingEl = ceilingStageRef.current;
      if (ceilingEl) {
        const showCeiling = cy > CEILING_ELEVATION_Y + 40;
        if (ceilingEl.dataset.visible !== String(showCeiling)) {
          ceilingEl.dataset.visible = String(showCeiling);
          ceilingEl.style.visibility = showCeiling ? "visible" : "hidden";
        }
      }

      // 5. Eye-plane frustum culling strictly offscreen behind the camera
      const objectEls = objectElsRef.current;
      for (const station of worldStations) {
        const el = objectEls[station.section];
        if (!el) continue;
        const r = Math.round(station.radiusPx * curScale);
        const pos = polarToWorld(station.azimuthDeg, r, station.elevationY);
        const zEye = worldToEyeZ(
          pos.x,
          pos.y,
          pos.z,
          cx,
          cy,
          cz,
          yaw,
          pitch,
        );
        const isBehind = zEye > -190;
        if (el.dataset.behind !== String(isBehind)) {
          el.dataset.behind = String(isBehind);
          el.style.visibility = isBehind ? "hidden" : "visible";
        }
      }

      const horizonEls = horizonElsRef.current;
      for (let i = 0; i < HORIZON_PANELS; i += 1) {
        const el = horizonEls[i];
        if (!el) continue;
        const az = (i * 360) / HORIZON_PANELS;
        const pos = polarToWorld(az, HORIZON_RADIUS_PX, 0);
        const zEye = worldToEyeZ(
          pos.x,
          pos.y,
          pos.z,
          cx,
          cy,
          cz,
          yaw,
          pitch,
        );
        const isBehind = zEye > -290;
        if (el.dataset.behind !== String(isBehind)) {
          el.dataset.behind = String(isBehind);
          el.style.visibility = isBehind ? "hidden" : "visible";
        }
      }

      const particleEls = particleElsRef.current;
      for (let i = 0; i < particleCoords.length; i += 1) {
        const el = particleEls[i];
        if (!el) continue;
        const star = particleCoords[i];
        const pos = polarToWorld(star.azimuthDeg, star.radius, star.y);
        const zEye = worldToEyeZ(
          pos.x,
          pos.y,
          pos.z,
          cx,
          cy,
          cz,
          yaw,
          pitch,
        );
        const isBehind = zEye > -220;
        if (el.dataset.behind !== String(isBehind)) {
          el.dataset.behind = String(isBehind);
          el.style.visibility = isBehind ? "hidden" : "visible";
        }
      }

      // 6. Gate StationProjection visibility until camera aligns with target station
      const anchorEl = stationAnchorRef.current;
      const curActive = activeSectionRef.current;
      if (anchorEl && curActive) {
        const st = stationMap[curActive];
        const angleOff = Math.abs(shortestAngleDelta(yaw, st.azimuthDeg));
        const r = Math.round(st.radiusPx * curScale) - st.hologramForwardPx;
        const pos = polarToWorld(st.azimuthDeg, r, st.elevationY);
        const zEye = worldToEyeZ(
          pos.x,
          pos.y,
          pos.z,
          cx,
          cy,
          cz,
          yaw,
          pitch,
        );
        const ready =
          !isClosingRef.current && angleOff <= 38 && zEye < -260;
        if (anchorEl.dataset.ready !== String(ready)) {
          anchorEl.dataset.ready = String(ready);
        }
      }

      // 7. Throttled HUD telemetry publication (zero React rerenders)
      if (now - lastTelemetryTime > 80) {
        lastTelemetryTime = now;
        publishTelemetry({
          yawDeg: Math.round(yaw),
          pitchDeg: Math.round(pitch),
          posX: Math.round(cx),
          posY: Math.round(cy),
          posZ: Math.round(cz),
        });
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [
    ceilingStageRef,
    horizonElsRef,
    objectElsRef,
    particleCoords,
    particleElsRef,
    presenterRef,
    publishTelemetry,
    setIsTransitioning,
    stationAnchorRef,
    viewportRef,
  ]);

  // Pointer drag look + mobile two-finger pinch forward/backward movement
  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (activeSectionRef.current) return;
      if (cameraRef.current.navigation.mode !== "explore") return;
      if (event.pointerType === "mouse" && event.button !== 0) return;

      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      const session = dragRef.current;
      const cam = cameraRef.current;

      if (pointersRef.current.size === 1) {
        session.startX = event.clientX;
        session.startY = event.clientY;
        session.lastX = event.clientX;
        session.lastY = event.clientY;
        session.lastTime = performance.now();
        session.isDragging = false;
        session.pinchLastDist = null;
        suppressClickRef.current = false;
        cam.orientation.velYaw = 0;
        cam.orientation.velPitch = 0;
      } else if (pointersRef.current.size === 2) {
        const pts = Array.from(pointersRef.current.values());
        session.pinchLastDist = Math.hypot(
          pts[1].x - pts[0].x,
          pts[1].y - pts[0].y,
        );
        session.isDragging = true;
        suppressClickRef.current = true;
        setIsDraggingUI(true);
        markInteracted();
      }
    },
    [markInteracted],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (activeSectionRef.current) return;
      if (cameraRef.current.navigation.mode !== "explore") return;
      if (!pointersRef.current.has(event.pointerId)) return;

      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      const session = dragRef.current;
      const cam = cameraRef.current;

      if (pointersRef.current.size === 2 && session.pinchLastDist !== null) {
        const pts = Array.from(pointersRef.current.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const deltaDist = dist - session.pinchLastDist;
        session.pinchLastDist = dist;

        const dir = getViewDirection(
          cam.orientation.targetYaw,
          cam.orientation.targetPitch,
        );
        const step = deltaDist * 3.4;
        cam.position.target = resolveFreeCameraCollision(
          {
            x: cam.position.target.x + dir.x * step,
            y: cam.position.target.y + dir.y * step,
            z: cam.position.target.z + dir.z * step,
          },
          radiusScaleRef.current,
        );
        return;
      }

      if (pointersRef.current.size !== 1) return;

      const totalMoved = Math.hypot(
        event.clientX - session.startX,
        event.clientY - session.startY,
      );

      if (!session.isDragging && totalMoved >= DRAG_THRESHOLD_PX) {
        session.isDragging = true;
        suppressClickRef.current = true;
        setIsDraggingUI(true);
        markInteracted();
      }

      if (!session.isDragging) return;

      const now = performance.now();
      const dt = Math.max(0.008, (now - session.lastTime) / 1000);
      const dx = event.clientX - session.lastX;
      const dy = event.clientY - session.lastY;
      const isTouch = event.pointerType === "touch";
      const yawSensitivity = isTouch ? 0.28 : 0.22;
      const pitchSensitivity = isTouch ? 0.22 : 0.16;

      const dYaw = -dx * yawSensitivity;
      const dPitch = dy * pitchSensitivity;

      cam.orientation.targetYaw += dYaw;
      cam.orientation.targetPitch = clamp(
        cam.orientation.targetPitch + dPitch,
        CAMERA_BOUNDS.minPitch,
        CAMERA_BOUNDS.maxPitch,
      );

      cam.orientation.velYaw = clamp(dYaw / dt, -340, 340);
      cam.orientation.velPitch = clamp(dPitch / dt, -160, 160);

      session.lastX = event.clientX;
      session.lastY = event.clientY;
      session.lastTime = now;
    },
    [markInteracted],
  );

  const endPointer = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    const session = dragRef.current;

    if (pointersRef.current.size < 2) {
      session.pinchLastDist = null;
    }

    if (pointersRef.current.size === 0 && session.isDragging) {
      session.isDragging = false;
      setIsDraggingUI(false);
      requestAnimationFrame(() => {
        suppressClickRef.current = false;
      });
    }
  }, []);

  return {
    isDraggingUI,
    shouldSuppressClick,
    handlePointerDown,
    handlePointerMove,
    endPointer,
  };
}
