import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

export default function useColorMode() {
  // Default to dark mode. Stored under `color-theme` in localStorage.
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "dark");

  useEffect(() => {
    const className = "dark";
    // Use documentElement (the <html> element) so Tailwind's `dark:` class variants
    // work reliably across the app.
    const rootClass = window.document.documentElement.classList;

    colorMode === "dark"
      ? rootClass.add(className)
      : rootClass.remove(className);
  }, [colorMode]);

  return [colorMode, setColorMode];
}
