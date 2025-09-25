
import { useEffect } from "react";

export function useFacebookSDK(appId: string) {
    useEffect(() => {
        if (typeof window === "undefined") return; // Make sure we’re in the browser
        if (window.FB) return; // Already loaded

        window.fbAsyncInit = function () {
            window.FB.init({
                appId,
                cookie: true,
                xfbml: false,
                version: "v17.0",
            });
        };

        const scriptId = "facebook-jssdk";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://connect.facebook.net/en_US/sdk.js";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }
    }, [appId]);
}
