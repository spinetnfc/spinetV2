import { LogIn, Menu, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ChangeLanguage from "@/components/change-language";
import Logo from "@/components/logo";
import ThemeSwitch from "@/components/theme-switch";
import { cn } from "@/utils/cn";
import CtaButton from "../cta-button";

const navItems = [
  { id: "features", label: "features" },
  { id: "pricing", label: "pricing" },
  { id: "support", label: "support" },
  { id: "products", label: "products" },
  { id: "how-it-works", label: "demo" },
  { id: "discover-more", label: "discover" },
];

function scrollToSection(id: string, setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>) {
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

  // State to handle auto-hiding behavior
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      // Show navbar when scrolling up or near the top; hide when scrolling down
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <header
      className={cn(
        "fixed z-50 flex w-full flex-row items-center justify-between px-3 py-2 lg:py-4 transition-transform duration-800 bg-white dark:bg-[#010C32]",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {/* Left section with logo */}
      <div className="flex items-center">
        <div className="me-8 flex h-11 items-center justify-center">
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
        <div className="flex items-center ">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="flex h-12 items-center rounded-[14px] p-2 xl:p-3"
            >
              <span className=" cursor-pointer text-lg font-medium leading-6 text-[#010E37] hover:text-blue-600 dark:text-white dark:hover:text-gray-400">
                <FormattedMessage id={label} />
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitch parentDarkMode={parentDarkMode} locale={locale} />
          <ChangeLanguage locale={locale} />
          <CtaButton
            text={intl.formatMessage({ id: "log-in" })}
            icon={<LogIn className="me-2.5 size-6" />}
            link="/auth/login"

          />
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute left-0 top-full w-full bg-white px-4 py-2 shadow-lg dark:bg-[#010C32] lg:hidden">
          <div className="flex items-center gap-3 border-b py-3">
            <ThemeSwitch />
            <ChangeLanguage locale={locale} />
          </div>
          <nav className="flex flex-col space-y-2">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id, setIsMenuOpen)}
                className="rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="font-inter text-lg font-medium text-[#010E37] dark:text-white">
                  <FormattedMessage id={label} />
                </span>
              </button>
            ))}


            <CtaButton
              text={intl.formatMessage({ id: "log-in" })}
              icon={<LogIn className="me-2.5 size-6" />}
              className="h-fit w-max mx-auto"
              link="/auth/login"
            />

          </nav>
        </div>
      )}
    </header>
  );
}

export default NavBar;
