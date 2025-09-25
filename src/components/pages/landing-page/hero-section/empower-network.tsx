"use client"

import { LogIn } from "lucide-react"
import { useTheme } from "next-themes"
import type React from "react"
import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import CtaButton from "../cta-button"
import ellipseOneDark from "@/assets/images/Ellipse-one-dark.png"
import ellipseOne from "@/assets/images/Ellipse-one.png"
import ellipseTwoDark from "@/assets/images/Ellipse-two-dark.png"
import ellipseTwo from "@/assets/images/Ellipse-two.png"
import ellipseThreeDark from "@/assets/images/Ellipse-three-dark.png"
import ellipseThree from "@/assets/images/Ellipse-three.png"

type Props = {
  locale: string
  isMenuOpen: boolean
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function EmpowerNetwork({ locale, isMenuOpen, setIsMenuOpen }: Props) {
  const intl = useIntl()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  function scrollToSection(id: string, setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>) {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setIsMenuOpen?.(false) // Close menu in mobile view
    }
  }
  // Handle mounting state
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <h1 className="z-10 mx-auto px-4 text-center tracking-tighter lg:px-0 text-6xl lg:text-6xl xl:text-8xl text-spinet-deep dark:text-spinet-light">
          <FormattedMessage id="empower-your-network" />
        </h1>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Ellipses */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          quality={100}
          src={resolvedTheme === "dark" ? ellipseOneDark : ellipseOne}
          alt=""
          className="absolute left-[10%] top-[20%] hidden w-2/5 max-w-[15%] lg:block animate-floating"
          priority
        />
        <Image
          quality={100}
          src={resolvedTheme === "dark" ? ellipseTwoDark : ellipseTwo}
          alt=""
          className="absolute right-0 top-1/4 hidden w-1/2 max-w-[30%] lg:block animate-floating"
          priority
        />
        <Image
          quality={100}
          src={resolvedTheme === "dark" ? ellipseThreeDark : ellipseThree}
          alt=""
          className="absolute bottom-[5%] left-[5%] hidden w-[30%] max-w-[30%] lg:block animate-floating"
          priority
        />

        {/* Mobile Ellipses */}
        <Image
          quality={100}
          src={resolvedTheme === "dark" ? ellipseOneDark : ellipseOne}
          alt=""
          className="absolute left-0 top-[30%] max-w-[30%] lg:hidden animate-floating"
          priority
        />
        <Image
          quality={100}
          src={resolvedTheme === "dark" ? ellipseTwoDark : ellipseTwo}
          alt=""
          className="absolute right-0 top-[40%] w-full max-w-[50%] lg:hidden animate-floating"
          priority
        />
        <Image
          quality={100}
          src={resolvedTheme === "dark" ? ellipseThreeDark : ellipseThree}
          alt=""
          className="absolute bottom-[10%] left-[5%] w-full max-w-[50%] lg:hidden animate-floating"
          priority
        />
      </div>

      {/* Content Container */}
      <div className="container z-10 text-center p-0">
        {/* Title Container */}
        <div className="flex flex-col items-center gap-2 ">
          <div className="flex flex-row items-center justify-center gap-2">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl tracking-tighter text-spinet-deep dark:text-spinet-light lg:text-6xl xl:text-8xl sm:pb-2">
              <FormattedMessage id="empower-your" />
            </h1>
            <h1 className="bg-linear-to-r from-[#1650DF] via-[#8FC8FF] to-[#a8d0ff] dark:to-[#EEF6FF] bg-clip-text text-3xl xs:text-4xl sm:text-5xl tracking-tighter text-transparent lg:text-6xl xl:text-8xl  sm:pb-2">
              <FormattedMessage id="network" />
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl tracking-tighter text-spinet-deep dark:text-spinet-light lg:text-6xl xl:text-8xl ">
              <FormattedMessage id="with" />
            </h2>
            <h2 className="bg-linear-to-r from-[#1650DF] via-[#8FC8FF] to-[#a8d0ff] dark:to-[#EEF6FF] bg-clip-text text-3xl xs:text-4xl sm:text-5xl tracking-tighter text-transparent lg:text-6xl xl:text-8xl ">
              <FormattedMessage id="spinet" />
            </h2>
          </div>
        </div>

        {/* Description */}
        <div className="mx-auto mt-5 max-w-4/5 sm:max-w-[60%] lg:max-w-[800px]">
          <p className=" text-xs xs:text-sm sm:text-base leading-relaxed text-spinet-text-muted lg:text-lg">
            <FormattedMessage id="empower-your-network-text" />
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex flex-col items-center justify-center gap-4 lg:mt-10 lg:flex-row">
          <CtaButton
            text={intl.formatMessage({ id: "sign-up-now" })}
            icon={<LogIn className="size-6" />}
            link={`/${locale}/auth/register`}
            className="text-base xs:text-lg sm:text-xl"
          />
          <Button
            className="h-12 rounded-2xl bg-white text-base xs:text-lg sm:text-xl leading-6 text-spinet-primary transition-all cursor-pointer
             hover:bg-spinet-primary hover:text-white hover:brightness-125 dark:bg-spinet-navy dark:text-white lg:w-[195px]"
            onClick={() => scrollToSection("pricing")}
          >
            <FormattedMessage id="see-offers" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EmpowerNetwork
