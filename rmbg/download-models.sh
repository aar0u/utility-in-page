#!/bin/bash

# Download and extract background removal models

MODEL_URL="https://staticimgly.com/@imgly/background-removal-data/1.7.0/package.tgz"
PUBLIC_DIR="public"
MODELS_DIR="$PUBLIC_DIR/models"
TGZ_FILE="package.tgz"

echo "Starting model download..."

# Create public directory if it doesn't exist
if [ ! -d "$PUBLIC_DIR" ]; then
    mkdir -p "$PUBLIC_DIR"
fi

# Download the package
echo "Downloading $MODEL_URL..."
curl -fsSL -o "$TGZ_FILE" "$MODEL_URL"

if [ $? -ne 0 ]; then
    echo "Failed to download the package"
    exit 1
fi

echo "Download completed"

# Extract only dist directory contents
echo "Extracting package..."
mkdir -p "$MODELS_DIR"
tar -xzf "$TGZ_FILE" -C "$MODELS_DIR" --strip-components=2 package/dist

if [ $? -ne 0 ]; then
    echo "Failed to extract the package"
    rm -f "$TGZ_FILE"
    exit 1
fi

echo "Extraction completed"

echo "Models downloaded and extracted to $MODELS_DIR"
echo "Done!"
