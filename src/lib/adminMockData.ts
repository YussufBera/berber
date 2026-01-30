export type Appointment = {
    id: string;
    customerName: string;
    service: string;
    date: string;
    time: string;
    price: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    avatar: string;
};

export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: '1', customerName: 'Max Mustermann', service: 'Haircut & Styling', date: '2026-01-30', time: '10:00', price: 35, status: 'confirmed', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', customerName: 'John Doe', service: 'Beard Trim', date: '2026-01-30', time: '11:00', price: 20, status: 'pending', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', customerName: 'Ali Yilmaz', service: 'Full Package', date: '2026-01-30', time: '13:00', price: 50, status: 'confirmed', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', customerName: 'Lukas Schmidt', service: 'Classic Cut', date: '2026-01-30', time: '14:30', price: 30, status: 'completed', avatar: 'https://i.pravatar.cc/150?u=4' },
];

export const DASHBOARD_STATS = [
    { label: 'Total Revenue', value: '€2,450', change: '+12%', icon: 'euro' },
    { label: 'Appointments', value: '45', change: '+5%', icon: 'calendar' },
    { label: 'New Clients', value: '12', change: '+20%', icon: 'users' },
];
