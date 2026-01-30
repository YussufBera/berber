"use client";

import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Scissors } from "lucide-react";

interface CutTransitionProps {
    isActive: boolean;
    onClosed: () => void;
    onComplete: () => void;
}

export default function CutTransition({ isActive, onClosed, onComplete }: CutTransitionProps) {
    const controls = useAnimation();
    const [isVisible, setIsVisible] = useState(false);

    const isMounted = React.useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        if (isActive) {
            setIsVisible(true);
        }
    }, [isActive]);

    useEffect(() => {
        if (isVisible && isActive) {
            const sequence = async () => {
                // Ensure elements are mounted before starting
                await new Promise(resolve => requestAnimationFrame(resolve));
                if (!isMounted.current) return;

                controls.set("initial");

                // 1. Close Panels (Cover Screen) - 1.0s
                await controls.start("closed");
                if (!isMounted.current) return;

                // 2. Trigger Content Swap (Behind curtain)
                onClosed();

                // Hold (Drama) - 0.5s
                await new Promise(resolve => setTimeout(resolve, 500));
                if (!isMounted.current) return;

                // 3. Vanish Scissors (Panels stay closed) - 0.4s
                await controls.start("vanish");
                if (!isMounted.current) return;

                // Short pause after scissors gone - 0.2s
                await new Promise(resolve => setTimeout(resolve, 200));
                if (!isMounted.current) return;

                // 4. Open Panels (Reveal New Content) - 1.2s
                await controls.start("cut");
                if (!isMounted.current) return;

                // Cleanup
                await new Promise(resolve => setTimeout(resolve, 200));

                if (isMounted.current) {
                    setIsVisible(false);
                    onComplete();
                }
            };
            sequence();
        }
    }, [isVisible, isActive, controls, onClosed, onComplete]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none">
            {/* Scissors Icon Animation */}
            <motion.div
                initial="initial"
                animate={controls}
                variants={{
                    initial: { scale: 3, opacity: 0 },
                    closed: { scale: 1, opacity: 1, transition: { duration: 1.0, ease: "easeOut" } },
                    vanish: { scale: 1, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } },
                    cut: { scale: 1, opacity: 0 } // Stay hidden
                }}
                className="absolute z-20 text-neon-blue"
            >
                <Scissors size={200} />
            </motion.div>

            {/* Top Half */}
            <motion.div
                initial="initial"
                animate={controls}
                variants={{
                    initial: { y: "-100%" },
                    closed: { y: "0%", transition: { duration: 1.0, ease: "easeInOut" } },
                    vanish: { y: "0%" }, // Stay closed
                    cut: { y: "-100%", transition: { duration: 1.2, ease: "easeInOut" } }
                }}
                className="absolute top-0 left-0 w-full h-1/2 bg-black border-b border-neon-blue shadow-[0_0_50px_rgba(0,243,255,0.2)] z-10"
            />

            {/* Bottom Half */}
            <motion.div
                initial="initial"
                animate={controls}
                variants={{
                    initial: { y: "100%" },
                    closed: { y: "0%", transition: { duration: 1.0, ease: "easeInOut" } },
                    vanish: { y: "0%" }, // Stay closed
                    cut: { y: "100%", transition: { duration: 1.2, ease: "easeInOut" } }
                }}
                className="absolute bottom-0 left-0 w-full h-1/2 bg-black border-t border-neon-blue shadow-[0_0_50px_rgba(0,243,255,0.2)] z-10"
            />
        </div>
    );
}
