# 🧪 Manual Testing Guide for Cloudinary Migration

## Quick Verification Steps

### 1. Open the Website

Simply **double-click** on `index.html` in your file explorer. It will open in your default browser.

### 2. Visual Check ✓

Look for these key images on the homepage:

- ✅ **MACHA Logo** (top left) - Should be visible
- ✅ **Leadership Photos** - Director and managers
- ✅ **Campus Images** - Facilities and grounds
- ✅ **Gallery Carousel** - Student photos

### 3. Check All Pages

Open and verify images on each page:
- `index.html` - Homepage ✓
- `about.html` - About page ✓
- `academics.html` - Academics ✓
- `admissions.html` - Admissions ✓  
- `apply.html` - Application ✓
- `contact.html` - Contact + Hospital images ✓
- `gallery.html` - Photo gallery ✓
- `student-life.html` - Student life ✓

### 4. Browser Console Check

1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Look for errors:
   - ❌ **404 errors** = Broken image links
   - ✅ **No errors** = All images loading correctly

### 5. Network Tab Check

1. Press `F12` → **Network** tab
2. Reload the page (`Ctrl+R`)
3. Filter by **Img** 
4. Verify images load from:
   ```
   res.cloudinary.com/dn4dszfra
   ```

**What to look for:**
- Status: `200` (success) ✅
- Domain: `res.cloudinary.com` ✅
- Size: Files loading properly ✅

---

## Expected Results

### ✅ All Images Should Load From:
```
https://res.cloudinary.com/dn4dszfra/image/upload/v*/macha-school/
```

### ✅ Performance Benefits:
- Faster loading (CDN delivery)
- Images optimized automatically
- No local bandwidth usage

---

## Test Specific Images

### Logo (Homepage)
```html
<!-- Should see this URL in browser inspector -->
https://res.cloudinary.com/dn4dszfra/image/upload/v1770486530/macha-school/macha-school/logo_macha.png
```

### Hospital Images (Contact Page)
```html
<!-- Example hospital image URL -->
https://res.cloudinary.com/dn4dszfra/image/upload/v1770486618/macha-school/macha-school/Hospital/medical_center_01.jpg
```

### Gallery Images
```html
<!-- Gallery carousel images (16 total) -->
https://res.cloudinary.com/dn4dszfra/image/upload/v*/macha-school/macha-school/gallery_students_01.jpg
...through...
https://res.cloudinary.com/dn4dszfra/image/upload/v*/macha-school/macha-school/gallery_students_16.jpg
```

---

## Troubleshooting

### ❌ If Images Don't Load:

**Check 1: Internet Connection**
- Cloudinary requires internet to load
- Local images won't work offline anymore

**Check 2: Console Errors**
- If you see 404 errors, note which images
- Run retry script if needed

**Check 3: Rollback if Needed**
```bash
git restore *.html css/styles.css
```
This restores the backup files

---

## Performance Test

### Before vs After:

**Before (Local):**
- Loading from local disk
- Limited to your hosting server speed

**After (Cloudinary):**
- Loading from global CDN
- Automatic optimization
- Faster for international visitors

### Test Load Time:
1. Open Network tab (`F12`)
2. Reload page (`Ctrl+R`)
3. Look at **Load time** at bottom
4. Should be faster than before! ⚡

---

## ✅ Verification Checklist

- [ ] Homepage loads with logo visible
- [ ] All 8 pages open without broken images
- [ ] No 404 errors in browser console
- [ ] Images load from `res.cloudinary.com/dn4dszfra`
- [ ] Hospital images on contact page work
- [ ] Gallery carousel displays all 16 images
- [ ] Page loads faster than before

---

## 🎉 Success Indicators

If you see:
- ✅ All images displaying correctly
- ✅ No broken image icons
- ✅ No console errors
- ✅ Images loading from Cloudinary URLs

**Then the migration is successful!**

---

## Next Steps After Testing

Once verified:

1. **Commit Changes**
   ```bash
   git add -A
   git commit -m "Migrate images to Cloudinary CDN"
   git push
   ```

2. **Optional: Delete Local Images**
   - Keep backups first!
   - Free up ~40MB of space
   - Local images no longer needed

3. **Deploy to Production**
   - Push to your hosting
   - Website will now use Cloudinary globally!

---

## Support

If you encounter any issues:
1. Check the `migration_report.json` for details
2. Restore from `.backup` files if needed
3. Contact Cloudinary support if CDN issues
