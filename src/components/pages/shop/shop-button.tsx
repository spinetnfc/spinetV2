import { Button } from "@/components/ui/button"; // Assuming this is a custom component, we'll replace it
import { cn } from "@/utils/cn";
import { ReactNode } from "react"; // Import ReactNode for broader type support

// Update the props type to accept string or ReactNode for title
const ShopButton = ({
    title,
    className,
    onClick,
}: {
    title: string | ReactNode; // Allow both string and ReactNode
    className?: string;
    onClick?: () => void;
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(className, "bg-[#082356] w-full py-3 px-4 text-white rounded-xl cursor-pointer")}
        >
            {title}
        </button>
    );
};

export default ShopButton;