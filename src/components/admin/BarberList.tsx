"use client";

import { Barber } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function BarberList() {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(true);

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

    const addBarber = async () => {
        const name = prompt("Barber Name:");
        if (!name) return;

        const specialty = prompt("Specialty (e.g. Master Barber):") || "Barber";

        // Random placeholder image from existing pattern or generic
        const image = `/team/ahmet.jpg`;

        try {
            const res = await fetch('/api/barbers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, specialty, image, shopId: "1" })
            });

            if (res.ok) {
                const newBarber = await res.json();
                setBarbers([...barbers, newBarber]);
            }
        } catch (error) {
            console.error("Failed to add barber", error);
        }
    };

    const deleteBarber = async (id: string) => {
        if (!confirm("Are you sure you want to remove this barber?")) return;

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
                    <h3 className="text-xl font-bold text-white">Team Management</h3>
                    <p className="text-sm text-gray-400">Manage your barbers</p>
                </div>
                <button
                    onClick={addBarber}
                    className="flex items-center gap-2 bg-neon-blue text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition-all"
                >
                    <Plus size={18} />
                    Add Barber
                </button>
            </div>

            <div className="space-y-3">
                {loading ? <p className="text-gray-500">Loading...</p> : barbers.map((barber, index) => (
                    <motion.div
                        key={barber.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-white/20 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden border border-white/10">
                                {/* Using a placeholder or the image path */}
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
        </div>
    );
}
