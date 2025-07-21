import React from "react";

export function useIsSmallScreen() {
    const [isSmall, setIsSmall] = React.useState(false);
    React.useEffect(() => {
        const check = () => setIsSmall(window.innerWidth < 640);
        window.addEventListener("resize", check);
        check();
        return () => window.removeEventListener("resize", check);
    }, []);
    return isSmall;
}
export function useIsLGScreen() {
    const [isLG, setIsLG] = React.useState(window.innerWidth >= 1024);
    React.useEffect(() => {
        const check = () => setIsLG(window.innerWidth >= 1024);
        window.addEventListener("resize", check);
        check();
        return () => window.removeEventListener("resize", check);
    }, []);
    return isLG;
}

export function useIsXLScreen() {
    const [isXL, setIsXL] = React.useState(window.innerWidth >= 1280);
    React.useEffect(() => {
        const check = () => setIsXL(window.innerWidth >= 1280);
        window.addEventListener("resize", check);
        check();
        return () => window.removeEventListener("resize", check);
    }, []);
    return isXL;
}