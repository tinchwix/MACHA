# 🚀 Quick Start: Cloudinary Migration

## ✅ Prerequisites Installed
- ✓ Cloudinary SDK
- ✓ Python dotenv

## 📋 3 Simple Steps

### 1️⃣ Get Your Cloudinary Credentials

Go to https://cloudinary.com/console and copy:
- Cloud Name
- API Key  
- API Secret

### 2️⃣ Create .env File

Copy `.env.example` to `.env` and fill in your credentials:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 3️⃣ Run Migration

```bash
# Preview what will happen (recommended first!)
py cloudinary_migrate.py --dry-run

# Execute the full migration
py cloudinary_migrate.py
```

## 🎉 Done!

The script will:
- ✅ Upload all 80 images to Cloudinary
- ✅ Update 73 references in 9 HTML files + CSS
- ✅ Create backup files (.backup extension)
- ✅ Generate migration_report.json

## 🔧 Advanced Options

```bash
# Upload only (don't update URLs yet)
py cloudinary_migrate.py --upload-only

# Update URLs only (after uploading somewhere else)
py cloudinary_migrate.py --update-urls

# Preview without making changes
py cloudinary_migrate.py --dry-run
```

## 🆘 Need Help?

See `CLOUDINARY_SETUP.md` for detailed instructions.

## ⏮️ Rollback

If something goes wrong:
```bash
git restore *.html css/styles.css
```
