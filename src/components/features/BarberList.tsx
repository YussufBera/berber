"use client";

import { MOCK_SHOPS, BarberShop } from "@/lib/mockData";
import BarberShopCard from "./BarberShopCard";
import BookingModal from "./BookingModal";
import { useState } from "react";

export default function BarberList() {
    const [selectedShop, setSelectedShop] = useState<BarberShop | null>(null);

    const handleShopClick = (shop: BarberShop) => {
        setSelectedShop(shop);
    };

    return (
        <div className="w-full min-h-screen bg-black text-white pt-24 pb-10">
            <div className="max-w-7xl mx-auto px-4">
                {/* Debug Header */}
                <div className="mb-12 text-center border-b border-white/20 pb-4">
                    <h2 className="text-4xl font-bold mb-4">Select Your <span className="text-neon-blue">Location</span></h2>
                    <p className="text-gray-400">If you can see this, the component is rendering.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {MOCK_SHOPS.map((shop, index) => (
                        <div
                            key={shop.id}
                            onClick={() => handleShopClick(shop)}
                            className="w-full flex justify-center"
                        >
                            <BarberShopCard shop={shop} />
                        </div>
                    ))}
                </div>
            </div>

            <BookingModal
                shop={selectedShop}
                isOpen={!!selectedShop}
                onClose={() => setSelectedShop(null)}
            />
        </div>
    );
}
