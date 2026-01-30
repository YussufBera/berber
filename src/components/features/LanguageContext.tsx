"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'de' | 'en' | 'tr';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const TRANSLATIONS: Record<Language, Record<string, string>> = {
    de: {
        "hero.title": "DEIN TERMIN.",
        "hero.subtitle": "PREMIUM TERMINE FÜR DEN MODERNEN GENTLEMAN",
        "book.button": "TERMIN BUCHEN",
        "select.services": "DIENSTLEISTUNGEN",
        "select.time": "ZEIT WÄHLEN",
        "select.date": "DATUM WÄHLEN",
        "confirmed": "BESTÄTIGT",
        "summary": "Zusammenfassung",
        "total": "Gesamt",
        "next": "Weiter",
        "confirm": "Bestätigen",
        "back": "Zurück",
        "nav.home": "START",
        "nav.info": "INFO",
        "nav.gallery": "GALERIE",
        "nav.book": "BUCHEN",
        "contact.details": "KONTAKT",
        "contact.title": "Kontaktdaten",
        "contact.phone": "Telefonnummer",
        "contact.email": "E-Mail",
        "contact.required": "Bitte geben Sie Telefon oder E-Mail an.",
        "contact.disclaimer": "Bitte geben Sie Ihre E-Mail-Adresse oder Telefonnummer an, damit wir Sie kontaktieren können, falls Ihr Termin nicht bestätigt werden kann.",
        "book.another": "Weiteren Termin buchen",
        "contact.name": "Vor- und Nachname"
    },
    en: {
        "hero.title": "YOUR APPOINTMENT.",
        "hero.subtitle": "PREMIUM APPOINTMENTS FOR THE MODERN GENTLEMAN",
        "book.button": "BOOK APPOINTMENT",
        "select.services": "SELECT SERVICES",
        "select.time": "CHOOSE A TIME",
        "select.date": "SELECT DATE",
        "confirmed": "CONFIRMED",
        "summary": "Summary",
        "total": "Total",
        "next": "Next Step",
        "confirm": "Confirm Booking",
        "back": "Back",
        "nav.home": "HOME",
        "nav.info": "INFO",
        "nav.gallery": "GALLERY",
        "nav.book": "BOOK",
        "contact.details": "CONTACT",
        "contact.title": "Contact Details",
        "contact.phone": "Phone Number",
        "contact.email": "Email Address",
        "contact.required": "Please provide either phone or email.",
        "contact.disclaimer": "Please enter your email or number to be contacted in case your appointment is not approved.",
        "book.another": "Book Another",
        "contact.name": "Full Name"
    },
    tr: {
        "hero.title": "RANDEVUNUZ.",
        "hero.subtitle": "MODERN BEYEFENDİLER İÇİN PREMİUM RANDEVULAR",
        "book.button": "RANDEVU AL",
        "select.services": "HİZMETLERİ SEÇİN",
        "select.time": "SAAT SEÇİN",
        "select.date": "TARİH SEÇİN",
        "confirmed": "ONAYLANDI",
        "summary": "Özet",
        "total": "Toplam",
        "next": "İleri",
        "confirm": "Onayla",
        "back": "Geri",
        "nav.home": "ANA SAYFA",
        "nav.info": "BİLGİ",
        "nav.gallery": "GALERİ",
        "nav.book": "RANDEVU",
        "contact.details": "İLETİŞİM",
        "contact.title": "İletişim Bilgileri",
        "contact.phone": "Telefon Numarası",
        "contact.email": "E-Posta",
        "contact.required": "Lütfen telefon veya e-posta giriniz.",
        "contact.disclaimer": "Randevunuzun onaylanmaması durumunda size dönüş yapılabilmesi için lütfen e-posta veya telefon numaranızı giriniz.",
        "book.another": "Başka Randevu Al",
        "contact.name": "Ad Soyad"
    }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('de');

    const t = (key: string) => {
        return TRANSLATIONS[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
