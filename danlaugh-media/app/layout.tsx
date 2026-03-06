import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Danlaugh Media Production | Dream. Create. Capture.',
  description: 'Professional video editing and media production services. We turn your vision into cinematic reality.',
  keywords: 'video editor, media production, film editing, commercial video, music video, documentary',
  openGraph: {
    title: 'Danlaugh Media Production',
    description: 'Dream. Create. Capture. Professional video editing services.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary font-body antialiased">
        {children}
      </body>
    </html>
  )
}
