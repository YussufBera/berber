"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import IntroAnimation from "@/components/features/IntroAnimation";
import { useLanguage } from "@/components/features/LanguageContext";

export default function AdminLogin() {
    const [step, setStep] = useState<'intro' | 'lang' | 'auth'>('intro');
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { setLanguage, t } = useLanguage();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (password === "berberadmin") {
            // Set cookie (valid for 1 day)
            document.cookie = "admin_session=true; path=/; max-age=86400";
            router.push("/admin/dashboard");
        } else {
            setError(t("admin.login.error"));
        }
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
                    onClick={() => { setLanguage('de'); setStep('auth'); }}
                    role="button"
                >
                    <span className="text-4xl md:text-6xl font-bold text-gray-500 group-hover:text-neon-blue transition-colors">DE</span>
                    <span className="absolute bottom-10 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-neon-blue">DEUTSCH</span>
                </div>

                {/* English */}
                <div
                    className="flex-1 border-r border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden"
                    onClick={() => { setLanguage('en'); setStep('auth'); }}
                    role="button"
                >
                    <span className="text-4xl md:text-6xl font-bold text-gray-500 group-hover:text-white transition-colors">EN</span>
                    <span className="absolute bottom-10 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-white">ENGLISH</span>
                </div>

                {/* Türkçe */}
                <div
                    className="flex-1 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden"
                    onClick={() => { setLanguage('tr'); setStep('auth'); }}
                    role="button"
                >
                    <span className="text-4xl md:text-6xl font-bold text-gray-500 group-hover:text-neon-purple transition-colors">TR</span>
                    <span className="absolute bottom-10 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-neon-purple">TÜRKÇE</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Lock className="text-neon-blue" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">{t("admin.login.title")}</h1>
                    <p className="text-gray-400 text-sm mt-2">{t("admin.login.subtitle")}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-blue focus:outline-none transition-colors text-center tracking-widest"
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
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        {t("admin.login.button")}
                    </button>
                </form>
            </div>
        </div>
    );
}
