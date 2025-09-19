# X Engojee - Automated X Engagement App

X Engojee is an Android application that automates user engagement on the X (formerly Twitter) platform using Android's Accessibility Service. The app identifies posts based on user-defined keywords and performs human-like interactions such as liking and commenting.

## Architecture

The application consists of three main components:

1. **React Native Frontend** - User-friendly control panel for managing rules and controlling the automation
2. **Native Android Module** - Bridge between React Native and the Accessibility Service
3. **Accessibility Service** - Core automation engine that reads screen content and performs actions

## Features

### ✅ Complete Implementation

- **Rule-Based Automation**: Create custom rules with keywords and replies
- **Human-Like Behavior**: Randomized delays, imperfect gestures, and probabilistic actions
- **Real-Time Monitoring**: Live activity logs and status updates
- **Accessibility Service**: Advanced UI parsing and gesture automation
- **Data Persistence**: AsyncStorage for rule management
- **Modern UI**: Beautiful React Native interface with proper UX

### 🎯 Humanizer Features

- **Randomized Delays**: Variable timing between actions (2-4 seconds for scrolling, 1.5-3.5 seconds for reading)
- **Imperfect Gestures**: Random tap points within UI elements instead of precise centers
- **Probabilistic Actions**: 90% action probability, 70% comment vs like ratio
- **Natural Scrolling**: Variable scroll distances and speeds

## Project Structure

```
xengojee/
├── android/
│   └── app/src/main/java/com/xengojee/
│       ├── XEngojeeService.kt           # Core Accessibility Service
│       ├── AutomationModule.kt          # React Native Bridge
│       ├── AutomationPackage.kt         # Native Module Package
│       └── MainActivity.kt              # Main Activity
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx                    # Control Panel Screen
│   │   └── explore.tsx                  # Rules Management Screen
│   └── modal.tsx                        # Rule Editor Screen
├── services/
│   └── AutomationService.js             # React Native Bridge Service
├── utils/
│   └── storage.js                       # AsyncStorage Helper Functions
└── docs/
    └── project-specifications.md       # Technical Specifications
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Android Studio
- Android SDK (API level 24 or higher)
- Physical Android device (recommended for testing)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   cd xengojee
   npm install
   ```

2. **Android Setup**
   ```bash
   # Build the Android app
   npx expo run:android
   ```

3. **Enable Accessibility Service**
   - Open the app
   - Tap "Enable Accessibility Service"
   - Find "X Engojee" in the accessibility services list
   - Enable the service

## Usage Guide

### 1. Creating Rules

1. Navigate to the "Rules" tab
2. Tap the "+" button to create a new rule
3. Fill in the form:
   - **Rule Name**: Descriptive name (e.g., "Crypto Replies")
   - **Keywords**: Comma-separated keywords (e.g., "bitcoin, crypto, blockchain")
   - **Replies**: One reply per line for random selection

### 2. Starting Automation

1. Go to the "Control" tab
2. Ensure you have at least one rule created
3. Toggle the service switch to "ON"
4. Open the X app
5. Monitor activity in the real-time log

### 3. Monitoring Activity

The Control tab shows:
- **Service Status**: Current automation state
- **Rules Summary**: Statistics about your rules
- **Activity Log**: Real-time updates of bot actions

## Technical Details

### Accessibility Service Configuration

```xml
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeViewScrolled|typeWindowContentChanged|typeWindowStateChanged"
    android:packageNames="com.twitter.android"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:notificationTimeout="100"
    android:canRetrieveWindowContent="true"
    android:canPerformGestures="true"
    android:settingsActivity="com.xengojee.MainActivity"
/>
```

Note: The app no longer declares `BIND_ACCESSIBILITY_SERVICE` as a normal permission in the manifest/app.json. That permission is only used on the service declaration. Start/stop commands are delivered via a broadcast receiver and persisted pending start, so you can toggle automation even if the service isn't yet enabled; it will start automatically once you enable the accessibility service.

### Key Components

#### XEngojeeService.kt
- Main accessibility service implementation
- UI parsing and post identification
- Gesture automation with humanization
- Keyword matching and action execution

#### AutomationModule.kt
- React Native bridge module
- Service lifecycle management
- Event emission to JavaScript

#### AutomationService.js
- JavaScript bridge service
- Event listener management
- Promise-based API for React Native

## Security & Privacy

- **No API Keys Required**: Uses accessibility service instead of X API
- **Local Data Storage**: All rules stored locally on device
- **No Network Requests**: No data sent to external servers
- **Permission-Based**: Requires explicit accessibility permission

## Bot Detection Evasion

The app implements several techniques to avoid detection:

1. **Variable Timing**: Random delays between all actions
2. **Imperfect Interactions**: Random tap points within UI elements
3. **Probabilistic Behavior**: Doesn't act on every post (90% action rate)
4. **Natural Patterns**: Mixes comments and likes (70/30 ratio)
5. **Session Management**: Designed for finite automation sessions

## Development

### Building for Development

```bash
# Start Metro bundler
npx expo start

# Run on Android device
npx expo run:android

# View logs
npx react-native log-android
```

### Debugging

1. **Android Studio Layout Inspector**: Inspect X app UI elements
2. **Logcat**: Monitor service logs with tag "XEngojeeService"
3. **React Native Debugger**: Debug JavaScript components

### Testing

Test the accessibility service with these steps:

1. Enable the service in Android settings
2. Open X app and scroll through timeline
3. Check Logcat for service activity
4. Verify actions are performed correctly

## Troubleshooting

### Common Issues

**Service Not Starting**
- Ensure accessibility service is enabled
- Check app permissions in Android settings
- Restart the app and try again

**No Posts Detected**
- Verify X app is the correct package (`com.twitter.android`)
- Check if X app UI has changed (may require service updates)
- Monitor Logcat for parsing errors

**Actions Not Working**
- Ensure gesture permissions are granted
- Check if UI elements have changed
- Verify random delays aren't too long

### Logs and Debugging

Check these log tags in Logcat:
- `XEngojeeService`: Accessibility service logs
- `AutomationModule`: React Native bridge logs
- `ReactNativeJS`: JavaScript console logs

## License

This project is for educational purposes only. Users are responsible for complying with X's Terms of Service and applicable laws.

## Disclaimer

This software is provided "as is" without warranty. The developers are not responsible for any consequences of using this automation tool. Please use responsibly and in accordance with platform terms of service.