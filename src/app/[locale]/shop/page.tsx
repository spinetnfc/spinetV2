import Reviews from "@/components/pages/shop/Reviews/reviews";

async function getMessages(locale: string) {
    return (await import(`@/lang/${locale}.json`)).default;
}
const Shop = async ({ params }: {
    params: Promise<{ locale: string }>;
}) => {
    // Await params before using its properties (do not call params as a function)
    const { locale } = await params;
    const messages = await getMessages(locale);
    return (<>
        <section id="shop" className="h-screen flex items-center text-black text-6xl bg-yellow-200">shop</section>
        <section id="on-sale" className="h-screen flex items-center text-black text-6xl bg-red-400">on-sale</section>
        <section id="new-arrivals" className="h-screen flex items-center text-black text-6xl bg-green-400">new arrivals</section>
        <section id="promotion" className="h-screen flex items-center text-black text-6xl bg-blue-400">promotion</section>
        <section>
            <Reviews />
        </section>
    </>
    );
}

export default Shop;