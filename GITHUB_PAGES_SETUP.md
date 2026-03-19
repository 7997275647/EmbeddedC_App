# 🚀 Deploy to GitHub Pages

This guide walks you through deploying EmbeddedC learning platform to GitHub Pages using JDoodle online compiler API.

## Prerequisites

1. **GitHub Account** - [Create one](https://github.com/signup) if you don't have one
2. **JDoodle Free Account** - [Sign up here](https://www.jdoodle.com/compiler-api/)
3. **Git** - To push code to GitHub

## Step 1: Get JDoodle API Credentials

1. Go to [JDoodle Compiler API](https://www.jdoodle.com/compiler-api/)
2. Sign up for a free account
3. Navigate to your **Client ID** and **Client Secret**
4. Copy both values

## Step 2: Update API Configuration

Edit `js/api-validator.js` and replace the placeholders:

```javascript
const JDOODLE_CONFIG = {
  clientId: 'YOUR_ACTUAL_CLIENT_ID_HERE',     // Paste your ID
  clientSecret: 'YOUR_ACTUAL_CLIENT_SECRET_HERE',  // Paste your secret
  apiUrl: 'https://api.jdoodle.com/v1/execute'
};
```

**Security Note:** 
- For public repositories, consider using environment variables
- These credentials are only used client-side (in browser), so exposure risk is moderate
- Create separate credentials just for this project if concerned

## Step 3: Create GitHub Repository

### If you already have a remote repository:

```bash
cd "c:\Users\modug\OneDrive\Desktop\GitHub\EmbeddedC_App"
git add .
git commit -m "chore: update to use JDoodle API for GitHub Pages deployment"
git push origin main
```

### If creating a new repository:

1. Go to [GitHub](https://github.com/new)
2. Create repository named `EmbeddedC_App` (or any name)
3. Make it **public** (required for GitHub Pages free tier)
4. Copy the HTTPS URL
5. Run:

```bash
cd "c:\Users\modug\OneDrive\Desktop\GitHub\EmbeddedC_App"
git init
git add .
git commit -m "initial commit: EmbeddedC learning platform"
git remote add origin https://github.com/YOUR_USERNAME/EmbeddedC_App.git
git branch -M main
git push -u origin main
```

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

GitHub will automatically run the deployment workflow.

## Step 5: Wait for Deployment

- **Automatic Workflow**: `.github/workflows/deploy.yml` runs automatically when you push
- **Status**: Check **Actions** tab to see deployment progress
- **URL**: Your app will be available at:
  ```
  https://YOUR_USERNAME.github.io/EmbeddedC_App/
  ```

## Step 6: Test Your App

1. Open the GitHub Pages URL in your browser
2. Try submitting code for Level 1
3. It should compile and run on JDoodle's servers

## Verify Everything Works

### Test Level 1

```c
#include <stdio.h>
int main() {
    printf("Hello, Embedded World!\n");
    return 0;
}
```

**Expected:** ✅ Success with output "Hello, Embedded World!"

### If It Doesn't Work

**"Compilation/Runtime Error" appears:**
- Check your JDoodle credentials are correct
- Verify API response in browser console (F12 → Console tab)
- Make sure you completed Step 1 (JDoodle account)

**"Validation Error" appears:**
- Check internet connection
- Ensure JDoodle API is not rate-limited (free tier has limits)
- Wait a few minutes and try again

**GitHub Pages won't deploy:**
- Check **Actions** tab for workflow errors
- Ensure `.github/workflows/deploy.yml` exists
- Verify branch is `main`

## What Gets Deployed

✅ **Deployed to GitHub Pages:**
- `index.html`
- `css/styles.css`
- `js/` (all JavaScript files)
- Assets and static files

❌ **NOT deployed:**
- `server.js` - No longer needed (JDoodle is the backend)
- `package.json` - Node.js not used
- `node_modules/` - Excluded via workflow
- `.github/` - Workflow files (excluded)

## Optional: Custom Domain

If you have a custom domain (e.g., `embeddedc.com`):

1. Edit `.github/workflows/deploy.yml`
2. Uncomment the `cname` line:
   ```yaml
   cname: embeddedc.com
   ```
3. Configure DNS to point to GitHub Pages IP addresses
4. See [GitHub Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details

## Updating Your App

To update the deployed version:

```bash
# Make changes to your files
# Then:
git add .
git commit -m "description of changes"
git push origin main
```

The workflow will automatically:
1. Detect the push
2. Run the deployment
3. Update your live site within seconds

## API Rate Limits

JDoodle free tier:
- **Requests per day**: Limited
- **Request timeout**: 5 seconds
- **Memory limit**: 256MB
- **CPU time**: 5 seconds

If you hit limits:
1. Wait a few hours for reset
2. Upgrade to JDoodle pro (paid)
3. Use alternative API (Wandbox, Judge0, etc.)

## Advanced: Switch to Different Compiler API

If you want to use a different online compiler:

1. **Wandbox** (supports many languages)
   - API: https://wandbox.org/api/
   - No authentication needed
   - Update `js/api-validator.js` to use their API

2. **Judge0** (powerful open-source)
   - API: https://judge0.com/
   - Has free tier with auth token
   - Update `js/api-validator.js` to use their API

The structure is set up to easily swap APIs.

## Troubleshooting

### Q: "Cannot GET /" error
**A:** Repository might be private or Pages not enabled. Check Settings → Pages

### Q: Code compiles locally but fails online
**A:** JDoodle might use different GCC version. Try simplifying code or check error message

### Q: "Validation Error: Failed to compile"
**A:** 
- Verify JDoodle credentials in `js/api-validator.js`
- Check browser console (F12) for detailed error
- Ensure code is valid C

### Q: App loads but no content appears
**A:** 
- Check browser console for JavaScript errors (F12 → Console)
- Verify all files loaded (Network tab)
- Ensure `.nojekyll` file exists

### Q: Changes not appearing after push
**A:**
- Check Actions tab for failed workflow
- Hard refresh browser (Ctrl+Shift+R)
- Wait 1-2 minutes for deployment to complete

## Security Notes

- JDoodle API credentials are embedded in JavaScript (client-side)
- This is generally safe since:
  - Credentials are only used from your domain
  - JDoodle would rate-limit abuse anyway
  - Would be replaced in production with proxy server
- For production, use a backend proxy to hide credentials

## Next Steps

1. ✅ Get JDoodle credentials
2. ✅ Update `js/api-validator.js`
3. ✅ Push to GitHub
4. ✅ Enable GitHub Pages
5. ✅ Share your link: `https://YOUR_USERNAME.github.io/EmbeddedC_App/`

## Questions?

- See [GitHub Pages Docs](https://docs.github.com/en/pages)
- Check [JDoodle API Docs](https://www.jdoodle.com/compiler-api/)
- Review [README.md](README.md) for project overview

---

Your app is now ready for the world! 🎉
