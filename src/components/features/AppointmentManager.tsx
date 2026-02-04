"use client";

import { useState } from "react";
import { useLanguage } from "../features/LanguageContext";
import { X, Phone, Calendar, Clock, Scissors, Trash2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AppointmentManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AppointmentManager({ isOpen, onClose }: AppointmentManagerProps) {
    const { t } = useLanguage();
    const [phone, setPhone] = useState("");
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState("");

    const findAppointments = async () => {
        if (!phone.trim()) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/appointments?phone=${encodeURIComponent(phone.trim())}`);
            const data = await res.json();

            if (Array.isArray(data)) {
                // Filter only pending/approved appointments, ignore cancelled/past if desired
                // For now, show all valid ones that can be cancelled
                const valid = data.filter((a: any) => new Date(a.date) >= new Date(new Date().setHours(0, 0, 0, 0)));
                setAppointments(valid);
            } else {
                setAppointments([]);
            }
        } catch (err) {
            console.error("Failed to find appointments", err);
            setError("Error fetching data");
        } finally {
            setLoading(false);
            setHasSearched(true);
        }
    };

    const cancelAppointment = async (id: string) => {
        const appointment = appointments.find(a => a.id === id);
        if (!appointment) return;

        // Check if less than 24 hours
        const appDate = new Date(appointment.date);
        const [hours, minutes] = appointment.time.split(':').map(Number);
        appDate.setHours(hours, minutes, 0, 0);

        const now = new Date();
        const diffInHours = (appDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            alert(t("manage.cancel_too_late"));
            return;
        }

        if (!confirm(t("manage.cancel_confirm"))) return;

        try {
            const res = await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAppointments(prev => prev.filter(a => a.id !== id));
            }
        } catch (err) {
            console.error("Failed to cancel", err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-2">{t("manage.title")}</h2>
                        <p className="text-gray-400 text-sm mb-6">{t("manage.subtitle")}</p>

                        <div className="flex gap-2 mb-8">
                            <div className="relative flex-1">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={t("manage.placeholder")}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue transition-colors"
                                    onKeyDown={(e) => e.key === 'Enter' && findAppointments()}
                                />
                            </div>
                            <button
                                onClick={findAppointments}
                                disabled={loading || !phone}
                                className="bg-neon-blue text-black font-bold px-6 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
                            >
                                {loading ? "..." : t("manage.find")}
                            </button>
                        </div>

                        {/* Results */}
                        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {hasSearched && appointments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                                    <AlertCircle size={32} className="mb-2 opacity-50" />
                                    <p>{t("manage.no_appts")}</p>
                                </div>
                            ) : (
                                appointments.map(app => (
                                    <div key={app.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex justify-between items-center group hover:border-white/20 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-bold text-white flex items-center gap-2">
                                                    <Calendar size={14} className="text-neon-purple" />
                                                    {new Date(app.date).toLocaleDateString()}
                                                </span>
                                                <span className="text-sm text-gray-400 flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {app.time}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                                <Scissors size={14} />
                                                <span className="line-clamp-1">{app.services}</span>
                                            </div>
                                            {app.barber && (
                                                <div className="text-xs text-neon-blue mt-1">
                                                    Barber: {app.barber}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => cancelAppointment(app.id)}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title={t("manage.cancel")}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
