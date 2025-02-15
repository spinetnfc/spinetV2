import { LogIn, Menu, X } from "lucide-react";
import NextLink from "next/link";
import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ChangeLanguage from "@/components/change-language";
import Logo from "@/components/logo";
import ThemeSwitch from "@/components/theme-switch";
import { cn } from "@/utils/cn";
import CtaButton from "../cta-button";

function NavBar({
  locale,
  parentDarkMode = false,
  isMenuOpen,
  setIsMenuOpen,
}: {
  locale: string;
  parentDarkMode?: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const intl = useIntl();

  const navItems = [
    { id: "partners", label: "partners", scroll: false },
    { id: "events", label: "events", scroll: false },
    { id: "features", label: "features", scroll: true },
    { id: "pricing", label: "pricing", scroll: true },
    { id: "support", label: "support", scroll: true },
  ];

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <header
      className={cn(
        "fixed z-50 flex w-full flex-row items-center justify-between px-4 py-2 lg:py-4 transition-transform duration-800 bg-white/90 dark:bg-[#010C32]/90",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="flex items-center">
        <div className="me-8 flex h-11 items-center justify-center">
          <Logo locale={locale} parentDarkMode={parentDarkMode} />
        </div>
      </div>

      <button
        className="lg:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="size-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="size-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <nav className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4">
          {navItems.map(({ id, label, scroll }) =>
            scroll ? (
              <button
                key={id}
                onClick={() => handleScroll(id)}
                className="flex h-12 items-center rounded-[14px] p-3 cursor-pointer"
              >
                <span className="font-inter text-lg font-medium text-[#010E37] hover:text-blue-600 dark:text-white">
                  <FormattedMessage id={label} />
                </span>
              </button>
            ) : (
              <NextLink
                key={id}
                href="/"
                className="flex h-12 items-center rounded-[14px] p-3"
              >
                <span className="font-inter text-lg font-medium text-[#010E37] hover:text-blue-600 dark:text-white">
                  <FormattedMessage id={label} />
                </span>
              </NextLink>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitch parentDarkMode={parentDarkMode} locale={locale} />
          <ChangeLanguage locale={locale} />
          <NextLink href={`/${locale}/auth/login`}>
            <CtaButton
              text={intl.formatMessage({ id: "log-in" })}
              icon={<LogIn className="me-2.5 size-6" />}
            />
          </NextLink>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
