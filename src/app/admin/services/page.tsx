"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";

import { MOCK_SHOPS, Service } from "@/lib/mockData";
import { Trash2, Plus, Save, X, RefreshCw, Edit2 } from "lucide-react";

export default function ServicesPage() {
    // 1. Storage Access (Replaced useStorage with API State)
    const [localServices, setLocalServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Services from API
    useEffect(() => {
        fetch('/api/services')
            .then(res => res.json())
            .then(data => {
                setLocalServices(data);
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [newService, setNewService] = useState<Partial<Service>>({
        name: { de: "", en: "", tr: "" },
        price: 0,
        duration: 30
    });

    const handleDelete = async (id: string) => {
        if (confirm("Sind Sie sicher?")) {
            // Optimistic Update
            setLocalServices(prev => prev.filter(s => s.id !== id));
            await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
        }
    };

    const handleAdd = async () => {
        if (!newService.name?.de || !newService.price) return;

        const payload = {
            name: { ...newService.name, en: newService.name.en || newService.name.de, tr: newService.name.tr || newService.name.de },
            price: Number(newService.price),
            duration: Number(newService.duration)
        };

        try {
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const addedService = await res.json();
                setLocalServices(prev => [...prev, addedService]);
                setIsEditing(false);
                setNewService({ name: { de: "", en: "", tr: "" }, price: 0, duration: 30 });
            }
        } catch (e) {
            alert("Fehler beim Hinzufügen");
        }
    };

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Service>>({});

    const startEdit = (service: Service) => {
        setEditingId(service.id);
        setEditForm({ price: service.price, duration: service.duration });
    };

    const saveEdit = async (id: string) => {
        try {
            await fetch('/api/services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...editForm })
            });

            setLocalServices(prev => prev.map(s => s.id === id ? { ...s, ...editForm } as Service : s));
            setEditingId(null);
        } catch (e) {
            console.error("Failed to update", e);
        }
    };

    return (
        <DashboardLayout>
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">Dienstleistungen verwalten</h3>
                        <p className="text-gray-400 text-sm">Änderungen werden sofort gespeichert.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-neon-blue text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors"
                        >
                            <Plus size={18} /> Neu
                        </button>
                    </div>
                </div>

                {isLoading && <p className="text-white">Lade Daten...</p>}

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
                                    {editingId === service.id ? (
                                        <div className="flex flex-col gap-1 w-24">
                                            <input
                                                type="number"
                                                className="bg-black border border-neon-blue rounded px-2 py-1 text-right text-sm text-neon-blue font-mono"
                                                value={editForm.price}
                                                onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                                autoFocus
                                            />
                                            <input
                                                type="number"
                                                className="bg-black border border-white/20 rounded px-2 py-1 text-right text-xs text-gray-400"
                                                value={editForm.duration}
                                                onChange={e => setEditForm({ ...editForm, duration: Number(e.target.value) })}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-mono text-neon-blue font-bold">€{service.price}</p>
                                            <p className="text-xs text-gray-400">{service.duration} min</p>
                                        </>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {editingId === service.id ? (
                                        <button
                                            onClick={() => saveEdit(service.id)}
                                            className="p-2 bg-neon-blue/10 text-neon-blue hover:bg-neon-blue hover:text-black rounded-lg transition-colors"
                                        >
                                            <Save size={18} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => startEdit(service)}
                                            className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
