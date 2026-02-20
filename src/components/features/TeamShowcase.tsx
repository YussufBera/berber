"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { Barber } from "@/lib/mockData";
import ApplicationModal from "./ApplicationModal";

export default function TeamShowcase() {
    const { t } = useLanguage();
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                const res = await fetch('/api/barbers');
                if (res.ok) {
                    const data = await res.json();
                    setBarbers(data);
                }
            } catch (error) {
                console.error("Failed to fetch barbers", error);
            }
        };
        fetchBarbers();
    }, []);

    return (
        <section className="py-24 bg-black relative border-t border-white/5 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-purple/5 via-transparent to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4">
                        {t('team.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">{t('team.highlight')}</span>
                    </h2>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
                    {barbers.length > 0 ? (
                        barbers.map((barber, index) => (
                            <motion.div
                                key={barber.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative w-full md:w-72 h-80 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center p-6 bg-neutral-900/50 hover:bg-neutral-800 transition-all duration-500 hover:border-neon-purple/30 overflow-hidden"
                            >
                                {/* NEW: Neon Barber Background Image */}
                                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                                    <img
                                        src="/team/neon-barber.png"
                                        alt="Barber Silhouette"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-16 h-1 bg-gradient-to-r from-neon-purple to-neon-blue rounded-full mb-6 group-hover:w-24 transition-all duration-500" />

                                    <h3 className="text-3xl font-bold text-white mb-2 tracking-wide group-hover:scale-110 transition-transform duration-300">{barber.name}</h3>
                                    <p className="text-neon-blue font-medium tracking-[0.2em] text-xs uppercase mb-4">{barber.specialty}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-gray-500">Loading team...</p>
                    )}

                    {/* "Join Us" Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        onClick={() => setIsModalOpen(true)}
                        className="group relative w-full md:w-72 h-80 rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center p-6 hover:border-white/30 transition-colors cursor-pointer"
                    >
                        <h3 className="text-xl font-bold text-gray-400 mb-2">{t('team.join_title')}</h3>
                        <p className="text-gray-600 text-xs text-center max-w-[200px]">{t('team.join_desc')}</p>
                    </motion.div>
                </div>
            </div>

            <ApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
}
