#!/bin/bash

# Build APK for production
echo "Building APK for production..."
echo "Using WEB_APP_URL=https://inventory-mobile.vercel.app"

# Backup current .env
cp .env .env.backup

# Use production .env
cp .env.production .env

# Build APK
cd android && ./gradlew clean assembleRelease

# Restore original .env
cd ..
mv .env.backup .env

# Copy APK to web public folder
cp android/app/build/outputs/apk/release/app-release.apk ../web/public/apk/inventory-system.apk

echo "✓ Production APK built and copied to inventory-web/public/apk/"
ls -lh ../web/public/apk/inventory-system.apk
