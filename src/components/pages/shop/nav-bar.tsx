'use client';
import { LogIn, Menu, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ChangeLanguage from "@/components/change-language";
import LogoSpinet from "@/components/logo-spinet";
import Logo from "@/components/logo";
import ThemeSwitch from "@/components/theme-switch";
import { cn } from "@/utils/cn";
import Header from "@/components/header";
import SearchBar from "./search-bar";

const navItems = [
    { id: "shop", label: "shop" },
    { id: "on-sale", label: "on-sale" },
    { id: "new-arrivals", label: "new-arrivals" },
    { id: "promotion", label: "promotion" },
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
                "fixed z-50 flex w-full h-16 flex-row items-center justify-between gap-3 px-3 py-2 lg:py-2 transition-transform duration-800 bg-[#010C32]",
                visible ? "translate-y-0" : "-translate-y-full"
            )}
        >
            {/* Left section with logo */}
            <div className="flex items-center">
                <div className="flex h-11 items-center justify-center">
                    <span className="lg:hidden">
                        <Logo locale={locale} />
                    </span>
                    <span className="hidden lg:block">
                        <LogoSpinet locale={locale} parentDarkMode={true} />
                    </span>
                </div>
            </div>

            {/* Desktop Navigation - Before SearchBar */}
            <nav className="hidden lg:flex lg:items-center">
                {navItems.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className="flex h-12 items-center rounded-[14px] p-2 xl:p-3"
                    >
                        <span className="cursor-pointer text-lg font-medium leading-6 hover:text-gray-400 text-white">
                            <FormattedMessage id={label} />
                        </span>
                    </button>
                ))}
            </nav>

            {/* Single SearchBar */}
            <SearchBar />

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

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center gap-3">
                <Header locale={locale} />
                {/* Uncomment these if you want them back */}
                {/* <ThemeSwitch parentDarkMode={parentDarkMode} locale={locale} />
                <ChangeLanguage locale={locale} /> */}
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="absolute left-0 top-full w-full bg-white px-4 py-2 shadow-lg dark:bg-[#010C32] lg:hidden">
                    <div className="flex items-center gap-3 border-b py-3">
                        <Header locale={locale} />
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
                    </nav>
                </div>
            )}
        </header>
    );
}

export default NavBar;