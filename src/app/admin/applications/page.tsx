"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import ApplicationManager from "@/components/admin/ApplicationManager";
import { useRouter } from "next/navigation";

export default function AdminApplicationsPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const authStatus = localStorage.getItem("adminAuth");
            if (authStatus === "true") {
                setIsAuthenticated(true);
            } else {
                router.push("/admin/login");
            }
        };

        checkAuth();
    }, [router]);

    if (!isAuthenticated) return null;

    return (
        <DashboardLayout>
            <ApplicationManager />
        </DashboardLayout>
    );
}
