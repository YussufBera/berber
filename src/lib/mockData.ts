export type Service = {
    id: string;
    name: {
        de: string;
        en: string;
        tr: string;
        ku?: string; // Optional for now, but we will populate it
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

// Initial Barber Data
export const MOCK_BARBERS: Barber[] = [
    { id: "b1", name: "Ahmet", specialty: "Master Barber", image: "/team/ahmet.jpg", shopId: "1" },
    { id: "b2", name: "Mahmut", specialty: "Fade Specialist", image: "/team/mahmut.jpg", shopId: "1" },
    { id: "b3", name: "John", specialty: "Colorist", image: "/team/john.jpg", shopId: "1" },
    { id: "b4", name: "Hans", specialty: "Classic Cuts", image: "/team/hans.jpg", shopId: "1" },
];

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
                name: { de: "Klassischer Haarschnitt", en: "Classic Haircut", tr: "Klasik Saç Kesimi", ku: "Porjêkirina Klasîk" },
                price: 35,
                duration: 45
            },
            {
                id: "s2",
                name: { de: "Bartpflege & Form", en: "Beard Trim & Shape", tr: "Sakal Düzeltme & Şekil", ku: "Çaksazî & Şiklê Rihê" },
                price: 25,
                duration: 30
            },
            {
                id: "s3",
                name: { de: "Premium Waschen & Styling", en: "Premium Wash & Style", tr: "Premium Yıkama & Şekil", ku: "Şûştin & Şikil - Premium" },
                price: 20,
                duration: 25
            },
            {
                id: "s4",
                name: { de: "Haare Färben", en: "Hair Coloring", tr: "Saç Boyama", ku: "Boyaxkirina Por" },
                price: 60,
                duration: 90
            },
            {
                id: "s5",
                name: { de: "Heißtuch-Rasur", en: "Hot Towel Shave", tr: "Sıcak Havlu Tıraşı", ku: "Tîraş bi Pêjika Germ" },
                price: 30,
                duration: 35
            },
            {
                id: "s6",
                name: { de: "Gesichtsbehandlung", en: "Facial Treatment", tr: "Yüz Bakımı", ku: "Lênêrîna Rûyê" },
                price: 40,
                duration: 45
            },
            {
                id: "s7",
                name: { de: "Komplettpaket", en: "Full Service Package", tr: "Full Bakım Paketi", ku: "Pakêta Xizmeta Temamî" },
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
                name: { de: "Fade Haarschnitt", en: "Fade Cut", tr: "Fade Kesim", ku: "Fade Hêkirin" }, // 'Fade' is often used as is, or 'Kurkirin bi şêwaza Fade'
                price: 38,
                duration: 45
            },
            {
                id: "s20",
                name: { de: "Königliche Rasur", en: "Royal Shave", tr: "Kral Tıraşı", ku: "Tîraşa Şahane" },
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
                name: { de: "Schnellschnitt", en: "Quick Cut", tr: "Hızlı Kesim", ku: "Hêkirina Bilez" },
                price: 25,
                duration: 30
            },
            {
                id: "s21",
                name: { de: "Bartöl-Therapie", en: "Beard Oil Therapy", tr: "Sakal Yağı Terapisi", ku: "Terapiya Rûnê Rihê" },
                price: 15,
                duration: 15
            },
        ],
    },
];
