"use client";

import { MOCK_APPOINTMENTS } from "@/lib/adminMockData";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../features/LanguageContext";

const HOURS = Array.from({ length: 11 }, (_, i) => i + 9); // 09:00 to 19:00

export default function CalendarView() {
    const { t } = useLanguage();
    const getPosition = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        return ((h - 9) * 120) + (m * 2) + 60; // 120px per hour + 60px header offset
    };

    return (
        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#151515]">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Clock size={18} className="text-neon-blue" />
                    {t('admin.calendar.daily_title')}
                </h3>
                <div className="flex items-center gap-4">
                    <p className="text-sm font-medium text-gray-300">Jan 30, 2026</p>
                    <div className="flex gap-1">
                        <button className="p-1 hover:bg-white/10 rounded"><ChevronLeft size={18} /></button>
                        <button className="p-1 hover:bg-white/10 rounded"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                {/* Hour Grid */}
                {HOURS.map(hour => (
                    <div key={hour} className="h-[120px] border-b border-white/5 flex group">
                        <div className="w-20 border-r border-white/5 flex justify-center pt-2 text-xs text-gray-500 font-mono">
                            {hour}:00
                        </div>
                        <div className="flex-1 group-hover:bg-white/[0.02]" />
                    </div>
                ))}

                {/* Current Time Indicator (Mock) */}
                <div
                    className="absolute left-20 right-0 border-t border-red-500 z-10 flex items-center"
                    style={{ top: getPosition('14:45') }}
                >
                    <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
                    <span className="text-[10px] text-red-500 ml-1 bg-[#111]">14:45</span>
                </div>

                {/* Appointments */}
                {MOCK_APPOINTMENTS.map(appt => {
                    const top = getPosition(appt.time);
                    // Rough duration estimate based on service type from mock data logic would be better
                    let height = 60;
                    if (appt.service.includes('Package')) height = 120;
                    if (appt.service.includes('Trim')) height = 40;

                    return (
                        <motion.div
                            key={appt.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                "absolute left-24 right-4 rounded-lg p-3 border-l-4 text-xs cursor-pointer hover:brightness-110 transition-all",
                                appt.status === 'confirmed' ? "bg-neon-blue/10 border-neon-blue text-blue-100" :
                                    appt.status === 'completed' ? "bg-green-500/10 border-green-500 text-green-100" :
                                        "bg-gray-800 border-gray-500 text-gray-300"
                            )}
                            style={{ top, height, width: 'calc(100% - 7rem)' }}
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-bold">{appt.customerName}</span>
                                <span className="opacity-70">{appt.time}</span>
                            </div>
                            <p className="opacity-80 mt-1">{appt.service}</p>
                            <div className="absolute bottom-2 right-2 flex items-center gap-1">
                                <div className="w-4 h-4 rounded-full bg-white/20" />
                                {/* Barber Avatar placeholder */}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
