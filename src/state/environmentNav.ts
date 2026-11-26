import { createContext, useContext } from "react";

export type SectionId =
  | "about"
  | "tech"
  | "experience"
  | "projects"
  | "resume"
  | "contact"
  | "testimonial"
  | "backstage";

export const sectionMeta: Record<SectionId, { label: string; code: string }> = {
  about: { label: "About Me", code: "01 · IDENTITY" },
  projects: { label: "Projects", code: "02 · SYSTEMS" },
  tech: { label: "Tech Stack", code: "03 · MATRIX" },
  experience: { label: "Experience", code: "04 · TIMELINE" },
  resume: { label: "Resume", code: "05 · DOCUMENT" },
  contact: { label: "Contact", code: "06 · UPLINK" },
  backstage: { label: "Backstage", code: "07 · ARCHIVE" },
  testimonial: { label: "Testimonial", code: "08 · FEEDBACK" },
};

export type AimRequest = {
  section: SectionId;
  nonce: number;
};

export type CameraTelemetry = {
  yawDeg: number;
  pitchDeg: number;
  posX: number;
  posY: number;
  posZ: number;
};

export type TelemetryListener = (telemetry: CameraTelemetry) => void;

export type EnvironmentNavValue = {
  activeSection: SectionId | null;
  isClosing: boolean;
  isTransitioning: boolean;
  hasInteracted: boolean;
  resetNonce: number;
  aimRequest: AimRequest | null;
  setIsTransitioning: (busy: boolean) => void;
  publishTelemetry: (telemetry: CameraTelemetry) => void;
  subscribeTelemetry: (listener: TelemetryListener) => () => void;
  markInteracted: () => void;
  openSection: (section: SectionId) => void;
  closeSection: () => void;
  resetCamera: () => void;
  aimAtSection: (section: SectionId) => void;
  registerObjectTrigger: (section: SectionId, element: HTMLButtonElement | null) => void;
};

export const EnvironmentNavContext = createContext<EnvironmentNavValue | null>(null);

export function useEnvironmentNav(): EnvironmentNavValue {
  const context = useContext(EnvironmentNavContext);
  if (!context) {
    throw new Error("useEnvironmentNav must be used inside EnvironmentNavProvider");
  }
  return context;
}
