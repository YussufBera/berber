"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check, X } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface WhatsAppConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (sendWhatsApp: boolean) => void;
    bookingName: string;
}

export default function WhatsAppConfirmationModal({ isOpen, onClose, onConfirm, bookingName }: WhatsAppConfirmationModalProps) {
    const { t } = useLanguage();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative z-10 bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                >
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageCircle size={32} className="text-green-500" />
                    </div>

                    <h3 className="text-2xl font-bold text-white text-center mb-2">
                        {t('modal.whatsapp.title')}
                    </h3>

                    <p className="text-gray-400 text-center mb-8">
                        {t('modal.whatsapp.message').replace('{name}', bookingName)}
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => onConfirm(true)}
                            className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
                        >
                            <MessageCircle size={20} />
                            {t('modal.whatsapp.send')}
                        </button>

                        <button
                            onClick={() => onConfirm(false)}
                            className="w-full bg-white/5 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-colors border border-white/5 flex items-center justify-center gap-2"
                        >
                            <Check size={20} />
                            {t('modal.whatsapp.no_send')}
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full text-gray-500 py-2 text-sm hover:text-white transition-colors mt-2"
                        >
                            {t('modal.whatsapp.cancel')}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
