import os
import sys
import cv2
import numpy as np
from PIL import Image

BRAIN_DIR = r"C:\Users\Lenovo\.gemini\antigravity\brain\734d83a0-9020-4a69-a67e-202ac9171427"
PUBLIC_CLAY = r"c:\Users\Lenovo\Documents\midhula hut\public\clay"

os.makedirs(os.path.join(PUBLIC_CLAY, "letters"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_CLAY, "fish"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_CLAY, "props"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_CLAY, "fx"), exist_ok=True)

def remove_background_matte(img_bgr, is_letter=False):
    """
    High-precision background matting for flat light-grey studio sheets.
    Uses border sampling + color distance + edge feathering.
    Cleans enclosed counters (like in D, A, R) when is_letter=True.
    """
    # Sample border pixels to detect exact background color
    border = np.concatenate([img_bgr[:10, :].reshape(-1, 3),
                             img_bgr[-10:, :].reshape(-1, 3),
                             img_bgr[:, :10].reshape(-1, 3),
                             img_bgr[:, -10:].reshape(-1, 3)], axis=0)
    bg_color = np.median(border, axis=0)
    
    # Euclidean distance in BGR
    dist = np.linalg.norm(img_bgr.astype(float) - bg_color, axis=2)
    
    # Smooth matte transition
    # For letters, high contrast allows clean cut with smooth anti-aliased edge
    if is_letter:
        alpha = np.clip((dist - 22.0) / (42.0 - 22.0) * 255.0, 0, 255).astype(np.uint8)
        # 1px erosion to remove any grey halo
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        alpha = cv2.erode(alpha, kernel, iterations=1)
        alpha = cv2.GaussianBlur(alpha, (3, 3), 0.5)
    else:
        # For organic props and fish, preserve soft fins and edges
        alpha = np.clip((dist - 20.0) / (45.0 - 20.0) * 255.0, 0, 255).astype(np.uint8)
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        alpha = cv2.erode(alpha, kernel, iterations=1)
        alpha = cv2.GaussianBlur(alpha, (3, 3), 0.5)
        
    rgba = np.dstack([img_bgr, alpha])
    return rgba

def save_crop_padded(rgba, bbox, out_path, padding=4):
    x, y, w, h = bbox
    crop = rgba[y:y+h, x:x+w]
    
    # Tight crop based on alpha
    alpha = crop[:, :, 3]
    ys, xs = np.where(alpha > 10)
    if len(xs) > 0 and len(ys) > 0:
        x_min, x_max = np.min(xs), np.max(xs)
        y_min, y_max = np.min(ys), np.max(ys)
        crop = crop[y_min:y_max+1, x_min:x_max+1]
    
    ch, cw = crop.shape[:2]
    padded = np.zeros((ch + 2 * padding, cw + 2 * padding, 4), dtype=np.uint8)
    padded[padding:padding+ch, padding:padding+cw] = crop
    
    # Save as WebP with 90% quality
    im_pil = Image.fromarray(cv2.cvtColor(padded, cv2.COLOR_BGRA2RGBA))
    im_pil.save(out_path, format="WEBP", quality=90)
    return im_pil

def slice_all():
    all_sprites = [] # for contact sheet

    # 1. BLUE LETTERS (M I D H U L A)
    p_blue = os.path.join(BRAIN_DIR, "sheet_blue_letters_1794921871014.jpg")
    img_blue = cv2.imread(p_blue)
    rgba_blue = remove_background_matte(img_blue, is_letter=True)
    
    # Connected components
    mask = (rgba_blue[:, :, 3] > 50).astype(np.uint8)
    num, labels, stats, centroids = cv2.connectedComponentsWithStats(mask)
    comps = [stats[i][:4] for i in range(1, num) if stats[i][4] > 1000]
    comps = sorted(comps, key=lambda c: c[0])
    
    blue_names = ["blue-M", "blue-I", "blue-D", "blue-H", "blue-U", "blue-L", "blue-A"]
    print(f"Blue letters found: {len(comps)}")
    for name, bbox in zip(blue_names, comps):
        out_p = os.path.join(PUBLIC_CLAY, "letters", f"{name}.webp")
        im = save_crop_padded(rgba_blue, bbox, out_p, padding=4)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp, size: {im.size}")

    # 2. ORANGE LETTERS (F A R M H U T)
    p_orange = os.path.join(BRAIN_DIR, "sheet_orange_letters_1794921888967.jpg")
    img_orange = cv2.imread(p_orange)
    rgba_orange = remove_background_matte(img_orange, is_letter=True)
    
    mask = (rgba_orange[:, :, 3] > 50).astype(np.uint8)
    num, labels, stats, centroids = cv2.connectedComponentsWithStats(mask)
    comps = [stats[i][:4] for i in range(1, num) if stats[i][4] > 1000]
    comps = sorted(comps, key=lambda c: c[0])
    
    orange_names = ["orange-F", "orange-A", "orange-R", "orange-M", "orange-H", "orange-U", "orange-T"]
    print(f"Orange letters found: {len(comps)}")
    for name, bbox in zip(orange_names, comps):
        out_p = os.path.join(PUBLIC_CLAY, "letters", f"{name}.webp")
        im = save_crop_padded(rgba_orange, bbox, out_p, padding=4)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp, size: {im.size}")

    # 3. FISH
    # Row 1: orange-guppy, pink-guppy, blue-guppy
    # Row 2: orange-small-1, orange-small-2, swordtail, peek-blue
    p_fish = os.path.join(BRAIN_DIR, "sheet_fish_1794921896934.jpg")
    img_fish = cv2.imread(p_fish)
    rgba_fish = remove_background_matte(img_fish, is_letter=False)
    
    mask = (rgba_fish[:, :, 3] > 50).astype(np.uint8)
    num, labels, stats, centroids = cv2.connectedComponentsWithStats(mask)
    comps = [stats[i][:4] for i in range(1, num) if stats[i][4] > 1000]
    
    r1 = sorted([c for c in comps if c[1] < 400], key=lambda c: c[0])
    r2 = sorted([c for c in comps if c[1] >= 400], key=lambda c: c[0])
    
    fish_mappings = [
        ("orange-guppy", r1[0]),
        ("pink-guppy", r1[1]),
        ("blue-guppy", r1[2]),
        ("orange-small-1", r2[0]),
        ("orange-small-2", r2[1]),
        ("swordtail", r2[2]),
        ("peek-blue", r2[3]),
    ]
    print(f"Fish found: {len(r1)} in row 1, {len(r2)} in row 2")
    for name, bbox in fish_mappings:
        out_p = os.path.join(PUBLIC_CLAY, "fish", f"{name}.webp")
        im = save_crop_padded(rgba_fish, bbox, out_p, padding=4)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp, size: {im.size}")

    # 4. PROPS
    # Row 1: crayfish, seaweed-1 (tall), seaweed-2 (small)
    # Row 2: rock-large, rock-small, rocks-cluster
    p_props = os.path.join(BRAIN_DIR, "sheet_props_1794921903844.jpg")
    img_props = cv2.imread(p_props)
    rgba_props = remove_background_matte(img_props, is_letter=False)
    
    mask = (rgba_props[:, :, 3] > 50).astype(np.uint8)
    num, labels, stats, centroids = cv2.connectedComponentsWithStats(mask)
    comps = [stats[i][:4] for i in range(1, num) if stats[i][4] > 1000]
    
    pr1 = sorted([c for c in comps if c[1] < 400], key=lambda c: c[0])
    pr2 = sorted([c for c in comps if c[1] >= 400], key=lambda c: c[0])
    
    props_mappings = [
        ("crayfish", pr1[0]),
        ("seaweed-1", pr1[1]),
        ("seaweed-2", pr1[2]),
        ("rock-large", pr2[0]),
        ("rock-small", pr2[1]),
        ("rocks-cluster", pr2[2]),
    ]
    print(f"Props found: {len(pr1)} in row 1, {len(pr2)} in row 2")
    for name, bbox in props_mappings:
        out_p = os.path.join(PUBLIC_CLAY, "props", f"{name}.webp")
        im = save_crop_padded(rgba_props, bbox, out_p, padding=4)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp, size: {im.size}")

    # 5. EXTRAS
    # Bubbles (4-5), Droplets (4), Star (1), Rays (1 combined), Pellets (6)
    p_extras = os.path.join(BRAIN_DIR, "sheet_extras_1794921923766.jpg")
    img_extras = cv2.imread(p_extras)
    rgba_extras = remove_background_matte(img_extras, is_letter=False)
    
    # Detect individual components in extras
    mask = (rgba_extras[:, :, 3] > 50).astype(np.uint8)
    num, labels, stats, centroids = cv2.connectedComponentsWithStats(mask)
    comps = [stats[i][:4] for i in range(1, num) if stats[i][4] > 100]
    
    # Pellets are on bottom row y > 450
    pellets = sorted([c for c in comps if c[1] > 450], key=lambda c: c[0])
    print(f"Pellets found: {len(pellets)}")
    for idx, bbox in enumerate(pellets[:6]):
        name = f"pellet-{idx+1}"
        out_p = os.path.join(PUBLIC_CLAY, "fx", f"{name}.webp")
        im = save_crop_padded(rgba_extras, bbox, out_p, padding=4)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp, size: {im.size}")
        
    # Top elements y < 450
    top_comps = [c for c in comps if c[1] <= 450]
    
    # Bubbles: x < 650
    bubbles = sorted([c for c in top_comps if c[0] < 650], key=lambda c: c[0])
    print(f"Bubbles found: {len(bubbles)}")
    for idx, bbox in enumerate(bubbles[:5]):
        name = f"bubble-{idx+1}"
        out_p = os.path.join(PUBLIC_CLAY, "fx", f"{name}.webp")
        im = save_crop_padded(rgba_extras, bbox, out_p, padding=4)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp, size: {im.size}")
    # If 4 bubbles, create bubble-5 as a scaled variation of bubble-4
    if len(bubbles) < 5 and len(bubbles) >= 4:
        name = "bubble-5"
        im_b5 = all_sprites[-1][1].resize((int(all_sprites[-1][1].width * 0.75), int(all_sprites[-1][1].height * 0.75)), Image.Resampling.LANCZOS)
        out_p = os.path.join(PUBLIC_CLAY, "fx", f"{name}.webp")
        im_b5.save(out_p, format="WEBP", quality=90)
        all_sprites.append((name, im_b5))
        print(f"  Saved {name}.webp (scaled)")

    # Droplets: 650 <= x < 950
    droplets = sorted([c for c in top_comps if 650 <= c[0] < 950], key=lambda c: (c[1], c[0]))
    print(f"Droplets found: {len(droplets)}")
    for idx, bbox in enumerate(droplets[:4]):
        name = f"droplet-{idx+1}"
        out_p = os.path.join(PUBLIC_CLAY, "fx", f"{name}.webp")
        im = save_crop_padded(rgba_extras, bbox, out_p, padding=4)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp, size: {im.size}")

    # Star: 950 <= x < 1100
    stars = [c for c in top_comps if 950 <= c[0] < 1100]
    if stars:
        name = "star"
        out_p = os.path.join(PUBLIC_CLAY, "fx", f"{name}.webp")
        im = save_crop_padded(rgba_extras, stars[0], out_p, padding=4)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp, size: {im.size}")

    # Rays: x >= 1100 (combine all rays into single bbox)
    rays = [c for c in top_comps if c[0] >= 1100]
    if rays:
        rx_min = min(c[0] for c in rays)
        ry_min = min(c[1] for c in rays)
        rx_max = max(c[0] + c[2] for c in rays)
        ry_max = max(c[1] + c[3] for c in rays)
        ray_bbox = (rx_min, ry_min, rx_max - rx_min, ry_max - ry_min)
        name = "rays"
        out_p = os.path.join(PUBLIC_CLAY, "fx", f"{name}.webp")
        im = save_crop_padded(rgba_extras, ray_bbox, out_p, padding=4)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp (combined 3 rays), size: {im.size}")

    # 6. GENERATE CONTACT SHEET (preview.png)
    print(f"\nGenerating contact sheet with {len(all_sprites)} sprites...")
    cols = 8
    rows = (len(all_sprites) + cols - 1) // cols
    cell_w, cell_h = 160, 160
    sheet = Image.new("RGBA", (cols * cell_w, rows * cell_h), (240, 240, 240, 255))
    
    # Checkerboard background pattern
    for r in range(rows * cell_h // 16):
        for c in range(cols * cell_w // 16):
            if (r + c) % 2 == 1:
                for y in range(r * 16, min((r + 1) * 16, rows * cell_h)):
                    for x in range(c * 16, min((c + 1) * 16, cols * cell_w)):
                        sheet.putpixel((x, y), (220, 220, 220, 255))
                        
    for idx, (name, im) in enumerate(all_sprites):
        col = idx % cols
        row = idx // cols
        cx = col * cell_w + cell_w // 2
        cy = row * cell_h + cell_h // 2
        
        # Scale down to fit 140x120
        ratio = min(140.0 / im.width, 120.0 / im.height, 1.0)
        nw, nh = max(1, int(im.width * ratio)), max(1, int(im.height * ratio))
        thumb = im.resize((nw, nh), Image.Resampling.LANCZOS)
        
        sheet.paste(thumb, (cx - nw // 2, cy - nh // 2), thumb)
        
    preview_path = os.path.join(PUBLIC_CLAY, "preview.png")
    sheet.save(preview_path, format="PNG")
    print(f"Saved contact sheet to {preview_path} ({sheet.width}x{sheet.height})")

if __name__ == "__main__":
    slice_all()
