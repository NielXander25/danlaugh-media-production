import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Danlaugh Media Production',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
