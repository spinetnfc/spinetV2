import { Button } from "@/components/ui/button";
import ShopButton from "./shop-button";

const Footer = () => {
    return (
        <>
            <div className="bg-white relative h-40">
                <div className="absolute top-0 left-20 right-20 h-48 bg-white border px-10 py-6 rounded-3xl
                flex items-center justify-between "
                >
                    <h2 className=" w-2/5 text-5xl font-semibold">Stay Up to date about our latest offers</h2>
                    <form >
                        <input type="text" placeholder="Enter your email" />
                        <ShopButton title="Subscribe to Our Newsletter" />
                    </form>
                </div>
            </div>
            <div className="bg-[#010C32] h-40">


            </div>
        </>
    );
}

export default Footer;