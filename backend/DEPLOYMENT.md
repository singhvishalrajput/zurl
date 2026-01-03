# Backend Deployment Guide for Vercel

## Pre-deployment Checklist

### 1. Environment Variables Setup
Before deploying, make sure you have the following environment variables configured in Vercel:

**Required:**
- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `FRONTEND_URL` - Your frontend URL (comma-separated for multiple origins)
- `NODE_ENV` - Set to `production`

**Optional (but recommended):**
- `REDIS_URL` - Redis connection string (app will work without it, but with reduced performance)
- `BASE_URL` - Your backend URL on Vercel
- `JWT_EXPIRES_IN` - JWT token expiration time (default: 1d)

### 2. MongoDB Atlas Configuration
Ensure your MongoDB Atlas is configured properly:
- Whitelist Vercel's IP addresses (or use `0.0.0.0/0` for all IPs)
- Enable connection pooling
- Use the connection string with `retryWrites=true&w=majority`

### 3. Redis Configuration (Optional)
If using Redis:
- Use a managed Redis service (Upstash, Redis Labs, etc.)
- Ensure it supports serverless/connection pooling
- The app will gracefully handle Redis unavailability

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the backend directory:
```bash
cd backend
vercel
```

4. Follow the prompts and configure your environment variables

### Option 2: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Connect your Git repository
4. Set the root directory to `backend`
5. Configure environment variables
6. Click "Deploy"

### Option 3: Deploy via Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Vercel will automatically detect the project settings from `vercel.json`
4. Configure environment variables in Vercel dashboard
5. Each push to your main branch will trigger automatic deployment

## Post-deployment

### Verify Deployment
1. Check the deployment logs in Vercel dashboard
2. Visit your backend URL (e.g., `https://your-backend.vercel.app`)
3. Test the health endpoint: `GET /`
4. Test authentication endpoints: `POST /api/auth/login`, `POST /api/auth/signup`
5. Test URL shortening: `POST /api/create`

### Monitor Performance
- Check Vercel Analytics for request metrics
- Monitor MongoDB Atlas for database performance
- Check Redis metrics if using Redis

## Important Notes for Serverless

### What's Changed for Serverless:
1. **No Background Jobs**: The click count sync job is disabled in production
   - In serverless, you can't run background processes
   - Consider using Vercel Cron Jobs or external schedulers for periodic tasks

2. **Connection Pooling**: MongoDB and Redis connections are cached and reused
   - Reduces cold start latency
   - Handles connection limits better

3. **Redis is Optional**: The app will work without Redis
   - All Redis operations fail gracefully
   - Performance is better with Redis but not required

4. **Timeout Limits**: Serverless functions have a 30-second timeout (on Hobby plan)
   - Upgrade to Pro plan for 60-second timeout if needed

### Recommended Improvements:
1. **Add Vercel Cron Jobs**: For periodic click count syncing
   - Create `/api/cron/sync-clicks` endpoint
   - Configure in `vercel.json`

2. **Use Edge Functions**: For faster response times
   - Consider using Vercel Edge Functions for redirect endpoint

3. **Enable Logging**: Use external logging service (Datadog, LogRocket, etc.)

## Troubleshooting

### Common Issues:

**1. MongoDB Connection Timeout**
- Check if MongoDB Atlas allows connections from Vercel IPs
- Verify connection string is correct
- Ensure network access is configured properly

**2. CORS Errors**
- Add your frontend URL to `FRONTEND_URL` environment variable
- Multiple URLs should be comma-separated

**3. JWT Token Issues**
- Verify `JWT_SECRET` is set in environment variables
- Check cookie settings in production

**4. Redis Connection Errors**
- Redis is optional, app will continue without it
- Check Redis service is accessible from Vercel
- Verify connection string format

**5. Function Timeout**
- Optimize database queries
- Add indexes to frequently queried fields
- Consider upgrading Vercel plan for longer timeouts

## Support
For issues, check Vercel deployment logs and MongoDB Atlas logs.
