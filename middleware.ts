import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: any) {
  const token = await getToken({ req });
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminPage && !token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}