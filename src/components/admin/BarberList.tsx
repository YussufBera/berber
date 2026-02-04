"use client";

import { Barber } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Save, User, Scissors } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/features/LanguageContext";

export default function BarberList() {
    const { t } = useLanguage();
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBarber, setNewBarber] = useState({ name: "", specialty: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBarbers();
    }, []);

    const fetchBarbers = async () => {
        try {
            const res = await fetch('/api/barbers');
            const data = await res.json();
            setBarbers(data);
        } catch (error) {
            console.error("Failed to fetch barbers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBarber = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBarber.name) return;

        setSaving(true);
        const specialty = newBarber.specialty || t("admin.barbers.specialty_placeholder");
        const image = `/team/default-barber.png`;

        try {
            const res = await fetch('/api/barbers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newBarber.name, specialty, image, shopId: "1" })
            });

            if (res.ok) {
                const added = await res.json();
                setBarbers([...barbers, added]);
                setIsModalOpen(false);
                setNewBarber({ name: "", specialty: "" });
            }
        } catch (error) {
            console.error("Failed to add barber", error);
        } finally {
            setSaving(false);
        }
    };

    const deleteBarber = async (id: string) => {
        if (!confirm(t("admin.barbers.delete_confirm"))) return;

        try {
            const res = await fetch(`/api/barbers?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setBarbers(barbers.filter(b => b.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete barber", error);
        }
    };

    return (
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">{t("admin.barbers.title")}</h3>
                    <p className="text-sm text-gray-400">{t("admin.barbers.subtitle")}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-neon-blue text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]"
                >
                    <Plus size={18} />
                    {t("admin.barbers.add_btn")}
                </button>
            </div>

            <div className="space-y-3">
                {loading ? <p className="text-gray-500 animate-pulse">{t("admin.barbers.loading")}...</p> : barbers.map((barber, index) => (
                    <motion.div
                        key={barber.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-white/20 transition-all hover:bg-white/10"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden border border-white/10">
                                <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-neon-purple transition-colors">{barber.name}</h4>
                                <p className="text-sm text-gray-400">{barber.specialty}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => deleteBarber(barber.id)}
                                className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modern Add Barber Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">{t("admin.barbers.modal_title")}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddBarber} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                                        <User size={14} /> {t("admin.barbers.name_label")}
                                    </label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={newBarber.name}
                                        onChange={e => setNewBarber({ ...newBarber, name: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:outline-none transition-colors"
                                        placeholder={t("admin.barbers.name_label")}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                                        <Scissors size={14} /> {t("admin.barbers.specialty_label")}
                                    </label>
                                    <input
                                        type="text"
                                        value={newBarber.specialty}
                                        onChange={e => setNewBarber({ ...newBarber, specialty: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-purple focus:outline-none transition-colors"
                                        placeholder={t("admin.barbers.specialty_placeholder")}
                                    />
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                                    >
                                        {t("admin.barbers.cancel")}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newBarber.name || saving}
                                        className="flex-1 py-3 rounded-xl bg-neon-blue text-black font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                {t("admin.barbers.save")}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
