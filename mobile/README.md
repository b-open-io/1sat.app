# 1Sat Market - Mobile App

Native iOS and Android wrapper for the 1Sat Ordinals Marketplace using Capacitor.

## Architecture

This is a **thin native wrapper** that loads the marketplace website (`alpha.1sat.market`) in a native WebView. The approach keeps the mobile app lean while providing essential native features for App Store compliance.

## Features

- Native iOS (WKWebView) and Android (Chromium WebView) apps
- Loads `https://alpha.1sat.market` in webview
- Minimal native code - all business logic stays in the web app
- Essential native integrations:
  - Splash screen
  - Status bar styling
  - Haptic feedback
  - Native sharing
  - Deep linking support

## Prerequisites

- Bun installed
- Xcode (for iOS development)
- Android Studio (for Android development)
- Apple Developer Account
- Google Play Developer Account

## Installation

```bash
cd ~/code/1sat.app/mobile
bun install
```

## Development

### Open in Native IDEs

```bash
# iOS (requires Xcode)
bun run open:ios

# Android (requires Android Studio)
bun run open:android
```

### Run on Device with Live Reload

```bash
# iOS
bun run run:ios

# Android
bun run run:android
```

### Sync Web Assets to Native Projects

After making changes to `capacitor.config.ts` or installing new plugins:

```bash
bun run sync
```

## Configuration

The app configuration is in `capacitor.config.ts`:

```typescript
{
  appId: 'com.onesat.market',
  appName: '1Sat Market',
  server: {
    url: 'https://alpha.1sat.market'  // Change to 1sat.market for production
  }
}
```

### Switching to Production

To point the app to the production site, update `capacitor.config.ts`:

```typescript
server: {
  url: 'https://1sat.market'
}
```

Then sync:
```bash
bun run sync
```

## Project Structure

```
mobile/
├── ios/                    # Xcode project
├── android/                # Android Studio project
├── www/                    # Fallback web assets (minimal)
├── capacitor.config.ts     # Capacitor configuration
└── package.json            # Dependencies
```

## Installed Plugins

- **@capacitor/splash-screen** - Native splash screen
- **@capacitor/status-bar** - Status bar styling
- **@capacitor/app** - App lifecycle and deep linking
- **@capacitor/haptics** - Tactile feedback
- **@capacitor/share** - Native share sheet

## iOS Setup

### First Time Setup

1. Open the project:
   ```bash
   bun run open:ios
   ```

2. Install CocoaPods dependencies:
   ```bash
   cd ios/App
   pod install
   ```

3. In Xcode:
   - Select your development team
   - Update bundle identifier if needed
   - Configure signing certificates

### Building for App Store

1. Update version in `ios/App/App/Info.plist`
2. Archive in Xcode: Product → Archive
3. Upload to App Store Connect
4. Submit for review

## Android Setup

### First Time Setup

1. Open the project:
   ```bash
   bun run open:android
   ```

2. In Android Studio:
   - Sync Gradle files
   - Update package name if needed (in `android/app/build.gradle`)
   - Configure signing keys

### Building for Play Store

1. Update version in `android/app/build.gradle`
2. Build signed bundle: Build → Generate Signed Bundle / APK
3. Upload to Google Play Console
4. Submit for review

## Native Features Integration

### Using Plugins in Your Web App

The web app at `alpha.1sat.market` can access Capacitor plugins:

```javascript
import { Haptics } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { App } from '@capacitor/app';

// Haptic feedback
await Haptics.impact({ style: 'medium' });

// Native sharing
await Share.share({
  title: 'Check out this NFT',
  text: 'Amazing 1Sat Ordinal!',
  url: 'https://1sat.market/nft/123',
  dialogTitle: 'Share NFT'
});

// Handle deep links
App.addListener('appUrlOpen', (event) => {
  // Handle incoming URL
  console.log('App opened with URL:', event.url);
});
```

### Detecting Mobile App

Check if code is running in the mobile app:

```javascript
import { Capacitor } from '@capacitor/core';

const isMobileApp = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform(); // 'ios', 'android', or 'web'
```

## Troubleshooting

### iOS: CocoaPods Issues

```bash
cd ios/App
pod deintegrate
pod install
```

### Android: Gradle Sync Failed

```bash
cd android
./gradlew clean
./gradlew build
```

### Changes Not Showing

Make sure to sync after config changes:
```bash
bun run sync
```

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Design Guidelines](https://developer.android.com/design)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

## License

Private - All Rights Reserved
