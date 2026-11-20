import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bijli Wala Aya — AI Supervisor",
  description: "AI Senior Supervisor for Split AC Home Appliance Repair - Startup Buildathon India 2026",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className="dark">
      <body className="bg-[#0b141a] text-[#e9edef] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
