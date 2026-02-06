# Deployment Guide

## Overview

This guide covers deploying the Rick and Morty Character Explorer to production environments.

## Prerequisites

- Node.js 18+
- npm 9+
- Git repository
- Deployment platform account (Vercel, Netlify, etc.)

## Build Process

### 1. Production Build

```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Run tests
npm run test:run

# Build for production
npm run build
```

### 2. Build Output

The build creates an optimized `dist/` folder:

```
dist/
├── assets/
│   ├── index-[hash].js       # Application code
│   ├── index-[hash].css      # Styles
│   └── [images/fonts]        # Static assets
├── index.html                # Entry point
└── manifest.webmanifest      # PWA manifest
```

### 3. Preview Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` to test the production build.

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the best experience for Vite applications.

#### Automatic Deployment

1. **Connect Repository**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your Git repository

2. **Configure Build**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables**
   Add in Vercel dashboard:
   ```
   VITE_API_GRAPHQL_ENDPOINT=https://rickandmortyapi.com/graphql
   VITE_APP_NAME=Rick and Morty Explorer
   VITE_ENABLE_PWA=true
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically deploys on every push

#### Manual Deployment (CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

### Option 2: Netlify

#### Automatic Deployment

1. **Connect Repository**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Select your repository

2. **Configure Build**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   Add in Netlify dashboard under "Site settings > Environment variables":
   ```
   VITE_API_GRAPHQL_ENDPOINT=https://rickandmortyapi.com/graphql
   VITE_APP_NAME=Rick and Morty Explorer
   VITE_ENABLE_PWA=true
   ```

4. **Deploy**
   - Click "Deploy site"
   - Auto-deploys on every push

#### Manual Deployment (CLI)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

### Option 3: GitHub Pages

#### Setup

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/repository-name"
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/repository-name/',  // Your repo name
     // ...
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**
   - Go to repository settings
   - Pages > Source > gh-pages branch
   - Save

---

### Option 4: Docker

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

#### Build and Run

```bash
# Build image
docker build -t rick-morty-app .

# Run container
docker run -p 8080:80 rick-morty-app
```

---

## Environment Variables

### Required Variables

```env
VITE_API_GRAPHQL_ENDPOINT=https://rickandmortyapi.com/graphql
```

### Optional Variables

```env
VITE_APP_NAME=Rick and Morty Explorer
VITE_ENABLE_PWA=true
```

### Platform-Specific Setup

**Vercel:**
- Add in Project Settings > Environment Variables

**Netlify:**
- Add in Site Settings > Build & deploy > Environment

**GitHub Actions:**
```yaml
env:
  VITE_API_GRAPHQL_ENDPOINT: https://rickandmortyapi.com/graphql
```

**Docker:**
- Use build args or runtime env injection

---

## Custom Domain

### Vercel

1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS:
   ```
   CNAME: your-domain.com -> cname.vercel-dns.com
   ```

### Netlify

1. Go to Domain Settings
2. Add custom domain
3. Update DNS:
   ```
   CNAME: your-domain.com -> [your-site].netlify.app
   ```

---

## Performance Optimization

### 1. Enable Compression

Most platforms enable this by default. For custom servers:

**nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_vary on;
```

### 2. Set Cache Headers

```nginx
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /index.html {
    add_header Cache-Control "no-cache";
}
```

### 3. CDN Configuration

Vercel and Netlify include CDN by default.

For custom setup, consider:
- Cloudflare
- AWS CloudFront
- Fastly

---

## Monitoring & Analytics

### 1. Web Vitals

Add to `src/main.tsx`:

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics endpoint
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 2. Error Tracking

Consider integrating:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Full monitoring

### 3. Analytics

Add Google Analytics, Plausible, or similar:

```html
<!-- public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## Security Headers

### Recommended Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://rickandmortyapi.com;";
```

**Vercel** - Add `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        }
      ]
    }
  ]
}
```

---

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:run
      
      - name: Type check
        run: npm run type-check
      
      - name: Build
        run: npm run build
        env:
          VITE_API_GRAPHQL_ENDPOINT: ${{ secrets.API_ENDPOINT }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Rollback Strategy

### Vercel
- Go to Deployments
- Find previous working deployment
- Click "Promote to Production"

### Netlify
- Go to Deploys
- Find previous deploy
- Click "Publish deploy"

### Git-Based
```bash
git revert HEAD
git push
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check types
npm run type-check

# Check for errors
npm run build
```

### 404 on Routes

**Problem:** Direct URLs return 404

**Solution:** Configure redirects

**Vercel** - `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify** - `public/_redirects`:
```
/*    /index.html   200
```

### Environment Variables Not Working

**Problem:** `import.meta.env` returns undefined

**Solutions:**
1. Restart dev server after changing `.env`
2. Ensure variables start with `VITE_`
3. Check platform-specific env setup

### CORS Errors in Production

**Problem:** API requests blocked

**Solution:** Verify `apollo.config.ts`:
```typescript
fetchOptions: {
  mode: 'cors',
},
```

---

## Checklist

Before deploying to production:

- [ ] All tests passing (`npm run test:run`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] Preview build locally (`npm run preview`)
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Security headers set
- [ ] Cache policies configured
- [ ] Domain configured (if custom)
- [ ] Rollback strategy in place

---

## Post-Deployment

1. **Test Production**
   - Visit site
   - Test main flows
   - Check console for errors
   - Verify API calls work

2. **Monitor**
   - Check error tracking
   - Review web vitals
   - Monitor analytics

3. **Optimize**
   - Review Lighthouse score
   - Check bundle size
   - Optimize images if needed

---

**Last Updated:** 2026-02-06  
**Platforms Tested:** Vercel, Netlify, GitHub Pages
