'use client';

import {useState} from 'react';
import {getSession, signIn} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {Eye, EyeOff, Lock, User} from 'lucide-react';

export default function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('ユーザー名またはパスワードが正しくありません');
            } else {
                // 認証成功時にセッションを更新
                await getSession();
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            console.error('Sign in error:', error);
            setError('ログイン中にエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div
                        className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                        <Lock className="h-6 w-6 text-yellow-600 dark:text-yellow-400"/>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Recipper にログイン
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        料理レシピ提案アプリケーション
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                ユーザー名
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                                    placeholder="ユーザー名を入力"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                パスワード
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                                    placeholder="パスワードを入力"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500"/>
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500"/>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'ログイン中...' : 'ログイン'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
