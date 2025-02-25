import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const ShopButton = ({ title, className, onClick }: { title: string, className?: string, onClick?: () => void }) => {
    return (
        <button onClick={onClick}
            className={cn(className, "bg-main w-full py-3 px-4 text-white rounded-xl")}
        >
            {title}
        </button>
    );
}

export default ShopButton;