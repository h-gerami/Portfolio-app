# Expo Go Setup Instructions

## Why Expo Go Doesn't Work
Your app has:
- `expo-dev-client` (requires custom dev build)
- `newArchEnabled: true` (not supported in Expo Go)
- Sentry plugin (requires native modules)

## Solution Options

### Option 1: Quick Fix - Use Expo Go (Limited Features)
1. Temporarily disable features:
   ```bash
   # Backup current config
   cp app.json app.json.backup
   
   # Use Expo Go compatible config
   cp app.json.expo-go app.json
   
   # Remove dev-client dependency temporarily
   npm uninstall expo-dev-client
   
   # Clear cache and restart
   npx expo start -c
   ```

2. **Note**: Sentry will be disabled in this mode.

### Option 2: Build Development Client (Recommended)
This allows you to use all features including Sentry:

**For iOS:**
```bash
# Install EAS CLI if you haven't
npm install -g eas-cli

# Login to Expo
eas login

# Build development client for iOS
eas build --profile development --platform ios

# Or build locally (requires Xcode)
npx expo run:ios
```

**For Android:**
```bash
# Build development client for Android
eas build --profile development --platform android

# Or build locally (requires Android Studio)
npx expo run:android
```

After building, install the app on your device and use:
```bash
npx expo start --dev-client
```

### Option 3: Use Tunnel Mode
If you're having network issues:
```bash
npx expo start --tunnel
```

### Option 4: Check Network
Make sure your phone and computer are on the same Wi-Fi network, or use tunnel mode.

## Current Configuration
- Script updated: `npm start` now uses `--dev-client` flag
- This means you need a custom dev build, not Expo Go

## Quick Commands
```bash
# Start with dev client (requires built app)
npm start

# Start in Expo Go mode (after switching configs)
npx expo start -c

# Build iOS dev client locally
npx expo run:ios

# Build Android dev client locally  
npx expo run:android
```
