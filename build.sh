#!/bin/bash

# X Engojee Build Script
echo "🚀 Building X Engojee..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Android SDK is set up
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME is not set. Make sure Android SDK is properly configured."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npx expo run:android --clear

# Build and run on Android
echo "🔨 Building for Android..."
npx expo run:android

echo "✅ Build complete! Make sure to:"
echo "1. Enable the accessibility service in Android Settings"
echo "2. Grant all necessary permissions"
echo "3. Test with the X app installed"

echo "📱 Happy automating!"
