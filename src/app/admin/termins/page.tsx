"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Calendar, CheckCircle, Trash2, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/features/LanguageContext";


export default function TerminsPage() {
    const { t } = useLanguage() as any;
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/appointments')
            .then(res => res.json())
            .then(data => setBookings(data))
            .catch(err => console.error(err));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin.termins.delete_confirm'))) return;
        try {
            await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleWhatsApp = (booking: any) => {
        const rawMessage = t("whatsapp.message_template");
        const message = rawMessage
            .replace("{name}", booking.name)
            .replace("{date}", new Date(booking.date).toLocaleDateString())
            .replace("{time}", booking.time)
            .replace("{barber}", booking.barber || "MAKAS")
            .replace("{total}", booking.total);

        // Basic phone cleanup (keep numbers only)
        const cleanPhone = booking.phone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // Filter and sort bookings
    const approvedBookings = bookings
        .filter((b: any) => b.status === 'approved')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <DashboardLayout>
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 min-h-[600px]">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={24} />
                    {t('admin.termins.title')}
                </h3>

                {approvedBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <Calendar size={48} className="mb-4 opacity-20" />
                        <p>{t('admin.termins.empty')}</p>
                        <p className="text-xs mt-2">{t('admin.termins.empty_sub')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-medium">{t('admin.termins.date')}</th>
                                    <th className="p-4 font-medium">{t('admin.termins.customer')}</th>
                                    <th className="p-4 font-medium">{t('admin.termins.barber')}</th>
                                    <th className="p-4 font-medium">{t('admin.termins.contact')}</th>
                                    <th className="p-4 font-medium">{t('admin.termins.services')}</th>
                                    <th className="p-4 font-medium text-right">{t('admin.termins.total')}</th>
                                    <th className="p-4 font-medium w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {approvedBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{new Date(booking.date).toLocaleDateString()}</div>
                                            <div className="text-neon-blue text-sm">{booking.time}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-white font-medium">{booking.name}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-white font-medium">{(booking.barber && booking.barber !== "Any") ? booking.barber : "-"}</span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-300">
                                            <div className="flex flex-col">
                                                <span>{booking.phone}</span>
                                                <span className="text-gray-500 text-xs">{booking.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-300">
                                            {booking.services}
                                        </td>
                                        <td className="p-4 text-right font-mono font-bold text-neon-purple">
                                            €{booking.total}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleDelete(booking.id)}
                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleWhatsApp(booking)}
                                                className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                                                title="WhatsApp ile Hatırlat"
                                            >
                                                <MessageCircle size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
