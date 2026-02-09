# Cloudinary Migration - Setup Instructions

## Step 1: Get Cloudinary Credentials

1. Sign up for free at: https://cloudinary.com/users/register/free
2. Go to your Dashboard: https://cloudinary.com/console
3. Copy your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 2: Install Cloudinary SDK

```bash
pip install cloudinary python-dotenv
```

## Step 3: Configure Credentials

### Option A: Environment Variables (Recommended)

Create a `.env` file in the project root:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Then install python-dotenv to load it:
```bash
pip install python-dotenv
```

And add this to the top of cloudinary_migrate.py:
```python
from dotenv import load_dotenv
load_dotenv()
```

### Option B: Set Environment Variables Directly

**Windows PowerShell:**
```powershell
$env:CLOUDINARY_CLOUD_NAME="your_cloud_name"
$env:CLOUDINARY_API_KEY="your_api_key"
$env:CLOUDINARY_API_SECRET="your_api_secret"
```

**Windows CMD:**
```cmd
set CLOUDINARY_CLOUD_NAME=your_cloud_name
set CLOUDINARY_API_KEY=your_api_key
set CLOUDINARY_API_SECRET=your_api_secret
```

## Step 4: Run Migration

### Dry Run (Preview Only)
```bash
py cloudinary_migrate.py --dry-run
```

### Upload Images Only
```bash
py cloudinary_migrate.py --upload-only
```

### Update URLs Only (after upload)
```bash
py cloudinary_migrate.py --update-urls
```

### Full Migration (Upload + Update)
```bash
py cloudinary_migrate.py
```

## Step 5: Verify

1. Open your website in a browser
2. Check all pages for images
3. Open browser DevTools > Network tab
4. Verify images load from Cloudinary CDN
5. Check console for any 404 errors

## Rollback (if needed)

If something goes wrong:

```bash
git restore *.html css/styles.css
```

Or restore from backup files:
```bash
# Backup files are created with .backup extension
# e.g., index.html.backup, styles.css.backup
```

## Tips

- Free tier includes 25GB storage and 25GB monthly bandwidth
- Images are automatically optimized by Cloudinary
- You can delete local images after successful migration (keep backups!)
- The script maintains the Hospital subfolder structure
