import {NextResponse} from 'next/server'
import type {NextRequest} from "next/server";
import {getToken} from "next-auth/jwt";

export {default} from 'next-auth/middleware'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

    const token = await getToken({req: request})
    const url = request.nextUrl.clone()
    const pathname = url.pathname

    const isAuthPage =
        pathname === '/' ||
        pathname.startsWith("/sign-in") ||
        pathname.startsWith("/sign-up") ||
        pathname.startsWith("/verify")

    if (token && isAuthPage && pathname !== "/dashboard") {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    //is the user is not authenticated and trying the to access dashboard, send to sign-in page.
    if (!token && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}