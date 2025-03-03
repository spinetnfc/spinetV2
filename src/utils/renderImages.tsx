import Image from "next/image";

/**
 * Helper function to render small images.
 * If there are 3 or fewer images, show them all.
 * If more than 3, show only 3 thumbnails:
 *   - The first two are shown normally.
 *   - The third is overlaid with dark opacity and displays "+X" for the remaining count.
 */
export function renderSmallImages(smallImages: string[]) {
    if (smallImages.length <= 3) {
        return smallImages.map((img, index) => (
            <Image
                key={index}
                src={img}
                alt="Thumbnail"
                width={60}
                height={60}
                className="w-24 xs:w-28 object-cover border-2 border-blue-500  cursor-pointer rounded-xl"
            />
        ));
    } else {
        const firstTwo = smallImages.slice(0, 2);
        const thirdImage = smallImages[2];
        const remaining = smallImages.length - 2;
        return (
            <>
                {firstTwo.map((img, index) => (
                    <Image
                        key={index}
                        src={img}
                        alt="Thumbnail"
                        width={60}
                        height={60}
                        className="w-3/10 xs:w-28 object-cover border-2 border-blue-500  cursor-pointer rounded-xl"
                    />
                ))}
                {/* Third thumbnail with dark overlay showing remaining count */}
                <div className="relative   xs:w-28 cursor-pointer border-2 border-blue-500 rounded-xl overflow-hidden">
                    <Image
                        src={thirdImage}
                        alt="Thumbnail"
                        width={60}
                        height={60}
                        className="w-1/3 xs:w-28 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black opacity-60">
                        <span className="text-sm text-white">+{remaining}</span>
                    </div>
                </div>
            </>
        );
    }
}
