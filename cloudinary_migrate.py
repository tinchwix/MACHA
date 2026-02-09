#!/usr/bin/env python3
"""
Cloudinary Migration Script for MACHA School Website
Uploads all images to Cloudinary and updates HTML/CSS references
"""

import os
import sys
import json
from pathlib import Path
from typing import Dict, List, Tuple

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv is optional

# Check if cloudinary is installed
try:
    import cloudinary
    import cloudinary.uploader
    import cloudinary.api
except ImportError:
    print("ERROR: Cloudinary SDK not installed!")
    print("Please install it with: pip install cloudinary")
    sys.exit(1)

# Configuration
WEBSITE_DIR = Path(__file__).parent
IMAGES_DIR = WEBSITE_DIR / "assets" / "images"
CLOUDINARY_FOLDER = "macha-school"

HTML_FILES = [
    "index.html",
    "about.html",
    "academics.html",
    "admissions.html",
    "apply.html",
    "contact.html",
    "gallery.html",
    "student-life.html"
]

CSS_FILES = [
    "css/styles.css"
]

def setup_cloudinary():
    """Setup Cloudinary configuration from environment variables"""
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")
    
    if not all([cloud_name, api_key, api_secret]):
        print("\n" + "="*60)
        print("CLOUDINARY CREDENTIALS REQUIRED")
        print("="*60)
        print("\nPlease set the following environment variables:")
        print("  CLOUDINARY_CLOUD_NAME")
        print("  CLOUDINARY_API_KEY")
        print("  CLOUDINARY_API_SECRET")
        print("\nOr create a .env file with these values.")
        print("\nGet your credentials from: https://cloudinary.com/console")
        print("="*60 + "\n")
        sys.exit(1)
    
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True
    )
    
    return cloud_name

def get_all_images() -> List[Tuple[Path, str]]:
    """Get all image files and their relative paths"""
    images = []
    
    for img_path in IMAGES_DIR.rglob("*"):
        if img_path.is_file() and img_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.jfif']:
            # Get relative path from images directory
            rel_path = img_path.relative_to(IMAGES_DIR)
            images.append((img_path, str(rel_path).replace("\\", "/")))
    
    return images

def upload_images(dry_run=False) -> Dict[str, str]:
    """Upload all images to Cloudinary"""
    images = get_all_images()
    results = {
        'uploaded': [],
        'skipped': [],
        'errors': []
    }
    url_mapping = {}
    
    print(f"\n[UPLOAD] Found {len(images)} images to upload")
    
    for img_path, rel_path in images:
        # Create public_id: macha-school/logo_macha.png or macha-school/Hospital/medical_center_01.jpg
        public_id = f"{CLOUDINARY_FOLDER}/{rel_path}"
        
        # Remove extension for public_id
        public_id_without_ext = os.path.splitext(public_id)[0]
        
        try:
            if dry_run:
                print(f"[DRY RUN] Would upload: {rel_path} -> {public_id}")
                # Simulate Cloudinary URL
                cloudinary_url = f"https://res.cloudinary.com/CLOUD_NAME/image/upload/{public_id}"
                results['uploaded'].append(rel_path)
            else:
                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    str(img_path),
                    public_id=public_id_without_ext,
                    folder="",  # Folder is already in public_id
                    overwrite=True,
                    resource_type="image"
                )
                
                cloudinary_url = upload_result['secure_url']
                print(f"[OK] Uploaded: {rel_path}")
                print(f"     URL: {cloudinary_url}")
                results['uploaded'].append(rel_path)
            
            # Store mapping for URL replacement
            url_mapping[f"assets/images/{rel_path}"] = cloudinary_url
            
        except Exception as e:
            error_msg = f"Error uploading {rel_path}: {str(e)}"
            print(f"[ERROR] {error_msg}")
            results['errors'].append(error_msg)
    
    return results, url_mapping

def update_html_files(url_mapping: Dict[str, str], dry_run=False) -> Dict:
    """Update image references in HTML files"""
    results = {
        'updated': [],
        'errors': []
    }
    
    for html_file in HTML_FILES:
        file_path = WEBSITE_DIR / html_file
        
        if not file_path.exists():
            results['errors'].append(f"File not found: {html_file}")
            continue
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            changes_count = 0
            
            # Replace all image references
            for local_path, cloudinary_url in url_mapping.items():
                if local_path in content:
                    count = content.count(local_path)
                    content = content.replace(local_path, cloudinary_url)
                    changes_count += count
            
            if content != original_content:
                if dry_run:
                    print(f"[DRY RUN] Would update {html_file}: {changes_count} references")
                    results['updated'].append((html_file, changes_count))
                else:
                    # Create backup
                    backup_path = file_path.with_suffix('.html.backup')
                    with open(backup_path, 'w', encoding='utf-8') as f:
                        f.write(original_content)
                    
                    # Write updated content
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    print(f"[OK] Updated {html_file}: {changes_count} references")
                    results['updated'].append((html_file, changes_count))
        
        except Exception as e:
            results['errors'].append(f"Error updating {html_file}: {str(e)}")
    
    return results

def update_css_files(url_mapping: Dict[str, str], dry_run=False) -> Dict:
    """Update image references in CSS files"""
    results = {
        'updated': [],
        'errors': []
    }
    
    for css_file in CSS_FILES:
        file_path = WEBSITE_DIR / css_file
        
        if not file_path.exists():
            results['errors'].append(f"File not found: {css_file}")
            continue
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            changes_count = 0
            
            # Replace all image references (handle both ../assets/images and assets/images)
            for local_path, cloudinary_url in url_mapping.items():
                # Try different variations
                variations = [
                    local_path,
                    f"../{local_path}",
                    local_path.replace("assets/images/", "../images/")
                ]
                
                for variant in variations:
                    if variant in content:
                        content = content.replace(variant, cloudinary_url)
                        changes_count += 1
            
            if content != original_content:
                if dry_run:
                    print(f"[DRY RUN] Would update {css_file}: {changes_count} references")
                    results['updated'].append((css_file, changes_count))
                else:
                    # Create backup
                    backup_path = file_path.with_suffix('.css.backup')
                    with open(backup_path, 'w', encoding='utf-8') as f:
                        f.write(original_content)
                    
                    # Write updated content
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    print(f"[OK] Updated {css_file}: {changes_count} references")
                    results['updated'].append((css_file, changes_count))
        
        except Exception as e:
            results['errors'].append(f"Error updating {css_file}: {str(e)}")
    
    return results

def save_migration_report(upload_results, html_results, css_results, url_mapping):
    """Save migration report to JSON file"""
    report = {
        'upload': upload_results,
        'html_updates': {
            'files': [{'file': f, 'changes': c} for f, c in html_results['updated']],
            'errors': html_results['errors']
        },
        'css_updates': {
            'files': [{'file': f, 'changes': c} for f, c in css_results['updated']],
            'errors': css_results['errors']
        },
        'url_mapping': url_mapping
    }
    
    report_path = WEBSITE_DIR / "migration_report.json"
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n[REPORT] Migration report saved to: migration_report.json")

def print_summary(upload_results, html_results, css_results):
    """Print summary of migration"""
    print("\n" + "="*60)
    print("MIGRATION SUMMARY")
    print("="*60)
    
    print(f"\n[IMAGES] UPLOADED: {len(upload_results['uploaded'])}")
    if upload_results['uploaded'][:5]:
        for img in upload_results['uploaded'][:5]:
            print(f"  * {img}")
        if len(upload_results['uploaded']) > 5:
            print(f"  ... and {len(upload_results['uploaded']) - 5} more")
    
    print(f"\n[HTML] FILES UPDATED: {len(html_results['updated'])}")
    for file, count in html_results['updated']:
        print(f"  * {file}: {count} references")
    
    print(f"\n[CSS] FILES UPDATED: {len(css_results['updated'])}")
    for file, count in css_results['updated']:
        print(f"  * {file}: {count} references")
    
    all_errors = upload_results['errors'] + html_results['errors'] + css_results['errors']
    if all_errors:
        print(f"\n[ERRORS]: {len(all_errors)}")
        for error in all_errors:
            print(f"  * {error}")
    else:
        print("\n[SUCCESS] NO ERRORS")
    
    print("\n" + "="*60)

def main():
    """Main execution function"""
    # Parse arguments
    dry_run = "--dry-run" in sys.argv
    upload_only = "--upload-only" in sys.argv
    update_only = "--update-urls" in sys.argv
    
    if dry_run:
        print("[DRY RUN] MODE - No changes will be made\n")
    else:
        print("[EXECUTE] CLOUDINARY MIGRATION\n")
    
    # Setup Cloudinary
    cloud_name = setup_cloudinary()
    print(f"[CONFIG] Connected to Cloudinary: {cloud_name}\n")
    
    url_mapping = {}
    upload_results = {'uploaded': [], 'skipped': [], 'errors': []}
    
    # Step 1: Upload images (unless update-only)
    if not update_only:
        print("[UPLOAD] Starting image upload to Cloudinary...")
        upload_results, url_mapping = upload_images(dry_run)
    else:
        # Load URL mapping from previous migration
        report_path = WEBSITE_DIR / "migration_report.json"
        if report_path.exists():
            with open(report_path, 'r') as f:
                report = json.load(f)
                url_mapping = report.get('url_mapping', {})
            print(f"[INFO] Loaded {len(url_mapping)} URL mappings from previous migration")
        else:
            print("[ERROR] No previous migration report found. Run upload first.")
            sys.exit(1)
    
    html_results = {'updated': [], 'errors': []}
    css_results = {'updated': [], 'errors': []}
    
    # Step 2: Update HTML/CSS files (unless upload-only)
    if not upload_only:
        print("\n[HTML] Updating HTML files...")
        html_results = update_html_files(url_mapping, dry_run)
        
        print("\n[CSS] Updating CSS files...")
        css_results = update_css_files(url_mapping, dry_run)
    
    # Save report
    if not dry_run and url_mapping:
        save_migration_report(upload_results, html_results, css_results, url_mapping)
    
    # Print summary
    print_summary(upload_results, html_results, css_results)
    
    if dry_run:
        print("\n[INFO] To execute the migration, run: py cloudinary_migrate.py")
    else:
        print("\n[SUCCESS] Cloudinary migration completed!")
        print("[INFO] Backup files created with .backup extension")
        print("[INFO] Test your website and commit changes when ready!")

if __name__ == "__main__":
    main()
