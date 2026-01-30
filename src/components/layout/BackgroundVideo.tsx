"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PLAYLIST = [
    "https://assets.mixkit.co/videos/271/271-720.mp4",   // Original: Barber equipment
    "https://assets.mixkit.co/videos/357/357-720.mp4",   // New: Cutting hair
    "https://assets.mixkit.co/videos/40122/40122-720.mp4", // New: Outlining beard
    "https://assets.mixkit.co/videos/363/363-720.mp4",    // New: Barber pole
];

export default function BackgroundVideo() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleVideoEnd = () => {
        setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
            {/* Overlay for contrast */}
            <div className="absolute inset-0 bg-black/60 z-10" />

            <AnimatePresence mode="popLayout"> {/* popLayout helps with smooth swapping */}
                <motion.video
                    key={currentIndex} // Key change triggers re-render/animation
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }} // Target visible opacity
                    exit={{ opacity: 0 }} // Fade out on exit
                    transition={{ duration: 1.5, ease: "easeInOut" }} // Slower crossfade
                    autoPlay
                    muted
                    playsInline
                    controls={false}
                    onEnded={handleVideoEnd}
                    className="absolute inset-0 w-full h-full object-cover grayscale-[20%] contrast-110"
                >
                    <source src={PLAYLIST[currentIndex]} type="video/mp4" />
                </motion.video>
            </AnimatePresence>
        </div>
    );
}
