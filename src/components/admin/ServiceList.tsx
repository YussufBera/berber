"use client";

import { Service } from "@/lib/mockData";
import { useState } from "react";
import { Plus, Edit2, Trash2, Clock, Euro } from "lucide-react";
import { motion } from "framer-motion";

// Augmented mock data for admin context
const INITIAL_SERVICES: Service[] = [
    {
        id: "s1",
        name: { en: "Haircut & Styling", de: "Haarschnitt & Styling", tr: "Saç Kesimi & Şekillendirme" },
        price: 35,
        duration: 45
    },
    {
        id: "s2",
        name: { en: "Beard Trim", de: "Bartpflege", tr: "Sakal Düzeltme" },
        price: 20,
        duration: 25
    },
    {
        id: "s3",
        name: { en: "Full Package", de: "Komplettpaket", tr: "Tam Paket" },
        price: 50,
        duration: 60
    },
    {
        id: "s4",
        name: { en: "Hot Towel Shave", de: "Heißtuch-Rasur", tr: "Sıcak Havlu Tıraşı" },
        price: 25,
        duration: 30
    },
];

export default function ServiceList() {
    const [services, setServices] = useState(INITIAL_SERVICES);

    return (
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white">Service Menu</h3>
                    <p className="text-sm text-gray-400">Manage your prices and durations</p>
                </div>
                <button className="flex items-center gap-2 bg-neon-blue text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition-all w-full md:w-auto justify-center">
                    <Plus size={18} />
                    Add Service
                </button>
            </div>

            <div className="space-y-3">
                {services.map((service, index) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-white/20 transition-all gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-gray-400 font-bold border border-white/5 group-hover:text-white group-hover:border-neon-purple transition-colors">
                                {service.name.en.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-neon-purple transition-colors">{service.name.en}</h4>
                                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {service.duration} min</span>
                                    <span className="flex items-center gap-1"><Euro size={12} /> Fixed Price</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <span className="text-xl font-bold text-white">€{service.price}</span>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
