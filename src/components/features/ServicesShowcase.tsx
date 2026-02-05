"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useState, useEffect } from "react";

interface Service {
    id: string;
    name: { [key: string]: string };
    price: number;
    duration: number;
    // adding images is not supported in the current API response format
}

export default function ServicesShowcase() {
    const { t, language } = useLanguage();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('/api/services');
                if (res.ok) {
                    const data = await res.json();
                    setServices(data);
                }
            } catch (error) {
                console.error("Failed to fetch services", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const getServiceName = (service: Service) => {
        const langCode = language || 'de';
        // Check if name is an object (which it usually is from the API)
        if (typeof service.name === 'object') {
            return service.name[langCode] || service.name['en'] || service.name['de'] || "Service";
        }
        return service.name; // Fallback if it's a string
    };

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

                {loading ? (
                    <div className="text-center text-gray-500 animate-pulse">Loading services...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 hover:border-neon-blue/30 transition-all group"
                            >
                                <div className="flex flex-col h-full justify-between">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                                            {getServiceName(service)}
                                        </h3>
                                        <div className="w-12 h-1 bg-white/10 rounded-full group-hover:bg-neon-blue transition-colors" />
                                    </div>

                                    <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Clock size={14} className="text-neon-blue" />
                                            {service.duration} {t('unit.mins')}
                                        </div>
                                        <div className="text-2xl font-bold text-white">
                                            €{service.price}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
