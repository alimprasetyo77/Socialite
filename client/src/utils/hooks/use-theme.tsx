import { useState, useEffect } from "react";

type Theme = "light" | "dark";

function useTheme() {
  const savedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState<Theme>(savedTheme as Theme);
  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.classList.add(system);
      setTheme(system);
      localStorage.setItem("theme", system);
      return;
    }

    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newValue = theme === "dark" ? "light" : "dark";
    setTheme(newValue);
  };

  return { toggleTheme, theme };
}

export default useTheme;
