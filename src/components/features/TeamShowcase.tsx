"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { Barber } from "@/lib/mockData";

export default function TeamShowcase() {
    const { t } = useLanguage();
    const [barbers, setBarbers] = useState<Barber[]>([]);

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
        <section className="py-24 bg-black relative border-t border-white/5">
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

                <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
                    {barbers.length > 0 ? (
                        barbers.map((barber, index) => (
                            <motion.div
                                key={barber.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative w-full md:w-64 h-64 rounded-full border border-white/10 flex flex-col items-center justify-center p-6 bg-neutral-900/50 hover:bg-neutral-800 transition-all duration-500 hover:border-neon-purple/30"
                            >
                                <div className="absolute inset-0 rounded-full bg-neon-purple/5 blur-xl group-hover:bg-neon-purple/10 transition-all" />

                                <h3 className="text-3xl font-bold text-white mb-2 relative z-10">{barber.name}</h3>
                                <p className="text-neon-blue font-medium tracking-widest text-xs uppercase relative z-10 mb-4">{barber.specialty}</p>

                                {/* Decorative line */}
                                <div className="w-12 h-[1px] bg-white/20 group-hover:w-24 transition-all duration-500" />
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
                        className="group relative w-full md:w-64 h-64 rounded-full border border-dashed border-white/10 flex flex-col items-center justify-center p-6 hover:border-white/30 transition-colors"
                    >
                        <h3 className="text-lg font-bold text-gray-400 mb-2">{t('team.join_title')}</h3>
                        <p className="text-gray-600 text-xs text-center">{t('team.join_desc')}</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
