"use client";

import { BarberShop, Service } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock Time Slots
const TIME_SLOTS = [
    "10:00", "10:45", "11:30", "13:00", "13:45", "14:30", "15:15", "16:00", "16:45", "17:30"
];

export default function BookingModal({
    shop,
    isOpen,
    onClose
}: {
    shop: BarberShop | null,
    isOpen: boolean,
    onClose: () => void
}) {
    const [step, setStep] = useState(1); // 1: Services, 2: Date/Time, 3: Confirm
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());

    if (!shop) return null;

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const total = shop.services
        .filter(s => selectedServices.includes(s.id))
        .reduce((acc, s) => acc + s.price, 0);

    const handleNext = () => {
        if (step === 1 && selectedServices.length > 0) setStep(2);
        else if (step === 2 && selectedTime) setStep(3);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        className="relative w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151515]">
                            <div>
                                <h2 className="text-xl font-bold text-white">{shop.name}</h2>
                                <p className="text-sm text-gray-400">Step {step} of 3</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="text-gray-400" />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-neon-blue mb-4">Select Services</h3>
                                    {shop.services.map(service => (
                                        <div
                                            key={service.id}
                                            onClick={() => toggleService(service.id)}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                                                selectedServices.includes(service.id)
                                                    ? "bg-neon-blue/10 border-neon-blue"
                                                    : "bg-white/5 border-white/5 hover:border-white/20"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                                                    selectedServices.includes(service.id) ? "bg-neon-blue border-transparent" : "border-gray-500"
                                                )}>
                                                    {selectedServices.includes(service.id) && <Check size={14} className="text-black" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{service.name.en}</p>
                                                    <p className="text-sm text-gray-500">{service.duration} mins</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-white">€{service.price}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-neon-purple mb-4 flex items-center gap-2">
                                            <Calendar size={20} /> Select Date
                                        </h3>
                                        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
                                            {[0, 1, 2, 3, 4, 5, 6].map(i => {
                                                const d = new Date();
                                                d.setDate(d.getDate() + i);
                                                const isSelected = selectedDate === d.getDate();
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelectedDate(d.getDate())}
                                                        className={cn(
                                                            "min-w-[80px] p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all",
                                                            isSelected ? "bg-neon-purple text-black border-neon-purple" : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                                                        )}
                                                    >
                                                        <span className="text-xs font-medium uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                        <span className="text-xl font-bold">{d.getDate()}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-neon-blue mb-4 flex items-center gap-2">
                                            <Clock size={20} /> Select Time
                                        </h3>
                                        <div className="grid grid-cols-4 gap-3">
                                            {TIME_SLOTS.map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={cn(
                                                        "py-2 px-1 rounded-lg border text-sm font-medium transition-all",
                                                        selectedTime === time
                                                            ? "bg-neon-blue text-black border-neon-blue"
                                                            : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                                                    )}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Check size={40} className="text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
                                    <p className="text-gray-400 mb-8">You are booked for {selectedTime} on {selectedDate}.</p>
                                    <div className="bg-white/5 p-4 rounded-xl max-w-sm mx-auto">
                                        {shop.services.filter(s => selectedServices.includes(s.id)).map(s => (
                                            <div key={s.id} className="flex justify-between text-sm text-gray-300 mb-1">
                                                <span>{s.name.en}</span>
                                                <span>€{s.price}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-bold text-white">
                                            <span>Total</span>
                                            <span>€{total}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-white/10 bg-[#151515] flex justify-between items-center">
                            {step < 3 ? (
                                <>
                                    <div className="text-white">
                                        <p className="text-sm text-gray-500">Total Estimate</p>
                                        <p className="text-2xl font-bold font-mono">€{total}</p>
                                    </div>
                                    <button
                                        disabled={step === 1 ? selectedServices.length === 0 : !selectedTime}
                                        onClick={handleNext}
                                        className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {step === 1 ? "Select Time" : "Confirm Booking"}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="w-full bg-neon-blue text-black px-8 py-3 rounded-full font-bold hover:bg-white transition-all"
                                >
                                    Done
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
