import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def clean_edges(im_rgba):
    # Erode slight alpha halo if any grey background pixels remain on semi-transparent boundary
    arr = np.array(im_rgba)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]

    # Detect near-grey background color #DADADA (approx 218, 218, 220)
    bg_color = np.array([218.0, 218.0, 220.0])
    color_diff = np.linalg.norm(rgb.astype(float) - bg_color, axis=2)

    # If a pixel has color extremely close to grey background and is semi-transparent, fade its alpha
    near_bg = (color_diff < 18) & (alpha < 240)
    alpha[near_bg] = 0

    # Slight alpha edge smooth
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    alpha_clean = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, kernel)
    # Don't erase solid parts
    alpha = np.where(alpha > 200, alpha, alpha_clean)

    arr[:, :, 3] = alpha
    return Image.fromarray(arr, 'RGBA')

def crop_component_with_margin(im_rgba, labels, comp_indices, bbox, margin=8, cap_width=None):
    x0, y0, x1, y1 = bbox
    
    # Extract sub-image and sub-mask
    arr = np.array(im_rgba)
    sub_arr = arr[y0:y1, x0:x1].copy()
    sub_labels = labels[y0:y1, x0:x1]
    
    if isinstance(comp_indices, int):
        comp_indices = [comp_indices]
        
    mask = np.isin(sub_labels, comp_indices)
    # Zero out alpha for any pixel not belonging to this component
    sub_arr[~mask, 3] = 0
    
    crop = Image.fromarray(sub_arr, 'RGBA')
    
    # Pad with margin
    padded = Image.new('RGBA', (crop.width + margin * 2, crop.height + margin * 2), (0, 0, 0, 0))
    padded.paste(crop, (margin, margin))
    
    if cap_width and padded.width > cap_width:
        new_w = cap_width
        new_h = int(padded.height * (cap_width / padded.width))
        padded = padded.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
    return padded

def get_connected_components(im_rgba, min_area=30):
    alpha = np.array(im_rgba.split()[-1])
    _, thresh = cv2.threshold(alpha, 25, 255, cv2.THRESH_BINARY)
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(thresh)
    
    comps = []
    for idx in range(1, num_labels):
        area = stats[idx, cv2.CC_STAT_AREA]
        if area >= min_area:
            x = stats[idx, cv2.CC_STAT_LEFT]
            y = stats[idx, cv2.CC_STAT_TOP]
            w = stats[idx, cv2.CC_STAT_WIDTH]
            h = stats[idx, cv2.CC_STAT_HEIGHT]
            cx, cy = centroids[idx]
            comps.append({
                'idx': idx,
                'bbox': (x, y, x + w, y + h),
                'centroid': (cx, cy),
                'area': area,
                'width': w,
                'height': h
            })
    return comps, labels

def slice_all():
    import rembg
    
    out_dirs = {
        'fish': 'public/fish',
        'props': 'public/props',
        'fx': 'public/fx'
    }
    for d in out_dirs.values():
        os.makedirs(d, exist_ok=True)
        
    # Process sheets
    sheets = {
        'fish': 'public/sheets/fish.png',
        'props': 'public/sheets/props.png',
        'details': 'public/sheets/details.png'
    }
    
    cleaned_sheets = {}
    for key, path in sheets.items():
        cache_path = f"public/test_rembg_{key}.png"
        if os.path.exists(cache_path):
            print(f"Loading cached background removal from {cache_path}...")
            rgba = Image.open(cache_path)
        else:
            print(f"Removing background from {path}...")
            orig = Image.open(path).convert('RGB')
            rgba = rembg.remove(orig)
            rgba.save(cache_path)
        cleaned_sheets[key] = clean_edges(rgba)
        
    extracted_sprites = []
    
    # --- 1. FISH SHEET (6 fish) ---
    print("Slicing fish sheet...")
    fish_im = cleaned_sheets['fish']
    fish_comps, fish_labels = get_connected_components(fish_im, min_area=1000)
    
    # Split into row 1 (cy < 280) and row 2 (cy >= 280)
    row1 = sorted([c for c in fish_comps if c['centroid'][1] < 280], key=lambda c: c['centroid'][0])
    row2 = sorted([c for c in fish_comps if c['centroid'][1] >= 280], key=lambda c: c['centroid'][0])
    
    assert len(row1) == 3, f"Expected 3 fish in row 1, got {len(row1)}"
    assert len(row2) == 3, f"Expected 3 fish in row 2, got {len(row2)}"
    
    fish_names_r1 = ['orange-guppy', 'pink-guppy', 'blue-guppy']
    fish_names_r2 = ['orange-small', 'swordtail', 'orange-small-2']
    
    for c, name in zip(row1, fish_names_r1):
        cap = 900 if name == 'orange-guppy' else 600
        sprite = crop_component_with_margin(fish_im, fish_labels, c['idx'], c['bbox'], margin=8, cap_width=cap)
        save_path = os.path.join(out_dirs['fish'], f"{name}.webp")
        sprite.save(save_path, 'WEBP', quality=90)
        extracted_sprites.append((name, sprite, 'fish'))
        print(f"  Saved {save_path} ({sprite.width}x{sprite.height})")
        
    for c, name in zip(row2, fish_names_r2):
        cap = 600
        sprite = crop_component_with_margin(fish_im, fish_labels, c['idx'], c['bbox'], margin=8, cap_width=cap)
        save_path = os.path.join(out_dirs['fish'], f"{name}.webp")
        sprite.save(save_path, 'WEBP', quality=90)
        extracted_sprites.append((name, sprite, 'fish'))
        print(f"  Saved {save_path} ({sprite.width}x{sprite.height})")

    # --- 2. PROPS SHEET (6 props) ---
    print("Slicing props sheet...")
    props_im = cleaned_sheets['props']
    props_comps, props_labels = get_connected_components(props_im, min_area=1000)
    
    p_row1 = sorted([c for c in props_comps if c['centroid'][1] < 330], key=lambda c: c['centroid'][0])
    p_row2 = sorted([c for c in props_comps if c['centroid'][1] >= 330], key=lambda c: c['centroid'][0])
    
    assert len(p_row1) == 3, f"Expected 3 props in row 1, got {len(p_row1)}"
    assert len(p_row2) == 3, f"Expected 3 props in row 2, got {len(p_row2)}"
    
    props_names_r1 = ['crayfish', 'seaweed-1', 'seaweed-2']
    props_names_r2 = ['rock-large', 'rock-small', 'rocks-cluster']
    
    for c, name in zip(p_row1, props_names_r1):
        sprite = crop_component_with_margin(props_im, props_labels, c['idx'], c['bbox'], margin=8, cap_width=700)
        save_path = os.path.join(out_dirs['props'], f"{name}.webp")
        sprite.save(save_path, 'WEBP', quality=90)
        extracted_sprites.append((name, sprite, 'props'))
        print(f"  Saved {save_path} ({sprite.width}x{sprite.height})")
        
    for c, name in zip(p_row2, props_names_r2):
        sprite = crop_component_with_margin(props_im, props_labels, c['idx'], c['bbox'], margin=8, cap_width=700)
        save_path = os.path.join(out_dirs['props'], f"{name}.webp")
        sprite.save(save_path, 'WEBP', quality=90)
        extracted_sprites.append((name, sprite, 'props'))
        print(f"  Saved {save_path} ({sprite.width}x{sprite.height})")

    # --- 3. DETAILS SHEET (18 objects) ---
    print("Slicing details sheet...")
    det_im = cleaned_sheets['details']
    det_comps, det_labels = get_connected_components(det_im, min_area=100)
    
    # Top row (cy < 300)
    top_comps = [c for c in det_comps if c['centroid'][1] < 300]
    bot_comps = [c for c in det_comps if c['centroid'][1] >= 300]
    
    # Bubbles: x < 300 in top row (5 bubbles, sort by size descending)
    bubbles = [c for c in top_comps if c['centroid'][0] < 300]
    assert len(bubbles) == 5, f"Expected 5 bubbles, found {len(bubbles)}"
    bubbles = sorted(bubbles, key=lambda c: c['area'], reverse=True)
    
    for i, c in enumerate(bubbles, 1):
        name = f"bubble-{i}"
        sprite = crop_component_with_margin(det_im, det_labels, c['idx'], c['bbox'], margin=8, cap_width=200)
        save_path = os.path.join(out_dirs['fx'], f"{name}.webp")
        sprite.save(save_path, 'WEBP', quality=90)
        extracted_sprites.append((name, sprite, 'fx'))
        print(f"  Saved {save_path} ({sprite.width}x{sprite.height})")
        
    # Droplets: 300 <= x < 600 in top row (4 droplets, sort left to right)
    droplets = sorted([c for c in top_comps if 300 <= c['centroid'][0] < 600], key=lambda c: c['centroid'][0])
    assert len(droplets) == 4, f"Expected 4 droplets, found {len(droplets)}"
    for i, c in enumerate(droplets, 1):
        name = f"droplet-{i}"
        sprite = crop_component_with_margin(det_im, det_labels, c['idx'], c['bbox'], margin=8, cap_width=200)
        save_path = os.path.join(out_dirs['fx'], f"{name}.webp")
        sprite.save(save_path, 'WEBP', quality=90)
        extracted_sprites.append((name, sprite, 'fx'))
        print(f"  Saved {save_path} ({sprite.width}x{sprite.height})")
        
    # Star: 600 <= x < 780 in top row
    stars = [c for c in top_comps if 600 <= c['centroid'][0] < 780]
    assert len(stars) == 1, f"Expected 1 star, found {len(stars)}"
    name = "star"
    sprite = crop_component_with_margin(det_im, det_labels, stars[0]['idx'], stars[0]['bbox'], margin=8, cap_width=200)
    save_path = os.path.join(out_dirs['fx'], f"{name}.webp")
    sprite.save(save_path, 'WEBP', quality=90)
    extracted_sprites.append((name, sprite, 'fx'))
    print(f"  Saved {save_path} ({sprite.width}x{sprite.height})")
    
    # Rays: x >= 780 in top row (3 components merged into 1)
    ray_comps = [c for c in top_comps if c['centroid'][0] >= 780]
    ray_indices = [c['idx'] for c in ray_comps]
    min_x = min(c['bbox'][0] for c in ray_comps)
    min_y = min(c['bbox'][1] for c in ray_comps)
    max_x = max(c['bbox'][2] for c in ray_comps)
    max_y = max(c['bbox'][3] for c in ray_comps)
    name = "rays"
    sprite = crop_component_with_margin(det_im, det_labels, ray_indices, (min_x, min_y, max_x, max_y), margin=8, cap_width=200)
    save_path = os.path.join(out_dirs['fx'], f"{name}.webp")
    sprite.save(save_path, 'WEBP', quality=90)
    extracted_sprites.append((name, sprite, 'fx'))
    print(f"  Saved {save_path} ({sprite.width}x{sprite.height})")
    
    # Bottom row: peek-blue (x < 450) and pellets (x >= 450)
    peek_comps = [c for c in bot_comps if c['centroid'][0] < 450]
    assert len(peek_comps) == 1, f"Expected 1 peek-blue, found {len(peek_comps)}"
    name = "peek-blue"
    sprite = crop_component_with_margin(det_im, det_labels, peek_comps[0]['idx'], peek_comps[0]['bbox'], margin=8, cap_width=600)
    # User instruction: "in /public/fish/ (all fish and peek-blue)"
    save_path = os.path.join(out_dirs['fish'], f"{name}.webp")
    sprite.save(save_path, 'WEBP', quality=90)
    extracted_sprites.append((name, sprite, 'fish'))
    print(f"  Saved {save_path} ({sprite.width}x{sprite.height})")
    
    pellets = sorted([c for c in bot_comps if c['centroid'][0] >= 450], key=lambda c: c['centroid'][0])
    assert len(pellets) == 6, f"Expected 6 pellets, found {len(pellets)}"
    for i, c in enumerate(pellets, 1):
        name = f"pellet-{i}"
        sprite = crop_component_with_margin(det_im, det_labels, c['idx'], c['bbox'], margin=8, cap_width=200)
        save_path = os.path.join(out_dirs['fx'], f"{name}.webp")
        sprite.save(save_path, 'WEBP', quality=90)
        extracted_sprites.append((name, sprite, 'fx'))
        print(f"  Saved {save_path} ({sprite.width}x{sprite.height})")

    # --- 4. GENERATE CONTACT SHEET /public/sprite-preview.png ---
    print(f"Generating contact sheet with {len(extracted_sprites)} sprites...")
    create_checkerboard_contact_sheet(extracted_sprites, "public/sprite-preview.png")
    print("Done slicing!")

def create_checkerboard_contact_sheet(sprites, out_path):
    # Create contact sheet with 5 columns
    cols = 5
    rows = (len(sprites) + cols - 1) // cols
    cell_w, cell_h = 320, 240
    sheet_w, sheet_h = cols * cell_w, rows * cell_h
    
    # Checkerboard background
    check_size = 16
    checker = Image.new('RGB', (sheet_w, sheet_h), (50, 50, 55))
    draw_check = ImageDraw.Draw(checker)
    for y in range(0, sheet_h, check_size):
        for x in range(0, sheet_w, check_size):
            if ((x // check_size) + (y // check_size)) % 2 == 0:
                draw_check.rectangle([x, y, x + check_size, y + check_size], fill=(70, 70, 75))
                
    draw = ImageDraw.Draw(checker)
    
    for i, (name, sprite, category) in enumerate(sprites):
        col = i % cols
        row = i // cols
        cx = col * cell_w + cell_w // 2
        cy = row * cell_h + (cell_h - 40) // 2
        
        # Fit sprite within (cell_w - 30, cell_h - 60)
        max_w = cell_w - 30
        max_h = cell_h - 60
        scale = min(1.0, max_w / sprite.width, max_h / sprite.height)
        render_w = max(1, int(sprite.width * scale))
        render_h = max(1, int(sprite.height * scale))
        rendered_sprite = sprite.resize((render_w, render_h), Image.Resampling.LANCZOS)
        
        # Paste centered
        px = cx - render_w // 2
        py = cy - render_h // 2
        checker.paste(rendered_sprite, (px, py), rendered_sprite)
        
        # Cell border
        draw.rectangle([col * cell_w, row * cell_h, (col + 1) * cell_w - 1, (row + 1) * cell_h - 1], outline=(90, 90, 100))
        
        # Text label
        label = f"{name} ({sprite.width}x{sprite.height})"
        draw.text((col * cell_w + 10, (row + 1) * cell_h - 28), label, fill=(255, 235, 160))
        draw.text((col * cell_w + 10, (row + 1) * cell_h - 14), category.upper(), fill=(150, 200, 255))
        
    checker.save(out_path, 'PNG')
    print(f"Contact sheet saved to {out_path}")

if __name__ == '__main__':
    slice_all()
