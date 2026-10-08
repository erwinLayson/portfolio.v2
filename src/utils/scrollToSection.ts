type ScrollToSectionOptions = {
  offset?: number;
};
export function scrollToSection(
  targetId: string,
  options: ScrollToSectionOptions = {},
): void {
  const { offset = 80 } = options;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const useSmooth = !prefersReducedMotion;

  const target = typeof window !== "undefined"
    ? document.getElementById(targetId)
    : null;

  if (!target) {
    // Fall back to native anchor behavior if the element doesn't exist.
    const anchor = document.createElement("a");
    anchor.href = `#${targetId}`;
    anchor.click();
    return;
  }

  const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top,
    behavior: useSmooth ? ("smooth" as const) : ("auto" as const),
  });
}
