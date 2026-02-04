"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageCode = 'de' | 'en' | 'tr' | 'ku';
type Language = LanguageCode | null;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
    de: {
        "hero.title": "DEIN TERMIN.",
        "hero.subtitle": "PREMIUM TERMINE FÜR DEN MODERNEN GENTLEMAN",
        "book.button": "TERMIN BUCHEN",
        "select.services": "DIENSTLEISTUNGEN",
        "select.time": "ZEIT WÄHLEN",
        "select.barber": "BARBIER WÄHLEN",
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
        "nav.manage": "TEILNAHME VERWALTEN",
        "manage.title": "Termine verwalten",
        "manage.subtitle": "Geben Sie Ihre Telefonnummer ein, um Ihre Termine zu sehen.",
        "manage.placeholder": "Telefonnummer",
        "manage.find": "Suchen",
        "manage.no_appts": "Keine Termine gefunden.",
        "manage.cancel": "Stornieren",
        "manage.cancel_confirm": "Möchten Sie diesen Termin wirklich stornieren?",
        "contact.details": "KONTAKT",
        "contact.title": "Kontaktdaten",
        "contact.phone": "Telefonnummer",
        "contact.email": "E-Mail",
        "contact.required": "Bitte geben Sie Telefon oder E-Mail an.",
        "contact.disclaimer": "Bitte geben Sie Ihre E-Mail-Adresse oder Telefonnummer an, damit wir Sie kontaktieren können, falls Ihr Termin nicht bestätigt werden kann.",
        "book.another": "Weiteren Termin buchen",
        "contact.name": "Vor- und Nachname",

        "gallery.interior": "Barber Interieur",
        "gallery.tools": "Professionelle Werkzeuge",
        "gallery.lounge": "Wartebereich",

        "select.service_prompt": "Wählen Sie eine Dienstleistung, um zu beginnen.",
        "unit.mins": "Min",

        "contact.placeholder_name": "Max Mustermann",
        "contact.placeholder_phone": "+49 123 4567890",
        "contact.placeholder_email": "beispiel@mail.com",

        "admin.login.title": "Admin Zugang",
        "admin.login.subtitle": "Bitte Passwort eingeben",
        "admin.login.button": "Anmelden",
        "admin.login.error": "Falsches Passwort",
        "admin.nav.dashboard": "Übersicht",
        "admin.nav.termins": "Termine",
        "admin.nav.services": "Dienstleistungen",
        "admin.nav.barbers": "Barbiere",
        "admin.nav.plan": "Plan",
        "admin.nav.availability": "Arbeitstage",
        "admin.logout": "Abmelden",

        "av.day_off": "Freier Tag",
        "av.working": "Arbeitet",
        "av.cancel": "Abbrechen",
        "av.set_off": "Als freien Tag markieren",
        "av.set_working": "Als Arbeitstag markieren",

        "admin.stats.total_revenue": "GESAMTEINNAHMEN",
        "admin.stats.confirmed_appointments": "BESTÄTIGTE TERMINE",
        "admin.stats.pending_approvals": "ONAY BEKLEYENLER",

        "admin.dashboard.pending_title": "Ausstehende Anfragen",
        "admin.dashboard.pending_empty": "Keine ausstehenden Termine.",
        "admin.dashboard.pending_subtitle": "Neue Buchungen erscheinen hier automatisch.",
        "admin.btn.approve": "Bestätigen",
        "admin.btn.reject": "Ablehnen",
        "admin.btn.delete_confirm": "Termin wirklich ablehnen und löschen?",

        "confirmation.cash_warning": "Bitte vergessen Sie nicht, den Betrag in bar mitzubringen.",
        "confirmation.message": "Ihr Termin ist bestätigt für {time} am {date}",
        "confirmation.barber": "Barbier: {name}",

        "info.location": "Standort",
        "info.opening_hours": "Öffnungszeiten",
        "info.get_directions": "Wegbeschreibung",
        "info.closed": "Geschlossen",
        "days.monday": "Montag",
        "days.tuesday": "Dienstag",
        "days.wednesday": "Mittwoch",
        "days.thursday": "Donnerstag",
        "days.friday": "Freitag",
        "days.saturday": "Samstag",
        "days.sunday": "Sonntag"
    },
    en: {
        "hero.title": "YOUR APPOINTMENT.",
        "hero.subtitle": "PREMIUM APPOINTMENTS FOR THE MODERN GENTLEMAN",
        "book.button": "BOOK APPOINTMENT",
        "select.services": "SELECT SERVICES",
        "select.time": "CHOOSE A TIME",
        "select.barber": "CHOOSE BARBER",
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
        "nav.manage": "MANAGE BOOKING",
        "manage.title": "Manage Appointments",
        "manage.subtitle": "Enter your phone number to view your appointments.",
        "manage.placeholder": "Phone Number",
        "manage.find": "Find",
        "manage.no_appts": "No appointments found.",
        "manage.cancel": "Cancel",
        "manage.cancel_confirm": "Are you sure you want to cancel this appointment?",
        "contact.details": "CONTACT",
        "contact.title": "Contact Details",
        "contact.phone": "Phone Number",
        "contact.email": "Email Address",
        "contact.required": "Please provide either phone or email.",
        "contact.disclaimer": "Please enter your email or number to be contacted in case your appointment is not approved.",
        "book.another": "Book Another",
        "contact.name": "Full Name",

        "gallery.interior": "Barber Interior",
        "gallery.tools": "Professional Tools",
        "gallery.lounge": "Waiting Lounge",

        "select.service_prompt": "Select a service to start.",
        "unit.mins": "mins",

        "contact.placeholder_name": "John Doe",
        "contact.placeholder_phone": "+1 234 567 890",
        "contact.placeholder_email": "example@mail.com",

        "admin.login.title": "Admin Access",
        "admin.login.subtitle": "Please enter password",
        "admin.login.button": "Login",
        "admin.login.error": "Wrong Password",
        "admin.nav.dashboard": "Dashboard",
        "admin.nav.termins": "Appointments",
        "admin.nav.services": "Services",
        "admin.nav.barbers": "Barbers",
        "admin.nav.plan": "Plan",
        "admin.nav.availability": "Working Days",
        "admin.logout": "Logout",

        "av.day_off": "Day Off",
        "av.working": "Working",
        "av.cancel": "Cancel",
        "av.set_off": "Mark as Day Off",
        "av.set_working": "Mark as Working",

        "admin.stats.total_revenue": "TOTAL REVENUE",
        "admin.stats.confirmed_appointments": "CONFIRMED APPOINTMENTS",
        "admin.stats.pending_approvals": "PENDING APPROVALS",

        "admin.dashboard.pending_title": "Pending Requests",
        "admin.dashboard.pending_empty": "No pending appointments.",
        "admin.dashboard.pending_subtitle": "New bookings will appear here automatically.",
        "admin.btn.approve": "Approve",
        "admin.btn.reject": "Reject",
        "admin.btn.delete_confirm": "Really reject and delete appointment?",

        "confirmation.cash_warning": "Please remember to bring the total amount in cash.",
        "confirmation.message": "Your appointment is confirmed for {time} on {date}",
        "confirmation.barber": "Barber: {name}",

        "info.location": "Location",
        "info.opening_hours": "Opening Hours",
        "info.get_directions": "Get Directions",
        "info.closed": "Closed",
        "days.monday": "Monday",
        "days.tuesday": "Tuesday",
        "days.wednesday": "Wednesday",
        "days.thursday": "Thursday",
        "days.friday": "Friday",
        "days.saturday": "Saturday",
        "days.sunday": "Sunday"
    },
    tr: {
        "hero.title": "RANDEVUNUZ.",
        "hero.subtitle": "MODERN BEYEFENDİLER İÇİN PREMİUM RANDEVULAR",
        "book.button": "RANDEVU AL",
        "select.services": "HİZMETLERİ SEÇİN",
        "select.time": "SAAT SEÇİN",
        "select.barber": "BERBER SEÇİN",
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
        "nav.manage": "RANDEVU YÖNET",
        "manage.title": "Randevularımı Yönet",
        "manage.subtitle": "Randevularınızı görmek için telefon numaranızı giriniz.",
        "manage.placeholder": "Telefon Numarası",
        "manage.find": "Bul",
        "manage.no_appts": "Randevu bulunamadı.",
        "manage.cancel": "İptal Et",
        "manage.cancel_confirm": "Bu randevuyu iptal etmek istediğinize emin misiniz?",
        "contact.details": "İLETİŞİM",
        "contact.title": "İletişim Bilgileri",
        "contact.phone": "Telefon Numarası",
        "contact.email": "E-Posta",
        "contact.required": "Lütfen telefon veya e-posta giriniz.",
        "contact.disclaimer": "Randevunuzun onaylanmaması durumunda size dönüş yapılabilmesi için lütfen e-posta veya telefon numaranızı giriniz.",
        "book.another": "Başka Randevu Al",
        "contact.name": "Ad Soyad",

        "gallery.interior": "Berber İç Mekan",
        "gallery.tools": "Profesyonel Ekipmanlar",
        "gallery.lounge": "Bekleme Alanı",

        "select.service_prompt": "Başlamak için bir hizmet seçin.",
        "unit.mins": "dk",

        "contact.placeholder_name": "Ahmet Yılmaz",
        "contact.placeholder_phone": "+90 555 123 4567",
        "contact.placeholder_email": "ornek@mail.com",

        "admin.login.title": "Yönetici Girişi",
        "admin.login.subtitle": "Lütfen şifreyi giriniz",
        "admin.login.button": "Giriş Yap",
        "admin.login.error": "Hatalı Şifre",
        "admin.nav.dashboard": "Panel",
        "admin.nav.termins": "Randevular",
        "admin.nav.services": "Hizmetler",
        "admin.nav.barbers": "Berberler",
        "admin.nav.plan": "Planlama",
        "admin.nav.availability": "Çalışma Günleri",
        "admin.logout": "Çıkış Yap",

        "av.day_off": "İzinli",
        "av.working": "Çalışıyor",
        "av.cancel": "Vazgeç",
        "av.set_off": "İzinli Olarak İşaretle",
        "av.set_working": "Çalışıyor Olarak İşaretle",

        "admin.stats.total_revenue": "TOPLAM GELİR",
        "admin.stats.confirmed_appointments": "ONAYLANAN RANDEVULAR",
        "admin.stats.pending_approvals": "ONAY BEKLEYENLER",

        "admin.dashboard.pending_title": "Bekleyen Talepler",
        "admin.dashboard.pending_empty": "Bekleyen randevu yok.",
        "admin.dashboard.pending_subtitle": "Yeni talepler burada otomatik görünür.",
        "admin.btn.approve": "Onayla",
        "admin.btn.reject": "Reddet",
        "admin.btn.delete_confirm": "Randevuyu reddedip silmek istiyor musunuz?",

        "confirmation.cash_warning": "Lütfen yanınızda tutar kadar nakit getirmeyi unutmayın.",
        "confirmation.message": "{date} tarihinde saat {time} için randevunuz onaylandı",
        "confirmation.barber": "Berber: {name}",

        "info.location": "Konum",
        "info.opening_hours": "Çalışma Saatleri",
        "info.get_directions": "Yol Tarifi Al",
        "info.closed": "Kapalı",
        "days.monday": "Pazartesi",
        "days.tuesday": "Salı",
        "days.wednesday": "Çarşamba",
        "days.thursday": "Perşembe",
        "days.friday": "Cuma",
        "days.saturday": "Cumartesi",
        "days.sunday": "Pazar"
    },
    ku: {
        "hero.title": "RANDEVÛYA TE.",
        "hero.subtitle": "RANDEVÛYÊN BI KALÎTE BO CAMÊRÊN MODERN",
        "book.button": "RANDEVÛ BIGIRE",
        "select.services": "XIZMETAN HILBIJÊRE",
        "select.time": "DEM HILBIJÊRE",
        "select.barber": "BERBER HILBIJÊRE",
        "select.date": "TARÎX HILBIJÊRE",
        "confirmed": "HAT ERÊKIRIN",
        "summary": "Kurte",
        "total": "Giştî",
        "next": "Pêşve",
        "confirm": "Erê Bike",
        "back": "Paşve",
        "nav.home": "DESTPÊK",
        "nav.info": "AGAHÎ",
        "nav.gallery": "GALERÎ",
        "nav.book": "RANDEVÛ",
        "nav.manage": "RANDEVÛ BIRÊVE BIBE",
        "manage.title": "Randevûyan Birêve Bibe",
        "manage.subtitle": "Ji bo dîtina randevûyan hejmara xwe binivîse.",
        "manage.placeholder": "Hejmara Telefonê",
        "manage.find": "Bibîne",
        "manage.no_appts": "Randevû nehat dîtin.",
        "manage.cancel": "Betal Bike",
        "manage.cancel_confirm": "Tu dixwazî vê randevûyê betal bikî?",
        "contact.details": "TÊKILÎ",
        "contact.title": "Agahiyên Têkiliyê",
        "contact.phone": "Hejmara Telefonê",
        "contact.email": "E-Posta",
        "contact.required": "Zehmet nebe telefon an e-posta binivîse.",
        "contact.disclaimer": "Heke randevûya te neyê erêkirin, ji bo em karibin li te vegerin ji kerema xwe e-posta an hejmara xwe binivîse.",
        "book.another": "Randevûyek Din Bigire",
        "contact.name": "Nav û Paşnav",

        "gallery.interior": "Navxweya Berber",
        "gallery.tools": "Amûrên Profesyonel",
        "gallery.lounge": "Cihê Bendewarîyê",

        "select.service_prompt": "Ji bo destpêkirinê xizmetek hilbijêre.",
        "unit.mins": "xûlek",

        "contact.placeholder_name": "Azad Şêrgo",
        "contact.placeholder_phone": "+49 ...",
        "contact.placeholder_email": "mînak@mail.com",

        "admin.login.title": "Têketina Rêveber",
        "admin.login.subtitle": "Zehmet nebe şîfreyê binivîse",
        "admin.login.button": "Têkeve",
        "admin.login.error": "Şîfre Çewt e",
        "admin.nav.dashboard": "Panel",
        "admin.nav.termins": "Randevû",
        "admin.nav.services": "Xizmet",
        "admin.nav.barbers": "Berber",
        "admin.nav.plan": "Plan",
        "admin.nav.availability": "Rojên Xebatê",
        "admin.logout": "Derkeve",

        "av.day_off": "bêhnvedan",
        "av.working": "Dixebite",
        "av.cancel": "Dev jê berde",
        "av.set_off": "Weke Bêhnvedan Nîşan Bide",
        "av.set_working": "Weke Dixebite Nîşan Bide",

        "admin.stats.total_revenue": "DAHATIN",
        "admin.stats.confirmed_appointments": "RANDEVÛYÊN ERÊKIRÎ",
        "admin.stats.pending_approvals": "YÊN LI BENDA ERÊKIRINÊ",

        "admin.dashboard.pending_title": "Daxwazên Li Bendê",
        "admin.dashboard.pending_empty": "Randevûyên li bendê tune ne.",
        "admin.dashboard.pending_subtitle": "Daxwazên nû dê li vir xuya bibin.",
        "admin.btn.approve": "Erê Bike",
        "admin.btn.reject": "Red Bike",
        "admin.btn.delete_confirm": "Tu dixwazî randevûyê red bikî û jê bibî?",

        "confirmation.cash_warning": "Ji kerema xwe ji bîr neke ku hûn drav bi xwe re bînin.",
        "confirmation.message": "Randevûya we ji bo {date} saet {time} hat erêkirin",
        "confirmation.barber": "Berber: {name}",

        "info.location": "Cih",
        "info.opening_hours": "Demjimêrên Xebatê",
        "info.get_directions": "Rê Tarîf Bike",
        "info.closed": "Girtî",
        "days.monday": "Duşem",
        "days.tuesday": "Sêşem",
        "days.wednesday": "Çarşem",
        "days.thursday": "Pêncşem",
        "days.friday": "În",
        "days.saturday": "Şemî",
        "days.sunday": "Yekşem"
    }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Start with null to allow client-side hydration match (but t() will handle fallback)
    const [language, setLanguageState] = useState<Language>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('berber_language') as LanguageCode;
        if (saved && ['de', 'en', 'tr', 'ku'].includes(saved)) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        if (lang) {
            localStorage.setItem('berber_language', lang);
        } else {
            localStorage.removeItem('berber_language');
        }
        setLanguageState(lang);
    };

    const t = (key: string) => {
        // Fallback to 'de' if language is not yet loaded (e.g. generic SSR or pre-mount)
        // This prevents showing keys like 'admin.login.title' during hydration
        const currentLang = language || 'de';
        return TRANSLATIONS[currentLang as LanguageCode][key] || key;
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
