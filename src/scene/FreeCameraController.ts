import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useEnvironmentNav, type SectionId } from "../state/environmentNav";
import {
  clamp,
  computeDefaultCamera,
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
  FLOOR_ELEVATION_Y,
  stationMap,
  worldStations,
} from "./worldConfig";

const DRAG_THRESHOLD_PX = 6;

type SavedCameraPose = {
  position: Vec3;
  yaw: number;
  pitch: number;
};

type CameraPose = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
};

type ActiveTween = {
  from: CameraPose;
  to: CameraPose;
  startTimeMs: number;
  durationMs: number;
  kind: "approaching" | "returning" | "resetting";
  targetSection: SectionId | null;
};

function easeInOutCubic(t: number): number {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

function computeTransitionDurationMs(from: CameraPose, to: CameraPose): number {
  const dist = Math.hypot(to.x - from.x, to.y - from.y, to.z - from.z);
  const angular = Math.hypot(to.yaw - from.yaw, to.pitch - from.pitch);
  return clamp(Math.round(520 + dist * 0.14 + angular * 1.3), 580, 960);
}

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
    tween: ActiveTween | null;
  };
};

type FreeCameraControllerArgs = {
  viewportRef: RefObject<HTMLDivElement | null>;
  ceilingStageRef: RefObject<HTMLDivElement | null>;
  presenterRef: RefObject<HTMLDivElement | null>;
  stationAnchorRef: RefObject<HTMLDivElement | null>;
  objectElsRef: RefObject<Partial<Record<SectionId, HTMLButtonElement | null>>>;
  horizonElsRef: RefObject<(HTMLDivElement | null)[]>;
  horizonAngles: number[];
  horizonRadiusPx: number;
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
  horizonAngles,
  horizonRadiusPx,
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

  const initialWidth = typeof window !== "undefined" ? window.innerWidth : 1280;
  const fixedPerspectiveRef = useRef<number>(
    computeResponsivePerspective(initialWidth),
  );

  const initialDefaults = computeDefaultCamera(initialWidth);

  // Centralized Free-Roaming Camera State (ref-based for zero React rerenders per frame)
  const cameraRef = useRef<FreeCameraState>({
    position: {
      current: { x: initialDefaults.x, y: initialDefaults.y, z: initialDefaults.z },
      target: { x: initialDefaults.x, y: initialDefaults.y, z: initialDefaults.z },
    },
    orientation: {
      yaw: initialDefaults.yaw,
      targetYaw: initialDefaults.yaw,
      velYaw: 0,
      pitch: initialDefaults.pitch,
      targetPitch: initialDefaults.pitch,
      velPitch: 0,
    },
    navigation: {
      mode: "explore",
      targetSection: null,
      previousPose: null,
      tween: null,
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
  const wakeSimulationRef = useRef<() => void>(() => {});
  const lastNavCommandRef = useRef({
    activeSection: null as SectionId | null,
    isClosing: false,
    resetNonce: 0,
    radiusScale,
  });

  useEffect(() => {
    activeSectionRef.current = activeSection;
    isClosingRef.current = isClosing;
    radiusScaleRef.current = radiusScale;
  }, [activeSection, isClosing, radiusScale]);

  const shouldSuppressClick = useCallback(() => {
    return suppressClickRef.current;
  }, []);

  const interruptTweenToExplore = useCallback(() => {
    const cam = cameraRef.current;
    if (cam.navigation.mode !== "returning" && cam.navigation.mode !== "resetting") {
      return;
    }
    cam.navigation.tween = null;
    cam.navigation.mode = "explore";
    cam.navigation.targetSection = null;
    cam.navigation.previousPose = null;
    cam.position.target = { ...cam.position.current };
    cam.orientation.targetYaw = cam.orientation.yaw;
    cam.orientation.targetPitch = cam.orientation.pitch;
    cam.orientation.velYaw = 0;
    cam.orientation.velPitch = 0;
    setIsTransitioning(false);
  }, [setIsTransitioning]);

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

  // Coordinated station selection, switch, exit & reset transition engine
  useEffect(() => {
    const prevCmd = lastNavCommandRef.current;
    const resetTriggered = resetNonce !== prevCmd.resetNonce;
    const sectionChanged = activeSection !== prevCmd.activeSection;
    const closingTriggered = isClosing && !prevCmd.isClosing;
    const scaleChangedWhileOpen =
      radiusScale !== prevCmd.radiusScale && Boolean(activeSection && !isClosing);

    lastNavCommandRef.current = {
      activeSection,
      isClosing,
      resetNonce,
      radiusScale,
    };

    const cam = cameraRef.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const startTween = (
      to: CameraPose,
      kind: ActiveTween["kind"],
      targetSection: SectionId | null,
    ) => {
      const liveFrom: CameraPose = {
        x: cam.position.current.x,
        y: cam.position.current.y,
        z: cam.position.current.z,
        yaw: cam.orientation.yaw,
        pitch: cam.orientation.pitch,
      };
      cam.orientation.velYaw = 0;
      cam.orientation.velPitch = 0;
      cam.orientation.targetYaw = to.yaw;
      cam.orientation.targetPitch = to.pitch;
      cam.position.target = { x: to.x, y: to.y, z: to.z };

      const durationMs = reducedMotion
        ? 0
        : computeTransitionDurationMs(liveFrom, to);

      cam.navigation.tween = {
        from: liveFrom,
        to,
        startTimeMs: performance.now(),
        durationMs,
        kind,
        targetSection,
      };
      cam.navigation.mode = kind;
      cam.navigation.targetSection = targetSection;
      setIsTransitioning(true);
      wakeSimulationRef.current();
    };

    if (resetTriggered) {
      pressedKeysRef.current.clear();
      cam.navigation.previousPose = null;
      const resetDefaults = computeDefaultCamera(window.innerWidth);
      startTween(
        {
          x: resetDefaults.x,
          y: resetDefaults.y,
          z: resetDefaults.z,
          yaw: shortestAngleTarget(cam.orientation.yaw, resetDefaults.yaw),
          pitch: resetDefaults.pitch,
        },
        "resetting",
        null,
      );
      return;
    }

    if (activeSection && !isClosing) {
      if (sectionChanged || scaleChangedWhileOpen || prevCmd.isClosing) {
        pressedKeysRef.current.clear();

        if (!cam.navigation.previousPose) {
          cam.navigation.previousPose = {
            position: { ...cam.position.current },
            yaw: cam.orientation.yaw,
            pitch: cam.orientation.pitch,
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

        startTween(
          {
            x: destination.x,
            y: destination.y,
            z: destination.z,
            yaw: shortestAngleTarget(cam.orientation.yaw, station.azimuthDeg),
            pitch: 0,
          },
          "approaching",
          activeSection,
        );
      }
      return;
    }

    if (
      (closingTriggered ||
        (!activeSection && sectionChanged && !prevCmd.isClosing)) &&
      cam.navigation.previousPose
    ) {
      const prev = cam.navigation.previousPose;
      startTween(
        {
          x: prev.position.x,
          y: prev.position.y,
          z: prev.position.z,
          yaw: shortestAngleTarget(
            cam.orientation.yaw,
            normalizeCompassDeg(prev.yaw),
          ),
          pitch: prev.pitch,
        },
        "returning",
        null,
      );
    }
  }, [activeSection, isClosing, resetNonce, radiusScale, setIsTransitioning]);

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
    wakeSimulationRef.current();
  }, [aimRequest, activeSection, radiusScale]);

  // Keyboard input listeners (WASD / QE / Arrows / Shift)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (activeSectionRef.current) return;
      const mode = cameraRef.current.navigation.mode;
      if (mode !== "explore" && mode !== "returning" && mode !== "resetting") {
        return;
      }
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
        if (key !== "shift" && mode !== "explore") {
          interruptTweenToExplore();
        }
        pressedKeysRef.current.add(key);
        if (key !== "shift") {
          markInteracted();
          wakeSimulationRef.current();
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
  }, [interruptTweenToExplore, markInteracted]);

  // Mouse wheel: move forward/backward freely along viewing direction
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      if (activeSectionRef.current) return;
      const mode = cameraRef.current.navigation.mode;
      if (mode !== "explore" && mode !== "returning" && mode !== "resetting") {
        return;
      }
      event.preventDefault();
      if (mode !== "explore") {
        interruptTweenToExplore();
      }
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
      wakeSimulationRef.current();
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [interruptTweenToExplore, markInteracted, viewportRef]);

  // Main demand-driven Free-Flight & Cubic Ease-In-Out Transition simulation loop
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let lastTelemetryTime = 0;
    let lastCameraCssKey = "";
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

      // 3. Evaluate programmatic cubic ease-in-out transition OR responsive exploration tracking
      const activeTween = cam.navigation.tween;
      if (activeTween) {
        const progress =
          reducedMotion || activeTween.durationMs <= 0
            ? 1
            : clamp((now - activeTween.startTimeMs) / activeTween.durationMs, 0, 1);
        const eased = easeInOutCubic(progress);

        cam.position.current.x =
          activeTween.from.x + (activeTween.to.x - activeTween.from.x) * eased;
        cam.position.current.y =
          activeTween.from.y + (activeTween.to.y - activeTween.from.y) * eased;
        cam.position.current.z =
          activeTween.from.z + (activeTween.to.z - activeTween.from.z) * eased;
        cam.orientation.yaw =
          activeTween.from.yaw +
          (activeTween.to.yaw - activeTween.from.yaw) * eased;
        cam.orientation.pitch =
          activeTween.from.pitch +
          (activeTween.to.pitch - activeTween.from.pitch) * eased;

        if (progress >= 1) {
          cam.orientation.yaw = activeTween.to.yaw;
          cam.orientation.targetYaw = activeTween.to.yaw;
          cam.orientation.pitch = activeTween.to.pitch;
          cam.orientation.targetPitch = activeTween.to.pitch;
          cam.orientation.velYaw = 0;
          cam.orientation.velPitch = 0;
          cam.position.current = {
            x: activeTween.to.x,
            y: activeTween.to.y,
            z: activeTween.to.z,
          };
          cam.position.target = {
            x: activeTween.to.x,
            y: activeTween.to.y,
            z: activeTween.to.z,
          };
          cam.navigation.tween = null;

          if (activeTween.kind === "approaching") {
            cam.navigation.mode = "focused";
          } else {
            cam.navigation.mode = "explore";
            cam.navigation.targetSection = null;
            cam.navigation.previousPose = null;
          }
          setIsTransitioning(false);
        }
      } else if (reducedMotion) {
        cam.orientation.yaw = cam.orientation.targetYaw;
        cam.orientation.pitch = cam.orientation.targetPitch;
        cam.position.current = { ...cam.position.target };
      } else {
        const rotSpeed = isDragging ? 26 : 14;
        const posSpeed = 12;
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

      const cx = cam.position.current.x;
      const cy = cam.position.current.y;
      const cz = cam.position.current.z;
      const yaw = cam.orientation.yaw;
      const pitch = cam.orientation.pitch;

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

      const yawStr = `${yaw.toFixed(3)}deg`;
      const pitchStr = `${pitch.toFixed(3)}deg`;
      const xStr = `${cx.toFixed(2)}px`;
      const yStr = `${cy.toFixed(2)}px`;
      const zStr = `${cz.toFixed(2)}px`;
      const floorStr = `${floorNearZ.toFixed(2)}px`;
      const ceilStr = `${ceilNearZ.toFixed(2)}px`;
      const cssKey = `${yawStr}|${pitchStr}|${xStr}|${yStr}|${zStr}|${floorStr}|${ceilStr}|${curScale}|${horizonAngles.length}|${particleCoords.length}|${String(activeSectionRef.current)}|${isClosingRef.current}`;

      const cssChanged = cssKey !== lastCameraCssKey;
      if (cssChanged) {
        lastCameraCssKey = cssKey;

        const viewport = viewportRef.current;
        if (viewport) {
          viewport.style.setProperty("--cam-yaw", yawStr);
          viewport.style.setProperty("--cam-pitch", pitchStr);
          viewport.style.setProperty("--cam-x", xStr);
          viewport.style.setProperty("--cam-y", yStr);
          viewport.style.setProperty("--cam-z", zStr);
          viewport.style.setProperty("--floor-near-z", floorStr);
          viewport.style.setProperty("--ceil-near-z", ceilStr);

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

          // Keep central presenter facing camera only while in front of lens so passing near origin never flips it 180deg
          if (presenterZEye < -90 && Math.hypot(cx, cz) > 48) {
            const faceYawDeg = (Math.atan2(cx, cz) * 180) / Math.PI;
            viewport.style.setProperty("--presenter-yaw", `${faceYawDeg.toFixed(2)}deg`);
          }

          // Cull central AI presentation strictly when behind the near eye plane
          const presenterEl = presenterRef.current;
          if (presenterEl) {
            const hidePresenter = presenterZEye > -75;
            if (presenterEl.dataset.hidden !== String(hidePresenter)) {
              presenterEl.dataset.hidden = String(hidePresenter);
              presenterEl.style.visibility = hidePresenter ? "hidden" : "visible";
            }
          }
        }

        // Smoothly reveal overhead canopy as camera descends below elevated overview
        const ceilingEl = ceilingStageRef.current;
        if (ceilingEl) {
          const ceilingAlpha = clamp((cy + 720) / 260, 0, 1);
          const showCeiling = ceilingAlpha > 0.004;
          if (ceilingEl.dataset.visible !== String(showCeiling)) {
            ceilingEl.dataset.visible = String(showCeiling);
            ceilingEl.style.visibility = showCeiling ? "visible" : "hidden";
          }
          if (showCeiling) {
            ceilingEl.style.opacity = ceilingAlpha.toFixed(3);
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
          const isBehind = zEye > -45;
          if (el.dataset.behind !== String(isBehind)) {
            el.dataset.behind = String(isBehind);
            el.style.visibility = isBehind ? "hidden" : "visible";
          }
        }

        const horizonEls = horizonElsRef.current;
        for (let i = 0; i < horizonAngles.length; i += 1) {
          const el = horizonEls[i];
          if (!el) continue;
          const az = horizonAngles[i];
          const pos = polarToWorld(az, horizonRadiusPx, 0);
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
          const isBehind = zEye > -55;
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
          const isBehind = zEye > -30;
          if (el.dataset.behind !== String(isBehind)) {
            el.dataset.behind = String(isBehind);
            el.style.visibility = isBehind ? "hidden" : "visible";
          }
        }

        // 6. Reveal StationProjection once camera nears & aligns with target station
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
          const maxReadyDist = fixedPerspectiveRef.current + 360;
          const ready =
            !isClosingRef.current &&
            angleOff <= 30 &&
            Math.abs(pitch) <= 16 &&
            zEye < -260 &&
            zEye >= -maxReadyDist;
          if (anchorEl.classList.contains("is-ready") !== ready) {
            anchorEl.classList.toggle("is-ready", ready);
          }
        }
      }

      const posSettled =
        Math.abs(cam.position.target.x - cx) < 0.05 &&
        Math.abs(cam.position.target.y - cy) < 0.05 &&
        Math.abs(cam.position.target.z - cz) < 0.05;
      const rotSettled =
        Math.abs(cam.orientation.targetYaw - yaw) < 0.01 &&
        Math.abs(cam.orientation.targetPitch - pitch) < 0.01 &&
        Math.abs(cam.orientation.velYaw) <= 0.08 &&
        Math.abs(cam.orientation.velPitch) <= 0.08;
      const keys = pressedKeysRef.current;
      const hasMovementKey =
        keys.has("w") ||
        keys.has("a") ||
        keys.has("s") ||
        keys.has("d") ||
        keys.has("q") ||
        keys.has("e") ||
        keys.has("arrowup") ||
        keys.has("arrowdown") ||
        keys.has("arrowleft") ||
        keys.has("arrowright");

      const keepRunning =
        Boolean(cam.navigation.tween) ||
        dragRef.current.isDragging ||
        hasMovementKey ||
        !posSettled ||
        !rotSettled;

      // 7. Throttled HUD telemetry publication (zero React rerenders)
      if (!keepRunning || (cssChanged && now - lastTelemetryTime > 80)) {
        lastTelemetryTime = now;
        publishTelemetry({
          yawDeg: Math.round(yaw),
          pitchDeg: Math.round(pitch),
          posX: Math.round(cx),
          posY: Math.round(cy),
          posZ: Math.round(cz),
        });
      }

      if (keepRunning) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = 0;
        cam.position.current = { ...cam.position.target };
        cam.orientation.yaw = cam.orientation.targetYaw;
        cam.orientation.pitch = cam.orientation.targetPitch;
      }
    };

    const wakeSimulation = () => {
      if (!rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(step);
      }
    };

    wakeSimulationRef.current = wakeSimulation;
    step(performance.now());

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      wakeSimulationRef.current = () => {};
    };
  }, [
    ceilingStageRef,
    horizonAngles,
    horizonElsRef,
    horizonRadiusPx,
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
      const mode = cameraRef.current.navigation.mode;
      if (mode !== "explore" && mode !== "returning" && mode !== "resetting") {
        return;
      }
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
        interruptTweenToExplore();
        const pts = Array.from(pointersRef.current.values());
        session.pinchLastDist = Math.hypot(
          pts[1].x - pts[0].x,
          pts[1].y - pts[0].y,
        );
        session.isDragging = true;
        suppressClickRef.current = true;
        setIsDraggingUI(true);
        markInteracted();
        wakeSimulationRef.current();
      }
    },
    [interruptTweenToExplore, markInteracted],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (activeSectionRef.current) return;
      const mode = cameraRef.current.navigation.mode;
      if (mode !== "explore" && mode !== "returning" && mode !== "resetting") {
        return;
      }
      if (!pointersRef.current.has(event.pointerId)) return;

      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      const session = dragRef.current;
      const cam = cameraRef.current;

      if (pointersRef.current.size === 2 && session.pinchLastDist !== null) {
        interruptTweenToExplore();
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
        wakeSimulationRef.current();
        return;
      }

      if (pointersRef.current.size !== 1) return;

      const totalMoved = Math.hypot(
        event.clientX - session.startX,
        event.clientY - session.startY,
      );

      if (!session.isDragging && totalMoved >= DRAG_THRESHOLD_PX) {
        interruptTweenToExplore();
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
      wakeSimulationRef.current();
    },
    [interruptTweenToExplore, markInteracted],
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
