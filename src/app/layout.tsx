import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recipper - 料理レシピ提案アプリ",
  description: "Gemini AIを使用した料理レシピ提案・管理アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
