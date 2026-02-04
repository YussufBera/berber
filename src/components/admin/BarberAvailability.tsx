"use client";

import { useState, useEffect } from "react";
import { User, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Barber } from "@/lib/mockData";
import { useLanguage } from "../features/LanguageContext";

export default function BarberAvailability() {
    const { t } = useLanguage();
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [offDays, setOffDays] = useState<string[]>([]); // Array of date strings "YYYY-MM-DD"
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Fetch Barbers
        fetch('/api/barbers')
            .then(res => res.json())
            .then(data => {
                setBarbers(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!selectedBarberId) return;

        // Fetch Availability for selected barber
        const selectedBarber = barbers.find(b => b.id === selectedBarberId);
        if (selectedBarber) {
            fetch(`/api/availability?barber=${encodeURIComponent(selectedBarber.name)}`)
                .then(res => res.json())
                .then((data: any[]) => {
                    // Extract dates from data where isOff is true
                    setOffDays(data.filter(d => d.isOff).map(d => d.date));
                })
                .catch(err => console.error(err));
        }
    }, [selectedBarberId, barbers]);

    // Calendar Logic (Simplified duplicate of Schedule)
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => {
        const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1;
    };
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const handleDayClick = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDay(date);
        setIsModalOpen(true);
    };

    const formatDateKey = (date: Date) => {
        // Use local date parts to avoid timezone shifting
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const updateAvailability = async (isOff: boolean) => {
        if (!selectedDay || !selectedBarberId) return;

        const barberName = barbers.find(b => b.id === selectedBarberId)?.name;
        if (!barberName) return;

        const dateKey = formatDateKey(selectedDay);

        try {
            await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    barber: barberName,
                    date: dateKey,
                    isOff
                })
            });

            // Update local state
            if (isOff) {
                setOffDays(prev => [...prev, dateKey]);
            } else {
                setOffDays(prev => prev.filter(d => d !== dateKey));
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to update availability", error);
        }
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-white/5 opacity-50 rounded-xl" />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
            const dateKey = formatDateKey(date);
            const isOff = offDays.includes(dateKey);
            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDayClick(i)}
                    className={`
                        h-24 p-2 rounded-xl border flex flex-col items-center justify-center transition-all relative
                        ${isOff
                            ? "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30"
                            : "bg-green-500/10 border-green-500/30 text-white hover:bg-green-500/20"}
                        ${isToday ? "ring-2 ring-white" : ""}
                    `}
                >
                    <span className="text-2xl font-bold">{i}</span>
                    <span className="text-xs font-bold mt-2 uppercase">
                        {isOff ? t('av.day_off') : t('av.working')}
                    </span>
                </motion.button>
            );
        }
        return days;
    };

    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; // Could localized if needed

    return (
        <div className="space-y-6">
            {/* Barber Selector */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="text-neon-blue" />
                    Select Barber
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {barbers.map(barber => (
                        <button
                            key={barber.id}
                            onClick={() => {
                                setSelectedBarberId(barber.id);
                                setIsModalOpen(false);
                            }}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl border transition-all min-w-[200px]
                                ${selectedBarberId === barber.id
                                    ? "bg-neon-blue/10 border-neon-blue text-white"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}
                            `}
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                                <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold">{barber.name}</div>
                                <div className="text-xs opacity-70">{barber.specialty}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar */}
            <AnimatePresence mode="wait">
                {!selectedBarberId ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#111] border border-white/5 rounded-2xl p-20 text-center">
                        <User size={48} className="mx-auto mb-4 text-gray-600" />
                        <h3 className="text-2xl text-white font-bold mb-2">Select a Barber</h3>
                        <p className="text-gray-500">Select a team member to manage their working days.</p>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#111] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-white">
                                {MONTH_NAMES[currentMonth.getMonth()]} <span className="text-gray-500">{currentMonth.getFullYear()}</span>
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><ChevronLeft /></button>
                                <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><ChevronRight /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-4 mb-4">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="text-gray-500 font-medium text-sm text-center uppercase tracking-wider">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-4">
                            {renderCalendar()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Modal */}
            <AnimatePresence>
                {isModalOpen && selectedDay && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="relative bg-[#222] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl z-10"
                        >
                            <h3 className="text-2xl font-bold text-white mb-2 text-center">
                                {selectedDay.toLocaleDateString()}
                            </h3>
                            <p className="text-gray-400 text-center mb-8">
                                Manage availability for <br /><span className="text-neon-blue font-bold">{barbers.find(b => b.id === selectedBarberId)?.name}</span>
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => updateAvailability(true)}
                                    className="w-full py-4 rounded-xl bg-red-500/20 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-all font-bold flex items-center justify-center gap-2"
                                >
                                    <XCircle /> {t('av.day_off', 'Day Off')}
                                </button>
                                <button
                                    onClick={() => updateAvailability(false)}
                                    className="w-full py-4 rounded-xl bg-green-500/20 text-green-500 border border-green-500 hover:bg-green-500 hover:text-white transition-all font-bold flex items-center justify-center gap-2"
                                >
                                    <CheckCircle /> {t('av.working', 'Working')}
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full py-4 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-all font-bold mt-2"
                                >
                                    {t('av.cancel', 'Cancel')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
