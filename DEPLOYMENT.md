# Deployment Guide: PWA + Vercel

This guide explains how to deploy the Words With Friends Helper as a Progressive Web App (PWA) on Vercel.

## 🎯 What Was Changed

### PWA Features Added:
1. **manifest.json** - App manifest for installability
2. **service-worker.js** - Offline support and caching
3. **PWA meta tags** - iOS and Android compatibility
4. **App icons** - 192x192 and 512x512 PNG icons

### Vercel Configuration:
1. **vercel.json** - Deployment configuration
2. **api/index.py** - Serverless function entry point
3. **Build scripts** - Automated build process
4. **.vercelignore** - Excluded files from deployment

---

## 📋 Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **Vercel CLI** (optional but recommended):
   ```bash
   npm install -g vercel
   ```
3. **Git repository** - Your code should be in a Git repo (GitHub, GitLab, etc.)

---

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add PWA and Vercel deployment config"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration
   - Click "Deploy"

3. **Done!** Your app will be available at `https://your-project.vercel.app`

### Option 2: Deploy via CLI

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No** (first time)
   - Project name? **words-with-friends-helper** (or your choice)
   - Directory? **./  ** (current directory)
   - Override settings? **No**

4. **Production deployment:**
   ```bash
   vercel --prod
   ```

---

## 🔧 Build Process

Vercel automatically runs these steps:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run build:**
   ```bash
   npm run vercel-build
   ```
   This runs `gulp` which:
   - Compiles TypeScript → bundle.js
   - Copies Python files
   - Copies HTML templates
   - Copies CSS styles
   - Copies assets (images, icons)
   - Copies PWA files (manifest, service worker)

3. **Deploy serverless function:**
   - `api/index.py` becomes a serverless endpoint
   - Handles both `/` (frontend) and `/bestGameMove` (API)

---

## 📱 PWA Features

### Installation

Users can install the app on their device:

**Desktop:**
- Chrome: Look for install icon in address bar
- Edge: Click ⋯ → Apps → Install this site as an app

**Mobile:**
- Safari (iOS): Share → Add to Home Screen
- Chrome (Android): ⋮ → Install app

### Offline Support

The service worker caches:
- HTML, CSS, JavaScript
- Images and assets
- External fonts and icons

**Not cached:**
- API calls to `/bestGameMove` (requires network)

### Update Strategy

When you deploy updates:
1. Service worker detects new version
2. Downloads updated files in background
3. User gets update on next page reload

---

## 🛠️ Configuration Files

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/dist/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.py"
    }
  ]
}
```

### `package.json` (scripts added)
```json
{
  "scripts": {
    "build": "gulp",
    "vercel-build": "npm install && gulp"
  }
}
```

---

## 🎨 Customizing Icons

The default icons are placeholders. To create proper icons:

1. **Create high-res icon** (1024x1024 PNG)
2. **Generate multiple sizes:**
   - 192x192 px → `src/static/assets/icon-192.png`
   - 512x512 px → `src/static/assets/icon-512.png`

3. **Online tools:**
   - https://realfavicongenerator.net/
   - https://favicon.io/

4. **Rebuild and deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

---

## 🔍 Testing PWA Locally

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Serve with HTTPS** (PWA requires HTTPS):
   ```bash
   # Using Python
   cd dist
   python app.py
   ```

3. **Test PWA features:**
   - Open Chrome DevTools → Application tab
   - Check Manifest, Service Workers, Storage

---

## 📊 Monitoring

After deployment:

1. **Check deployment status:**
   - Vercel Dashboard → Your Project → Deployments

2. **View logs:**
   - Click on a deployment → View logs

3. **Custom domain** (optional):
   - Project Settings → Domains
   - Add your custom domain

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `Module not found: dictionary.py`
**Fix:** Ensure `api/` directory has all Python files:
```bash
ls api/
# Should show: index.py, best_game_move.py, dictionary.py, words.txt
```

### Service Worker Not Registering

**Error:** `Service worker registration failed`
**Fix:** Ensure HTTPS is enabled (Vercel provides this automatically)

### Icons Not Showing

**Error:** Icons appear broken
**Fix:**
1. Check `src/static/assets/` has icon-192.png and icon-512.png
2. Run `npm run build` to copy to dist/
3. Redeploy

### API Endpoint Not Working

**Error:** `/bestGameMove` returns 404
**Fix:** Check `vercel.json` routes configuration

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **PWA Checklist:** https://web.dev/pwa-checklist/
- **Service Workers:** https://developers.google.com/web/fundamentals/primers/service-workers

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] App loads at Vercel URL
- [ ] Static assets load (CSS, JS, images)
- [ ] Board editor works
- [ ] "Go" button computes best move
- [ ] localStorage persistence works
- [ ] Export/Import board features work
- [ ] Install prompt appears (Chrome/Edge)
- [ ] App installs on mobile devices
- [ ] Offline mode works (after first visit)
- [ ] PWA manifest loads without errors

---

## 🎉 Success!

Your app is now:
- ✅ Deployed on Vercel
- ✅ Accessible worldwide
- ✅ Installable as PWA
- ✅ Works offline
- ✅ Auto-scales with traffic
- ✅ Has HTTPS enabled

**Share your app:** `https://your-project.vercel.app`
