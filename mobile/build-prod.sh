#!/bin/bash

# Get current date and time
BUILD_DATE=$(date +"%Y-%m-%d %H:%M:%S")
BUILD_TIMESTAMP=$(date +%s)

# Read current version from build.gradle
CURRENT_VERSION_CODE=$(grep "versionCode" android/app/build.gradle | awk '{print $2}')
CURRENT_VERSION_NAME=$(grep "versionName" android/app/build.gradle | awk '{print $2}' | tr -d '"')

# Increment version code
NEW_VERSION_CODE=$((CURRENT_VERSION_CODE + 1))

# Update version in build.gradle
sed -i.bak "s/versionCode $CURRENT_VERSION_CODE/versionCode $NEW_VERSION_CODE/" android/app/build.gradle
sed -i.bak "s/versionName \"$CURRENT_VERSION_NAME\"/versionName \"1.0.$NEW_VERSION_CODE\"/" android/app/build.gradle
rm android/app/build.gradle.bak

echo "Building APK for production..."
echo "Version: 1.0.$NEW_VERSION_CODE (Build $NEW_VERSION_CODE)"
echo "Build Date: $BUILD_DATE"
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
mkdir -p ../web/public/apk
cp android/app/build/outputs/apk/release/app-release.apk ../web/public/apk/inventory-system.apk

# Get APK file size
APK_SIZE=$(ls -lh ../web/public/apk/inventory-system.apk | awk '{print $5}')

# Create build info JSON
cat > ../web/public/apk/build-info.json << EOF
{
  "version": "1.0.$NEW_VERSION_CODE",
  "versionCode": $NEW_VERSION_CODE,
  "buildDate": "$BUILD_DATE",
  "buildTimestamp": $BUILD_TIMESTAMP,
  "fileSize": "$APK_SIZE"
}
EOF

echo "✓ Production APK built successfully!"
echo "✓ Version: 1.0.$NEW_VERSION_CODE"
echo "✓ Build Date: $BUILD_DATE"
echo "✓ File Size: $APK_SIZE"
echo "✓ APK copied to ../web/public/apk/inventory-system.apk"
echo "✓ Build info saved to ../web/public/apk/build-info.json"
ls -lh ../web/public/apk/
