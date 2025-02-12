// ThemeSwitch.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

interface ThemeSwitchProps {
  parentDarkMode?: boolean;
}

export default function ThemeSwitch({ parentDarkMode }: ThemeSwitchProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Image
        src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
        width={36}
        height={36}
        alt="Loading Theme Switch"
      />
    );
  }

  // Determine if we're in dark mode
  const isDark = resolvedTheme === 'dark';

  // Toggle theme when clicked
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center w-16 h-8 rounded-full focus:outline-none transition-colors duration-300 bg-blue-950
`}
    >
      {/* Sliding disk */}
      <span
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDark ? 'translate-x-8' : ''
          }`}
      ></span>
      {/* Icon container */}
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-1.5">
        {isDark ? (
          <>
            <Sun fill="#f9fafb" className="w-5 h-5  text-gray-50" />
            <Moon className="w-5 h-5 text-blue-bg-blue-950" />
          </>
        ) : (
          <>
            <Sun fill="#1f2937" className="w-5 h-5  text-blue-950" />
            <Moon className="w-5 h-5 text-gray-50" />
          </>)}
      </div>
    </button>
  );
}
