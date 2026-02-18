import './globals.css'
import { Cormorant_Garamond, Cinzel } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
})

export const metadata = {
  title: "Mab",
  description: "I've been expecting you.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cormorant.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
