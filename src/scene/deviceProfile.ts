import { useEffect, useState } from "react";

export type PerformanceTier = "low" | "balanced" | "high";

export type DeviceProfile = {
  tier: PerformanceTier;
  reducedMotion: boolean;
  starCount: number;
  presenterParticleCount: number;
  horizonPanels: number;
  enableAmbientAnimations: boolean;
};

type NetworkInfo = {
  saveData?: boolean;
  effectiveType?: string;
};

const TIER_BUDGETS: Record<
  PerformanceTier,
  Omit<DeviceProfile, "tier" | "reducedMotion">
> = {
  low: {
    starCount: 8,
    presenterParticleCount: 4,
    horizonPanels: 10,
    enableAmbientAnimations: false,
  },
  balanced: {
    starCount: 18,
    presenterParticleCount: 6,
    horizonPanels: 14,
    enableAmbientAnimations: true,
  },
  high: {
    starCount: 32,
    presenterParticleCount: 12,
    horizonPanels: 18,
    enableAmbientAnimations: true,
  },
};

/**
 * Classifies rendering capability using hardware concurrency, memory, network hints,
 * pointer ergonomics, and reduced-motion preference rather than viewport width alone.
 */
export function detectDeviceProfile(): DeviceProfile {
  if (typeof window === "undefined") {
    return {
      tier: "balanced",
      reducedMotion: false,
      ...TIER_BUDGETS.balanced,
    };
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: NetworkInfo;
  };
  const cores = nav.hardwareConcurrency ?? 4;
  const memoryGb = nav.deviceMemory;
  const saveData = Boolean(nav.connection?.saveData);
  const netType = nav.connection?.effectiveType;
  const isSlowNetwork = netType === "slow-2g" || netType === "2g";
  const isTouchPrimary =
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    (nav.maxTouchPoints > 0 && window.innerWidth < 1024);

  let tier: PerformanceTier = "high";

  if (
    reducedMotion ||
    saveData ||
    isSlowNetwork ||
    cores <= 2 ||
    (memoryGb !== undefined && memoryGb <= 2) ||
    (isTouchPrimary && (cores <= 4 || (memoryGb !== undefined && memoryGb <= 4)))
  ) {
    tier = "low";
  } else if (
    isTouchPrimary ||
    cores <= 6 ||
    (memoryGb !== undefined && memoryGb <= 4)
  ) {
    tier = "balanced";
  }

  const budgets = TIER_BUDGETS[tier];
  return {
    tier,
    reducedMotion,
    ...budgets,
    enableAmbientAnimations: !reducedMotion && budgets.enableAmbientAnimations,
  };
}

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(detectDeviceProfile);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    );
    const update = () => setProfile(detectDeviceProfile());

    motionQuery.addEventListener("change", update);
    coarseQuery.addEventListener("change", update);
    return () => {
      motionQuery.removeEventListener("change", update);
      coarseQuery.removeEventListener("change", update);
    };
  }, []);

  return profile;
}
