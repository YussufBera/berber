"use client";

import { MOCK_SHOPS } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Calendar, Clock, ChevronRight, Scissors, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "./LanguageContext";
import { useRouter } from "next/navigation";


// Use the first shop as the "Single" shop
const SHOP = MOCK_SHOPS[0];

const TIME_SLOTS = [
    "10:00", "10:45", "11:30", "13:00", "13:45", "14:30", "15:15", "16:00", "16:45", "17:30", "18:15", "19:00"
];

export default function SingleShopBooking() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const [step, setStep] = useState(1); // 1: Services, 2: Date/Time, 3: Contact, 4: Success
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
    const [error, setError] = useState("");

    // Hydration fix
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        setSelectedDate(new Date().toISOString());
    }, []);

    // Services State (Fetched from API)
    const [services, setServices] = useState<any[]>(SHOP.services);

    useEffect(() => {
        fetch('/api/services')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setServices(data);
            })
            .catch(err => console.error("Failed to load services", err));
    }, []);

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const total = services
        .filter(s => selectedServices.includes(s.id))
        .reduce((acc, s) => acc + s.price, 0);

    const handleNext = async () => {
        if (step === 1 && selectedServices.length > 0) setStep(2);
        else if (step === 2 && selectedTime) setStep(3);
        else if (step === 3) {
            // Validate Name
            if (!contactInfo.name.trim()) {
                setError(t("contact.required")); // Or generic required message
                return;
            }

            // Validate Phone: Optional +, then 10-12 digits. No other chars allow.
            const phoneRegex = /^\+?[0-9]{10,12}$/;
            if (!contactInfo.phone || !phoneRegex.test(contactInfo.phone.replace(/\s/g, ''))) {
                setError("Bitte eine gültige Telefonnummer eingeben (10-12 Ziffern)."); // You might want to translate this too if strict localization is needed, but user didn't ask explicitly for validation error translation. Using German default as base or English based on context. Let's stick to a generic error or hardcoded for now if t() key missing.
                // Actually, let's use a generic error if possible or just hardcode for now.
                // User asked for specific validation rules.
                return;
            }

            // Save booking to Database
            try {
                const newBooking = {
                    name: contactInfo.name,
                    email: contactInfo.email,
                    phone: contactInfo.phone,
                    services: services.filter(s => selectedServices.includes(s.id)).map(s => s.name.en),
                    total: total,
                    date: selectedDate, // Use selected ISO Date
                    time: selectedTime,
                };

                const res = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newBooking),
                });

                if (!res.ok) throw new Error('Failed to create booking');

                setStep(4);
            } catch (err) {
                console.error("Booking error:", err);
                setError("Failed to confirm booking. Please try again.");
            }
        }
    };

    // Map language code to locale string for Date formatting
    const localeMap: Record<string, string> = {
        'de': 'de-DE',
        'en': 'en-US',
        'tr': 'tr-TR',
        'ku': 'ku-TR' // Fallback to Turkish locale region for Kurdish if 'ku' isn't fully supported, or 'ku' if available in environment
    };
    const currentLocale = localeMap[language || 'de'];

    // Helper for safe service name access
    const getServiceName = (s: any) => {
        if (!s.name) return "Service";
        // Check language specific name, fallback to German
        return s.name[language || 'de'] || s.name['de'] || "Service";
    };

    // Determine 'today' only after mount to avoid hydration mismatch, or use a fixed date for initial render if needed.
    // However, to be safe, we return null until mounted if we are strictly avoiding mismatch.
    if (!mounted) return null;

    // Calculate dates based on current client time
    const today = new Date();

    return (
        <div className="relative z-10 w-full max-w-5xl mx-auto p-6 md:p-12 min-h-screen flex flex-col pt-32 pb-20">

            {/* Back Button */}
            <button
                onClick={() => router.push('/')}
                className="absolute top-4 left-6 md:left-12 flex items-center gap-2 text-white/70 hover:text-white transition-colors group z-50 pointer-events-auto"
            >
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-neon-blue group-hover:border-neon-blue group-hover:text-black transition-all">
                    <ArrowLeft size={20} />
                </div>
                <span className="font-medium">{t('back') || 'Back'}</span>
            </button>

            {/* Header content - Scroll Entrance */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-10 text-center md:text-left"
            >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tighter">
                    {step === 1 && t('select.services')}
                    {step === 2 && t('select.time')}
                    {step === 3 && t('contact.details')}
                    {step === 4 && t('confirmed')}
                </h2>
                <div className="h-1 w-20 bg-neon-blue rounded-full mx-auto md:mx-0" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Interactive Area */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {services.map(service => (
                                    <div
                                        key={service.id}
                                        onClick={() => toggleService(service.id)}
                                        className={cn(
                                            "relative group p-6 rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden",
                                            selectedServices.includes(service.id)
                                                ? "bg-neon-blue/10 border-neon-blue"
                                                : "bg-white/5 border-white/10 hover:border-white/30"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-white">{getServiceName(service)}</h3>
                                            <span className="text-neon-blue font-mono text-lg">€{service.price}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm">{service.duration} {t('unit.mins')}</p>

                                        {selectedServices.includes(service.id) && (
                                            <div className="absolute right-4 bottom-4 w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center text-black">
                                                <Check size={18} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                {/* Date Picker */}
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 w-full overflow-hidden">
                                    <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2"><Calendar className="text-neon-purple" /> {t('select.date')}</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar w-full">
                                        {Array.from({ length: 30 }, (_, i) => i).map(i => {
                                            const d = new Date(today); // Use safe 'today'
                                            d.setDate(today.getDate() + i);
                                            const dIso = d.toISOString();
                                            // Compare just the date part (YYYY-MM-DD)
                                            const isSelected = selectedDate.split('T')[0] === dIso.split('T')[0];

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedDate(dIso)}
                                                    className={cn(
                                                        "min-w-[100px] p-4 rounded-xl border flex flex-col items-center gap-2 transition-all shrink-0 snap-start",
                                                        isSelected
                                                            ? "bg-neon-purple text-black border-neon-purple scale-105"
                                                            : "bg-black/40 border-white/10 text-gray-400 hover:border-white/30"
                                                    )}
                                                >
                                                    <span className="text-sm font-medium uppercase">{d.toLocaleDateString(currentLocale, { weekday: 'short' })}</span>
                                                    <span className="text-3xl font-bold">{d.getDate()}</span>
                                                    <span className="text-xs opacity-50">{d.toLocaleDateString(currentLocale, { month: 'short' })}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Time Picker */}
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
                            </motion.div>
                        )}

                        {step === 3 && (
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
                                            placeholder={t('contact.placeholder_name')}
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
                                            placeholder={t('contact.placeholder_phone')}
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
                                            placeholder={t('contact.placeholder_email')}
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
                        )}

                        {step === 4 && (
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
                                    className="text-xl text-gray-300 mb-6 max-w-md mx-auto leading-relaxed"
                                >
                                    Your appointment is confirmed for <br />
                                    <span className="text-neon-blue font-bold text-2xl">{selectedTime}</span> on <span className="text-neon-purple font-bold text-2xl">{new Date(selectedDate).toLocaleDateString()}</span>.
                                </motion.p>

                                {/* Cash Warning */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl max-w-md mx-auto mb-10"
                                >
                                    <p className="text-yellow-500 font-bold flex items-center justify-center gap-2">
                                        ⚠️ {t('confirmation.cash_warning')}
                                    </p>
                                </motion.div>

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
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Column: Summary & Actions - Scroll Entrance */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-fit sticky top-24 lg:block"
                >
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Scissors size={20} className="text-gray-400" />
                            {t('summary')}
                        </h3>

                        {selectedServices.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">{t('select.service_prompt')}</p>
                        ) : (
                            <div className="space-y-4">
                                {services.filter(s => selectedServices.includes(s.id)).map(s => (
                                    <div key={s.id} className="flex justify-between text-gray-300 text-sm border-b border-white/5 pb-2">
                                        <span>{getServiceName(s)}</span>
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
                </motion.div>

            </div>
        </div>
    );
}
