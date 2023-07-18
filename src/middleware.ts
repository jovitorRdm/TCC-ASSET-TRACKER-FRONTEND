import decode from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedRoutesByRoles } from './helpers/getAuthorizedRoutesByRoles ';
import { AccountType } from './types/accountType';

export const config = {
  matcher: '/panel/:path*',
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get('helloWord');

  if (!accessToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const { accountType } = decode(accessToken.value) as { accountType: AccountType[] };

  const authorizedRoutes = getAuthorizedRoutesByRoles(accountType);

  if (!authorizedRoutes.includes(pathname)) {
    const res = NextResponse.redirect(new URL('/panel', req.url));

    return res;
  }

  return NextResponse.next();
}
