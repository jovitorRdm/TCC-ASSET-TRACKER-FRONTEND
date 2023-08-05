import decode from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedRoutesByRoles } from './helpers/getAuthorizedRoutesByRoles ';
import { AccountType } from './types/accountType';

export const config = {
  matcher: '/:path*',
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get('helloWorld');

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const { accountType } = decode(token.value) as { accountType: AccountType };

  const authorizedRoutes = getAuthorizedRoutesByRoles(accountType );

  if (!authorizedRoutes.includes(pathname)) {
    const res = NextResponse.redirect(new URL('/', req.url));

    return res;
  }

  return NextResponse.next();
}
