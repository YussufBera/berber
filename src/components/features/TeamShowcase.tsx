"use client";

import { motion } from "framer-motion";
import { useLanguage } from "./LanguageContext";

const BARBERS = [
    {
        id: "1",
        name: "Yusuf",
        specialty: "Master Barber",
        image: "/team/barber1.png" // We might need to use placeholders if these don't exist
    },
    {
        id: "2",
        name: "Ahmet",
        specialty: "Style Director",
        image: "/team/barber2.png"
    }
    // Add more if needed. For now assume we have some images or will use placeholders.
];

export default function TeamShowcase() {
    const { t } = useLanguage();

    return (
        <section className="py-24 bg-black relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neon-purple/10 via-transparent to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
                >
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-2">
                            MEET THE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">MASTERS</span>
                        </h2>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* 
                        If we don't have real images yet, we should use a sleek placeholder or conditional rendering.
                        I'll use a generic placeholder style if the image fails or just standard div.
                     */}
                    {/* Placeholder Barber 1 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-900 border border-white/5"
                    >
                        <div className="absolute inset-0 bg-neutral-800 animate-pulse" /> {/* Placeholder bg */}
                        {/* If we had images: <img src={...} /> */}
                        <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-black/20 to-transparent">
                            <h3 className="text-3xl font-bold text-white mb-1">Yusuf</h3>
                            <p className="text-neon-blue font-medium tracking-wider text-sm uppercase">Master Barber</p>
                        </div>
                    </motion.div>

                    {/* Placeholder Barber 2 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-900 border border-white/5"
                    >
                        <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
                        <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-black/20 to-transparent">
                            <h3 className="text-3xl font-bold text-white mb-1">Ahmet</h3>
                            <p className="text-neon-purple font-medium tracking-wider text-sm uppercase">Stylist</p>
                        </div>
                    </motion.div>

                    {/* "Join Us" or decorative card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center justify-center p-8 text-center"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-gray-500 mb-2">Join the Elite</h3>
                            <p className="text-gray-600 text-sm">We are always looking for talent.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
