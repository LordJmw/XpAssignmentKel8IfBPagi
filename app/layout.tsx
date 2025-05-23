import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Task Management App',
  description: 'Organize Your Task Easily Using This Web',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
