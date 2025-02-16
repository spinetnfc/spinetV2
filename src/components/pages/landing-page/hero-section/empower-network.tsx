import { ChevronRight, LogIn } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Button } from "@/components/ui/button";
import CtaButton from "../cta-button";
// import NavBar if needed

type Props = {
  locale: string;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function EmpowerNetwork({ locale, isMenuOpen, setIsMenuOpen }: Props) {
  const intl = useIntl();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* Minimal content to prevent layout shift */}
        <h1 className="z-10 mx-auto px-4 text-center text-6xl tracking-tighter lg:px-0 lg:text-8xl">
          <FormattedMessage id="empower-your-network" />
        </h1>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Ellipses */}
      <div className="absolute inset-0 pointer-events-none">
        {resolvedTheme === "dark" && (
          <>
            <div className="absolute left-[384px] top-[-70px] h-[422px] w-[121px] rotate-[-20deg] bg-linear-to-b from-[#0A234D] via-[#8FC8FF] to-[#145FF2] opacity-70 blur-[58px]" />
            <div className="absolute left-[710px] top-[-106px] h-[422px] w-[121px] rotate-[31deg] bg-linear-to-b from-[#0A234D] via-[#8FC8FF] to-[#145FF2] opacity-70 blur-[58px]" />
          </>
        )}
        <img
          src={resolvedTheme === "dark" ? "/img/Ellipse-one-dark.png" : "/img/Ellipse-one.png"}
          alt=""
          className="absolute left-[-5%] top-[-10%] hidden w-2/5 max-w-[600px] lg:block"
        />
        <img
          src={resolvedTheme === "dark" ? "/img/Ellipse-two-dark.png" : "/img/Ellipse-two.png"}
          alt=""
          className="absolute right-[-10%] top-1/2 hidden w-1/2 max-w-[700px] lg:block"
        />
        <img
          src={resolvedTheme === "dark" ? "/img/Ellipse-three-dark.png" : "/img/Ellipse-three.png"}
          alt=""
          className="absolute bottom-[-10%] left-[10%] hidden w-[30%] max-w-[500px] lg:block"
        />

        {/* Mobile Ellipses */}
        <img
          src={resolvedTheme === "dark" ? "/img/Ellipse-one-dark.png" : "/img/Ellipse-one.png"}
          alt=""
          className="absolute left-[-10%] top-[-5%] w-3/5 max-w-[400px] lg:hidden"
        />
        <img
          src={resolvedTheme === "dark" ? "/img/Ellipse-two-dark.png" : "/img/Ellipse-two.png"}
          alt=""
          className="absolute right-[-15%] top-1/2 w-[70%] max-w-[450px] lg:hidden"
        />
        <img
          src={resolvedTheme === "dark" ? "/img/Ellipse-three-dark.png" : "/img/Ellipse-three.png"}
          alt=""
          className="absolute bottom-[-10%] left-[5%] w-1/2 max-w-[350px] lg:hidden"
        />
      </div>

      {/* Content Container */}
      <div className="container z-10 mx-auto px-4 text-center lg:px-0">
        {/* Title Container */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex flex-col items-center justify-center gap-2 lg:flex-row">
            <h1 className="text-6xl tracking-tighter text-[#1A3B8E] dark:text-[#EEF6FF] lg:text-8xl">
              <FormattedMessage id="empower-your" />
            </h1>
            <h1 className="bg-linear-to-r from-[#1650DF] via-[#8FC8FF] to-[#EEF6FF] bg-clip-text text-6xl tracking-tighter text-transparent lg:text-8xl">
              <FormattedMessage id="network" />
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-5xl tracking-tighter text-[#1A3B8E] dark:text-[#EEF6FF] lg:text-[86px]">
              <FormattedMessage id="with" />
            </h2>
            <h2 className="bg-linear-to-r from-[#1650DF] via-[#8FC8FF] to-[#EEF6FF] bg-clip-text text-5xl tracking-tighter text-transparent lg:text-[86px]">
              <FormattedMessage id="spinet" />
            </h2>
          </div>
        </div>

        {/* Description */}
        <div className="mx-auto mt-5 max-w-[800px]">
          <p className="text-base leading-relaxed text-[#010E37CC] dark:text-[#F5F5F5] lg:text-lg">
            <FormattedMessage id="empower-your-network-text" />
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex flex-col items-center justify-center gap-4 lg:mt-10 lg:flex-row">
          <CtaButton
            text={intl.formatMessage({ id: "sign-up-now" })}
            icon={<LogIn className="size-6" />}
          />
          <Button
            icon={<ChevronRight className="size-6" />}
            className="h-12 rounded-2xl bg-white text-xl leading-6 text-[#145FF2] transition-all hover:bg-blue-500 hover:text-white hover:brightness-125 dark:bg-[#082356] dark:text-white lg:w-[195px]"
            iconPosition="right"
          >
            <FormattedMessage id="see-offers" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EmpowerNetwork;
