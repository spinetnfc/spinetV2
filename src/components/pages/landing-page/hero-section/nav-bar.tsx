"use client";
import { LogIn, Menu, User2, X } from "lucide-react";
import React, { useState, useEffect, useCallback, memo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ChangeLanguage from "@/components/change-language";
import Logo from "@/components/logo";
import ThemeSwitch from "@/components/theme-switch";
import { cn } from "@/utils/cn";
import CtaButton from "../cta-button";
import { useIsAuthenticated, useAuthLoading } from "@/store/auth-store";
import UserMenu from "@/components/userMenu";

// Memoize CtaButton and UserMenu to prevent unnecessary re-renders
const MemoizedCtaButton = memo(CtaButton);
const MemoizedUserMenu = memo(UserMenu);

const navItems = [
  { id: "discover-more", label: "discover" },
  { id: "features", label: "features" },
  { id: "pricing", label: "pricing" },
  { id: "how-it-works", label: "demo" },
  { id: "products", label: "PRODUCTS" },
  { id: "support", label: "support" },
];

function scrollToSection(
  id: string,
  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>
) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMenuOpen?.(false); // Close menu in mobile view
  }
}

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
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const isAuthenticated = useIsAuthenticated();
  const authLoading = useAuthLoading();

  // Memoize scrollToSection to prevent re-creation
  const memoizedScrollToSection = useCallback(
    (id: string) => scrollToSection(id, setIsMenuOpen),
    [setIsMenuOpen]
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // Memoize auth-dependent rendering to avoid unnecessary re-renders
  const authButton = React.useMemo(() => {
    if (authLoading) {
      return <div className="h-12 w-24 animate-pulse bg-spinet-primary dark:bg-spinet-navy rounded-2xl"></div>;
    }
    return !isAuthenticated ? (
      <MemoizedCtaButton
        text={intl.formatMessage({ id: "log-in" })}
        icon={<LogIn className="me-2.5 size-6" />}
        link={`/${locale}/auth/login`}
      />
    ) : (
      <MemoizedUserMenu locale={locale} />
    );
  }, [isAuthenticated, authLoading, locale, intl]);

  return (
    <header
      className={cn(
        "fixed z-50 flex w-full flex-row items-center justify-between px-3 py-2 lg:py-2 transition-transform duration-300 bg-white dark:bg-spinet-dark",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {/* Left section with logo */}
      <div className="flex items-center">
        <div className="me-8 flex items-center justify-center">
          <Logo locale={locale} parentDarkMode={parentDarkMode} />
        </div>
      </div>

      {/* Mobile menu button */}
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

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
        <div className="flex items-center">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => memoizedScrollToSection(id)}
              className="flex h-12 items-center rounded-[14px] p-2 xl:p-3"
            >
              <span className="cursor-pointer text-lg font-medium leading-6 text-spinet-text-primary hover:text-spinet-primary">
                <FormattedMessage id={label} />
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitch parentDarkMode={parentDarkMode} locale={locale} />
          <ChangeLanguage locale={locale} />
          {authButton}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "absolute left-0 top-full w-full bg-white px-4 py-2 shadow-lg dark:bg-spinet-dark lg:hidden transition-all duration-300 transform",
          isMenuOpen
            ? "opacity-100 max-h-[500px] translate-y-0"
            : "opacity-0 max-h-0 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="flex w-full items-center justify-end border-b py-3">
          <div className="flex items-center gap-3 justify-between">
            <ThemeSwitch />
            <ChangeLanguage locale={locale} />
            {authButton}
          </div>
        </div>
        <nav className="flex flex-col space-y-2">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => memoizedScrollToSection(id)}
              className="rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="font-inter text-lg font-medium text-spinet-text-primary">
                <FormattedMessage id={label} />
              </span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;