"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Briefcase, ArrowLeft } from "lucide-react";
import IntroAnimation from "@/components/features/IntroAnimation";
import { useLanguage } from "@/components/features/LanguageContext";

export default function AdminLogin() {
    const [step, setStep] = useState<'intro' | 'lang' | 'role' | 'auth_admin' | 'auth_staff' | 'staff_select'>('intro');
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [barbers, setBarbers] = useState<any[]>([]);
    const [selectedBarber, setSelectedBarber] = useState<any>(null);
    const router = useRouter();
    const { setLanguage, t } = useLanguage();

    useEffect(() => {
        if (step === 'staff_select') {
            fetch('/api/barbers')
                .then(res => res.json())
                .then(data => setBarbers(data))
                .catch(err => console.error(err));
        }
    }, [step]);

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "berberadmin") {
            document.cookie = "admin_session=true; path=/; max-age=86400";
            router.push("/admin/dashboard");
        } else {
            setError(t("admin.login.error"));
        }
    };

    const handleStaffLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "berberadmin") {
            setError("");
            setStep('staff_select');
        } else {
            setError(t("admin.login.error"));
        }
    };

    const handleStaffSelect = (barber: any) => {
        document.cookie = "staff_session=true; path=/; max-age=86400";
        document.cookie = `staff_barber_id=${barber.id}; path=/; max-age=86400`;
        router.push("/admin/staff");
    };

    if (step === 'intro') {
        return <IntroAnimation onComplete={() => setStep('lang')} />;
    }

    if (step === 'lang') {
        return (
            <div className="fixed inset-0 z-50 flex bg-black">
                {/* Deutsch */}
                <div
                    className="flex-1 border-r border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden"
                    onClick={() => { setLanguage('de'); setStep('role'); }}
                    role="button"
                >
                    <span className="text-4xl md:text-6xl font-bold text-gray-500 group-hover:text-neon-blue transition-colors">DE</span>
                    <span className="absolute bottom-10 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-neon-blue">DEUTSCH</span>
                </div>

                {/* English */}
                <div
                    className="flex-1 border-r border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden"
                    onClick={() => { setLanguage('en'); setStep('role'); }}
                    role="button"
                >
                    <span className="text-4xl md:text-6xl font-bold text-gray-500 group-hover:text-white transition-colors">EN</span>
                    <span className="absolute bottom-10 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-white">ENGLISH</span>
                </div>

                {/* TR */}
                <div
                    className="flex-1 border-r border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden"
                    onClick={() => { setLanguage('tr'); setStep('role'); }}
                    role="button"
                >
                    <span className="text-4xl md:text-6xl font-bold text-gray-500 group-hover:text-neon-purple transition-colors">TR</span>
                    <span className="absolute bottom-10 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-neon-purple">TÜRKÇE</span>
                </div>

                {/* KU */}
                <div
                    className="flex-1 border-r border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden"
                    onClick={() => { setLanguage('ku'); setStep('role'); }}
                    role="button"
                >
                    <span className="text-4xl md:text-6xl font-bold text-gray-500 group-hover:text-yellow-500 transition-colors">KU</span>
                    <span className="absolute bottom-10 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-yellow-500">KURDÎ</span>
                </div>

                {/* AR */}
                <div
                    className="flex-1 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden"
                    onClick={() => { setLanguage('ar'); setStep('role'); }}
                    role="button"
                >
                    <span className="text-4xl md:text-6xl font-bold text-gray-500 group-hover:text-green-500 transition-colors">AR</span>
                    <span className="absolute bottom-10 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-green-500">العربية</span>
                </div>
            </div>
        );
    }

    if (step === 'role') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4 animate-in fade-in duration-500">
                <div className="w-full max-w-md space-y-4">
                    <h1 className="text-3xl font-bold text-white text-center mb-8">{t("book.step_1.title")}</h1>

                    <button
                        onClick={() => { setStep('auth_admin'); setError(""); setPassword(""); }}
                        className="w-full bg-[#111] hover:bg-white/5 border border-white/10 rounded-2xl p-6 transition-all flex items-center gap-6 group"
                    >
                        <div className="w-16 h-16 bg-neon-blue/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-neon-blue/20 transition-colors">
                            <Lock className="text-neon-blue" size={32} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-xl font-bold text-white group-hover:text-neon-blue transition-colors">Yönetici Girişi</h2>
                            <p className="text-gray-400 text-sm mt-1">Sistem ayarlarına ve tüm randevulara erişim sağlayın.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => { setStep('auth_staff'); setError(""); setPassword(""); }}
                        className="w-full bg-[#111] hover:bg-white/5 border border-white/10 rounded-2xl p-6 transition-all flex items-center gap-6 group"
                    >
                        <div className="w-16 h-16 bg-neon-purple/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-neon-purple/20 transition-colors">
                            <Briefcase className="text-neon-purple" size={32} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-xl font-bold text-white group-hover:text-neon-purple transition-colors">Çalışan Girişi</h2>
                            <p className="text-gray-400 text-sm mt-1">Sadece kendi randevularınızı ve programınızı görün.</p>
                        </div>
                    </button>

                    <button onClick={() => setStep('lang')} className="w-full text-center text-gray-500 hover:text-white mt-4 transition-colors">
                        {t('back')}
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'staff_select') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4 animate-in fade-in duration-500">
                <div className="w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => setStep('auth_staff')} className="p-2 hover:bg-white/5 rounded-full text-white transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Profilini Seç</h1>
                            <p className="text-gray-400 text-sm mt-1">Devam etmek için ismine tıkla.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {barbers.map(barber => (
                            <button
                                key={barber.id}
                                onClick={() => handleStaffSelect(barber)}
                                className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-neon-purple hover:bg-white/5 bg-black/40 transition-all group"
                            >
                                <div className="w-16 h-16 rounded-full bg-gray-800 overflow-hidden shrink-0">
                                    <img src={barber.image} alt={barber.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-bold text-white group-hover:text-neon-purple transition-colors">{barber.name}</h3>
                                    <p className="text-sm text-gray-400">{barber.specialty}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Step: auth_admin or auth_staff
    const isStaff = step === 'auth_staff';
    const formHandler = isStaff ? handleStaffLogin : handleAdminLogin;

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 relative">

                <button
                    onClick={() => setStep('role')}
                    className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex flex-col items-center mb-8 mt-4">
                    <div className={`w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 ${isStaff ? 'text-neon-purple' : 'text-neon-blue'}`}>
                        {isStaff ? <Briefcase size={32} /> : <Lock size={32} />}
                    </div>
                    <h1 className="text-2xl font-bold text-white">{isStaff ? "Çalışan Girişi" : t("admin.login.title")}</h1>
                    <p className="text-gray-400 text-sm mt-2">{t("admin.login.subtitle")}</p>
                </div>

                <form onSubmit={formHandler} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            className={`w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none transition-colors text-center tracking-widest ${isStaff ? 'focus:border-neon-purple' : 'focus:border-neon-blue'}`}
                            placeholder="••••••••"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center font-medium bg-red-500/10 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full font-bold py-4 rounded-xl transition-colors ${isStaff
                            ? 'bg-neon-purple text-white hover:bg-neon-purple/80'
                            : 'bg-neon-blue text-black hover:bg-white hover:text-black'
                            }`}
                    >
                        {t("admin.login.button")}
                    </button>
                </form>
            </div>
        </div>
    );
}
