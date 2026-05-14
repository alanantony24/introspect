import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SketchProvider } from "sketchbook-ui";
import "./globals.css";
import "sketchbook-ui/style.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Introspect",
  description: "A calm self-reflection companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SketchProvider>{children}</SketchProvider>
      </body>
    </html>
  );
}
