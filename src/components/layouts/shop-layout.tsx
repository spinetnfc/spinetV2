import { ReactNode } from "react";
import NavBarWrapper from "../NavBarWrapper.client";
import ShopFooter from "../pages/shop/footer";

const ShopLayout = ({ locale, children }: { locale: string; children: ReactNode }) => {
    return (<div className="flex flex-col min-h-screen w-full">
        <NavBarWrapper locale={locale} parent="shop" />
        <div className="pt-16">
            {children}
        </div>
        <ShopFooter locale={locale} />
    </div>);
}

export default ShopLayout;