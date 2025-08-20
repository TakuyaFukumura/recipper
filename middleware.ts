import {auth} from './auth';
import {NextResponse} from 'next/server';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnSignInPage = req.nextUrl.pathname.startsWith('/auth/signin');
    
    // 未認証でサインインページ以外にアクセスした場合、サインインページにリダイレクト
    if (!isLoggedIn && !isOnSignInPage) {
        return NextResponse.redirect(new URL('/auth/signin', req.nextUrl));
    }
    
    // 認証済みでサインインページにアクセスした場合、ホームページにリダイレクト
    if (isLoggedIn && isOnSignInPage) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    
    return NextResponse.next();
});

export const config = {
    matcher: [
        // 認証が必要なパスを指定
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};
