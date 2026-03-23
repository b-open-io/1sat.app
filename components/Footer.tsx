"use client"

export function Footer() {
  const links = [
    {
      label: "GitHub",
      href: "https://github.com/b-open-io/1sat-sdk",
    },
    { label: "Docs", href: "#docs" },
    { label: "Twitter", href: "https://twitter.com/1satordinals" },
  ]

  return (
    <footer
      className="w-full px-4 md:px-8 py-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Logo + copyright */}
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)",
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white opacity-90" />
          </div>
          <span
            className="text-xs"
            style={{
              color: "rgba(255,255,255,0.25)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            © 2026 1Sat
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-5">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.25)" }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.6)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.25)"
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
