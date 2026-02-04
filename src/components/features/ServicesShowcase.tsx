"use client";

import { motion } from "framer-motion";
import { Scissors, Zap, Clock, Star } from "lucide-react";
import { useLanguage } from "./LanguageContext";

const services = [
    {
        id: "haircut",
        icon: Scissors,
        price: "35€",
        duration: "45 min",
        image: "/gallery/real-tools.png" // Placeholder, using existing assets
    },
    {
        id: "beard",
        icon: Zap, // Using Zap for styling/beard
        price: "20€",
        duration: "25 min",
        image: "/gallery/real-interior.png"
    },
    {
        id: "full",
        icon: Star,
        price: "50€",
        duration: "60 min",
        image: "/gallery/real-lounge.png"
    }
];

export default function ServicesShowcase() {
    const { t } = useLanguage();

    return (
        <section className="py-24 bg-[#050505] relative overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter">
                        {t('services.title')} <span className="text-neon-blue">{t('services.highlight')}</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {t('services.subtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative h-[400px] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 mx-auto w-full max-w-sm"
                        >
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0">
                                <img
                                    src={service.image}
                                    alt={t(`services.${service.id}`)}
                                    className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="mb-4 transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                                    <div className="w-12 h-12 bg-neon-blue/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-neon-blue/30 text-neon-blue">
                                        <service.icon size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{t(`services.${service.id}`)}</h3>
                                    <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                        {/* Placeholder description logic or simplified */}
                                        Professional care for your look.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                    <div className="flexItems-center gap-2 text-gray-300 text-sm">
                                        <Clock size={14} className="text-neon-blue" />
                                        {service.duration}
                                    </div>
                                    <div className="text-xl font-bold text-white">{service.price}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
