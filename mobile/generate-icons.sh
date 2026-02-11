#!/bin/bash

# Script to generate app icons from SVG template
# Requires: ImageMagick (brew install imagemagick)

echo "Generating app icons..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed"
    echo "Install it with: brew install imagemagick"
    exit 1
fi

# Generate icon.png (1024x1024 for app stores)
convert -background none assets/icon-template.svg -resize 1024x1024 assets/icon.png
echo "✓ Generated icon.png (1024x1024)"

# Generate adaptive-icon.png (1024x1024 for Android adaptive icon)
convert -background none assets/icon-template.svg -resize 1024x1024 assets/adaptive-icon.png
echo "✓ Generated adaptive-icon.png (1024x1024)"

# Generate favicon.png (48x48 for web)
convert -background none assets/icon-template.svg -resize 48x48 assets/favicon.png
echo "✓ Generated favicon.png (48x48)"

# Generate splash icon (for splash screen)
convert -background none assets/icon-template.svg -resize 512x512 assets/splash-icon.png
echo "✓ Generated splash-icon.png (512x512)"

echo ""
echo "All icons generated successfully!"
echo "You can now run: bun run build:android"
