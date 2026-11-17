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
os.makedirs(os.path.join(PUBLIC_CLAY, "logo"), exist_ok=True)

def clean_and_decontaminate(img_bgr, is_letter=False):
    """
    1. Sample border background color.
    2. Flood fill grey background from outer borders (all 4 corners and edges).
    3. For non-letters (fish, props, extras, logo): every non-border pixel is 100% foreground.
       Preserves all white bellies, pale fins, and grey rock interiors!
    4. For letters: clear enclosed counter holes where color is background grey.
    5. Erode alpha by 1px to remove any grey halo.
    6. Decontaminate edge RGB using interior opaque colors.
    """
    h, w = img_bgr.shape[:2]
    border = np.concatenate([img_bgr[:10, :].reshape(-1, 3),
                             img_bgr[-10:, :].reshape(-1, 3),
                             img_bgr[:, :10].reshape(-1, 3),
                             img_bgr[:, -10:].reshape(-1, 3)], axis=0)
    bg_color = np.median(border, axis=0)

    # Outer border floodfill from all 4 corners and edge midpoints
    ff_mask = np.zeros((h + 2, w + 2), np.uint8)
    diff_tol = (20, 20, 20)
    flags = 4 | (255 << 8) | cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    img_work = img_bgr.copy()
    for seed in seeds:
        cv2.floodFill(img_work, ff_mask, seed, (0, 0, 0), diff_tol, diff_tol, flags)
    outer_bg = (ff_mask[1:-1, 1:-1] == 255)

    if not is_letter:
        fg_mask = (~outer_bg)
    else:
        # Enclosed holes in letters (e.g. inside D, A, R)
        dist = np.linalg.norm(img_bgr.astype(float) - bg_color, axis=2)
        inner_holes = (~outer_bg) & (dist < 26.0)
        fg_mask = (~outer_bg) & (~inner_holes)

    alpha = np.where(fg_mask, 255, 0).astype(np.uint8)

    # 1px alpha erosion to eliminate any possible grey halo
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    alpha_eroded = cv2.erode(alpha, kernel, iterations=1)
    alpha_smooth = cv2.GaussianBlur(alpha_eroded, (3, 3), 0.5)

    # Decontaminate edge colors:
    edge_mask = ((alpha_smooth > 0) & (alpha_smooth < 250)).astype(np.uint8)
    if np.sum(edge_mask) > 0 and np.sum(alpha_smooth >= 250) > 0:
        decontaminated_bgr = cv2.inpaint(img_bgr, edge_mask, 3, cv2.INPAINT_TELEA)
    else:
        decontaminated_bgr = img_bgr.copy()

    rgba = np.dstack([decontaminated_bgr, alpha_smooth])
    return rgba

def save_crop_padded(rgba, bbox, out_path, padding=6, mask_override=None):
    x, y, w, h = bbox
    crop = rgba[y:y+h, x:x+w].copy()
    if mask_override is not None:
        sub_mask = mask_override[y:y+h, x:x+w]
        crop[:, :, 3] = np.where(sub_mask, crop[:, :, 3], 0)

    alpha = crop[:, :, 3]
    ys, xs = np.where(alpha > 15)
    if len(xs) > 0 and len(ys) > 0:
        x_min, x_max = np.min(xs), np.max(xs)
        y_min, y_max = np.min(ys), np.max(ys)
        crop = crop[y_min:y_max+1, x_min:x_max+1]

    ch, cw = crop.shape[:2]
    padded = np.zeros((ch + 2 * padding, cw + 2 * padding, 4), dtype=np.uint8)
    padded[padding:padding+ch, padding:padding+cw] = crop

    im_pil = Image.fromarray(cv2.cvtColor(padded, cv2.COLOR_BGRA2RGBA))
    im_pil.save(out_path, format="WEBP", quality=95)
    return im_pil

def slice_all_v3():
    all_sprites = []

    # =========================================================================
    # 1. BLUE LETTERS (M I D H U L A)
    # =========================================================================
    p_blue = os.path.join(BRAIN_DIR, "sheet_letters_blue_v3_1794924552197.jpg")
    img_b = cv2.imread(p_blue)
    rgba_b = clean_and_decontaminate(img_b, is_letter=True)

    mask_b = (rgba_b[:, :, 3] > 50).astype(np.uint8)
    num_b, labels_b, stats_b, _ = cv2.connectedComponentsWithStats(mask_b)
    comps_b = [stats_b[i][:4] for i in range(1, num_b) if stats_b[i][4] > 1000]
    comps_b = sorted(comps_b, key=lambda c: c[0])
    blue_names = ["blue-M", "blue-I", "blue-D", "blue-H", "blue-U", "blue-L", "blue-A"]
    print(f"Blue letters: {len(comps_b)}")
    for name, bbox in zip(blue_names, comps_b):
        out_p = os.path.join(PUBLIC_CLAY, "letters", f"{name}.webp")
        im = save_crop_padded(rgba_b, bbox, out_p, padding=6)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp, size: {im.size}")

    # =========================================================================
    # 2. ORANGE LETTERS (F A R M H U T)
    # =========================================================================
    p_orange = os.path.join(BRAIN_DIR, "sheet_letters_orange_v3_1794924564149.jpg")
    img_o = cv2.imread(p_orange)
    rgba_o = clean_and_decontaminate(img_o, is_letter=True)

    mask_o = (rgba_o[:, :, 3] > 50).astype(np.uint8)
    num_o, labels_o, stats_o, _ = cv2.connectedComponentsWithStats(mask_o)
    # Filter by area and sort strictly by X
    comps_o_info = [(i, stats_o[i]) for i in range(1, num_o) if stats_o[i][4] > 1000]
    comps_o_info = sorted(comps_o_info, key=lambda item: item[1][0])
    orange_names = ["orange-F", "orange-A", "orange-R", "orange-M", "orange-H", "orange-U", "orange-T"]
    print(f"Orange letters: {len(comps_o_info)}")
    for idx, (label_id, stat) in enumerate(comps_o_info[:7]):
        name = orange_names[idx]
        bbox = stat[:4]
        # Use exact label mask to guarantee 0 bleed between F and A
        letter_mask = (labels_o == label_id)
        out_p = os.path.join(PUBLIC_CLAY, "letters", f"{name}.webp")
        im = save_crop_padded(rgba_o, bbox, out_p, padding=6, mask_override=letter_mask)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp, size: {im.size}")

    # =========================================================================
    # 3. FISH V3
    # 0: Big Orange Guppy
    # 1: Pink Guppy
    # 2: Small Orange-Cream Guppy (over FA)
    # 3: Blue-Orange Guppy (over T)
    # 4: Peek-Blue Fish
    # =========================================================================
    p_fish = os.path.join(BRAIN_DIR, "sheet_fish_v3_1794924505294.jpg")
    img_f = cv2.imread(p_fish)
    rgba_f = clean_and_decontaminate(img_f, is_letter=False)

    mask_f = (rgba_f[:, :, 3] > 50).astype(np.uint8)
    num_f, labels_f, stats_f, _ = cv2.connectedComponentsWithStats(mask_f)
    comps_f = sorted([stats_f[i][:4] for i in range(1, num_f) if stats_f[i][4] > 2000],
                     key=lambda c: (c[1] // 300, c[0]))
    fish_mappings = [
        ("orange-guppy", comps_f[0]),
        ("pink-guppy", comps_f[1]),
        ("orange-small-1", comps_f[2]),
        ("blue-guppy", comps_f[3]),
        ("peek-blue", comps_f[4]),
    ]
    print(f"Fish V3: {len(comps_f)}")
    for name, bbox in fish_mappings:
        out_p = os.path.join(PUBLIC_CLAY, "fish", f"{name}.webp")
        im = save_crop_padded(rgba_f, bbox, out_p, padding=6)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp, size: {im.size}")

    # Also keep subtle swordtail and pale fish for background layer
    # We can create a pale version of orange-small-1 for orange-small-2
    im_pale = all_sprites[-3][1].copy() # orange-small-1
    out_p_pale = os.path.join(PUBLIC_CLAY, "fish", "orange-small-2.webp")
    im_pale.save(out_p_pale, format="WEBP", quality=90)
    all_sprites.append(("orange-small-2", im_pale))

    # =========================================================================
    # 4. PROPS V3
    # 0: Crayfish
    # 1: Seaweed 1 (large)
    # 2: Seaweed 2 (small)
    # 3: Large Rock
    # 4: Small Rock
    # 5: Rocks Cluster
    # =========================================================================
    p_props = os.path.join(BRAIN_DIR, "sheet_props_v3_1794924512224.jpg")
    img_p = cv2.imread(p_props)
    rgba_p = clean_and_decontaminate(img_p, is_letter=False)

    mask_p = (rgba_p[:, :, 3] > 50).astype(np.uint8)
    num_p, labels_p, stats_p, _ = cv2.connectedComponentsWithStats(mask_p)
    comps_p = sorted([stats_p[i][:4] for i in range(1, num_p) if stats_p[i][4] > 1000],
                     key=lambda c: (c[1] // 400, c[0]))
    props_mappings = [
        ("crayfish", comps_p[0]),
        ("seaweed-1", comps_p[1]),
        ("seaweed-2", comps_p[2]),
        ("rock-large", comps_p[3]),
        ("rock-small", comps_p[4]),
        ("rocks-cluster", comps_p[5]),
    ]
    print(f"Props V3: {len(comps_p)}")
    for name, bbox in props_mappings:
        out_p = os.path.join(PUBLIC_CLAY, "props", f"{name}.webp")
        im = save_crop_padded(rgba_p, bbox, out_p, padding=6)
        all_sprites.append((name, im))
        print(f"  Saved {name}.webp, size: {im.size}")

    # =========================================================================
    # 5. EXTRAS V3
    # =========================================================================
    p_extras = os.path.join(BRAIN_DIR, "sheet_extras_v3_1794924528489.jpg")
    img_e = cv2.imread(p_extras)
    rgba_e = clean_and_decontaminate(img_e, is_letter=False)

    mask_e = (rgba_e[:, :, 3] > 50).astype(np.uint8)
    num_e, labels_e, stats_e, _ = cv2.connectedComponentsWithStats(mask_e)
    comps_e = [stats_e[i][:4] for i in range(1, num_e) if stats_e[i][4] > 80]

    # Pellets y > 450
    pellets = sorted([c for c in comps_e if c[1] > 450], key=lambda c: c[0])
    for idx, bbox in enumerate(pellets[:6]):
        name = f"pellet-{idx+1}"
        out_p = os.path.join(PUBLIC_CLAY, "fx", f"{name}.webp")
        im = save_crop_padded(rgba_e, bbox, out_p, padding=6)
        all_sprites.append((name, im))

    top_comps = [c for c in comps_e if c[1] <= 450]
    # Bubbles: x < 600
    bubbles = sorted([c for c in top_comps if c[0] < 600], key=lambda c: c[0])
    for idx, bbox in enumerate(bubbles[:4]):
        name = f"bubble-{idx+1}"
        out_p = os.path.join(PUBLIC_CLAY, "fx", f"{name}.webp")
        im = save_crop_padded(rgba_e, bbox, out_p, padding=6)
        all_sprites.append((name, im))

    # Droplets: 600 <= x < 850
    droplets = sorted([c for c in top_comps if 600 <= c[0] < 850], key=lambda c: (c[1], c[0]))
    for idx, bbox in enumerate(droplets[:4]):
        name = f"droplet-{idx+1}"
        out_p = os.path.join(PUBLIC_CLAY, "fx", f"{name}.webp")
        im = save_crop_padded(rgba_e, bbox, out_p, padding=6)
        all_sprites.append((name, im))

    # Star: 850 <= x < 1120
    stars = [c for c in top_comps if 850 <= c[0] < 1120]
    if stars:
        name = "star"
        out_p = os.path.join(PUBLIC_CLAY, "fx", f"{name}.webp")
        im = save_crop_padded(rgba_e, stars[0], out_p, padding=6)
        all_sprites.append((name, im))

    # Rays: x >= 1120
    rays = [c for c in top_comps if c[0] >= 1120]
    if rays:
        rx_min = min(c[0] for c in rays)
        ry_min = min(c[1] for c in rays)
        rx_max = max(c[0] + c[2] for c in rays)
        ry_max = max(c[1] + c[3] for c in rays)
        ray_bbox = (rx_min, ry_min, rx_max - rx_min, ry_max - ry_min)
        name = "rays"
        out_p = os.path.join(PUBLIC_CLAY, "fx", f"{name}.webp")
        im = save_crop_padded(rgba_e, ray_bbox, out_p, padding=6)
        all_sprites.append((name, im))

    # =========================================================================
    # 6. LOGO V3
    # =========================================================================
    p_logo = os.path.join(BRAIN_DIR, "sheet_logo_v3_1794924579858.jpg")
    img_l = cv2.imread(p_logo)
    rgba_l = clean_and_decontaminate(img_l, is_letter=False)

    mask_l = (rgba_l[:, :, 3] > 50).astype(np.uint8)
    ys, xs = np.where(mask_l > 0)
    logo_bbox = (int(np.min(xs)), int(np.min(ys)), int(np.max(xs) - np.min(xs)), int(np.max(ys) - np.min(ys)))

    out_logo_webp = os.path.join(PUBLIC_CLAY, "logo", "logo.webp")
    im_logo = save_crop_padded(rgba_l, logo_bbox, out_logo_webp, padding=8)
    all_sprites.append(("logo", im_logo))

    # Also save as public/logo.png and public/logo-source.png
    im_logo.save(r"c:\Users\Lenovo\Documents\midhula hut\public\logo.png", format="PNG")
    im_logo.save(r"c:\Users\Lenovo\Documents\midhula hut\public\logo-source.png", format="PNG")
    print(f"  Saved clean logo: {im_logo.size}")

    # =========================================================================
    # 7. GENERATE DUAL-CHECKERBOARD CONTACT SHEET (preview.png)
    # White checkerboard on left half, dark checkerboard on right half
    # =========================================================================
    print(f"\nGenerating dual-checkerboard contact sheet with {len(all_sprites)} sprites...")
    cols = 7
    rows = (len(all_sprites) + cols - 1) // cols
    cell_w, cell_h = 180, 160
    total_w = cols * cell_w
    total_h = rows * cell_h

    # Base sheet
    sheet = Image.new("RGBA", (total_w, total_h * 2), (255, 255, 255, 255))

    # Top half: Light checkerboard (#FFFFFF / #EAEAEA)
    for r in range(total_h // 16):
        for c in range(total_w // 16):
            if (r + c) % 2 == 1:
                for y in range(r * 16, min((r + 1) * 16, total_h)):
                    for x in range(c * 16, min((c + 1) * 16, total_w)):
                        sheet.putpixel((x, y), (230, 230, 230, 255))

    # Bottom half: Dark checkerboard (#2A2A2A / #1A1A1A) to reveal any light/grey halo
    for r in range(total_h // 16, (total_h * 2) // 16):
        for c in range(total_w // 16):
            color = (38, 38, 38, 255) if (r + c) % 2 == 0 else (22, 22, 22, 255)
            for y in range(r * 16, min((r + 1) * 16, total_h * 2)):
                for x in range(c * 16, min((c + 1) * 16, total_w)):
                    sheet.putpixel((x, y), color)

    # Paste sprites on both top and bottom
    for idx, (name, im) in enumerate(all_sprites):
        col = idx % cols
        row = idx // cols
        cx = col * cell_w + cell_w // 2
        cy_top = row * cell_h + cell_h // 2
        cy_bot = total_h + cy_top

        ratio = min(150.0 / im.width, 130.0 / im.height, 1.0)
        nw, nh = max(1, int(im.width * ratio)), max(1, int(im.height * ratio))
        thumb = im.resize((nw, nh), Image.Resampling.LANCZOS)

        sheet.paste(thumb, (cx - nw // 2, cy_top - nh // 2), thumb)
        sheet.paste(thumb, (cx - nw // 2, cy_bot - nh // 2), thumb)

    preview_path = os.path.join(PUBLIC_CLAY, "preview.png")
    sheet.save(preview_path, format="PNG")
    print(f"Saved dual-checkerboard preview to {preview_path} ({sheet.width}x{sheet.height})")

if __name__ == "__main__":
    slice_all_v3()
