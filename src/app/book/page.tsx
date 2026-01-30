"use client";

import SingleShopBooking from "@/components/features/SingleShopBooking";
import BackgroundVideo from "@/components/layout/BackgroundVideo";

export default function BookingPage() {
    return (
        <main className="min-h-screen relative overflow-hidden font-sans">
            <BackgroundVideo />
            <div className="relative z-10 pt-10 min-h-screen">
                <SingleShopBooking />
            </div>
        </main>
    );
}
