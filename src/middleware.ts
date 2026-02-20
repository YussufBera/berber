import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        const adminSession = request.cookies.get('admin_session');
        const staffSession = request.cookies.get('staff_session');

        // Staff route specifically allows staff_session OR admin_session
        if (request.nextUrl.pathname.startsWith('/admin/staff')) {
            if (!staffSession && !adminSession) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
            return NextResponse.next();
        }

        // All other /admin routes strictly require admin_session
        if (!adminSession) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
