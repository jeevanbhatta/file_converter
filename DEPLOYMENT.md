# 🚀 Deployment Guide

This guide will help you deploy the File Converter app to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Node.js and npm installed

## Step-by-Step Deployment

### 1. Update Configuration

Before deploying, update the `base` path in `vite.config.js` to match your GitHub repository name:

```js
export default defineConfig({
  base: '/YOUR_REPOSITORY_NAME/', // Change this!
  // ... rest of config
})
```

For example, if your repo is `https://github.com/username/my-converter`, set:

```js
base: '/my-converter/',
```

### 2. Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: File Converter app"
```

### 3. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the "+" icon → "New repository"
3. Name it (e.g., `file-converter`)
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### 4. Push to GitHub

```bash
# Add remote origin (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 5. Enable GitHub Actions Deployment

#### Option A: Automatic Deployment (Recommended)

1. Go to your repository on GitHub
2. Click **Settings**
3. Click **Pages** in the left sidebar
4. Under **Source**, select **"GitHub Actions"**
5. The workflow will automatically trigger and deploy your app
6. Wait 2-3 minutes for the deployment to complete
7. Your app will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

#### Option B: Manual Deployment with gh-pages

```bash
# Install gh-pages (if not already installed)
npm install

# Deploy
npm run deploy
```

This will build your app and push it to the `gh-pages` branch.

Then enable GitHub Pages:
1. Go to repository **Settings** → **Pages**
2. Set **Source** to "Deploy from a branch"
3. Set **Branch** to `gh-pages` and folder to `/ (root)`
4. Click **Save**

### 6. Verify Deployment

1. Go to your repository **Settings** → **Pages**
2. You should see: "Your site is live at https://..."
3. Click the link to open your app

If you see 404 errors:
- Make sure the `base` path in `vite.config.js` is correct
- Wait a few minutes for GitHub Pages to propagate
- Check the **Actions** tab for any deployment errors

## Automatic Deployments

With the GitHub Actions workflow (`.github/workflows/deploy.yml`), your app will automatically redeploy whenever you push to the `main` branch:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# GitHub Actions will automatically rebuild and deploy!
```

## Custom Domain (Optional)

Want to use a custom domain like `converter.yourdomain.com`?

1. Buy a domain from a registrar (Namecheap, Google Domains, etc.)
2. Add a `CNAME` file to the `public/` directory with your domain:
   ```
   converter.yourdomain.com
   ```
3. Configure DNS with your registrar:
   - Add a `CNAME` record pointing to `YOUR_USERNAME.github.io`
4. In GitHub repository **Settings** → **Pages**, enter your custom domain
5. Enable "Enforce HTTPS"

## Troubleshooting

### 404 Error on Refresh

If you get 404 errors when refreshing on routes other than home:

Add a `public/404.html` that redirects to `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>File Converter</title>
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/'">
  </head>
</html>
```

### Assets Not Loading

Make sure:
1. `base` in `vite.config.js` ends with `/`
2. All asset imports use relative paths
3. Clear your browser cache

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building locally
npm run build
```

### Deployment Failed in GitHub Actions

Check the **Actions** tab in your repository:
1. Click on the failed workflow
2. Check the error logs
3. Common issues:
   - Node version mismatch (set to 20 in workflow)
   - Missing dependencies (check package.json)
   - Build errors (fix locally first)

## Local Testing of Production Build

Always test the production build locally before deploying:

```bash
# Build
npm run build

# Preview
npm run preview
```

Open the preview URL and test all features.

## Environment Variables

If you need environment variables:

1. Create `.env` file (already in `.gitignore`):
   ```
   VITE_API_KEY=your_key_here
   ```

2. Access in code:
   ```js
   const apiKey = import.meta.env.VITE_API_KEY;
   ```

3. For GitHub Actions, add secrets in repository **Settings** → **Secrets**

## Monitoring

Track your deployments:

1. **GitHub Actions**: Repository → **Actions** tab
2. **GitHub Pages**: Repository → **Settings** → **Pages**
3. **Analytics**: Add Google Analytics or Plausible (privacy-friendly)

## Updating the App

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# That's it! GitHub Actions will deploy automatically
```

Or manually:

```bash
npm run deploy
```

## Rolling Back

If a deployment breaks:

```bash
# Revert to previous commit
git revert HEAD
git push

# Or reset to a specific commit
git reset --hard <commit-hash>
git push --force
```

## Multiple Environments

Want staging and production?

1. Create a `develop` branch for staging
2. Add another workflow for staging:

```yaml
# .github/workflows/staging.yml
on:
  push:
    branches:
      - develop
# ... same as deploy.yml but deploy to different path
```

## Need Help?

- 📖 [GitHub Pages Documentation](https://docs.github.com/en/pages)
- 📖 [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- 🐛 [Open an Issue](https://github.com/jeevanbhatta/file_converter/issues)

---

Happy deploying! 🎉

