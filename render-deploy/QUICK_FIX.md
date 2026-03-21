# Quick Fix: Task Runner Errors

## Issue
```
Error: Failed to connect to n8n task broker at 127.0.0.1:5679
Task runner connection attempt failed: invalid or expired grant token
```

## Solution (1 minute)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your web service: `youtube-automation-app-j19x`
3. Click **Environment** in left sidebar
4. Click **Add Environment Variable** (twice)

5. Add these two variables:
   ```
   N8N_RUNNERS_ENABLED=false
   EXECUTIONS_MODE=regular
   ```

6. Click **Save Changes**
7. Render will auto-deploy in 2-3 minutes

## Why This Works

n8n's latest version tries to use "task runners" for advanced features we don't need. This causes:
- 403 errors trying to connect to localhost:5679
- Invalid grant token errors
- Slower startup times

Setting `N8N_RUNNERS_ENABLED=false` disables this feature.

Our workflows use simple HTTP Request nodes that work perfectly without task runners.

## After Fix

- ✅ No more task runner errors
- ✅ Faster n8n startup
- ✅ All workflows work normally
- ✅ Database connections stable

Visit: https://youtube-automation-app-j19x.onrender.com/

Should load perfectly in 2-3 minutes! 🚀
