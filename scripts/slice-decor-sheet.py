import os
import cv2
import numpy as np

# Source image
img_path = r'C:/Users/Lenovo/.gemini/antigravity/brain/734d83a0-9020-4a69-a67e-202ac9171427/.user_uploaded/media_1795111699318_9c21ec1c.jpg'
full_img = cv2.imread(img_path).astype(np.float32)

out_dir = r'c:/Users/Lenovo/Documents/midhula hut/public/decor'
os.makedirs(out_dir, exist_ok=True)

# Grid slices [y0, y1, x0, x1] with safety margins
elements = [
    ('goldfish', [20, 215, 20, 260], 22),
    ('guppy', [20, 220, 270, 510], 22),
    ('koi', [20, 215, 515, 765], 22),
    ('betta', [15, 230, 760, 1015], 22),
    ('swordtail', [240, 420, 15, 310], 22),
    ('seaweed-tall', [220, 460, 305, 500], 22),
    ('seaweed-short', [245, 455, 530, 755], 22),
    ('pebbles', [265, 445, 770, 1015], 22),
    ('shell', [475, 660, 45, 240], 20),
    ('starfish', [455, 665, 270, 505], 22),
    ('coral', [460, 665, 530, 745], 22),
    ('bubbles', [465, 665, 780, 975], 16),
]

previews = []

for name, (y0, y1, x0, x1), th in elements:
    crop = full_img[y0:y1, x0:x1].copy()
    h, w, _ = crop.shape
    diff = np.max(np.abs(crop - 254.5), axis=2)

    # Core foreground mask
    core = (diff > th).astype(np.uint8)
    # Remove single isolated noise pixels
    core = cv2.morphologyEx(core, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
    
    # Fill internal holes (e.g. eyes, white scales, bubble center)
    contours, _ = cv2.findContours(core, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    solid = np.zeros_like(core)
    cv2.drawContours(solid, contours, -1, 1, -1)

    # Signed distance field for sub-pixel anti-aliased edge
    dist_in = cv2.distanceTransform(solid, cv2.DIST_L2, 3)
    dist_out = cv2.distanceTransform(1 - solid, cv2.DIST_L2, 3)
    signed_dist = dist_in - dist_out

    # Shift edge inward by 0.35 px and feather over 1.2 px
    alpha = np.clip((signed_dist - 0.35) / 1.2 + 0.5, 0.0, 1.0)
    alpha_3d = np.repeat(alpha[:, :, np.newaxis], 3, axis=2)

    # Inpaint boundary pixels to eliminate any residual white halo
    fg_u8 = np.clip(crop, 0, 255).astype(np.uint8)
    inpaint_mask = ((alpha > 0.01) & (signed_dist < 1.4)).astype(np.uint8)
    inpaint_color = cv2.inpaint(fg_u8, inpaint_mask, 3, cv2.INPAINT_TELEA).astype(np.float32)

    fg_clean = crop * (signed_dist >= 1.4)[:, :, None] + inpaint_color * (signed_dist < 1.4)[:, :, None]

    # Crop tight to alpha bounding box
    alpha_mask = alpha > 0.01
    y_idx, x_idx = np.where(alpha_mask)
    if len(y_idx) == 0:
        print(f"Warning: Empty mask for {name}")
        continue
    ymin, ymax = y_idx.min(), y_idx.max()
    xmin, xmax = x_idx.min(), x_idx.max()

    # Add 1px safety transparent margin
    ymin = max(0, ymin - 1)
    ymax = min(h - 1, ymax + 1)
    xmin = max(0, xmin - 1)
    xmax = min(w - 1, xmax + 1)

    cropped_fg = fg_clean[ymin:ymax+1, xmin:xmax+1]
    cropped_alpha = alpha[ymin:ymax+1, xmin:xmax+1]

    # Combine BGR + A into 4-channel BGRA uint8
    rgba = np.zeros((cropped_fg.shape[0], cropped_fg.shape[1], 4), dtype=np.uint8)
    rgba[:, :, :3] = np.clip(cropped_fg, 0, 255).astype(np.uint8)
    rgba[:, :, 3] = np.clip(cropped_alpha * 255, 0, 255).astype(np.uint8)

    # Save PNG
    png_path = os.path.join(out_dir, f"{name}.png")
    cv2.imwrite(png_path, rgba)

    # Save WebP
    webp_path = os.path.join(out_dir, f"{name}.webp")
    # OpenCV imwrite with WEBP quality 95
    cv2.imwrite(webp_path, rgba, [cv2.IMWRITE_WEBP_QUALITY, 95])

    print(f"Saved {name}: size={rgba.shape[1]}x{rgba.shape[0]} px -> {png_path} & {webp_path}")

    # Generate a preview card composited over Yellow, Aqua, Cream
    card_h = 140
    card_w = 140
    # Scale element to fit in 120x120
    scale = min(110 / rgba.shape[1], 110 / rgba.shape[0])
    resized_rgba = cv2.resize(rgba, (int(rgba.shape[1] * scale), int(rgba.shape[0] * scale)), interpolation=cv2.INTER_AREA)
    rw, rh = resized_rgba.shape[1], resized_rgba.shape[0]

    # Function to composite onto a background color
    def make_comp(bg_bgr):
        bg = np.full((card_h, card_w, 3), bg_bgr, dtype=np.uint8)
        yo = (card_h - rh) // 2
        xo = (card_w - rw) // 2
        a = resized_rgba[:, :, 3:4].astype(np.float32) / 255.0
        c = resized_rgba[:, :, :3].astype(np.float32)
        bg_roi = bg[yo:yo+rh, xo:xo+rw].astype(np.float32)
        bg[yo:yo+rh, xo:xo+rw] = np.clip(c * a + bg_roi * (1.0 - a), 0, 255).astype(np.uint8)
        # Add label
        cv2.putText(bg, name, (6, card_h - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (40, 40, 40), 1, cv2.LINE_AA)
        return bg

    comp_yellow = make_comp([139, 229, 253]) # #FDE58B in BGR
    comp_aqua = make_comp([245, 235, 189])   # #BDEBF5 in BGR
    comp_cream = make_comp([232, 244, 250])  # #FAF4E8 in BGR
    previews.append(np.vstack([comp_yellow, comp_aqua, comp_cream]))

# Combine all previews into a contact sheet: 4 cols x 3 rows
row1 = np.hstack(previews[0:4])
row2 = np.hstack(previews[4:8])
row3 = np.hstack(previews[8:12])
contact_sheet = np.vstack([row1, row2, row3])
contact_path = r'C:/Users/Lenovo/.gemini/antigravity/brain/734d83a0-9020-4a69-a67e-202ac9171427/verify_cutouts_contact_sheet.png'
cv2.imwrite(contact_path, contact_sheet)
print(f"Contact sheet saved to {contact_path}")
