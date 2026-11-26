import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  EnvironmentNavContext,
  type AimRequest,
  type CameraTelemetry,
  type SectionId,
  type TelemetryListener,
} from "./environmentNav";
import { DEFAULT_CAMERA } from "../scene/worldConfig";

const CLOSE_DELAY_MS = 180;

export function EnvironmentNavProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [resetNonce, setResetNonce] = useState(0);
  const [aimRequest, setAimRequest] = useState<AimRequest | null>(null);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const objectTriggers = useRef<Partial<Record<SectionId, HTMLButtonElement | null>>>({});
  const telemetryListeners = useRef<Set<TelemetryListener>>(new Set());
  const latestTelemetry = useRef<CameraTelemetry>({
    yawDeg: DEFAULT_CAMERA.yaw,
    pitchDeg: DEFAULT_CAMERA.pitch,
    posX: DEFAULT_CAMERA.x,
    posY: DEFAULT_CAMERA.y,
    posZ: DEFAULT_CAMERA.z,
  });

  const registerObjectTrigger = useCallback(
    (section: SectionId, element: HTMLButtonElement | null) => {
      objectTriggers.current[section] = element;
    },
    [],
  );

  const markInteracted = useCallback(() => {
    setHasInteracted((prev) => (prev ? prev : true));
  }, []);

  const publishTelemetry = useCallback((telemetry: CameraTelemetry) => {
    latestTelemetry.current = telemetry;
    for (const listener of telemetryListeners.current) {
      listener(telemetry);
    }
  }, []);

  const subscribeTelemetry = useCallback((listener: TelemetryListener) => {
    telemetryListeners.current.add(listener);
    listener(latestTelemetry.current);
    return () => {
      telemetryListeners.current.delete(listener);
    };
  }, []);

  const openSection = useCallback(
    (section: SectionId) => {
      if (activeSection === section && !isClosing) return;
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      if (!activeSection) {
        lastFocused.current =
          (document.activeElement as HTMLElement | null) ??
          objectTriggers.current[section] ??
          null;
      }
      setHasInteracted(true);
      setIsClosing(false);
      setActiveSection(section);
    },
    [activeSection, isClosing],
  );

  const closeSection = useCallback(() => {
    if (!activeSection || isClosing || closeTimer.current) return;
    const closingTarget = activeSection;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = prefersReducedMotion ? 0 : CLOSE_DELAY_MS;

    setIsClosing(true);

    const finalize = () => {
      setActiveSection(null);
      setIsClosing(false);
      closeTimer.current = null;
      requestAnimationFrame(() => {
        const returnEl =
          objectTriggers.current[closingTarget] ?? lastFocused.current;
        returnEl?.focus({ preventScroll: true });
      });
    };

    if (delay === 0) {
      finalize();
    } else {
      closeTimer.current = setTimeout(finalize, delay);
    }
  }, [activeSection, isClosing]);

  const resetCamera = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveSection(null);
    setIsClosing(false);
    setResetNonce((n) => n + 1);
    setHasInteracted(true);
  }, []);

  const aimAtSection = useCallback((section: SectionId) => {
    setAimRequest((prev) => ({
      section,
      nonce: (prev?.nonce ?? 0) + 1,
    }));
  }, []);

  useEffect(() => {
    if (!activeSection) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSection();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeSection, closeSection]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const value = useMemo(
    () => ({
      activeSection,
      isClosing,
      isTransitioning,
      hasInteracted,
      resetNonce,
      aimRequest,
      setIsTransitioning,
      publishTelemetry,
      subscribeTelemetry,
      markInteracted,
      openSection,
      closeSection,
      resetCamera,
      aimAtSection,
      registerObjectTrigger,
    }),
    [
      activeSection,
      isClosing,
      isTransitioning,
      hasInteracted,
      resetNonce,
      aimRequest,
      publishTelemetry,
      subscribeTelemetry,
      markInteracted,
      openSection,
      closeSection,
      resetCamera,
      aimAtSection,
      registerObjectTrigger,
    ],
  );

  return (
    <EnvironmentNavContext.Provider value={value}>
      {children}
    </EnvironmentNavContext.Provider>
  );
}
