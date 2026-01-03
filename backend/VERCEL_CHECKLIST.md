# Vercel Deployment Checklist

## ✅ Backend Deployment Fixes Applied

### 1. Serverless Compatibility
- ✅ Disabled background sync job in production (serverless doesn't support setInterval)
- ✅ MongoDB connection caching and pooling for cold starts
- ✅ Redis connection made optional and failsafe
- ✅ Proper initialization for serverless environment

### 2. Configuration Files
- ✅ `vercel.json` - Configured with proper serverless settings
- ✅ `package.json` - Added start script
- ✅ `.vercelignore` - Created to exclude unnecessary files
- ✅ `DEPLOYMENT.md` - Comprehensive deployment guide

### 3. Connection Handling
- ✅ MongoDB: Connection reuse and caching for serverless
- ✅ Redis: Graceful degradation when unavailable
- ✅ Timeout configurations optimized for serverless

### 4. Error Handling
- ✅ Global error handler properly configured
- ✅ Redis operations fail gracefully
- ✅ Database connection errors handled properly

## 📝 Before Deploying - Action Items

### Required Environment Variables in Vercel
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Optional Environment Variables
```
REDIS_URL=redis://...
BASE_URL=https://your-backend.vercel.app
JWT_EXPIRES_IN=1d
PORT=3000
```

### MongoDB Atlas Setup
- [ ] Whitelist Vercel IPs (or 0.0.0.0/0)
- [ ] Database user has proper permissions
- [ ] Connection string includes retryWrites=true&w=majority
- [ ] Network access configured

### Redis Setup (Optional)
- [ ] Using managed Redis service (Upstash recommended for serverless)
- [ ] Connection string configured
- [ ] Network access allowed

## 🚀 Deployment Commands

### Via Vercel CLI
```bash
cd backend
vercel --prod
```

### Via Git (Recommended)
```bash
git add .
git commit -m "Prepared backend for Vercel deployment"
git push origin main
```
Then connect repository in Vercel dashboard.

## 🔍 Post-Deployment Testing

### Test Endpoints
1. **Health Check**
   ```bash
   curl https://your-backend.vercel.app/
   ```

2. **Authentication**
   ```bash
   # Signup
   curl -X POST https://your-backend.vercel.app/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
   
   # Login
   curl -X POST https://your-backend.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **URL Shortening** (requires authentication)
   ```bash
   curl -X POST https://your-backend.vercel.app/api/create \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"fullUrl":"https://example.com","customShortUrl":"test"}'
   ```

## ⚠️ Known Limitations in Serverless

1. **No Background Jobs**
   - Click count sync job disabled
   - Solution: Use Vercel Cron Jobs or external scheduler

2. **Cold Starts**
   - First request may be slower (2-3 seconds)
   - Subsequent requests are fast due to connection caching

3. **Function Timeout**
   - 30 seconds on Hobby plan
   - 60 seconds on Pro plan

4. **Redis Optional**
   - App works without Redis but with reduced performance
   - All caching operations degrade gracefully

## 🎯 Next Steps After Backend Deployment

1. Note your backend URL from Vercel
2. Test all endpoints
3. Update frontend `VITE_API_URL` with backend URL
4. Deploy frontend to Vercel
5. Update `FRONTEND_URL` in backend env vars with frontend URL

## 📊 Monitoring

- Check Vercel dashboard for logs
- Monitor MongoDB Atlas metrics
- Watch for CORS issues with frontend
- Check function execution times

## 🐛 Common Issues

**Issue**: MongoDB connection timeout
**Solution**: Check Atlas IP whitelist and connection string

**Issue**: CORS errors
**Solution**: Add frontend URL to FRONTEND_URL env var

**Issue**: 500 errors on cold start
**Solution**: Normal for first request, subsequent should work

**Issue**: Redis errors in logs
**Solution**: Expected if Redis not configured, app continues normally

---

**Status**: ✅ Backend is ready for Vercel deployment!
