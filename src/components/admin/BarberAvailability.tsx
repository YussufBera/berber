"use client";

import { useState, useEffect } from "react";
import { User, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Barber } from "@/lib/mockData";
import { useLanguage } from "../features/LanguageContext";

export default function BarberAvailability() {
    const { t } = useLanguage();
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [availabilities, setAvailabilities] = useState<any[]>([]); // Array of full DB records
    const [selectedDayAvail, setSelectedDayAvail] = useState<any | null>(null);
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Time Slots constant matching frontend SingleShopBooking.tsx
    const TIME_SLOTS = [
        "10:00", "10:45", "11:30", "13:00", "13:45", "14:30", "15:15", "16:00", "16:45", "17:30", "18:15", "19:00"
    ];
    const [tempClosedHours, setTempClosedHours] = useState<string[]>([]);
    const [isHoursView, setIsHoursView] = useState(false);

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

    const fetchAvailability = (barberId: string) => {
        const selectedBarber = barbers.find(b => b.id === barberId);
        if (selectedBarber) {
            fetch(`/api/availability?barber=${encodeURIComponent(selectedBarber.name)}`)
                .then(res => res.json())
                .then((data: any[]) => {
                    setAvailabilities(data || []);
                })
                .catch(err => console.error(err));
        }
    }

    useEffect(() => {
        if (!selectedBarberId) return;
        fetchAvailability(selectedBarberId);
    }, [selectedBarberId, barbers]);

    // Calendar Logic (Simplified duplicate of Schedule)
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => {
        const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1;
    };
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const handleDayClick = (dayStr: string) => {
        const date = new Date(dayStr);
        setSelectedDay(date);

        // Find existing record
        const existing = availabilities.find(a => a.date === dayStr);
        setSelectedDayAvail(existing || null);

        // Parse closedHours if they exist
        let parsed = [];
        if (existing && existing.closedHours && existing.closedHours !== "[]") {
            try { parsed = JSON.parse(existing.closedHours); } catch (e) { }
        }
        setTempClosedHours(parsed);
        setIsHoursView(false);
        setIsModalOpen(true);
    };

    const formatDateKey = (date: Date) => {
        // Use local date parts to avoid timezone shifting
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const updateAvailability = async (isOff: boolean, closedHours: string[] = []) => {
        if (!selectedDay || !selectedBarberId) return;

        const barberName = barbers.find(b => b.id === selectedBarberId)?.name;
        if (!barberName) return;

        const dateKey = formatDateKey(selectedDay);

        // Optimistic UI update could go here, but fetch is safer.
        try {
            await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    barber: barberName,
                    date: dateKey,
                    isOff,
                    closedHours: JSON.stringify(closedHours)
                })
            });

            // Re-fetch to guarantee sync
            fetchAvailability(selectedBarberId);
            setIsModalOpen(false);
            setIsHoursView(false);
        } catch (error) {
            console.error("Failed to update availability", error);
        }
    };

    const toggleHour = (time: string) => {
        setTempClosedHours(prev =>
            prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
        );
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-14 md:h-24 bg-white/5 opacity-50 rounded-xl" />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
            const dateKey = formatDateKey(date);

            const record = availabilities.find(a => a.date === dateKey);
            const isOff = record?.isOff;

            let hasClosedHours = false;
            if (record?.closedHours && record.closedHours !== "[]") {
                try {
                    const parsed = JSON.parse(record.closedHours);
                    if (parsed.length > 0) hasClosedHours = true;
                } catch (e) { }
            }

            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDayClick(dateKey)}
                    className={`
                        h-14 md:h-24 p-1 md:p-2 rounded-xl border flex flex-col items-center justify-center transition-all relative
                        ${isOff
                            ? "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30"
                            : hasClosedHours
                                ? "bg-orange-500/20 border-orange-500 text-orange-400 hover:bg-orange-500/30"
                                : "bg-green-500/10 border-green-500/30 text-white hover:bg-green-500/20"}
                        ${isToday ? "ring-2 ring-white" : ""}
                    `}
                >
                    <span className="text-lg md:text-2xl font-bold">{i}</span>
                    <span className="text-[10px] md:text-xs font-bold mt-1 md:mt-2 uppercase truncate w-full text-center">
                        {isOff ? t('av.day_off') : hasClosedHours ? t('av.select_hours') : t('av.working')}
                    </span>
                </motion.button>
            );
        }
        return days;
    };



    const MONTH_NAMES = t('admin.months').split(',');


    return (
        <div className="space-y-6">
            {/* Barber Selector */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="text-neon-blue" />
                    {t('admin.calendar.select_barber')}
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
                        <h3 className="text-2xl text-white font-bold mb-2">{t('admin.calendar.select_barber')}</h3>
                        <p className="text-gray-500">{t('admin.calendar.select_barber_msg')}</p>
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
                        <div className="grid grid-cols-7 gap-1 md:gap-4 mb-4">
                            {t('admin.days.short').split(',').map(day => (
                                <div key={day} className="text-gray-500 font-medium text-xs md:text-sm text-center uppercase tracking-wider">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 md:gap-4">
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
                                {t('admin.calendar.manage_for')} <br /><span className="text-neon-blue font-bold">{barbers.find(b => b.id === selectedBarberId)?.name}</span>
                            </p>

                            <div className="flex flex-col gap-3">
                                {!isHoursView ? (
                                    <>
                                        <button
                                            onClick={() => updateAvailability(true)}
                                            className="w-full py-4 rounded-xl bg-red-500/20 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-all font-bold flex items-center justify-center gap-2"
                                        >
                                            <XCircle /> {t('av.day_off', 'Day Off')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsHoursView(true);
                                            }}
                                            className="w-full py-4 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all font-bold flex items-center justify-center gap-2"
                                        >
                                            <Clock /> {t('av.select_hours', 'Select Hours')}
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
                                    </>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            {TIME_SLOTS.map(time => {
                                                const isSelected = tempClosedHours.includes(time);
                                                return (
                                                    <button
                                                        key={time}
                                                        onClick={() => toggleHour(time)}
                                                        className={`py-2 rounded-lg text-sm font-bold border transition-all ${isSelected
                                                                ? "bg-red-500 border-red-500 text-white"
                                                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                                            }`}
                                                    >
                                                        {time}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        <button
                                            onClick={() => updateAvailability(false, tempClosedHours)}
                                            className="w-full py-4 rounded-xl bg-neon-blue text-black border border-neon-blue hover:bg-white hover:border-white transition-all font-bold flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle /> {t('av.save', 'Save')}
                                        </button>
                                        <button
                                            onClick={() => setIsHoursView(false)}
                                            className="w-full py-4 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-all font-bold mt-2"
                                        >
                                            {t('back', 'Back')}
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
