import { ReactNode } from "react";
import NavBarWrapper from "../NavBarWrapper.client";
import Footer from "../pages/landing-page/footer/footer";

const SearchLayout = ({ locale, children }: { locale: string; children: ReactNode }) => {
    return (<div className="flex flex-col min-h-screen w-full">
        <NavBarWrapper locale={locale} parent="search" />
        <div className="pt-16">
            {children}
        </div>
        <Footer locale={locale} />
    </div>);
}

export default SearchLayout;