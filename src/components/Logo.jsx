import Link from 'next/link'
import React from 'react'
import config from '@/config'

const Logo = () => {
  const appName = config.appName || "Aether Hub";

  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
      <div className="flex items-center gap-1">
        <span className="text-[var(--primary)]">Ae</span>
        <span className="text-sm text-[var(--muted)]">ther</span>
      </div>
      <span className="hidden sm:inline-block text-base font-semibold text-black/90">
      </span>
    </Link>
  )
}
export default Logo
