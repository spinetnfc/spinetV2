import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const ShopButton = ({ title, className, onClick }: { title: string, className?: string, onClick?: () => void }) => {
    return (
        <Button onClick={onClick}
            className={cn(className, "bg-[#010C32] w-full")}
        >
            {title}
        </Button>
    );
}

export default ShopButton;