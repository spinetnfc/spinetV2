import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

interface ThemeSwitchProps {
  parentDarkMode?: boolean;
  locale?: string;
}

export default function ThemeSwitch({ parentDarkMode, locale }: ThemeSwitchProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Image
        src="data:image/svg+xml;base64,..."
        width={36}
        height={36}
        alt="Loading Theme Switch"
      />
    );
  }

  const isDark = resolvedTheme === 'dark';
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Determine layout classes for the slider.
  const flexDirectionClass = locale === 'ar' ? 'flex-row-reverse' : 'flex-row';
  const sliderPositionClass = locale === 'ar' ? 'right-1' : 'left-1';
  const sliderTranslate = isDark ? (locale === 'ar' ? '-translate-x-8' : 'translate-x-8') : '';

  // Conditionally swap icon order for RTL.
  let icons;
  if (isDark) {
    if (locale === 'ar') {
      icons = (
        <>
          <Moon className="w-5 h-5 text-gray-950" />
          <Sun fill="#f9fafb" className="w-5 h-5 text-blue-50" />
        </>
      );
    } else {
      icons = (
        <>
          <Sun fill="#f9fafb" className="w-5 h-5 text-blue-50" />
          <Moon className="w-5 h-5 text-gray-950" />
        </>
      );
    }
  } else {
    if (locale === 'ar') {
      icons = (
        <>
          <Moon className="w-5 h-5 text-blue-50" />
          <Sun fill="#1f2937" className="w-5 h-5 text-blue-950" />
        </>
      );
    } else {
      icons = (
        <>
          <Sun fill="#1f2937" className="w-5 h-5 text-blue-950" />
          <Moon className="w-5 h-5 text-blue-50" />
        </>
      );
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center w-16 h-8 rounded-full focus:outline-hidden transition-colors duration-300 bg-blue-950 cursor-pointer"
    >
      {/* Sliding disk */}
      <span
        className={`absolute top-1 ${sliderPositionClass} w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sliderTranslate}`}
      ></span>
      {/* Icon container with conditional flex direction */}
      <div className={`absolute inset-0 flex ${flexDirectionClass} items-center justify-between pointer-events-none px-1.5`}>
        {icons}
      </div>
    </button>
  );
}
