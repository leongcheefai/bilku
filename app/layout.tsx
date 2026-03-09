import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'BilKu - Free SST Invoice Generator for Malaysian Freelancers',
  description:
    'Generate professional SST-compliant invoices in 60 seconds. Free invoice generator with automatic 8% SST tax calculation, bilingual support (English & Bahasa Malaysia), and multi-currency options. Built for Malaysian freelancers and agencies.',
  keywords: [
    'SST invoice generator',
    'Malaysian invoice',
    'freelancer invoice Malaysia',
    'SST compliant invoice',
    'invoice generator free',
    'Sales and Service Tax invoice',
    'Bahasa Malaysia invoice',
    'Malaysian freelancer tools',
    'invoice template Malaysia',
    'SST tax calculator',
    'DuitNow invoice',
    'MYR invoice',
  ],
  authors: [{ name: 'BilKu' }],
  creator: 'BilKu',
  metadataBase: new URL('https://invoisku.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: 'https://invoisku.vercel.app',
    siteName: 'BilKu',
    title: 'BilKu - Free SST Invoice Generator for Malaysian Freelancers',
    description:
      'Generate professional SST-compliant invoices in 60 seconds. Free for Malaysian freelancers and agencies with automatic 8% SST calculation.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BilKu - SST Invoice Generator for Malaysian Freelancers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BilKu - Free SST Invoice Generator for Malaysian Freelancers',
    description:
      'Generate SST-compliant invoices in 60 seconds. Free for Malaysian freelancers and agencies.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
