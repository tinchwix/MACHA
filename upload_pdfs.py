#!/usr/bin/env python3
"""Upload PDF documents to Cloudinary"""
import os
from dotenv import load_dotenv
load_dotenv()

import cloudinary
import cloudinary.uploader

# Setup Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# PDF files to upload
pdfs = [
    {
        'path': 'assets/images/docs_fee_structure_2026.pdf',
        'public_id': 'macha-school/docs_fee_structure_2026'
    },
    {
        'path': 'assets/images/docs_academic_calendar_2026.pdf',
        'public_id': 'macha-school/docs_academic_calendar_2026'
    }
]

print("Uploading PDF documents to Cloudinary...\n")

for pdf in pdfs:
    try:
        result = cloudinary.uploader.upload(
            pdf['path'],
            public_id=pdf['public_id'],
            resource_type="raw",  # Use 'raw' for PDFs
            overwrite=True
        )
        print(f"[OK] Uploaded: {pdf['path']}")
        print(f"  URL: {result['secure_url']}\n")
    except Exception as e:
        print(f"[ERROR] Error uploading {pdf['path']}: {str(e)}\n")

print("PDF upload complete!")
