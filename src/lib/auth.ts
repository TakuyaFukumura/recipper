import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'ユーザー名', type: 'text' },
        password: { label: 'パスワード', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // 環境変数からユーザー情報を取得
        const envUsername = process.env.AUTH_USER;
        const envPasswordHash = process.env.AUTH_PASSWORD_HASH;

        if (!envUsername || !envPasswordHash) {
          console.error('AUTH_USER or AUTH_PASSWORD_HASH environment variables are not set');
          return null;
        }

        // ユーザー名の確認
        if (credentials.username !== envUsername) {
          return null;
        }

        // パスワードの確認
        const isValidPassword = await bcrypt.compare(credentials.password as string, envPasswordHash);
        
        if (!isValidPassword) {
          return null;
        }

        // 認証成功
        return {
          id: '1',
          name: envUsername,
          email: null, // このアプリではメールアドレスは不要
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};