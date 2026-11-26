import { lazy, Suspense, useEffect, useState } from "react";
import Environment3D from "./scene/Environment3D";
import { EnvironmentNavProvider } from "./state/EnvironmentNavProvider";

const ResumePage = lazy(() => import("./pages/ResumePage"));

function checkIsResumeRoute(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname.replace(/\/$/, "");
  const hash = window.location.hash;
  return path === "/resume" || hash === "#resume";
}

export default function App() {
  const [isResume, setIsResume] = useState<boolean>(checkIsResumeRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsResume(checkIsResumeRoute());
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  if (isResume) {
    return (
      <Suspense fallback={null}>
        <ResumePage />
      </Suspense>
    );
  }

  return (
    <EnvironmentNavProvider>
      <Environment3D />
    </EnvironmentNavProvider>
  );
}
