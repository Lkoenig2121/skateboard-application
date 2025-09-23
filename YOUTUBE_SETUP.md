# 🎥 YouTube API Setup Guide

## Step 1: Get YouTube Data API Key

1. **Go to Google Cloud Console**

   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select Project**

   - Click "Select a project" at the top
   - Either select existing project or create new one
   - Click "NEW PROJECT" if creating new

3. **Enable YouTube Data API**

   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "ENABLE"

4. **Create API Key**

   - Go to "APIs & Services" → "Credentials"
   - Click "CREATE CREDENTIALS" → "API key"
   - Copy the generated API key

5. **Configure Environment**
   - Create `.env.local` file in project root:
   ```bash
   cp .env.local.example .env.local
   ```
   - Add your API key:
   ```env
   YOUTUBE_API_KEY=your_actual_api_key_here
   ```

## Step 2: Test the Integration

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Visit your app:**
   - Open [http://localhost:3000](http://localhost:3000)
   - You should see real YouTube videos loading!

## Troubleshooting

### "YouTube API key not configured"

- Make sure `.env.local` exists and contains your API key
- Restart the development server after adding the key

### "API quota exceeded"

- YouTube API has daily quotas
- Free tier allows ~10,000 requests per day
- Each video search uses ~100 quota units

### Videos not loading

- Check browser console for errors
- Verify API key is correct
- Ensure YouTube Data API v3 is enabled

## API Quota Management

The YouTube Data API has quotas:

- **Free tier:** 10,000 units/day
- **Video search:** ~100 units per request
- **Video details:** ~1 unit per video

Each category change triggers a new API call, so you get ~100 category switches per day on free tier.

## What You Get

With YouTube API integration, your SkateTube app will:

- ✅ Fetch real skateboarding videos from YouTube
- ✅ Show actual thumbnails, titles, and descriptions
- ✅ Display real view counts and upload dates
- ✅ Filter by categories (skateboarding, BMX, etc.)
- ✅ Include channel information
- ✅ Have working video links to YouTube

Enjoy your real YouTube-powered skateboarding app! 🛹🎥
