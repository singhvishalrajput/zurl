# Frontend Vercel Deployment Checklist

## ✅ Frontend Deployment Fixes Applied

### 1. Environment Variable Configuration
- ✅ Replaced hard-coded `localhost:3000` with `import.meta.env.VITE_API_URL`
- ✅ Created `.env.example` with documentation
- ✅ Created `.env.local` for local development
- ✅ Configured axios to use environment variables

### 2. Vite Configuration Improvements
- ✅ Added path aliases (`@` → `./src`)
- ✅ Configured build output directory (`dist`)
- ✅ Disabled source maps for production
- ✅ Implemented code splitting (react-vendor, ui-vendor)
- ✅ Set server port to 5174

### 3. Vercel Configuration
- ✅ Created `vercel.json` for SPA routing
- ✅ Configured rewrites for client-side routing
- ✅ Added cache headers for static assets (1 year)
- ✅ Created `.vercelignore` to exclude unnecessary files

### 4. Documentation
- ✅ Created comprehensive `DEPLOYMENT.md`
- ✅ Created this checklist

---

## 📝 Before Deploying - Action Items

### Required Environment Variables in Vercel
```
VITE_API_URL=https://your-backend.vercel.app
```

### Verify Backend is Ready
- [ ] Backend is deployed to Vercel
- [ ] Backend URL is accessible
- [ ] Backend has frontend URL in `FRONTEND_URL` env var
- [ ] Backend CORS is properly configured

---

## 🚀 Deployment Options

### Option 1: Vercel CLI (Quick)
```bash
cd frontend
vercel --prod
```

### Option 2: Git Integration (Recommended)
```bash
git add .
git commit -m "Prepared frontend for Vercel deployment"
git push origin main
```
Then connect repository in Vercel dashboard.

### Option 3: Vercel Dashboard (Manual)
1. Import project from Git
2. Set root directory to `frontend`
3. Configure environment variable: `VITE_API_URL`
4. Deploy

---

## 🔍 Post-Deployment Testing

### 1. Basic Functionality
```bash
# Visit your frontend URL
https://your-frontend.vercel.app
```

- [ ] Home page loads correctly
- [ ] Navigation works
- [ ] All routes are accessible

### 2. Authentication Flow
- [ ] Can access signup page
- [ ] Can create new account
- [ ] Can login with credentials
- [ ] Auth token/cookie is set
- [ ] Protected routes work after login

### 3. URL Shortening
- [ ] Can create new short URL
- [ ] Short URL appears in dashboard
- [ ] Can copy short URL
- [ ] Short URL redirects correctly
- [ ] Click count updates

### 4. Cross-Origin Requests
- [ ] API calls succeed (check Network tab)
- [ ] No CORS errors in console
- [ ] Cookies are sent with requests

---

## ⚠️ Common Issues & Quick Fixes

### Issue: API calls return 404
**Fix**: Check `VITE_API_URL` is set correctly in Vercel

### Issue: CORS errors
**Fix**: Add frontend URL to backend's `FRONTEND_URL` env var

### Issue: Routes show 404
**Fix**: `vercel.json` should handle this (already configured)

### Issue: Environment variable not working
**Fix**: Redeploy after setting env vars (they're baked into build)

---

## 🎯 Post-Deployment Updates

### Update Backend Environment Variable
After frontend deployment, add frontend URL to backend:

1. Go to Backend Vercel Project
2. Settings → Environment Variables
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=http://localhost:5174,https://your-frontend.vercel.app
   ```
4. Redeploy backend

---

## 📊 Files Changed/Created

### Modified Files:
1. **src/utils/axiosinstance.js**
   - Changed: `baseURL: 'http://localhost:3000'`
   - To: `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'`

2. **vite.config.js**
   - Added: Path aliases
   - Added: Build optimizations
   - Added: Code splitting configuration

### New Files Created:
1. **`.env.example`** - Template for environment variables
2. **`.env.local`** - Local development environment variables
3. **`vercel.json`** - Vercel configuration for SPA routing
4. **`.vercelignore`** - Files to exclude from deployment
5. **`DEPLOYMENT.md`** - Comprehensive deployment guide
6. **`VERCEL_CHECKLIST.md`** - This file

---

## 🔐 Environment Variables

### Development (`.env.local`)
```env
VITE_API_URL=http://localhost:3000
```

### Production (Vercel Dashboard)
```env
VITE_API_URL=https://your-backend.vercel.app
```

**Important**: 
- Env vars must start with `VITE_` to be accessible
- They are embedded at build time
- Changing them requires redeployment

---

## 🏗️ Build Configuration

### Build Command
```bash
npm run build
```

### Output Directory
```
dist/
```

### Build Optimizations Applied:
- ✅ Code splitting by vendor
- ✅ Tree shaking for unused code
- ✅ Minification and compression
- ✅ Asset hashing for cache busting
- ✅ Source maps disabled

---

## 📈 Performance Features

### Code Splitting
- `react-vendor.js` - React core libraries (~150KB)
- `ui-vendor.js` - UI component libraries (~80KB)
- Automatic splitting for route components

### Caching Strategy
- Static assets: 1 year cache
- HTML: No cache (always fresh)
- JS/CSS: Hashed filenames for cache busting

### Bundle Size Expectations
- Initial load: ~250-300KB (gzipped)
- Lazy-loaded routes: ~50-100KB each

---

## 🧪 Local Testing

### Test Production Build Locally
```bash
# Build the project
npm run build

# Preview production build
npm run preview

# Visit http://localhost:4173
```

This ensures your production build works before deploying.

---

## 🔄 Deployment Workflow

### For Future Updates:

1. **Make Changes Locally**
   ```bash
   # Make code changes
   # Test locally
   npm run dev
   ```

2. **Test Production Build**
   ```bash
   npm run build
   npm run preview
   ```

3. **Commit and Push**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

4. **Automatic Deployment**
   - Vercel automatically builds and deploys
   - Check deployment status in dashboard
   - Test deployed changes

---

## 🎉 Deployment Complete When:

- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] Backend `FRONTEND_URL` updated
- [ ] All authentication flows work
- [ ] URL shortening works end-to-end
- [ ] No console errors
- [ ] No CORS issues
- [ ] Performance is acceptable (< 3s load time)

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev
- **React Router**: https://reactrouter.com
- **TailwindCSS**: https://tailwindcss.com

---

## ⏭️ Next Steps

1. Deploy frontend to Vercel
2. Update backend CORS settings
3. Test end-to-end functionality
4. Monitor performance metrics
5. Consider adding:
   - Analytics (Google Analytics, Plausible)
   - Error tracking (Sentry)
   - Performance monitoring
   - Custom domain

---

**Status**: ✅ Frontend is ready for Vercel deployment!

**Deployment Command**: `cd frontend && vercel --prod`
