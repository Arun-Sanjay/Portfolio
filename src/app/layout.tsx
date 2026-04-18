import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono, Inter, Chakra_Petch } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Cyberpunk display face — used on the hero headline so the site's
// "first impression" type matches the HUD / cube aesthetic. Chakra Petch
// reads as modern tech/sci-fi without the retro roundness of Orbitron.
const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-chakra-petch',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'S Arun Sanjay — Developer & Builder',
  description:
    'Full-stack developer and builder based at RVCE Bangalore. Shipping apps, hacking on AI, and building things that matter.',
  metadataBase: new URL('https://arunsanjay.dev'),
  openGraph: {
    title: 'S Arun Sanjay — Developer & Builder',
    description:
      'Full-stack developer and builder based at RVCE Bangalore. Shipping apps, hacking on AI, and building things that matter.',
    type: 'website',
    locale: 'en_US',
    siteName: 'S Arun Sanjay',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S Arun Sanjay — Developer & Builder',
    description:
      'Full-stack developer and builder based at RVCE Bangalore. Shipping apps, hacking on AI, and building things that matter.',
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} ${chakraPetch.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
