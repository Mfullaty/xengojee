@echo off
echo 🚀 Building X Engojee...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if Android SDK is set up
if not defined ANDROID_HOME (
    echo ⚠️  ANDROID_HOME is not set. Make sure Android SDK is properly configured.
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Clean previous builds
echo 🧹 Cleaning previous builds...
call npx expo run:android --clear

REM Build and run on Android
echo 🔨 Building for Android...
call npx expo run:android

echo ✅ Build complete! Make sure to:
echo 1. Enable the accessibility service in Android Settings
echo 2. Grant all necessary permissions
echo 3. Test with the X app installed

echo 📱 Happy automating!
pause
