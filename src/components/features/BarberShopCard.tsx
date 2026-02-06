"use client";

import { Star, MapPin } from "lucide-react";
import { BarberShop } from "@/lib/mockData";
import Image from "next/image";

export default function BarberShopCard({ shop }: { shop: BarberShop }) {
    // Fallback language since this card is deprecated/unused in new flow
    // Ideally we would use context here too
    const lang = 'en';

    return (
        <div className="relative w-full max-w-[280px] cursor-pointer group bg-white border border-rose-100/50 shadow-sm hover:shadow-md hover:border-gold/40 rounded-2xl overflow-hidden transition-all duration-300">
            {/* Content */}
            <div className="p-6 text-center">
                <div className="mb-3 flex justify-center text-gold">
                    <Star size={16} fill="currentColor" />
                    <span className="font-bold ml-1 text-gray-600">{shop.rating}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-rose-gold transition-colors">
                    {shop.name}
                </h3>

                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mb-4">
                    <MapPin size={12} />
                    <span>{shop.address}</span>
                </div>

                <div className="w-12 h-[1px] bg-rose-100 mx-auto"></div>
            </div>
        </div>
    );
}
