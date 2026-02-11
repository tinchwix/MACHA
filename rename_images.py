#!/usr/bin/env python3
"""
Image Renaming Script for MACHA School Website
Renames images and updates all references in HTML and CSS files
"""

import json
import os
import shutil
import sys
from pathlib import Path
import re

# Configuration
WEBSITE_DIR = Path(__file__).parent
IMAGES_DIR = WEBSITE_DIR / "assets" / "images"
CONFIG_FILE = WEBSITE_DIR / "rename_config.json"
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

def load_config():
    """Load the renaming configuration"""
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def rename_files(mappings, dry_run=False):
    """Rename image files according to the mapping"""
    results = {
        'renamed': [],
        'skipped': [],
        'errors': []
    }
    
    for old_name, new_name in mappings.items():
        old_path = IMAGES_DIR / old_name
        new_path = IMAGES_DIR / new_name
        
        if not old_path.exists():
            results['skipped'].append(f"File not found: {old_name}")
            continue
        
        if new_path.exists() and old_path != new_path:
            results['errors'].append(f"Target already exists: {new_name}")
            continue
        
        try:
            if dry_run:
                print(f"[DRY RUN] Would rename: {old_name} -> {new_name}")
                results['renamed'].append((old_name, new_name))
            else:
                shutil.move(str(old_path), str(new_path))
                print(f"[OK] Renamed: {old_name} -> {new_name}")
                results['renamed'].append((old_name, new_name))
        except Exception as e:
            results['errors'].append(f"Error renaming {old_name}: {str(e)}")
    
    return results

def update_html_files(mappings, dry_run=False):
    """Update image references in HTML files"""
    results = {
        'updated': [],
        'errors': []
    }
    
    for html_file in HTML_FILES:
        file_path = WEBSITE_DIR / html_file
        
        if not file_path.exists():
            results['errors'].append(f"HTML file not found: {html_file}")
            continue
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            changes_count = 0
            
            # Replace all image references
            for old_name, new_name in mappings.items():
                # Match both with and without 'assets/images/' prefix
                old_pattern = f"assets/images/{old_name}"
                new_pattern = f"assets/images/{new_name}"
                
                if old_pattern in content:
                    content = content.replace(old_pattern, new_pattern)
                    changes_count += content.count(new_pattern) - original_content.count(new_pattern)
            
            if content != original_content:
                if dry_run:
                    print(f"[DRY RUN] Would update {html_file}: {changes_count} references")
                    results['updated'].append((html_file, changes_count))
                else:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"[OK] Updated {html_file}: {changes_count} references")
                    results['updated'].append((html_file, changes_count))
        
        except Exception as e:
            results['errors'].append(f"Error updating {html_file}: {str(e)}")
    
    return results

def update_css_files(mappings, dry_run=False):
    """Update image references in CSS files"""
    results = {
        'updated': [],
        'errors': []
    }
    
    for css_file in CSS_FILES:
        file_path = WEBSITE_DIR / css_file
        
        if not file_path.exists():
            results['errors'].append(f"CSS file not found: {css_file}")
            continue
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            changes_count = 0
            
            # Replace all image references in url() statements
            for old_name, new_name in mappings.items():
                # Match patterns like url('../assets/images/...')
                old_patterns = [
                    f"assets/images/{old_name}",
                    f"../assets/images/{old_name}",
                    f"../images/{old_name}"
                ]
                new_replacement = f"assets/images/{new_name}"
                
                for pattern in old_patterns:
                    if pattern in content:
                        # Determine the correct replacement based on what was found
                        if "../assets/images/" in pattern:
                            replacement = f"../assets/images/{new_name}"
                        elif "../images/" in pattern:
                            replacement = f"../images/{new_name}"
                        else:
                            replacement = new_replacement
                        
                        content = content.replace(pattern, replacement)
                        changes_count += 1
            
            if content != original_content:
                if dry_run:
                    print(f"[DRY RUN] Would update {css_file}: {changes_count} references")
                    results['updated'].append((css_file, changes_count))
                else:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"[OK] Updated {css_file}: {changes_count} references")
                    results['updated'].append((css_file, changes_count))
        
        except Exception as e:
            results['errors'].append(f"Error updating {css_file}: {str(e)}")
    
    return results

def print_summary(file_results, html_results, css_results):
    """Print a summary of all operations"""
    print("\n" + "="*60)
    print("RENAMING SUMMARY")
    print("="*60)
    
    print(f"\n[FILES] RENAMED: {len(file_results['renamed'])}")
    if file_results['renamed']:
        for old, new in file_results['renamed'][:5]:
            print(f"  * {old} -> {new}")
        if len(file_results['renamed']) > 5:
            print(f"  ... and {len(file_results['renamed']) - 5} more")
    
    print(f"\n[HTML] FILES UPDATED: {len(html_results['updated'])}")
    for file, count in html_results['updated']:
        print(f"  * {file}: {count} references updated")
    
    print(f"\n[CSS] FILES UPDATED: {len(css_results['updated'])}")
    for file, count in css_results['updated']:
        print(f"  * {file}: {count} references updated")
    
    if file_results['skipped']:
        print(f"\n[WARNING] SKIPPED: {len(file_results['skipped'])}")
        for msg in file_results['skipped']:
            print(f"  * {msg}")
    
    all_errors = (file_results['errors'] + 
                  html_results['errors'] + 
                  css_results['errors'])
    if all_errors:
        print(f"\n[ERROR] ERRORS: {len(all_errors)}")
        for error in all_errors:
            print(f"  * {error}")
    else:
        print("\n[SUCCESS] NO ERRORS")
    
    print("\n" + "="*60)

def main():
    """Main execution function"""
    # Parse arguments
    dry_run = "--dry-run" in sys.argv
    
    if dry_run:
        print("[DRY RUN] MODE - No changes will be made\n")
    else:
        print("[EXECUTE] IMAGE RENAMING\n")
    
    # Load configuration
    print("[CONFIG] Loading configuration...")
    config = load_config()
    mappings = config['image_mappings']
    print(f"Found {len(mappings)} image mappings\n")
    
    # Step 1: Rename files
    print("[FILES] Renaming image files...")
    file_results = rename_files(mappings, dry_run)
    
    # Step 2: Update HTML files
    print("\n[HTML] Updating HTML files...")
    html_results = update_html_files(mappings, dry_run)
    
    # Step 3: Update CSS files
    print("\n[CSS] Updating CSS files...")
    css_results = update_css_files(mappings, dry_run)
    
    # Print summary
    print_summary(file_results, html_results, css_results)
    
    if dry_run:
        print("\n[INFO] To execute the actual renaming, run: py rename_images.py")
    else:
        print("\n[SUCCESS] Image renaming completed successfully!")
        print("[INFO] Don't forget to test the website and commit your changes!")

if __name__ == "__main__":
    main()
