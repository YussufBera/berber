"use client";

import { useState } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Calendar, CheckCircle } from "lucide-react";


const [bookings, setBookings] = useState<any[]>([]);

useEffect(() => {
    fetch('/api/appointments')
        .then(res => res.json())
        .then(data => setBookings(data))
        .catch(err => console.error(err));
}, []);

// Filter and sort bookings
const approvedBookings = bookings
    .filter((b: any) => b.status === 'approved')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

return (
    <DashboardLayout>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 min-h-[600px]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                Bestätigte Termine
            </h3>

            {approvedBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Calendar size={48} className="mb-4 opacity-20" />
                    <p>Noch keine bestätigten Termine.</p>
                    <p className="text-xs mt-2">Bestätigte Buchungen erscheinen hier.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Datum & Zeit</th>
                                <th className="p-4 font-medium">Kunde</th>
                                <th className="p-4 font-medium">Kontakt</th>
                                <th className="p-4 font-medium">Dienstleistungen</th>
                                <th className="p-4 font-medium text-right">Gesamt</th>
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
                                    <td className="p-4 text-sm text-gray-300">
                                        <div className="flex flex-col">
                                            <span>{booking.phone}</span>
                                            <span className="text-gray-500 text-xs">{booking.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-300">
                                        {booking.services.join(", ")}
                                    </td>
                                    <td className="p-4 text-right font-mono font-bold text-neon-purple">
                                        €{booking.total}
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
