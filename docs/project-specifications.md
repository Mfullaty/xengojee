# Project Technical Specification: X Engojee

**Document Version:** 1.0  
**Date:** September 17, 2025  
**Prepared For:** AI Engineer / Android Developer

## 1. Executive Summary

**Project Name:** X Engojee

**Objective:** To develop an Android application that automates user engagement on the X (formerly Twitter) platform. The application will not use the official X API. Instead, it will leverage Android's Accessibility Service to read the screen content, identify posts based on user-defined keywords, and perform human-like interactions such as liking and commenting.

**Core Architecture:** A hybrid application featuring:

- **React Native Frontend:** A user-friendly control panel for managing keyword-based rule sets and starting/stopping the automation process.
- **Native Android Backend:** A robust Accessibility Service written in Kotlin/Java that serves as the automation engine, performing all screen analysis and user-emulation gestures.

**Key Technical Challenge:** The primary challenge is to reliably parse the X app's UI, which lacks static element IDs, and to execute actions in a manner that evades bot detection by mimicking human behavior.

## 2. System Architecture

The application is composed of three primary components that interact on the user's device.

```
+------------------------------------------+
|       React Native Control Panel (UI)    |
| - Manages Keyword/Reply Rules            |
| - Start/Stop/Status Controls             |
| - Stores Rules in AsyncStorage           |
+------------------|------------------------+
                   | (React Native Bridge)
                   | 1. startService(rulesAsJSON)
                   | 2. stopService()
                   | 3. getStatus()
                   | 4. Event Emitter (Native -> JS)
+------------------v------------------------+
|         Native Android Module (Kotlin)   |
| - Receives commands from JS              |
| - Manages Accessibility Service Lifecycle|
+------------------|------------------------+
                   | (Service Intent)
+------------------v------------------------+
|   X Engojee Accessibility Service        |
| - Monitors screen for com.twitter.android|
| - Reads UI Node Tree (View Hierarchy)    |
| - Matches Post Text to Keywords          |
| - Executes Gestures (Taps, Scrolls)      |
| - Implements "Humanizer" Logic           |
+------------------------------------------+
```

## 3. Detailed Implementation Plan

### Part 1: React Native Control Panel

The user interface for configuration and control.

**Technology Stack:** React Native, JavaScript/TypeScript.

#### Key Screens:

**Main Screen:**
- A prominent toggle switch for "Start / Stop Service".
- A status display area (e.g., "Service Inactive", "Running...", "Post Liked").
- A button "Enable Service" that opens the phone's Accessibility settings screen (`Intent.ACTION_ACCESSIBILITY_SETTINGS`) to guide the user.

**Rules Management Screen:**
- A FlatList displaying all created rule sets. Each item should show the rule name (e.g., "GM Replies") and a count of keywords and replies.
- "Add New Rule" Floating Action Button.
- Swipe-to-delete functionality for existing rules.

**Rule Editor Screen:**
- A form for creating/editing a rule.
- **Input 1:** Rule Name (e.g., "Crypto Project Replies").
- **Input 2:** Keywords (A TextInput where keywords are entered comma-separated).
- **Input 3:** Replies (A multiline TextInput where replies are entered, one per line).

#### Data Persistence:
- Utilize `@react-native-async-storage/async-storage`.
- Create helper functions `saveRules(rules)` and `loadRules()`.
- Load rules into component state via `useEffect` on app launch. Save rules whenever a change is made in the Rule Editor.

#### Bridge to Native Code:
- Create a JS file (e.g., `AutomationService.js`) that imports `NativeModules` from React Native.
- Expose functions like `start(rules)`, `stop()`, and `getStatus()`.
- The `start` function must serialize the entire rules array to a JSON string before passing it to the native side.
- Instantiate `NativeEventEmitter` to listen for status updates sent from the native service.

### Part 2: The Native Android Automation Engine (Accessibility Service)

This is the core of the application, written in Kotlin.

#### Step 2.1: Setup the Accessibility Service

1. In Android Studio, create a new Kotlin class `XEngojeeService` that extends `AccessibilityService`.

2. Create an XML configuration file (`res/xml/accessibility_service_config.xml`). This file is critical:

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

3. Declare the service in `AndroidManifest.xml`, ensuring it's protected by the `BIND_ACCESSIBILITY_SERVICE` permission.

#### Step 2.2: Implement the Service Logic

**`onServiceConnected()`:** Override this method to perform initial setup.

**`onAccessibilityEvent(event: AccessibilityEvent)`:** This is the main event loop.

- **Guard Clauses:** Immediately exit if `rootInActiveWindow` is null or the event is from an irrelevant package.
- **Node Traversal & Post Identification:** The X app's UI is dynamic. A robust strategy for finding a "post" container is to search for a leaf-node that is uniquely part of a post, like the "Like" button, and then traverse up the parent nodes to find the encompassing container.
- **Heuristic:** A post container often contains nodes with content descriptions for "Reply," "Repost," and "Like."
- **State Management:** Maintain a `HashSet<String>` of recently processed post texts to prevent the service from acting on the same post multiple times during screen refreshes.

#### Keyword Matching:
- For each identified post, extract its text content. Sanitize it by converting to lowercase.
- Iterate through the rules (parsed from the JSON passed by React Native).
- For each rule, iterate through its keywords. If `postText.contains(keyword)`, you have a match.

#### Action Execution:

**Comment Action:**
1. Find the "Reply" button node within the post container.
2. Perform `performAction(ACTION_CLICK)`.
3. **Crucial:** Use `Thread.sleep()` with a random delay (see Humanizer Module) to wait for the reply UI to load.
4. Scan the new view hierarchy for an `EditText` node.
5. Select a random reply from the matched rule's list.
6. Populate the `EditText` using `ACTION_SET_TEXT`.
7. Find and click the final "Reply" button.

**Like Action:**
- If no keyword match is found, default to a "like" action.
- Find the "Like" button node. Check its `contentDescription`. If it is not "Liked," perform `ACTION_CLICK`.

### Part 3: The "Humanizer" Module (Essential for Evasion)

This is not a formal module but a set of practices to integrate directly into the `XEngojeeService` to avoid detection.

#### 1. Randomized Delays
Create a helper function `randomSleep(min: Long, max: Long)` and call it before every single action.

- Before scrolling: `randomSleep(2000, 4000)`
- After finding a post, before acting: `randomSleep(1500, 3500)` (simulates reading)
- Before clicking any button: `randomSleep(500, 1200)`

#### 2. Imperfect Tapping & Gestures
Do not use `performAction(ACTION_CLICK)`. It is too precise. Use the gesture API for realism.

- Get the target node's bounds in screen: `node.getBoundsInScreen(rect)`.
- Calculate a random tap point inside these bounds, not the exact center.
- Build a `GestureDescription` with a `Path` that simulates a brief tap at this random coordinate.
- Use `dispatchGesture()` to execute.
- For scrolling, create a swipe gesture with slight variations in path and duration.

#### 3. Probabilistic Actions
Do not be a perfect machine.

- **Action Probability:** Before acting on any post, check against a probability (e.g., `if (Random.nextFloat() < 0.9)`). On a "failure," simply scroll past the post. This 10% inactivity looks natural.
- **Comment vs. Like Ratio:** Do not comment on every match. Even if a keyword matches, introduce another probability check to decide whether to comment or just like it (e.g., 70% chance to comment on a match).

#### 4. Session Management
The service should be designed to run for finite sessions. The React Native app can enforce this by automatically calling the `stop()` method after a user-defined timer (e.g., 30 minutes) expires.

## 4. Development & Debugging Tools

**Android Studio's Layout Inspector:** This tool is non-negotiable. Use it to inspect the live UI of the X app on an emulator or physical device. It will reveal the `contentDescription`, text, and view hierarchy you need to target.

**Logcat:** Use extensive `Log.d("XEngojeeService", "...")` throughout the native service to monitor what it is seeing, what decisions it is making, and where it is failing.

**On-Screen Logging:** Use the native-to-JS event emitter to display a simplified log on the React Native UI. This is invaluable for non-technical users to see what the app is doing.