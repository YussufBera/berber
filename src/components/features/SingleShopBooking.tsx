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

const COUNTRY_CODES = [
    { code: "+49", flag: "🇩🇪", label: "DE" },
    { code: "+90", flag: "🇹🇷", label: "TR" },
    { code: "+33", flag: "🇫🇷", label: "FR" },
    { code: "+44", flag: "🇬🇧", label: "UK" },
    { code: "+1", flag: "🇺🇸", label: "US" },
    { code: "+31", flag: "🇳🇱", label: "NL" },
    { code: "+32", flag: "🇧🇪", label: "BE" },
    { code: "+41", flag: "🇨🇭", label: "CH" },
    { code: "+43", flag: "🇦🇹", label: "AT" },
];

const scrollToElement = (id: string, offset = 100) => {
    const element = document.getElementById(id);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth"
        });
    }
};

export default function SingleShopBooking() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const [step, setStep] = useState(1); // 1: Services, 2: Date/Time, 3: Barber, 4: Contact, 5: Success
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedBarber, setSelectedBarber] = useState<string | null>(null); // Barber ID
    const [unavailableBarbers, setUnavailableBarbers] = useState<string[]>([]); // Names of barbers who are off
    const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
    const [countryCode, setCountryCode] = useState("+49");
    const [error, setError] = useState("");

    // Hydration fix
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        setSelectedDate(new Date());
    }, []);

    // Services State (Fetched from API)
    const [services, setServices] = useState<any[]>(SHOP.services);
    const [barbers, setBarbers] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/services')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setServices(data);
            })
            .catch(err => console.error("Failed to load services", err));

        fetch('/api/barbers')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setBarbers(data);
            })
            .catch(err => console.error("Failed to load barbers", err));
    }, []);

    useEffect(() => {
        // Scroll to top of content when step changes
        scrollToElement('booking-content-top', 120);
    }, [step]);

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const servicesTotal = services
        .filter(s => selectedServices.includes(s.id))
        .reduce((acc, s) => acc + s.price, 0);

    // Add 1 Euro if specific barber is selected (and it's not "any" - represented by null or "any" based on logic below)
    // We'll use "any" as the ID for Any Barber selection
    const isSpecificBarberSelected = selectedBarber && selectedBarber !== "any";
    const total = servicesTotal + (isSpecificBarberSelected ? 1 : 0);

    // Fetch Availability when Date Changes
    useEffect(() => {
        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            fetch(`/api/availability?date=${dateStr}`)
                .then(res => res.json())
                .then((data: any[]) => {
                    const off = data.filter(d => d.isOff).map(d => d.barber);
                    setUnavailableBarbers(off);
                    // Deselect if currently selected barber is off
                    if (selectedBarber && off.find(name => {
                        const b = barbers.find(barb => barb.id === selectedBarber);
                        return b && b.name === name;
                    })) {
                        setSelectedBarber(null);
                    }
                })
                .catch(console.error);
        }
    }, [selectedDate, selectedBarber, barbers]);

    const handleNext = async () => {
        if (step === 1 && selectedServices.length > 0) setStep(2);
        else if (step === 2 && selectedTime) setStep(3);
        else if (step === 3 && selectedBarber) setStep(4);
        else if (step === 4) {
            // Validate Name
            if (!contactInfo.name.trim()) {
                setError(t("contact.required"));
                return;
            }

            // Clean phone: remove spaces and leading zeros
            let cleanNumber = contactInfo.phone.replace(/\s/g, '');
            if (cleanNumber.startsWith('0')) {
                cleanNumber = cleanNumber.substring(1);
            }

            // Combine with country code
            const fullPhone = countryCode + cleanNumber;

            // Validate Phone: + then 10-15 digits
            const phoneRegex = /^\+[0-9]{10,15}$/;
            if (!cleanNumber || !phoneRegex.test(fullPhone)) {
                setError("Bitte eine gültige Telefonnummer eingeben.");
                return;
            }

            // Save booking to Database
            try {
                const barberName = selectedBarber === "any" ? "Any" : barbers.find(b => b.id === selectedBarber)?.name || "Any";

                const newBooking = {
                    name: contactInfo.name,
                    email: contactInfo.email,
                    phone: fullPhone,
                    services: services.filter(s => selectedServices.includes(s.id)).map(s => s.name.en),
                    total: total,
                    date: selectedDate,
                    time: selectedTime,
                    barber: barberName,
                    preferredLanguage: language || "de"
                };

                const res = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newBooking),
                });

                if (!res.ok) throw new Error('Failed to create booking');

                setStep(5);
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
        'ku': 'ku-TR',
        'ar': 'ar-SA'
    };
    const currentLocale = localeMap[language || 'de'];

    // Helper for safe service name access
    const getServiceName = (s: any) => {
        if (!s.name) return "Service";
        return s.name[language || 'de'] || s.name['de'] || "Service";
    };

    if (!mounted) return null;

    const today = new Date();

    return (
        <div className="relative z-10 w-full max-w-5xl mx-auto p-6 md:p-12 min-h-screen flex flex-col pt-32 pb-20">

            {/* Back Button */}
            <button
                onClick={() => router.push('/')}
                className="absolute -top-6 left-6 md:left-12 flex items-center gap-2 text-white/70 hover:text-white transition-colors group z-50 pointer-events-auto"
            >
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-neon-blue group-hover:border-neon-blue group-hover:text-black transition-all">
                    <ArrowLeft size={20} />
                </div>
                <span className="font-medium text-sm tracking-widest">{t('nav.home') || 'HOME'}</span>
            </button>

            {/* Header content - Scroll Entrance */}
            <motion.div
                id="booking-content-top" // Anchor for scrolling
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-10 text-center md:text-left"
            >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tighter">
                    {step === 1 && t('select.services')}
                    {step === 2 && t('select.time')}
                    {step === 3 && t('select.barber')}
                    {step === 4 && t('contact.details')}
                    {step === 5 && t('confirmed')}
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
                                        onClick={() => {
                                            toggleService(service.id);
                                            // Scroll down a bit to encourage progression or show more
                                            setTimeout(() => {
                                                window.scrollBy({ top: 150, behavior: 'smooth' });
                                            }, 100);
                                        }}
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

                                            // Compare using local date strings
                                            const selYear = selectedDate ? selectedDate.getFullYear() : 0;
                                            const selMonth = selectedDate ? selectedDate.getMonth() : 0;
                                            const selDay = selectedDate ? selectedDate.getDate() : 0;

                                            // Check if dates match exactly (year, month, day)
                                            const isSelected = selectedDate &&
                                                selYear === d.getFullYear() &&
                                                selMonth === d.getMonth() &&
                                                selDay === d.getDate();

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setSelectedDate(d);
                                                        // Scroll to Time Picker slightly later to allow render
                                                        setTimeout(() => scrollToElement('time-picker-section', 140), 100);
                                                    }}
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
                                <div id="time-picker-section" className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2"><Clock className="text-neon-blue" /> {t('select.time')}</h3>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                        {TIME_SLOTS.map(time => {
                                            // Check if time is in the past
                                            const isPast = (() => {
                                                if (!selectedDate) return false;
                                                const now = new Date();
                                                const today = new Date();

                                                // Reset times to compare dates only
                                                const selDate = new Date(selectedDate);
                                                selDate.setHours(0, 0, 0, 0);
                                                today.setHours(0, 0, 0, 0);

                                                // If date is in the past (shouldn't happen with date picker but good to be safe)
                                                if (selDate < today) return true;

                                                // If date is in future, time is not past
                                                if (selDate > today) return false;

                                                // If date is today, check time
                                                const [hours, minutes] = time.split(':').map(Number);
                                                const slotTime = new Date(now);
                                                slotTime.setHours(hours, minutes, 0, 0);

                                                return slotTime < now;
                                            })();

                                            return (
                                                <button
                                                    key={time}
                                                    disabled={isPast}
                                                    onClick={() => {
                                                        setSelectedTime(time);
                                                        setTimeout(() => scrollToElement('action-bar-bottom'), 100);
                                                    }}
                                                    className={cn(
                                                        "py-3 rounded-xl text-center font-bold border transition-all duration-300",
                                                        selectedTime === time
                                                            ? "bg-neon-blue text-black border-neon-blue shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                                                            : isPast
                                                                ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed opacity-50"
                                                                : "bg-white/5 border-white/10 text-white hover:border-neon-blue/50 hover:bg-white/10"
                                                    )}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                {/* Warning Message */}
                                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-500 shrink-0">
                                        <div className="font-bold text-lg">€</div>
                                    </div>
                                    <p className="text-yellow-500 text-sm font-medium">
                                        {t("select.barber_warning")}
                                    </p>
                                </div>

                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    {barbers.map(barber => {
                                        const isOff = unavailableBarbers.includes(barber.name);
                                        return (
                                            <div
                                                key={barber.id}
                                                onClick={() => {
                                                    if (!isOff) {
                                                        setSelectedBarber(barber.id);
                                                        setTimeout(() => scrollToElement('action-bar-bottom'), 100);
                                                    }
                                                }}
                                                className={`
                                                relative p-4 rounded-xl border-2 cursor-pointer transition-all group overflow-hidden
                                                ${selectedBarber === barber.id
                                                        ? "border-neon-blue bg-neon-blue/10"
                                                        : isOff
                                                            ? "border-white/5 bg-red-500/5 opacity-50 cursor-not-allowed" // Disabled style
                                                            : "border-white/10 hover:border-white/30 bg-white/5"
                                                    }
                                            `}
                                            >
                                                {/* Selection Indicator */}
                                                <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedBarber === barber.id ? "bg-neon-blue border-neon-blue" : "border-gray-500"}`}>
                                                    {selectedBarber === barber.id && <Check size={12} className="text-black" />}
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-full bg-gray-800 overflow-hidden shrink-0">
                                                        <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors">{barber.name}</h3>
                                                        <p className="text-sm text-gray-400">
                                                            {isOff ? (
                                                                <span className="text-red-500 font-bold uppercase text-xs">{t('av.day_off')}</span>
                                                            ) : (
                                                                "+1€"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            </div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
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
                                        <div className="flex gap-2">
                                            <div className="relative">
                                                <select
                                                    value={countryCode}
                                                    onChange={(e) => setCountryCode(e.target.value)}
                                                    className="appearance-none bg-black/40 border border-white/10 rounded-xl py-4 pl-4 pr-8 text-white focus:border-neon-blue focus:outline-none transition-colors h-full cursor-pointer"
                                                >
                                                    {COUNTRY_CODES.map((c) => (
                                                        <option key={c.code} value={c.code}>
                                                            {c.flag} {c.code}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ChevronRight size={14} className="rotate-90" />
                                                </div>
                                            </div>

                                            <input
                                                type="tel"
                                                value={contactInfo.phone}
                                                onChange={(e) => {
                                                    // Only allow numbers
                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                    setContactInfo(prev => ({ ...prev, phone: val }));
                                                    setError("");
                                                }}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
                                                placeholder="176 123 45 67"
                                            />
                                        </div>
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
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step5"
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
                                    <span className="block mb-4 text-2xl text-white font-medium">
                                        {t('confirmation.message')
                                            .replace('{time}', selectedTime || '')
                                            .replace('{date}', selectedDate ? selectedDate.toLocaleDateString() : '')
                                        }
                                    </span>
                                    <div className="text-sm text-gray-400">
                                        <div className="text-sm text-gray-400">
                                            {selectedBarber === "any" ? t("select.any_barber") : t('confirmation.barber').replace('{name}', barbers.find(b => b.id === selectedBarber)?.name || '')}
                                        </div>
                                    </div>
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
                                {isSpecificBarberSelected && (
                                    <div className="flex justify-between text-neon-blue text-sm border-b border-white/5 pb-2">
                                        <span>{t("select.barber")} ({barbers.find(b => b.id === selectedBarber)?.name})</span>
                                        <span>+€1</span>
                                    </div>
                                )}

                                {step === 3 && (
                                    <button
                                        onClick={() => {
                                            setSelectedBarber("any");
                                            setTimeout(() => {
                                                setStep(4);
                                            }, 50);
                                        }}
                                        className="w-full text-center py-3 rounded-xl border border-white/20 text-sm font-medium text-gray-300 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all pt-2 flex items-center justify-center gap-2 group"
                                    >
                                        <span>{t("select.continue_without")}</span>
                                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs group-hover:bg-white/20 transition-colors">+0€</span>
                                    </button>
                                )}

                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-gray-400">{t('total')}</span>
                                    <span className="text-2xl font-bold text-white">€{total}</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-8" id="action-bar-bottom">
                            {step < 5 && (
                                <button
                                    disabled={step === 1 ? selectedServices.length === 0 : step === 2 ? !selectedTime : step === 3 ? !selectedBarber : false}
                                    onClick={handleNext}
                                    className="w-full bg-neon-blue text-black font-bold py-4 rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {step === 4 ? t('confirm') : t('next')}
                                    <ChevronRight size={20} />
                                </button>
                            )}

                            {step > 1 && step < 5 && (
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
