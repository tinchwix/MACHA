#!/usr/bin/env python3
"""Retry upload for failed image"""
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

# Upload the failed image
img_path = "assets/images/Hospital/medical_center_05.jpg"
public_id = "macha-school/Hospital/medical_center_05"

try:
    result = cloudinary.uploader.upload(
        img_path,
        public_id=public_id,
        overwrite=True,
        resource_type="image"
    )
    print(f"SUCCESS! Uploaded: {img_path}")
    print(f"URL: {result['secure_url']}")
except Exception as e:
    print(f"ERROR: {str(e)}")
