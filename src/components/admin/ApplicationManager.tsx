"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, CheckCircle, XCircle, Clock, Mail, Phone, User } from "lucide-react";
import { useLanguage } from "../features/LanguageContext";

interface JobApplication {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    createdAt: string;
}

export default function ApplicationManager() {
    const { t } = useLanguage();
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await fetch("/api/admin/applications");
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            }
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/applications/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setApplications(apps => apps.map(app =>
                    app.id === id ? { ...app, status } : app
                ));
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const deleteApplication = async (id: string) => {
        if (!confirm(t("admin.btn.delete_confirm"))) return;

        try {
            const res = await fetch(`/api/admin/applications/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setApplications(apps => apps.filter(app => app.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete application:", error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "reviewed":
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20"><CheckCircle size={12} /> Reviewed</span>;
            case "rejected":
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"><XCircle size={12} /> Rejected</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"><Clock size={12} /> Pending</span>;
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-400">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-neutral-900 border border-white/10 p-6 rounded-2xl">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                        {t("admin.nav.applications")}
                    </h2>
                    <p className="text-gray-400 text-sm">Review incoming job applications</p>
                </div>
                <div className="bg-neon-purple/20 text-neon-purple px-4 py-2 rounded-xl border border-neon-purple/30 font-bold">
                    {applications.length} Total
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="bg-neutral-900 border border-white/10 rounded-2xl p-12 text-center">
                    <BriefcasePlaceholder className="mx-auto w-16 h-16 text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No Applications Yet</h3>
                    <p className="text-gray-500">When someone applies, it will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {applications.map((app, i) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-neutral-900 border border-white/10 rounded-2xl p-5 flex flex-col hover:border-neon-purple/30 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-white mb-1">{app.name}</h3>
                                    {getStatusBadge(app.status)}
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4 flex-1">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Mail size={14} className="text-neon-blue" />
                                    <a href={`mailto:${app.email}`} className="hover:text-white truncate">{app.email}</a>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Phone size={14} className="text-neon-purple" />
                                    <a href={`tel:${app.phone}`} className="hover:text-white">{app.phone}</a>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">Message</p>
                                    <p className="text-sm text-gray-300 bg-black/40 p-3 rounded-lg max-h-32 overflow-y-auto whitespace-pre-wrap">
                                        {app.message}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                                {app.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(app.id, "reviewed")}
                                            className="flex-1 py-2 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium border border-green-500/20 hover:bg-green-500/20 transition-colors"
                                        >
                                            Mark Reviewed
                                        </button>
                                        <button
                                            onClick={() => updateStatus(app.id, "rejected")}
                                            className="flex-1 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg text-sm font-medium border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => deleteApplication(app.id)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-auto"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

function BriefcasePlaceholder({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}
