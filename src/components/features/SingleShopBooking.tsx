"use client";

import { MOCK_SHOPS } from "@/lib/mockData";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Calendar, Clock, ChevronRight, Scissors, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "./LanguageContext";
import { useRouter } from "next/navigation";


// Use the first shop as the "Single" shop
const SHOP = MOCK_SHOPS[0];

// Synchronization: Uses useStorage hook to listen for 'barber_services' changes from Admin Panel
// Hydration: Defaults to SHOP.services, then updates from localStorage using the hook

const TIME_SLOTS = [
    "10:00", "10:45", "11:30", "13:00", "13:45", "14:30", "15:15", "16:00", "16:45", "17:30", "18:15", "19:00"
];

export default function SingleShopBooking() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const [step, setStep] = useState(1); // 1: Services, 2: Date/Time, 3: Contact, 4: Success
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // ... (keep useEffect for fetching services)

    // Prevent hydration mismatch by defining today based on client mount or fixed
    const today = new Date();

    // ...

    // Safe access for service name
    const getServiceName = (s: any) => {
        return s.name?.[language || 'de'] || s.name?.['de'] || "Service";
    };

    if (!mounted) return null; // Or legitimate loading skeleton

    return (
        <div className="relative z-10 w-full max-w-5xl mx-auto p-6 md:p-12 min-h-screen flex flex-col pt-32 pb-20">
            {/* ... */}
            {/* Left Column */}
            {step === 1 && (
                <motion.div ...>
            {services.map(service => (
                <div ...>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{getServiceName(service)}</h3>
                    <span className="text-neon-blue font-mono text-lg">€{service.price}</span>
                </div>
                                        {/* ... */ }
                                    </div>
    ))
}
                            </motion.div >
                        )}

{
    step === 2 && (
                            <motion.div ...>
                                {/* Date Picker */}
                                <div ...>
                                    <h3 ...>...</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar w-full">
                                        {Array.from({ length: 30 }, (_, i) => i).map(i => {
                                            const d = new Date();
                                            d.setDate(today.getDate() + i);
                                            const isSelected = selectedDate === d.getDate();
                                            return (
                                                <button key={i} ...>
                                                    <span className="text-sm font-medium uppercase">{d.toLocaleDateString(currentLocale, { weekday: 'short' })}</span>
                                                    <span className="text-3xl font-bold">{d.getDate()}</span>
                                                </button>
    )
})}
                                    </div >
                                </div >
    {/* ... */ }
                            </motion.div >
                        )}
{/* ... */ }

{/* Time Picker */ }
<div className="bg-white/5 p-6 rounded-2xl border border-white/10">
    <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2"><Clock className="text-neon-blue" /> {t('select.time')}</h3>
    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {TIME_SLOTS.map(time => (
            <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={cn(
                    "py-3 px-2 rounded-xl border text-sm font-bold transition-all",
                    selectedTime === time
                        ? "bg-neon-blue text-black border-neon-blue scale-105"
                        : "bg-black/40 border-white/10 text-gray-400 hover:bg-white/5"
                )}
            >
                {time}
            </button>
        ))}
    </div>
</div>
                            </motion.div >
                        )}

{
    step === 3 && (
        <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white/5 p-8 rounded-2xl border border-white/10"
        >
            <h3 className="text-xl font-bold text-white mb-6">{t('contact.title')}</h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-gray-400 text-sm mb-2">{t('contact.name')}</label>
                    <input
                        type="text"
                        value={contactInfo.name}
                        onChange={(e) => {
                            setContactInfo(prev => ({ ...prev, name: e.target.value }));
                            setError("");
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-2">{t('contact.phone')}</label>
                    <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => {
                            setContactInfo(prev => ({ ...prev, phone: e.target.value }));
                            setError("");
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
                        placeholder="+49 ..."
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-2">{t('contact.email')}</label>
                    <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => {
                            setContactInfo(prev => ({ ...prev, email: e.target.value }));
                            setError("");
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-purple focus:outline-none transition-colors"
                        placeholder="example@mail.com"
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-sm font-medium">{error}</p>
                )}

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-blue-200 text-sm leading-relaxed">
                        {t('contact.disclaimer')}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

{
    step === 4 && (
        <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden"
        >
            {/* Success Glow Background */}
            <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full scale-150 animate-pulse-slow pointer-events-none" />

            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.5)] relative z-10"
            >
                <Check size={64} className="text-black" strokeWidth={4} />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl font-bold text-white mb-4 tracking-tighter"
            >
                {t('confirmed')}!
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-gray-300 mb-10 max-w-md mx-auto leading-relaxed"
            >
                Your appointment is confirmed for <br />
                <span className="text-neon-blue font-bold text-2xl">{selectedTime}</span> on <span className="text-neon-purple font-bold text-2xl">{selectedDate}.</span>
            </motion.p>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={() => router.push('/')}
                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg hover:scale-105 transform duration-200"
            >
                {t('book.another')}
            </motion.button>
        </motion.div>
    )
}
                    </AnimatePresence >
                </div >

    {/* Right Column: Summary & Actions - Scroll Entrance */ }
    < motion.div
initial = {{ opacity: 0, x: 20 }}
animate = {{ opacity: 1, x: 0 }}
transition = {{ duration: 0.8, delay: 0.2 }}
className = "h-fit sticky top-24 lg:block"
    >
    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Scissors size={20} className="text-gray-400" />
            {t('summary')}
        </h3>

        {selectedServices.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Select a service to start.</p>
        ) : (
            <div className="space-y-4">
                {services.filter(s => selectedServices.includes(s.id)).map(s => (
                    <div key={s.id} className="flex justify-between text-gray-300 text-sm border-b border-white/5 pb-2">
                        <span>{s.name[language || 'de']}</span>
                        <span>€{s.price}</span>
                    </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400">{t('total')}</span>
                    <span className="text-2xl font-bold text-white">€{total}</span>
                </div>
            </div>
        )}

        <div className="mt-8">
            {step < 4 && (
                <button
                    disabled={step === 1 ? selectedServices.length === 0 : step === 2 ? !selectedTime : false}
                    onClick={handleNext}
                    className="w-full bg-neon-blue text-black font-bold py-4 rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {step === 3 ? t('confirm') : t('next')}
                    <ChevronRight size={20} />
                </button>
            )}

            {step > 1 && step < 4 && (
                <button
                    onClick={() => setStep(step - 1)}
                    className="w-full mt-4 text-gray-500 hover:text-white text-sm"
                >
                    {t('back')}
                </button>
            )}
        </div>
    </div>
                </motion.div >

            </div >
        </div >
    );
}
