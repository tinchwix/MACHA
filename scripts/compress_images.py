import os
from PIL import Image

def compress_images(directory, target_quality=80, max_width=1920):
    total_original_size = 0
    total_compressed_size = 0
    count = 0

    print(f"Scanning directory: {directory}")
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                filepath = os.path.join(root, file)
                original_size = os.path.getsize(filepath)
                
                # Skip files smaller than 200KB to avoid excessive processing
                if original_size < 200 * 1024:
                    continue
                
                total_original_size += original_size
                count += 1
                
                try:
                    with Image.open(filepath) as img:
                        # Convert RGBA to RGB if saving as JPEG
                        if img.mode in ("RGBA", "P") and file.lower().endswith(('.jpg', '.jpeg')):
                            img = img.convert("RGB")
                        
                        # Resize if larger than max_width
                        if img.width > max_width:
                            ratio = max_width / float(img.width)
                            new_height = int(float(img.height) * float(ratio))
                            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                        
                        # Compression
                        if file.lower().endswith(('.jpg', '.jpeg')):
                            img.save(filepath, "JPEG", quality=target_quality, optimize=True)
                        elif file.lower().endswith('.png'):
                            # For PNG, we can use quantize to reduce size significantly
                            img = img.quantize(colors=256).convert("RGBA")
                            img.save(filepath, "PNG", optimize=True)
                        elif file.lower().endswith('.webp'):
                            img.save(filepath, "WEBP", quality=target_quality, optimize=True)
                        
                        compressed_size = os.path.getsize(filepath)
                        total_compressed_size += compressed_size
                        
                        savings = (original_size - compressed_size) / 1024
                        print(f"Compressed {file}: {original_size/1024:.1f}KB -> {compressed_size/1024:.1f}KB (Saved {savings:.1f}KB)")
                except Exception as e:
                    print(f"Error processing {file}: {e}")
                    total_compressed_size += original_size

    if count > 0:
        total_savings = (total_original_size - total_compressed_size) / (1024 * 1024)
        print(f"\nSummary:")
        print(f"Processed {count} images")
        print(f"Original Total: {total_original_size / (1024*1024):.2f}MB")
        print(f"Compressed Total: {total_compressed_size / (1024*1024):.2f}MB")
        print(f"Total Space Saved: {total_savings:.2f}MB")
    else:
        print("No images found for compression (>200KB).")

if __name__ == "__main__":
    assets_dir = os.path.join(os.getcwd(), "assets", "images")
    if os.path.exists(assets_dir):
        compress_images(assets_dir)
    else:
        print(f"Directory not found: {assets_dir}")
