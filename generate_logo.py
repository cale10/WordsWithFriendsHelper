#!/usr/bin/env python3
"""
Generate PWA logo for Words With Friends Helper
Creates a game tile-style logo with "W" letter
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_tile_logo(size, output_path):
    """Create a Words With Friends style tile logo"""

    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Calculate padding and tile size
    padding = int(size * 0.1)
    tile_size = size - (padding * 2)

    # Draw shadow (for depth effect)
    shadow_offset = int(size * 0.02)
    draw.rounded_rectangle(
        [padding + shadow_offset, padding + shadow_offset,
         padding + tile_size + shadow_offset, padding + tile_size + shadow_offset],
        radius=int(size * 0.08),
        fill=(0, 0, 0, 60)
    )

    # Draw main tile background (beige/tan like wood)
    draw.rounded_rectangle(
        [padding, padding, padding + tile_size, padding + tile_size],
        radius=int(size * 0.08),
        fill=(238, 224, 201)
    )

    # Draw border
    draw.rounded_rectangle(
        [padding, padding, padding + tile_size, padding + tile_size],
        radius=int(size * 0.08),
        outline=(190, 170, 145),
        width=max(2, int(size * 0.01))
    )

    # Draw inner shadow for depth
    inner_padding = padding + int(size * 0.015)
    draw.rounded_rectangle(
        [inner_padding, inner_padding,
         padding + tile_size - int(size * 0.015),
         padding + tile_size - int(size * 0.015)],
        radius=int(size * 0.07),
        outline=(200, 185, 160),
        width=max(1, int(size * 0.005))
    )

    # Try to load a nice font, fall back to default
    try:
        # Try common system fonts
        font_paths = [
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
            '/System/Library/Fonts/Helvetica.ttc',
            'C:\\Windows\\Fonts\\arialbd.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
        ]

        font = None
        for font_path in font_paths:
            if os.path.exists(font_path):
                font = ImageFont.truetype(font_path, int(size * 0.45))
                font_small = ImageFont.truetype(font_path, int(size * 0.12))
                break

        if font is None:
            font = ImageFont.load_default()
            font_small = ImageFont.load_default()
    except:
        font = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Draw letter "W"
    letter = "W"

    # Get text bounding box for centering
    bbox = draw.textbbox((0, 0), letter, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Center the letter
    text_x = padding + (tile_size - text_width) // 2 - bbox[0]
    text_y = padding + (tile_size - text_height) // 2 - bbox[1] - int(size * 0.02)

    # Draw letter with slight shadow
    shadow_color = (100, 90, 75)
    draw.text((text_x + 2, text_y + 2), letter, fill=shadow_color, font=font)
    draw.text((text_x, text_y), letter, fill=(51, 51, 51), font=font)

    # Draw point value (4 points for W)
    point_value = "4"
    point_bbox = draw.textbbox((0, 0), point_value, font=font_small)
    point_width = point_bbox[2] - point_bbox[0]
    point_height = point_bbox[3] - point_bbox[1]

    # Position in bottom right
    point_x = padding + tile_size - point_width - int(size * 0.08)
    point_y = padding + tile_size - point_height - int(size * 0.08)

    draw.text((point_x + 1, point_y + 1), point_value, fill=shadow_color, font=font_small)
    draw.text((point_x, point_y), point_value, fill=(51, 51, 51), font=font_small)

    # Save image
    img.save(output_path, 'PNG', quality=95)
    print(f"✓ Created {output_path} ({size}x{size})")

def main():
    """Generate both icon sizes"""

    # Output directory
    output_dir = 'src/static/assets'
    os.makedirs(output_dir, exist_ok=True)

    # Generate 192x192 icon
    create_tile_logo(192, f'{output_dir}/icon-192.png')

    # Generate 512x512 icon
    create_tile_logo(512, f'{output_dir}/icon-512.png')

    print("\n✅ PWA logos generated successfully!")
    print("\nNext steps:")
    print("1. Review the icons in src/static/assets/")
    print("2. Run 'npx gulp' to copy to dist/")
    print("3. Commit and push to GitHub")

if __name__ == '__main__':
    main()
