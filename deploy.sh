#!/bin/bash

# Configuration
APP_NAME="nestjs-app"  # Change this to your app name
PM2_PROCESS_NAME="$APP_NAME-backend"

echo "🚀 Starting deployment process for $APP_NAME..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci -f 

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Installing PM2..."
    npm install -g pm2
fi

# Start or restart the application
echo "🔄 Starting/Restarting the application..."
if pm2 describe "$PM2_PROCESS_NAME" > /dev/null; then
    pm2 restart $PM2_PROCESS_NAME
else
    pm2 start npm --name "$PM2_PROCESS_NAME" -- start
fi

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 startup
echo "🔌 Setting up PM2 startup..."
pm2 startup

echo "✅ Deployment completed successfully for $APP_NAME!"