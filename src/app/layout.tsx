import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "S Arun Sanjay — Developer & Founder",
  description:
    "Full stack developer, founder, and B.Tech CS student at RVCE Bangalore. Building products that matter.",
  openGraph: {
    title: "S Arun Sanjay — Portfolio",
    description:
      "Full stack developer, founder, and B.Tech CS student at RVCE Bangalore.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrains.variable} ${inter.variable} ${playfair.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
