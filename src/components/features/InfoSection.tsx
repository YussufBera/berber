"use client";

import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function InfoSection() {
    const { t } = useLanguage();

    const hours = [
        { day: "Pazartesi", time: "09:00–20:00" },
        { day: "Salı", time: "09:00–20:00" },
        { day: "Çarşamba", time: "09:00–20:00" },
        { day: "Perşembe", time: "09:00–20:00" },
        { day: "Cuma", time: "09:00–20:00" },
        { day: "Cumartesi", time: "09:00–20:00" },
        { day: "Pazar", time: "Kapalı", closed: true },
    ];

    return (
        <section className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Address Card */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-panel p-10 rounded-3xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-32 bg-neon-blue/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-neon-blue/20" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-neon-blue/50 transition-colors">
                            <MapPin className="text-neon-blue w-8 h-8" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-4">Location</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            Gröpelinger Heerstraße 209<br />
                            28239 Bremen
                        </p>

                        <a
                            href="https://maps.google.com/?q=Gröpelinger+Heerstraße+209+28239+Bremen"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-neon-blue font-bold hover:text-white transition-colors"
                        >
                            Get Directions &rarr;
                        </a>
                    </div>
                </motion.div>

                {/* Hours Card */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass-panel p-10 rounded-3xl relative overflow-hidden group"
                >
                    <div className="absolute bottom-0 left-0 p-32 bg-neon-purple/10 rounded-full blur-3xl -ml-16 -mb-16 transition-all group-hover:bg-neon-purple/20" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-neon-purple/50 transition-colors">
                                <Clock className="text-neon-purple w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-white">Opening Hours</h2>
                        </div>

                        <div className="space-y-3">
                            {hours.map((item) => (
                                <div key={item.day} className="flex justify-between items-center text-gray-300 border-b border-white/5 pb-2 last:border-0">
                                    <span className="font-medium">{item.day}</span>
                                    <span className={item.closed ? "text-red-500 font-bold" : "text-white font-mono"}>
                                        {item.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
