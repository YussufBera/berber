export type Service = {
    id: string;
    name: {
        de: string;
        en: string;
        tr: string;
    };
    price: number;
    duration: number; // in minutes
};

export type BarberShop = {
    id: string;
    name: string;
    address: string;
    rating: number;
    image: string;
    services: Service[];
};

export type Barber = {
    id: string;
    name: string;
    specialty: string;
    image: string;
    shopId: string;
};

export const MOCK_SHOPS: BarberShop[] = [
    {
        id: "1",
        name: "Neon Cuts Berlin",
        address: "Kreuzberg, Berlin",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1585747860715-614c6c98fb6f?q=80&w=2670&auto=format&fit=crop",
        services: [
            {
                id: "s1",
                name: { de: "Klassischer Haarschnitt", en: "Classic Haircut", tr: "Klasik Saç Kesimi" },
                price: 35,
                duration: 45
            },
            {
                id: "s2",
                name: { de: "Bartpflege & Form", en: "Beard Trim & Shape", tr: "Sakal Düzeltme & Şekil" },
                price: 25,
                duration: 30
            },
            {
                id: "s3",
                name: { de: "Premium Waschen & Styling", en: "Premium Wash & Style", tr: "Premium Yıkama & Şekil" },
                price: 20,
                duration: 25
            },
            {
                id: "s4",
                name: { de: "Haare Färben", en: "Hair Coloring", tr: "Saç Boyama" },
                price: 60,
                duration: 90
            },
            {
                id: "s5",
                name: { de: "Heißtuch-Rasur", en: "Hot Towel Shave", tr: "Sıcak Havlu Tıraşı" },
                price: 30,
                duration: 35
            },
            {
                id: "s6",
                name: { de: "Gesichtsbehandlung", en: "Facial Treatment", tr: "Yüz Bakımı" },
                price: 40,
                duration: 45
            },
            {
                id: "s7",
                name: { de: "Komplettpaket", en: "Full Service Package", tr: "Full Bakım Paketi" },
                price: 90,
                duration: 120
            },
        ],
    },
    {
        id: "2",
        name: "Midnight Grooming",
        address: "Mitte, Berlin",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1503951914875-befbb7135952?q=80&w=2680&auto=format&fit=crop",
        services: [
            {
                id: "s10",
                name: { de: "Fade Haarschnitt", en: "Fade Cut", tr: "Fade Kesim" },
                price: 38,
                duration: 45
            },
            {
                id: "s20",
                name: { de: "Königliche Rasur", en: "Royal Shave", tr: "Kral Tıraşı" },
                price: 45,
                duration: 40
            },
        ],
    },
    {
        id: "3",
        name: "Blade & Glory",
        address: "Prenzlauer Berg, Berlin",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2670&auto=format&fit=crop",
        services: [
            {
                id: "s11",
                name: { de: "Schnellschnitt", en: "Quick Cut", tr: "Hızlı Kesim" },
                price: 25,
                duration: 30
            },
            {
                id: "s21",
                name: { de: "Bartöl-Therapie", en: "Beard Oil Therapy", tr: "Sakal Yağı Terapisi" },
                price: 15,
                duration: 15
            },
        ],
    },
];
