"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import LogoSpinet from "@/components/logo-spinet";
import Logo from "@/components/logo";
import Header from "@/components/header";
import { SearchBar } from "./search-bar";
import { cn } from "@/utils/cn";

const navItems = [
    { id: "shop", label: "shop" },
    { id: "top-selling", label: "top-selling" },
    { id: "new-arrivals", label: "new-arrivals" },
    { id: "promotion", label: "promotion" },
];

interface NavBarProps {
    locale: string;
    parentDarkMode?: boolean;
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function NavBar({ locale, parentDarkMode = false, isMenuOpen, setIsMenuOpen }: NavBarProps) {
    const intl = useIntl();

    return (
        <header
            className={cn(
                "fixed z-50 flex w-full h-16 flex-row items-center justify-between gap-3 px-3 py-2 lg:py-2 transition-transform duration-800 bg-spinet-dark"
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center">
                {navItems.map(({ id, label }) => (
                    <Link
                        key={id}
                        href={id !== "shop" ? `/shop/products?category=${id}` : `/shop`}
                        className="flex h-12 items-center rounded-[14px] p-2 xl:p-3"
                    >
                        <span className="cursor-pointer text-lg font-medium leading-6 hover:text-gray-400 text-white">
                            <FormattedMessage id={label} />
                        </span>
                    </Link>
                ))}
            </nav>

            {/* Search Bar */}
            <SearchBar />

            {/* Mobile menu toggle button */}
            <button
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMenuOpen ? (
                    <X className="size-6 text-gray-600 dark:text-gray-100" />
                ) : (
                    <Menu className="size-6 text-gray-600 dark:text-gray-100" />
                )}
            </button>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center gap-3">
                <Header locale={locale} />
            </div>

            {/* Mobile Navigation Dropdown */}
            <div
                className={cn(
                    "absolute left-0 top-full w-full bg-white px-4 py-2 shadow-lg dark:bg-spinet-dark lg:hidden transition-all duration-500 transform",
                    isMenuOpen
                        ? "opacity-100 max-h-[500px] translate-y-0"
                        : "opacity-0 max-h-0 -translate-y-2 pointer-events-none"
                )}
            >
                <div className="flex items-center gap-3 border-b py-3">
                    <Header locale={locale} />
                </div>
                <nav className="flex flex-col space-y-2">
                    {navItems.map(({ id, label }) => (
                        <Link
                            key={id}
                            href={id !== "shop" ? `/shop/products?category=${id}` : `/shop`}
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <span className="font-inter text-lg font-medium text-spinet-text-primary">
                                <FormattedMessage id={label} />
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}

export default NavBar;
