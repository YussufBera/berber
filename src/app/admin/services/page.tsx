"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useStorage } from "@/hooks/useStorage";
import { MOCK_SHOPS, Service } from "@/lib/mockData";
import { Trash2, Plus, Save, X, RefreshCw } from "lucide-react";

export default function ServicesPage() {
    // 1. Storage Access (Source of Truth)
    const [storedServices, setStoredServices] = useStorage<Service[]>('barber_services', MOCK_SHOPS[0].services);

    // 2. Local Editing State (Disconnected from live site until saved)
    const [localServices, setLocalServices] = useState<Service[]>(storedServices);
    const [hasChanges, setHasChanges] = useState(false);

    // Sync local state with storage on initial load (only if local is empty or mismatch, but usually we want to start with stored)
    useEffect(() => {
        // We only sync down if we haven't touched anything? 
        // Or maybe we just initialize from it. 
        // Let's just trust initial state, but if storage changes externally (other tab), we might want to know?
        // For now, let's strictly load once.
    }, []);

    // Effect to detect unsaved changes
    useEffect(() => {
        setHasChanges(JSON.stringify(localServices) !== JSON.stringify(storedServices));
    }, [localServices, storedServices]);

    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [newService, setNewService] = useState<Partial<Service>>({
        name: { de: "", en: "", tr: "" },
        price: 0,
        duration: 30
    });

    const handleSaveToWebsite = () => {
        setStoredServices(localServices); // This triggers the localStorage update + 'storage' event
        setHasChanges(false);
        alert("Webseite erfolgreich aktualisiert!");
    };

    const handleDelete = (id: string) => {
        if (confirm("Sind Sie sicher?")) {
            setLocalServices(prev => prev.filter(s => s.id !== id));
        }
    };

    const handleAdd = () => {
        if (!newService.name?.de || !newService.price) return;

        const serviceToAdd: Service = {
            id: Date.now().toString(),
            name: { ...newService.name, en: newService.name.en || newService.name.de, tr: newService.name.tr || newService.name.de } as any,
            price: Number(newService.price),
            duration: Number(newService.duration)
        };

        setLocalServices(prev => [...prev, serviceToAdd]);
        setIsEditing(false);
        setNewService({ name: { de: "", en: "", tr: "" }, price: 0, duration: 30 });
    };

    return (
        <DashboardLayout>
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">Dienstleistungen verwalten</h3>
                        <p className="text-gray-400 text-sm">Änderungen werden erst nach Klick auf "Webseite aktualisieren" übernommen.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSaveToWebsite}
                            disabled={!hasChanges}
                            className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${hasChanges
                                    ? "bg-green-500 text-black hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                                    : "bg-white/10 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            <RefreshCw size={18} className={hasChanges ? "animate-spin-slow" : ""} />
                            {hasChanges ? "Webseite aktualisieren" : "Aktuell"}
                        </button>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-neon-blue text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors"
                        >
                            <Plus size={18} /> Neu
                        </button>
                    </div>
                </div>

                {/* Edit Form */}
                {isEditing && (
                    <div className="mb-8 p-6 bg-white/5 rounded-xl border border-neon-blue/30 animate-in fade-in slide-in-from-top-4">
                        <h4 className="text-white font-bold mb-4">Neue Dienstleistung</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                placeholder="Name (Deutsch) *"
                                className="p-3 rounded-lg bg-black border border-white/20 text-white focus:border-neon-blue outline-none"
                                value={newService.name?.de}
                                onChange={e => setNewService({ ...newService, name: { ...newService.name as any, de: e.target.value } })}
                            />
                            <input
                                placeholder="Name (Englisch)"
                                className="p-3 rounded-lg bg-black border border-white/20 text-white"
                                value={newService.name?.en}
                                onChange={e => setNewService({ ...newService, name: { ...newService.name as any, en: e.target.value } })}
                            />
                            <input
                                placeholder="Name (Türkisch)"
                                className="p-3 rounded-lg bg-black border border-white/20 text-white"
                                value={newService.name?.tr}
                                onChange={e => setNewService({ ...newService, name: { ...newService.name as any, tr: e.target.value } })}
                            />
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    placeholder="Preis (€) *"
                                    className="p-3 rounded-lg bg-black border border-white/20 text-white w-full"
                                    value={newService.price}
                                    onChange={e => setNewService({ ...newService, price: Number(e.target.value) })}
                                />
                                <input
                                    type="number"
                                    placeholder="Dauer (Min)"
                                    className="p-3 rounded-lg bg-black border border-white/20 text-white w-full"
                                    value={newService.duration}
                                    onChange={e => setNewService({ ...newService, duration: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white px-4">Abbrechen</button>
                            <button onClick={handleAdd} className="bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200">
                                <Plus size={18} /> Zur Liste hinzufügen
                            </button>
                        </div>
                    </div>
                )}

                {/* List */}
                <div className="grid grid-cols-1 gap-4">
                    {localServices.length === 0 && (
                        <p className="text-center text-gray-500 py-10">Keine Dienstleistungen vorhanden.</p>
                    )}
                    {localServices.map(service => (
                        <div key={service.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                            <div>
                                <h4 className="font-bold text-white group-hover:text-neon-blue transition-colors">{service.name.de}</h4>
                                <p className="text-xs text-gray-500">{service.name.en} / {service.name.tr}</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="font-mono text-neon-blue font-bold">€{service.price}</p>
                                    <p className="text-xs text-gray-400">{service.duration} min</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
