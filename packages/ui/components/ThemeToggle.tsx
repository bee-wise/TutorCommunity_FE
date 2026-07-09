"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[3.5em] h-[2em]" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <label className="relative block w-[3.5em] h-[2em] text-[12px] sm:text-[14px]">
      <input
        type="checkbox"
        className="peer absolute opacity-0 w-0 h-0"
        checked={isDark}
        onChange={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle Dark Mode"
      />
      <span className="absolute cursor-pointer inset-0 bg-[#f4f4f5] peer-checked:bg-[#303136] transition-all duration-400 rounded-full before:absolute before:content-[''] before:h-[1.4em] before:w-[1.4em] before:rounded-[20px] before:left-[0.3em] before:top-1/2 before:-translate-y-1/2 before:bg-[linear-gradient(40deg,#ff0080,#ff8c00_70%)] before:transition-all before:duration-400 peer-checked:before:left-[calc(100%-1.7em)] peer-checked:before:bg-none peer-checked:before:bg-[#303136] peer-checked:before:shadow-[inset_-3px_-2px_5px_-2px_#8983f7,inset_-10px_-4px_0_0_#a3dafb]" />
    </label>
  );
}
