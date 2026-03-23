"use client"

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 pointer-events-none">
      {/* Left pill: logo + nav links */}
      <nav
        className="pointer-events-auto flex items-center gap-6 px-4 py-2.5 rounded-full border"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo mark */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)",
            }}
          >
            <div className="w-3 h-3 rounded-full bg-white opacity-90" />
          </div>
          <span
            className="text-sm font-semibold tracking-tight"
            style={{
              fontFamily: "var(--font-geist-mono)",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            1Sat
          </span>
        </div>

        {/* Divider */}
        <div
          className="hidden md:block w-px h-4 self-center"
          style={{ background: "rgba(255,255,255,0.12)" }}
        />

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-5">
          {["Features", "GitHub", "Docs"].map((link) => (
            <a
              key={link}
              href={
                link === "GitHub"
                  ? "https://github.com/b-open-io/1sat-sdk"
                  : `#${link.toLowerCase()}`
              }
              className="text-sm transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.55)" }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.9)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.55)"
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </nav>

      {/* Right pill: CTA */}
      <a
        href="https://github.com/b-open-io/1sat-sdk/releases"
        className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white cta-glow transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)",
          fontFamily: "var(--font-geist-sans)",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-80"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="hidden sm:inline">Download for Mac</span>
        <span className="sm:hidden">Download</span>
      </a>
    </header>
  )
}
