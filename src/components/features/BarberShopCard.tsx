"use client";

import { Star, MapPin } from "lucide-react";
import { BarberShop } from "@/lib/mockData";
import Image from "next/image";

export default function BarberShopCard({ shop }: { shop: BarberShop }) {
    // Fallback language since this card is deprecated/unused in new flow
    // Ideally we would use context here too
    const lang = 'en';

    return (
        <div className="relative w-full max-w-sm cursor-pointer group bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden hover:border-neon-blue transition-colors">

            <div className="relative h-[300px] w-full bg-zinc-800">
                {/* Image Background */}
                <Image
                    src={shop.image}
                    alt={shop.name}
                    fill
                    className="object-cover opacity-80"
                />
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 rounded bg-neon-blue/20 text-neon-blue text-xs font-bold">
                        OPEN NOW
                    </span>
                    <div className="flex items-center text-neon-purple gap-1">
                        <Star size={16} fill="currentColor" />
                        <span className="font-bold">{shop.rating}</span>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">
                    {shop.name}
                </h3>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <MapPin size={14} />
                    <span>{shop.address}</span>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-3">
                    {shop.services.slice(0, 2).map((s) => (
                        <div key={s.id} className="flex justify-between text-sm text-gray-300">
                            <span>{s.name[lang]}</span>
                            <span className="font-mono text-neon-blue">€{s.price}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
