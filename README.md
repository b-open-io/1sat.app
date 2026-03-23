# 1Sat App Monorepo

Monorepo containing the 1Sat ecosystem mobile app and landing page.

## Projects

### 📱 `/mobile` - Native Mobile App

Capacitor-based native wrapper for iOS and Android that loads the 1Sat Ordinals Marketplace.

- **Current target:** `https://alpha.1sat.market`
- **Production target:** `https://1sat.market`
- **Tech:** Capacitor 7, TypeScript, Native iOS/Android
- **Approach:** Thin native wrapper with minimal code

[View mobile README →](./mobile/README.md)

### 🌐 `/frontend` - Landing Page

Next.js 16 landing page for the 1sat.app domain.

- **URL:** `https://1sat.app`
- **Tech:** Next.js 16, React 19, TailwindCSS v4, TypeScript
- **Purpose:** Marketing site with app store download links

[View frontend README →](./frontend/README.md)

## Architecture Overview

```
┌─────────────────────────────────────┐
│   1Sat Marketplace (hosted)         │
│   https://alpha.1sat.market         │
│   - Full marketplace functionality   │
│   - Bitcoin wallet features          │
│   - NFT browsing & trading          │
└────────────┬────────────────────────┘
             │
             │ Loaded in WebView
             │
┌────────────▼────────────────────────┐
│   Mobile App (/mobile)               │
│   - iOS (WKWebView)                 │
│   - Android (Chromium WebView)      │
│   - Native features layer           │
│   - App Store distribution          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│   Landing Page (/frontend)           │
│   https://1sat.app                   │
│   - Marketing content                │
│   - App store download links         │
│   - Feature showcase                 │
└──────────────────────────────────────┘
```

## Prerequisites

- **Bun** (package manager)
- **Node.js 18+** (for Next.js)
- **Xcode** (for iOS development, macOS only)
- **Android Studio** (for Android development)
- **CocoaPods** (for iOS dependencies): `sudo gem install cocoapods`

## Quick Start

### Install All Dependencies

From the monorepo root:

```bash
cd ~/code/1sat.app
bun install
```

This will install dependencies for both `frontend` and `mobile` workspaces.

### Development

```bash
# Frontend development server
bun dev
# or
cd frontend && bun dev

# Mobile - open in native IDEs
cd mobile && bun run open:ios      # Xcode
cd mobile && bun run open:android  # Android Studio

# Mobile - run with live reload
cd mobile && bun run run:ios
cd mobile && bun run run:android
```

## Workspace Commands

```bash
# Run commands from workspace root
bun dev                           # Frontend dev server
bun build:frontend                # Build frontend
bun mobile:open:ios               # Open iOS in Xcode
bun mobile:open:android           # Open Android in Android Studio
bun mobile:sync                   # Sync Capacitor

# Or use workspace filters
bun --filter frontend dev         # Frontend dev
bun --filter frontend build       # Frontend build
```

## Project Structure

```
1sat.app/
├── package.json              # Workspace root
├── frontend/                 # Next.js 16 landing page
│   ├── app/                  # Next.js app router
│   ├── components/           # React components
│   ├── package.json
│   └── README.md
├── mobile/                   # Capacitor mobile app
│   ├── ios/                  # Xcode project
│   ├── android/              # Android Studio project
│   ├── www/                  # Fallback web assets
│   ├── capacitor.config.ts   # Config (points to alpha.1sat.market)
│   ├── package.json
│   └── README.md
└── README.md                 # This file
```

## Deployment

### Frontend (Landing Page)

Deploy to Vercel:

```bash
cd frontend
vercel
```

Or configure in Vercel dashboard to deploy from the `/frontend` directory.

### Mobile (iOS App Store)

1. Update target URL in `mobile/capacitor.config.ts` to production:
   ```typescript
   server: { url: 'https://1sat.market' }
   ```

2. Open in Xcode:
   ```bash
   cd mobile && bun run open:ios
   ```

3. Configure signing & provisioning profiles

4. Archive and upload to App Store Connect

5. Submit for review

[See detailed iOS instructions →](./mobile/README.md#ios-setup)

### Mobile (Google Play Store)

1. Update target URL in `mobile/capacitor.config.ts` to production

2. Open in Android Studio:
   ```bash
   cd mobile && bun run open:android
   ```

3. Configure signing keys

4. Build signed bundle (AAB)

5. Upload to Google Play Console

6. Submit for review

[See detailed Android instructions →](./mobile/README.md#android-setup)

## Development Workflow

### Making Changes to the Marketplace

The mobile app loads the live marketplace from `alpha.1sat.market`. Changes to the marketplace website are immediately reflected in the mobile app (no rebuild needed).

### Adding Native Features

1. Install Capacitor plugin:
   ```bash
   cd mobile
   bun add @capacitor/plugin-name
   ```

2. Update `capacitor.config.ts` if needed

3. Sync to native projects:
   ```bash
   bun run sync
   ```

4. Rebuild in Xcode/Android Studio

### Switching from Alpha to Production

Update `mobile/capacitor.config.ts`:

```typescript
server: {
  url: 'https://1sat.market'  // Change from alpha.1sat.market
}
```

Then sync:
```bash
cd mobile && bun run sync
```

## Installed Capacitor Plugins

- **@capacitor/app** - App lifecycle, deep linking
- **@capacitor/haptics** - Tactile feedback
- **@capacitor/share** - Native share sheet
- **@capacitor/splash-screen** - Launch screen
- **@capacitor/status-bar** - Status bar styling

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript 5.9
- TailwindCSS v4
- Biome (linting/formatting)

### Mobile
- Capacitor 7
- TypeScript 5.9
- Native iOS (Swift/Objective-C)
- Native Android (Kotlin/Java)

### Package Management
- Bun workspaces

## Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)
- [Bun Workspaces](https://bun.sh/docs/install/workspaces)

## Contributing

This is a private project. For access, contact the team.

## License

Private - All Rights Reserved
