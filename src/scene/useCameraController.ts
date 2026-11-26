import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useEnvironmentNav, type SectionId } from "../state/environmentNav";
import {
  clamp,
  computeResponsivePerspective,
  computeSafePlaneNearZ,
  normalizeCompassDeg,
  polarToWorld,
  shortestAngleDelta,
  shortestAngleTarget,
  worldToEyeZ,
} from "./cameraMath";
import {
  CAMERA_LIMITS,
  CEILING_ELEVATION_Y,
  DEFAULT_CAMERA,
  FLOOR_ELEVATION_Y,
  HORIZON_PANELS,
  HORIZON_RADIUS_PX,
  stationMap,
  worldStations,
} from "./worldConfig";

const DRAG_THRESHOLD_PX = 6;
const TRANSITION_EPSILON_POS = 1.5;
const TRANSITION_EPSILON_DEG = 0.25;

type Vec3 = {
  x: number;
  y: number;
  z: number;
};

type SavedCameraSnapshot = {
  position: Vec3;
  yaw: number;
  pitch: number;
  zoom: number;
};

type AnimationPhase =
  | "explore"
  | "approaching"
  | "focused"
  | "returning"
  | "resetting";

type CameraRigState = {
  position: {
    current: Vec3;
    target: Vec3;
  };
  rotation: {
    yaw: number;
    targetYaw: number;
    velYaw: number;
    pitch: number;
    targetPitch: number;
    velPitch: number;
  };
  zoom: {
    current: number;
    target: number;
  };
  previousState: SavedCameraSnapshot | null;
  animation: {
    phase: AnimationPhase;
    targetSection: SectionId | null;
  };
};

type UseCameraControllerArgs = {
  viewportRef: RefObject<HTMLDivElement | null>;
  stationAnchorRef: RefObject<HTMLDivElement | null>;
  objectElsRef: RefObject<Partial<Record<SectionId, HTMLButtonElement | null>>>;
  horizonElsRef: RefObject<(HTMLDivElement | null)[]>;
  particleElsRef: RefObject<(HTMLSpanElement | null)[]>;
  particleCoords: { azimuthDeg: number; radius: number; y: number }[];
  radiusScale: number;
};

export function useCameraController({
  viewportRef,
  stationAnchorRef,
  objectElsRef,
  horizonElsRef,
  particleElsRef,
  particleCoords,
  radiusScale,
}: UseCameraControllerArgs) {
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

  // Centralized camera controller state (kept in ref to prevent React re-renders during movement)
  const rigRef = useRef<CameraRigState>({
    position: {
      current: { x: DEFAULT_CAMERA.x, y: DEFAULT_CAMERA.y, z: DEFAULT_CAMERA.z },
      target: { x: DEFAULT_CAMERA.x, y: DEFAULT_CAMERA.y, z: DEFAULT_CAMERA.z },
    },
    rotation: {
      yaw: DEFAULT_CAMERA.yaw,
      targetYaw: DEFAULT_CAMERA.yaw,
      velYaw: 0,
      pitch: DEFAULT_CAMERA.pitch,
      targetPitch: DEFAULT_CAMERA.pitch,
      velPitch: 0,
    },
    zoom: {
      current: DEFAULT_CAMERA.zoom,
      target: DEFAULT_CAMERA.zoom,
    },
    previousState: null,
    animation: {
      phase: "explore",
      targetSection: null,
    },
  });

  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragSessionRef = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    isDragging: false,
    pinchStartDist: null as number | null,
    pinchStartZoom: DEFAULT_CAMERA.zoom as number,
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
    const phase = rigRef.current.animation.phase;
    return (
      suppressClickRef.current ||
      phase === "approaching" ||
      phase === "returning" ||
      phase === "resetting"
    );
  }, []);

  // Fixed perspective per viewport resize (never mutated during wheel zoom or drag)
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

  // Station Selection & Return transition orchestrator
  useEffect(() => {
    const rig = rigRef.current;

    if (activeSection && !isClosing) {
      // Save visitor's exact camera state only when transitioning from free exploration
      if (!rig.previousState) {
        rig.previousState = {
          position: { ...rig.position.target },
          yaw: rig.rotation.targetYaw,
          pitch: rig.rotation.targetPitch,
          zoom: rig.zoom.target,
        };
      }

      const station = stationMap[activeSection];
      const scaledR = Math.round(station.radiusPx * radiusScale);
      const hologramR = scaledR - station.hologramForwardPx;
      const approachDist = hologramR - fixedPerspectiveRef.current;
      const targetPos = polarToWorld(
        station.azimuthDeg,
        approachDist,
        station.elevationY,
      );

      rig.rotation.velYaw = 0;
      rig.rotation.velPitch = 0;
      rig.rotation.targetYaw = shortestAngleTarget(
        rig.rotation.yaw,
        station.azimuthDeg,
      );
      rig.rotation.targetPitch = 0;
      rig.zoom.target = 0;
      rig.position.target = targetPos;

      rig.animation.phase = "approaching";
      rig.animation.targetSection = activeSection;
      setIsTransitioning(true);
    } else if ((!activeSection || isClosing) && rig.previousState) {
      // Restore exact saved camera position, yaw, pitch, and zoom
      const prev = rig.previousState;
      rig.rotation.velYaw = 0;
      rig.rotation.velPitch = 0;
      rig.rotation.targetYaw = shortestAngleTarget(
        rig.rotation.yaw,
        normalizeCompassDeg(prev.yaw),
      );
      rig.rotation.targetPitch = prev.pitch;
      rig.zoom.target = prev.zoom;
      rig.position.target = { ...prev.position };

      rig.animation.phase = "returning";
      rig.animation.targetSection = null;
      setIsTransitioning(true);

      if (!activeSection) {
        rig.previousState = null;
      }
    }
  }, [activeSection, isClosing, radiusScale, setIsTransitioning]);

  // Explicit Reset Camera command -> restore elevated top-down initial pose
  useEffect(() => {
    if (resetNonce === 0) return;
    const rig = rigRef.current;
    rig.previousState = null;
    rig.rotation.velYaw = 0;
    rig.rotation.velPitch = 0;
    rig.rotation.targetYaw = shortestAngleTarget(rig.rotation.yaw, DEFAULT_CAMERA.yaw);
    rig.rotation.targetPitch = DEFAULT_CAMERA.pitch;
    rig.zoom.target = DEFAULT_CAMERA.zoom;
    rig.position.target = {
      x: DEFAULT_CAMERA.x,
      y: DEFAULT_CAMERA.y,
      z: DEFAULT_CAMERA.z,
    };
    rig.animation.phase = "resetting";
    rig.animation.targetSection = null;
    setIsTransitioning(true);
  }, [resetNonce, setIsTransitioning]);

  // Keyboard Tab / Index aim preview (when in exploration mode)
  useEffect(() => {
    if (!aimRequest || activeSection) return;
    const rig = rigRef.current;
    if (rig.animation.phase !== "explore") return;
    const station = stationMap[aimRequest.section];
    rig.rotation.velYaw = 0;
    rig.rotation.velPitch = 0;
    rig.rotation.targetYaw = shortestAngleTarget(rig.rotation.yaw, station.azimuthDeg);
    rig.rotation.targetPitch = clamp(-14, CAMERA_LIMITS.minPitch, CAMERA_LIMITS.maxPitch);
  }, [aimRequest, activeSection]);

  // Main 60fps simulation & GPU-only transform loop (zero React re-renders)
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

      const rig = rigRef.current;
      const reducedMotion = reducedMotionQuery.matches;
      const phase = rig.animation.phase;
      const isDragging = dragSessionRef.current.isDragging;
      const controlsLocked = phase !== "explore";

      // Apply inertial coasting strictly during free exploration after pointer release
      if (!controlsLocked && !isDragging && !reducedMotion) {
        if (
          Math.abs(rig.rotation.velYaw) > 0.08 ||
          Math.abs(rig.rotation.velPitch) > 0.08
        ) {
          rig.rotation.targetYaw += rig.rotation.velYaw * dt;
          rig.rotation.targetPitch = clamp(
            rig.rotation.targetPitch + rig.rotation.velPitch * dt,
            CAMERA_LIMITS.minPitch,
            CAMERA_LIMITS.maxPitch,
          );
          const damping = Math.exp(-6.2 * dt);
          rig.rotation.velYaw *= damping;
          rig.rotation.velPitch *= damping;
          if (
            rig.rotation.targetPitch <= CAMERA_LIMITS.minPitch ||
            rig.rotation.targetPitch >= CAMERA_LIMITS.maxPitch
          ) {
            rig.rotation.velPitch = 0;
          }
        } else {
          rig.rotation.velYaw = 0;
          rig.rotation.velPitch = 0;
        }
      }

      if (reducedMotion) {
        rig.rotation.yaw = rig.rotation.targetYaw;
        rig.rotation.pitch = rig.rotation.targetPitch;
        rig.zoom.current = rig.zoom.target;
        rig.position.current = { ...rig.position.target };
      } else {
        const lerpSpeed =
          phase === "approaching" || phase === "returning" || phase === "resetting"
            ? 7.2
            : isDragging
              ? 26
              : 12;
        const alpha = 1 - Math.exp(-lerpSpeed * dt);
        rig.rotation.yaw += (rig.rotation.targetYaw - rig.rotation.yaw) * alpha;
        rig.rotation.pitch += (rig.rotation.targetPitch - rig.rotation.pitch) * alpha;
        rig.zoom.current += (rig.zoom.target - rig.zoom.current) * alpha;
        rig.position.current.x +=
          (rig.position.target.x - rig.position.current.x) * alpha;
        rig.position.current.y +=
          (rig.position.target.y - rig.position.current.y) * alpha;
        rig.position.current.z +=
          (rig.position.target.z - rig.position.current.z) * alpha;
      }

      // Check transition completion
      if (
        phase === "approaching" ||
        phase === "returning" ||
        phase === "resetting"
      ) {
        const posErr =
          Math.abs(rig.position.target.x - rig.position.current.x) +
          Math.abs(rig.position.target.y - rig.position.current.y) +
          Math.abs(rig.position.target.z - rig.position.current.z);
        const rotErr =
          Math.abs(rig.rotation.targetYaw - rig.rotation.yaw) +
          Math.abs(rig.rotation.targetPitch - rig.rotation.pitch);
        const zoomErr = Math.abs(rig.zoom.target - rig.zoom.current);

        if (
          reducedMotion ||
          (posErr < TRANSITION_EPSILON_POS &&
            rotErr < TRANSITION_EPSILON_DEG &&
            zoomErr < TRANSITION_EPSILON_POS)
        ) {
          rig.rotation.yaw = rig.rotation.targetYaw;
          rig.rotation.pitch = rig.rotation.targetPitch;
          rig.zoom.current = rig.zoom.target;
          rig.position.current = { ...rig.position.target };

          if (phase === "approaching") {
            rig.animation.phase = "focused";
          } else {
            rig.animation.phase = "explore";
            rig.animation.targetSection = null;
          }
          setIsTransitioning(false);
        }
      }

      const cx = rig.position.current.x;
      const cy = rig.position.current.y;
      const cz = rig.position.current.z;
      const yaw = rig.rotation.yaw;
      const pitch = rig.rotation.pitch;
      const zoom = rig.zoom.current;

      const viewport = viewportRef.current;
      if (viewport) {
        const floorNearZ = computeSafePlaneNearZ(
          FLOOR_ELEVATION_Y - cy,
          pitch,
          zoom,
          155,
        );
        const ceilNearZ = computeSafePlaneNearZ(
          CEILING_ELEVATION_Y - cy,
          pitch,
          zoom,
          155,
        );

        viewport.style.setProperty("--cam-yaw", `${yaw.toFixed(3)}deg`);
        viewport.style.setProperty("--cam-pitch", `${pitch.toFixed(3)}deg`);
        viewport.style.setProperty("--cam-zoom", `${zoom.toFixed(2)}px`);
        viewport.style.setProperty("--cam-x", `${cx.toFixed(2)}px`);
        viewport.style.setProperty("--cam-y", `${cy.toFixed(2)}px`);
        viewport.style.setProperty("--cam-z", `${cz.toFixed(2)}px`);
        viewport.style.setProperty("--floor-near-z", `${floorNearZ}px`);
        viewport.style.setProperty("--ceil-near-z", `${ceilNearZ}px`);
      }

      // Cull behind-eye objects strictly far outside the horizontal screen boundary
      const curScale = radiusScaleRef.current;
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
          zoom,
        );
        const isBehind = zEye > -210;
        if (el.dataset.behind !== String(isBehind)) {
          el.dataset.behind = String(isBehind);
          el.style.visibility = isBehind ? "hidden" : "visible";
        }
      }

      // Cull 360deg horizon wall panels strictly offscreen behind the eye
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
          zoom,
        );
        const isBehind = zEye > -290;
        if (el.dataset.behind !== String(isBehind)) {
          el.dataset.behind = String(isBehind);
          el.style.visibility = isBehind ? "hidden" : "visible";
        }
      }

      // Cull 360deg star particles behind the eye
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
          zoom,
        );
        const isBehind = zEye > -220;
        if (el.dataset.behind !== String(isBehind)) {
          el.dataset.behind = String(isBehind);
          el.style.visibility = isBehind ? "hidden" : "visible";
        }
      }

      // Reveal active StationProjection only when camera faces within 38deg and in front of eye
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
          zoom,
        );
        const ready =
          !isClosingRef.current && angleOff <= 38 && zEye < -260;
        if (anchorEl.dataset.ready !== String(ready)) {
          anchorEl.dataset.ready = String(ready);
        }
      }

      // Publish compass/pitch telemetry without causing React re-renders
      if (now - lastTelemetryTime > 80) {
        lastTelemetryTime = now;
        publishTelemetry({
          yawDeg: Math.round(yaw),
          pitchDeg: Math.round(pitch),
          zoomPx: Math.round(zoom),
        });
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [
    horizonElsRef,
    objectElsRef,
    particleCoords,
    particleElsRef,
    publishTelemetry,
    setIsTransitioning,
    stationAnchorRef,
    viewportRef,
  ]);

  // Wheel zoom: exclusively adjusts camera distance (never changes station)
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      if (activeSectionRef.current) return;
      if (rigRef.current.animation.phase !== "explore") return;
      event.preventDefault();
      markInteracted();
      const rig = rigRef.current;
      rig.zoom.target = clamp(
        rig.zoom.target - event.deltaY * 0.65,
        CAMERA_LIMITS.minZoom,
        CAMERA_LIMITS.maxZoom,
      );
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [markInteracted, viewportRef]);

  // Keyboard exploration controls
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (activeSectionRef.current) return;
      if (rigRef.current.animation.phase !== "explore") return;
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

      const rig = rigRef.current;
      let handled = true;

      switch (event.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          rig.rotation.targetYaw -= 18;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          rig.rotation.targetYaw += 18;
          break;
        case "ArrowUp":
        case "w":
        case "W":
          rig.rotation.targetPitch = clamp(
            rig.rotation.targetPitch + 9,
            CAMERA_LIMITS.minPitch,
            CAMERA_LIMITS.maxPitch,
          );
          break;
        case "ArrowDown":
        case "s":
        case "S":
          rig.rotation.targetPitch = clamp(
            rig.rotation.targetPitch - 9,
            CAMERA_LIMITS.minPitch,
            CAMERA_LIMITS.maxPitch,
          );
          break;
        case "+":
        case "=":
          rig.zoom.target = clamp(
            rig.zoom.target + 90,
            CAMERA_LIMITS.minZoom,
            CAMERA_LIMITS.maxZoom,
          );
          break;
        case "-":
        case "_":
          rig.zoom.target = clamp(
            rig.zoom.target - 90,
            CAMERA_LIMITS.minZoom,
            CAMERA_LIMITS.maxZoom,
          );
          break;
        default:
          handled = false;
      }

      if (handled) {
        event.preventDefault();
        rig.rotation.velYaw = 0;
        rig.rotation.velPitch = 0;
        markInteracted();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [markInteracted]);

  // Pointer drag + pinch handlers
  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (activeSectionRef.current) return;
      if (rigRef.current.animation.phase !== "explore") return;
      if (event.pointerType === "mouse" && event.button !== 0) return;

      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      const session = dragSessionRef.current;
      const rig = rigRef.current;

      if (pointersRef.current.size === 1) {
        session.startX = event.clientX;
        session.startY = event.clientY;
        session.lastX = event.clientX;
        session.lastY = event.clientY;
        session.lastTime = performance.now();
        session.isDragging = false;
        session.pinchStartDist = null;
        suppressClickRef.current = false;
        rig.rotation.velYaw = 0;
        rig.rotation.velPitch = 0;
      } else if (pointersRef.current.size === 2) {
        const pts = Array.from(pointersRef.current.values());
        session.pinchStartDist = Math.hypot(
          pts[1].x - pts[0].x,
          pts[1].y - pts[0].y,
        );
        session.pinchStartZoom = rig.zoom.target;
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
      if (rigRef.current.animation.phase !== "explore") return;
      if (!pointersRef.current.has(event.pointerId)) return;

      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      const session = dragSessionRef.current;
      const rig = rigRef.current;

      if (pointersRef.current.size === 2 && session.pinchStartDist) {
        const pts = Array.from(pointersRef.current.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const deltaDist = dist - session.pinchStartDist;
        rig.zoom.target = clamp(
          session.pinchStartZoom + deltaDist * 2.1,
          CAMERA_LIMITS.minZoom,
          CAMERA_LIMITS.maxZoom,
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

      rig.rotation.targetYaw += dYaw;
      rig.rotation.targetPitch = clamp(
        rig.rotation.targetPitch + dPitch,
        CAMERA_LIMITS.minPitch,
        CAMERA_LIMITS.maxPitch,
      );

      rig.rotation.velYaw = clamp(dYaw / dt, -340, 340);
      rig.rotation.velPitch = clamp(dPitch / dt, -160, 160);

      session.lastX = event.clientX;
      session.lastY = event.clientY;
      session.lastTime = now;
    },
    [markInteracted],
  );

  const endPointer = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    const session = dragSessionRef.current;

    if (pointersRef.current.size < 2) {
      session.pinchStartDist = null;
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
