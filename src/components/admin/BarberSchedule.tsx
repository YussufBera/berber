"use client";

import { useState, useEffect } from "react";
import { User, Calendar as CalendarIcon, Clock, DollarSign, Scissors, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Barber } from "@/lib/mockData";

export default function BarberSchedule() {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/barbers').then(res => res.json()),
            fetch('/api/appointments').then(res => res.json())
        ]).then(([barbersData, appointmentsData]) => {
            setBarbers(barbersData);
            setAppointments(appointmentsData);
            setLoading(false);
        }).catch(err => console.error(err));
    }, []);

    const selectedBarber = barbers.find(b => b.id === selectedBarberId);

    // Filter appointments for selected barber
    const barberAppointments = appointments.filter(app => {
        const isConfirmed = app.status === 'approved' || app.status === 'confirmed' || app.status === 'pending'; // Show all active
        const barberName = selectedBarber?.name;
        // Match by name as we store name in DB
        return isConfirmed && app.barber === barberName;
    });

    // Calendar Helpers
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => {
        const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1; // Mon=0, Sun=6
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const getAppointmentsForDay = (day: number) => {
        const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return barberAppointments.filter(app => {
            const appDate = new Date(app.date);
            return isSameDay(appDate, checkDate);
        }).sort((a, b) => a.time.localeCompare(b.time));
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];

        // Empty slots for start of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-white/5 opacity-50 rounded-xl" />);
        }

        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            const dayApps = getAppointmentsForDay(i);
            const hasApps = dayApps.length > 0;
            const isSelected = selectedDate ? (selectedDate.getDate() === i && selectedDate.getMonth() === currentMonth.getMonth()) : false;
            const isToday = isSameDay(new Date(), new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));

            days.push(
                <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))}
                    className={`
                        h-24 p-2 rounded-xl border flex flex-col items-start justify-between transition-all relative
                        ${isSelected
                            ? "bg-neon-blue text-black border-neon-blue"
                            : hasApps
                                ? "bg-white/10 border-neon-purple/50 text-white hover:border-neon-purple"
                                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"}
                        ${isToday ? "ring-1 ring-inset ring-white" : ""}
                    `}
                >
                    <span className={`text-lg font-bold ${isSelected ? "text-black" : "text-white"}`}>{i}</span>

                    {hasApps && (
                        <div className="flex gap-1 flex-wrap content-end w-full">
                            {dayApps.slice(0, 4).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-black" : "bg-neon-purple"}`}
                                />
                            ))}
                            {dayApps.length > 4 && (
                                <span className="text-[10px] leading-3">+</span>
                            )}
                        </div>
                    )}
                </motion.button>
            );
        }

        return days;
    };

    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (loading) return <div className="p-10 text-center text-white">Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header / Barber Selector */}
            <div className="flex flex-col gap-6">
                {/* Step 1: Barber Selector */}
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
                                    setSelectedDate(null); // Reset date when changing barber
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
            </div>

            <AnimatePresence mode="wait">
                {!selectedBarberId ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-[#111] border border-white/5 rounded-2xl p-20 text-center"
                    >
                        <User size={48} className="mx-auto mb-4 text-gray-600" />
                        <h3 className="text-2xl text-white font-bold mb-2">Select a Barber</h3>
                        <p className="text-gray-500">Choose a team member above to view their schedule.</p>
                    </motion.div>
                ) : !selectedDate ? (
                    // Step 2: Calendar View
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#111] border border-white/5 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-white">
                                {MONTH_NAMES[currentMonth.getMonth()]} <span className="text-gray-500">{currentMonth.getFullYear()}</span>
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                                    <ChevronLeft />
                                </button>
                                <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                                    <ChevronRight />
                                </button>
                            </div>
                        </div>

                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 gap-4 mb-4">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="text-gray-500 font-medium text-sm text-center uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-4">
                            {renderCalendar()}
                        </div>
                    </motion.div>
                ) : (
                    // Step 3: Day Detail View
                    <motion.div
                        key="day-detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-[#111] border border-white/5 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <button
                                onClick={() => setSelectedDate(null)}
                                className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                            >
                                <ArrowLeft />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedDate.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </h2>
                                <p className="text-gray-400">
                                    Schedule for <span className="text-neon-blue">{selectedBarber?.name}</span>
                                </p>
                            </div>
                        </div>

                        {getAppointmentsForDay(selectedDate.getDate()).length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No appointments for this day.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {getAppointmentsForDay(selectedDate.getDate()).map((app) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-white/20 transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2 text-xl font-bold text-white">
                                                <Clock size={18} className="text-neon-blue" />
                                                {app.time}
                                            </div>
                                            <div className="flex items-center text-green-400 font-mono text-sm bg-green-900/20 px-2 py-0.5 rounded">
                                                <DollarSign size={12} />
                                                {app.total}
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <p className="text-white font-medium text-lg">{app.name}</p>
                                            <p className="text-gray-500 text-xs">{app.phone}</p>
                                        </div>

                                        <div className="text-sm text-gray-400 mt-2 pt-2 border-t border-white/5 flex items-start gap-2">
                                            <Scissors size={14} className="mt-0.5 shrink-0" />
                                            <span className="line-clamp-2">{app.services}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
