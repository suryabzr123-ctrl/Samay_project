export const metadata = {
  title: 'Samay Raina — Outclass Challenge',
  description: 'Hatke, spike‑proof site with polls, roast wall, and a cheesy easter egg.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0b0b10', color: '#e6e6f0', fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}

