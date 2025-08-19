import {auth} from './auth';

export default auth((req) => {
    // ここで追加のミドルウェアロジックを実装可能
});

export const config = {
    matcher: [
        // 認証が必要なパスを指定
        '/((?!api/auth|auth/signin|_next/static|_next/image|favicon.ico).*)',
    ],
};
