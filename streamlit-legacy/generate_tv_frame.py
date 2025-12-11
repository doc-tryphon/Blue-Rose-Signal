from PIL import Image, ImageDraw, ImageFilter
import numpy as np

# Create a large canvas for the TV frame
width, height = 1920, 1080
frame_thickness = 120  # Thick bezel like vintage CRTs

# Create image with transparency
img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Draw the outer bezel (gray/beige plastic)
bezel_color = (70, 70, 68, 255)  # Dark gray plastic
draw.rectangle([0, 0, width, height], fill=bezel_color)

# Cut out the center (screen area) with transparency
screen_margin = frame_thickness
draw.rectangle(
    [screen_margin, screen_margin, width - screen_margin, height - screen_margin],
    fill=(0, 0, 0, 0)
)

# Add inner shadow for depth (darker edge inside the bezel)
shadow_width = 15
shadow_color = (20, 20, 20, 200)
# Top shadow
draw.rectangle([screen_margin, screen_margin, width - screen_margin, screen_margin + shadow_width], fill=shadow_color)
# Bottom shadow
draw.rectangle([screen_margin, height - screen_margin - shadow_width, width - screen_margin, height - screen_margin], fill=shadow_color)
# Left shadow
draw.rectangle([screen_margin, screen_margin, screen_margin + shadow_width, height - screen_margin], fill=shadow_color)
# Right shadow
draw.rectangle([width - screen_margin - shadow_width, screen_margin, width - screen_margin, height - screen_margin], fill=shadow_color)

# Add highlights on the bezel (top-left light reflection)
highlight = Image.new('RGBA', (width, height), (0, 0, 0, 0))
highlight_draw = ImageDraw.Draw(highlight)

# Top-left diagonal highlight
for i in range(60):
    opacity = int(255 * (1 - i/60) * 0.15)
    highlight_draw.rectangle([0, i, width - i, i + 1], fill=(255, 255, 255, opacity))
    highlight_draw.rectangle([i, 0, i + 1, height - i], fill=(255, 255, 255, opacity))

# Blend highlight
img = Image.alpha_composite(img, highlight)

# Add subtle texture with noise
pixels = np.array(img)
noise = np.random.randint(-5, 5, (height, width, 4), dtype=np.int16)
noise[:, :, 3] = 0  # Don't modify alpha channel
pixels_noisy = np.clip(pixels.astype(np.int16) + noise, 0, 255).astype(np.uint8)
img_textured = Image.fromarray(pixels_noisy, 'RGBA')

# Apply slight blur to the bezel for more realistic plastic look
# Create a mask for just the bezel area
mask = Image.new('L', (width, height), 255)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rectangle([screen_margin, screen_margin, width - screen_margin, height - screen_margin], fill=0)

# Blur only the bezel
blurred = img_textured.filter(ImageFilter.GaussianBlur(radius=1))
img_final = Image.composite(blurred, img_textured, mask)

# Save the TV frame
img_final.save('tv_frame_overlay.png', 'PNG')
print("TV frame generated: tv_frame_overlay.png")
print(f"Frame thickness: {frame_thickness}px")
print(f"Image size: {width}x{height}")
