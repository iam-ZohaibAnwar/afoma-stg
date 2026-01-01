// frontend/middleware.js
import { NextResponse } from 'next/server';
import * as jose from "jose"

export async function middleware(req) {
  try{
    const accessToken = req.cookies.get('accessToken')?.value;

    let decoded = {}
    if(accessToken){
      const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_ACCESS_KEY);
      decoded = await jose.jwtVerify(accessToken, secret);
    }
  
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!accessToken) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }
  
      if (decoded?.payload?.role !== 'admin') {
        return NextResponse.redirect(new URL('/forbidden', req.url)); // Redirect unauthorized users
      }
  
      const restrictedPaths = ['/admin/user-management', '/admin/commission'];
  
      if (restrictedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
          if (!decoded?.payload?.fullAccess) {
            // Admin doesn't have permission to access these pages
            return NextResponse.redirect(new URL('/forbidden', req.url)); 
          }
        }
    }
  
    return NextResponse.next(); // Allow access if authorized
  }catch(err){
    return NextResponse.redirect(new URL('/sign-in', req.url)); 
  }
}

export const config = {
  matcher: ['/admin/:path*'], // Apply middleware to all admin routes
};
