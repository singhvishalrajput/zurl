# Frontend Deployment Guide for Vercel

## Pre-deployment Checklist

### 1. Environment Variables Setup
Before deploying, configure the following in Vercel:

**Required:**
- `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.vercel.app`)

### 2. Backend Deployment
Ensure your backend is already deployed and note the URL. You'll need this for the `VITE_API_URL` environment variable.

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI (if not already installed):
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the frontend directory:
```bash
cd frontend
vercel
```

4. Configure environment variable when prompted:
   - `VITE_API_URL`: Your backend URL

5. Deploy to production:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Connect your Git repository
4. Set the root directory to `frontend`
5. Framework Preset: `Vite`
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Configure environment variable:
   - `VITE_API_URL` = `https://your-backend.vercel.app`
9. Click "Deploy"

### Option 3: Deploy via Git Integration (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Vercel will automatically detect Vite settings
4. Configure environment variables in Vercel dashboard:
   - `VITE_API_URL` = `https://your-backend.vercel.app`
5. Each push to main branch triggers automatic deployment

## Post-deployment

### Update Backend CORS
After frontend deployment, update your backend environment variable:
- Add frontend URL to `FRONTEND_URL` in backend Vercel settings
- Example: `FRONTEND_URL=https://your-frontend.vercel.app`
- You may need to redeploy the backend for changes to take effect

### Verify Deployment
1. Visit your frontend URL (e.g., `https://your-frontend.vercel.app`)
2. Test user registration
3. Test user login
4. Test URL shortening
5. Test URL redirection
6. Check browser console for any errors

## Important Configuration

### 1. SPA Routing
The `vercel.json` file ensures all routes redirect to `index.html`, enabling client-side routing with React Router.

### 2. Asset Caching
Static assets in `/assets/` folder are cached for 1 year for optimal performance.

### 3. Environment Variables
- All Vite environment variables must start with `VITE_`
- They are embedded at build time
- Changing env vars requires redeployment

## Build Optimization

### Code Splitting
The build is configured to split code into chunks:
- `react-vendor`: React, React DOM, React Router
- `ui-vendor`: UI libraries (Lucide, Radix UI)
- Automatic chunk splitting for better caching

### Performance Features
- Source maps disabled in production (smaller bundle)
- Assets hashed for cache busting
- Automatic tree-shaking for unused code

## Testing Locally with Production Build

### Build the project:
```bash
npm run build
```

### Preview the production build:
```bash
npm run preview
```

This will serve the production build locally at `http://localhost:4173`

## Common Issues & Solutions

### Issue 1: API Calls Failing
**Symptom**: Network errors, CORS errors
**Solution**: 
- Verify `VITE_API_URL` is set correctly
- Check backend CORS allows your frontend URL
- Ensure backend is deployed and running

### Issue 2: Routes Not Working (404)
**Symptom**: Direct URLs show 404 error
**Solution**: 
- `vercel.json` is already configured for SPA routing
- If issue persists, check Vercel deployment settings

### Issue 3: Environment Variables Not Working
**Symptom**: Still using localhost URL
**Solution**: 
- Ensure variable name starts with `VITE_`
- Redeploy after setting environment variables
- Check Vercel dashboard for proper configuration

### Issue 4: Authentication Not Working
**Symptom**: Login/signup fails, cookies not set
**Solution**: 
- Ensure `withCredentials: true` in axios (already configured)
- Backend must set CORS credentials to true (already configured)
- Backend must include frontend URL in CORS origins

### Issue 5: Build Fails
**Symptom**: Deployment fails during build
**Solution**: 
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Test build locally first: `npm run build`

## Performance Optimization Tips

### 1. Image Optimization
```jsx
// Use Vercel's image optimization
import Image from 'next/image'
// Or optimize images before adding to project
```

### 2. Lazy Loading
```jsx
// Use React.lazy for route-based code splitting
const Dashboard = lazy(() => import('./pages/DashboardPage'));
```

### 3. Analytics
Enable Vercel Analytics:
- Go to Vercel Dashboard → Project → Analytics
- Add analytics script to track performance

## Security Best Practices

### 1. Environment Variables
- Never commit `.env.local` to Git
- Use Vercel dashboard to manage secrets
- Rotate sensitive keys regularly

### 2. HTTPS
- Vercel provides automatic HTTPS
- Ensure all API calls use HTTPS in production

### 3. Content Security Policy
Consider adding CSP headers in `vercel.json`:
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline'"
}
```

## Monitoring & Analytics

### Built-in Metrics
- Vercel automatically tracks:
  - Page load times
  - Core Web Vitals
  - Request counts
  - Bandwidth usage

### Custom Analytics
Consider adding:
- Google Analytics
- PostHog
- Mixpanel
- Sentry for error tracking

## Continuous Deployment

### Automatic Deployments
- Main branch → Production
- Other branches → Preview deployments
- Pull requests → Automatic preview

### Preview Deployments
Every git push creates a unique preview URL:
- Test changes before merging
- Share with team for review
- Automatic preview comments on PRs

## Custom Domain Setup

### Add Custom Domain
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `zurl.com`)
3. Update DNS records as instructed
4. Vercel automatically provisions SSL certificate

### DNS Configuration
```
A Record: 76.76.21.21
CNAME: cname.vercel-dns.com
```

## Troubleshooting Checklist

- [ ] Backend is deployed and accessible
- [ ] `VITE_API_URL` is set in Vercel
- [ ] Backend `FRONTEND_URL` includes frontend URL
- [ ] Build succeeds locally
- [ ] All dependencies are in `package.json`
- [ ] `.env.local` is in `.gitignore`
- [ ] CORS is properly configured on backend
- [ ] Routes work with `vercel.json` SPA config

## Next Steps After Deployment

1. ✅ Test all features end-to-end
2. ✅ Monitor performance in Vercel dashboard
3. ✅ Set up custom domain (optional)
4. ✅ Enable analytics (optional)
5. ✅ Add error tracking (recommended)
6. ✅ Document deployment process for team

## Support

- Vercel Documentation: https://vercel.com/docs
- Vite Documentation: https://vitejs.dev
- React Router: https://reactrouter.com

---

**Status**: ✅ Frontend is ready for Vercel deployment!
