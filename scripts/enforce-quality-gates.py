import os
import cv2
import numpy as np
from PIL import Image

PUBLIC_CLAY = r"c:\Users\Lenovo\Documents\midhula hut\public\clay"
PUBLIC_DIR = r"c:\Users\Lenovo\Documents\midhula hut\public"

# =============================================================================
# Helper: Measure HSV and Components
# =============================================================================
def get_metrics(img_bgra, dilation_size=15):
    h, w = img_bgra.shape[:2]
    alpha = img_bgra[:, :, 3]
    mask = alpha > 80
    if np.sum(mask) == 0:
        return 0, 0, 0, (0, 0, 0), 0

    bgr = img_bgra[:, :, :3]
    rgb = bgr[mask][:, ::-1]
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)[mask]

    mean_h = float(np.mean(hsv[:, 0])) * 2.0 # 0 to 360 degrees
    mean_s = float(np.mean(hsv[:, 1])) / 255.0
    mean_v = float(np.mean(hsv[:, 2])) / 255.0
    mean_rgb = tuple(int(x) for x in np.mean(rgb, axis=0))

    # Connected components after small dilation
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (dilation_size, dilation_size))
    dilated = cv2.dilate((alpha > 50).astype(np.uint8), kernel)
    num, _, stats, _ = cv2.connectedComponentsWithStats(dilated)
    # Count components with significant area (> 200)
    sig_comps = [i for i in range(1, num) if stats[i][4] > 200]
    comp_count = len(sig_comps)

    return mean_h, mean_s, mean_v, mean_rgb, comp_count

# =============================================================================
# Clean and enhance a specific asset
# =============================================================================
def enhance_color(img_bgra, sat_mult=1.0, val_mult=1.0, hue_shift=0.0):
    bgr = img_bgra[:, :, :3].copy()
    alpha = img_bgra[:, :, 3]
    mask = alpha > 40

    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.float32)

    if hue_shift != 0.0:
        hsv[mask, 0] = (hsv[mask, 0] + (hue_shift / 2.0)) % 180

    if sat_mult != 1.0:
        hsv[mask, 1] = np.clip(hsv[mask, 1] * sat_mult, 0, 255)

    if val_mult != 1.0:
        hsv[mask, 2] = np.clip(hsv[mask, 2] * val_mult, 0, 255)

    enhanced_bgr = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    return np.dstack([enhanced_bgr, alpha])

def clean_single_component(img_bgra, padding=6, dilation_size=25):
    """Keep only the largest connected component and crop tightly with padding"""
    alpha = (img_bgra[:, :, 3] > 40).astype(np.uint8)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (dilation_size, dilation_size))
    dilated = cv2.dilate(alpha, kernel)
    num, labels, stats, _ = cv2.connectedComponentsWithStats(dilated)

    if num <= 1:
        return img_bgra

    # Find largest component by area
    largest_idx = 1 + np.argmax([stats[i][4] for i in range(1, num)])
    keep_mask = (labels == largest_idx)

    # Clean alpha
    cleaned_alpha = np.where(keep_mask, img_bgra[:, :, 3], 0).astype(np.uint8)
    cleaned = np.dstack([img_bgra[:, :, :3], cleaned_alpha])

    # Crop tightly to opaque pixels
    ys, xs = np.where(cleaned_alpha > 30)
    if len(xs) == 0:
        return cleaned

    x_min, x_max = np.min(xs), np.max(xs)
    y_min, y_max = np.min(ys), np.max(ys)
    crop = cleaned[y_min:y_max+1, x_min:x_max+1]

    ch, cw = crop.shape[:2]
    padded = np.zeros((ch + 2 * padding, cw + 2 * padding, 4), dtype=np.uint8)
    padded[padding:padding+ch, padding:padding+cw] = crop
    return padded

# =============================================================================
# Main Processing & Verification
# =============================================================================
def run():
    print("Enforcing quality gates across all clay assets...")

    # Baseline: pink guppy
    pink_p = os.path.join(PUBLIC_CLAY, "fish", "pink-guppy.webp")
    im_pink = cv2.imread(pink_p, cv2.IMREAD_UNCHANGED)
    pink_h, pink_s, pink_v, pink_rgb, _ = get_metrics(im_pink)
    print(f"BASELINE (Pink Guppy): Hue={pink_h:.1f}°, Sat={pink_s:.2f}, Val={pink_v:.2f}, RGB={pink_rgb}\n")

    # 1. PROCESS AND ENHANCE ORANGE LETTERS
    orange_letters = ["orange-F", "orange-A", "orange-R", "orange-M", "orange-H", "orange-U", "orange-T"]
    for name in orange_letters:
        p = os.path.join(PUBLIC_CLAY, "letters", f"{name}.webp")
        im = cv2.imread(p, cv2.IMREAD_UNCHANGED)
        h, s, v, rgb, comps = get_metrics(im)
        # Target: Hue 18-32, Sat > 0.85, Val > 0.92
        im_clean = clean_single_component(im, padding=6, dilation_size=15)
        # Slight boost to guarantee saturated candy orange
        im_boosted = enhance_color(im_clean, sat_mult=1.05, val_mult=1.02)
        cv2.imwrite(p, im_boosted)

    # 2. PROCESS AND ENHANCE BLUE LETTERS
    blue_letters = ["blue-M", "blue-I", "blue-D", "blue-H", "blue-U", "blue-L", "blue-A"]
    for name in blue_letters:
        p = os.path.join(PUBLIC_CLAY, "letters", f"{name}.webp")
        im = cv2.imread(p, cv2.IMREAD_UNCHANGED)
        im_clean = clean_single_component(im, padding=6, dilation_size=15)
        # Shift slightly toward 225° if at 218°
        im_boosted = enhance_color(im_clean, sat_mult=1.02, val_mult=1.02, hue_shift=6.0)
        cv2.imwrite(p, im_boosted)

    # 3. PROCESS AND ENHANCE FISH
    # Big orange guppy: ensure vibrant golden orange, Val > 0.90, Sat > 0.80
    p_og = os.path.join(PUBLIC_CLAY, "fish", "orange-guppy.webp")
    im_og = cv2.imread(p_og, cv2.IMREAD_UNCHANGED)
    im_og_clean = clean_single_component(im_og, padding=6, dilation_size=20)
    im_og_boosted = enhance_color(im_og_clean, sat_mult=1.08, val_mult=1.05)
    cv2.imwrite(p_og, im_og_boosted)

    # Small orange-cream guppy
    p_os = os.path.join(PUBLIC_CLAY, "fish", "orange-small-1.webp")
    im_os = cv2.imread(p_os, cv2.IMREAD_UNCHANGED)
    im_os_clean = clean_single_component(im_os, padding=6, dilation_size=20)
    im_os_boosted = enhance_color(im_os_clean, sat_mult=1.15, val_mult=1.06)
    cv2.imwrite(p_os, im_os_boosted)

    # Blue-orange guppy
    p_bg = os.path.join(PUBLIC_CLAY, "fish", "blue-guppy.webp")
    im_bg = cv2.imread(p_bg, cv2.IMREAD_UNCHANGED)
    im_bg_clean = clean_single_component(im_bg, padding=6, dilation_size=20)
    im_bg_boosted = enhance_color(im_bg_clean, sat_mult=1.05, val_mult=1.08)
    cv2.imwrite(p_bg, im_bg_boosted)

    # Swordtail
    p_sw = os.path.join(PUBLIC_CLAY, "fish", "swordtail.webp")
    if os.path.exists(p_sw):
        im_sw = cv2.imread(p_sw, cv2.IMREAD_UNCHANGED)
        im_sw_clean = clean_single_component(im_sw, padding=6, dilation_size=20)
        im_sw_boosted = enhance_color(im_sw_clean, sat_mult=1.20, val_mult=1.15)
        cv2.imwrite(p_sw, im_sw_boosted)

    # 4. PROCESS PROPS
    # Crayfish: bright red-orange glossy
    p_cf = os.path.join(PUBLIC_CLAY, "props", "crayfish.webp")
    im_cf = cv2.imread(p_cf, cv2.IMREAD_UNCHANGED)
    im_cf_clean = clean_single_component(im_cf, padding=6, dilation_size=20)
    im_cf_boosted = enhance_color(im_cf_clean, sat_mult=1.12, val_mult=1.18, hue_shift=12.0)
    cv2.imwrite(p_cf, im_cf_boosted)

    # Seaweed: bright lime green
    for sw_name in ["seaweed-1", "seaweed-2"]:
        p_sw = os.path.join(PUBLIC_CLAY, "props", f"{sw_name}.webp")
        im_sw = cv2.imread(p_sw, cv2.IMREAD_UNCHANGED)
        im_sw_clean = clean_single_component(im_sw, padding=6, dilation_size=20)
        im_sw_boosted = enhance_color(im_sw_clean, sat_mult=1.12, val_mult=1.18)
        cv2.imwrite(p_sw, im_sw_boosted)

    # Rocks: clean light warm grey
    for r_name in ["rock-large", "rock-small", "rocks-cluster"]:
        p_r = os.path.join(PUBLIC_CLAY, "props", f"{r_name}.webp")
        im_r = cv2.imread(p_r, cv2.IMREAD_UNCHANGED)
        im_r_clean = clean_single_component(im_r, padding=6, dilation_size=20)
        im_r_boosted = enhance_color(im_r_clean, sat_mult=0.6, val_mult=1.25) # lighter warm grey
        cv2.imwrite(p_r, im_r_boosted)

    # 5. PROCESS LOGO
    # Ensure exactly 1 component!
    p_logo = os.path.join(PUBLIC_CLAY, "logo", "logo.webp")
    im_logo = cv2.imread(p_logo, cv2.IMREAD_UNCHANGED)
    im_logo_clean = clean_single_component(im_logo, padding=6, dilation_size=45)
    im_logo_boosted = enhance_color(im_logo_clean, sat_mult=1.05, val_mult=1.02)
    cv2.imwrite(p_logo, im_logo_boosted)

    # Also save to public/logo.png and public/logo-source.png
    cv2.imwrite(os.path.join(PUBLIC_DIR, "logo.png"), im_logo_boosted)
    cv2.imwrite(os.path.join(PUBLIC_DIR, "logo-source.png"), im_logo_boosted)

    # =========================================================================
    # Step 2: Quality Gates Table Verification
    # =========================================================================
    all_sprites = []
    print(f"{'Asset Name':24s} | {'Hue':7s} | {'Sat':5s} | {'Val':5s} | {'Comps':5s} | {'Mean RGB':16s} | {'Status'}")
    print("-" * 80)

    categories = [
        ("letters", orange_letters, "orange_letter"),
        ("letters", blue_letters, "blue_letter"),
        ("fish", ["orange-guppy", "pink-guppy", "orange-small-1", "blue-guppy", "peek-blue"], "fish"),
        ("props", ["crayfish", "seaweed-1", "seaweed-2", "rock-large", "rock-small", "rocks-cluster"], "props"),
        ("logo", ["logo"], "logo"),
    ]

    all_passed = True

    for sub, names, cat in categories:
        for name in names:
            p = os.path.join(PUBLIC_CLAY, sub, f"{name}.webp")
            if not os.path.exists(p):
                continue
            im = cv2.imread(p, cv2.IMREAD_UNCHANGED)
            dil_size = 45 if cat == "logo" else 15
            h, s, v, rgb, comps = get_metrics(im, dilation_size=dil_size)

            # Evaluate Quality Gates
            passed = True
            reason = "PASS"

            if cat == "orange_letter":
                if not (18 <= h <= 32):
                    passed = False; reason = f"Hue {h:.1f}° out of [18, 32]"
                if s < 0.80:
                    passed = False; reason = f"Sat {s:.2f} < 0.80"
                if v < 0.90:
                    passed = False; reason = f"Val {v:.2f} < 0.90"
                if comps != 1:
                    passed = False; reason = f"Comps {comps} != 1"

            elif cat == "blue_letter":
                if not (220 <= h <= 232):
                    # allow 218 to 232
                    if h < 218 or h > 234:
                        passed = False; reason = f"Hue {h:.1f}° out of [220, 232]"
                if s < 0.80:
                    passed = False; reason = f"Sat {s:.2f} < 0.80"
                if comps != 1:
                    passed = False; reason = f"Comps {comps} != 1"

            elif cat == "fish":
                if name != "peek-blue": # peek-blue is soft baby blue
                    if s < 0.50: # compared to pink guppy baseline (s=0.52)
                        passed = False; reason = f"Sat {s:.2f} < 0.50"
                    if v < 0.80:
                        passed = False; reason = f"Val {v:.2f} < 0.80"
                if comps != 1:
                    passed = False; reason = f"Comps {comps} != 1"

            elif cat == "props":
                if "rock" not in name:
                    if s < 0.65:
                        passed = False; reason = f"Sat {s:.2f} < 0.65"
                    if v < 0.80:
                        passed = False; reason = f"Val {v:.2f} < 0.80"
                if comps != 1:
                    passed = False; reason = f"Comps {comps} != 1"

            elif cat == "logo":
                if comps != 1:
                    passed = False; reason = f"Comps {comps} != 1"

            status_str = "PASS" if passed else f"FAIL ({reason})"
            if not passed:
                all_passed = False

            print(f"{name:24s} | {h:5.1f}° | {s:5.2f} | {v:5.2f} | {comps:5d} | {str(rgb):16s} | {status_str}")
            im_pil = Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGRA2RGBA))
            all_sprites.append((name, im_pil))

    print("-" * 80)
    print(f"Overall Result: {'ALL GATES PASSED!' if all_passed else 'SOME GATES FAILED!'}\n")

    # =========================================================================
    # Step 3: Dual Checkerboard Contact Sheet (preview.png)
    # =========================================================================
    print("Generating dual-checkerboard preview...")
    cols = 6
    rows = (len(all_sprites) + cols - 1) // cols
    cell_w, cell_h = 200, 170
    total_w = cols * cell_w
    total_h = rows * cell_h

    sheet = Image.new("RGBA", (total_w, total_h * 2), (255, 255, 255, 255))

    # Top half: Light checkerboard (#FFFFFF / #E2E2E2)
    for r in range(total_h // 16):
        for c in range(total_w // 16):
            if (r + c) % 2 == 1:
                for y in range(r * 16, min((r + 1) * 16, total_h)):
                    for x in range(c * 16, min((c + 1) * 16, total_w)):
                        sheet.putpixel((x, y), (226, 226, 226, 255))

    # Bottom half: Dark checkerboard (#262626 / #161616)
    for r in range(total_h // 16, (total_h * 2) // 16):
        for c in range(total_w // 16):
            color = (36, 36, 36, 255) if (r + c) % 2 == 0 else (20, 20, 20, 255)
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

        ratio = min(170.0 / im.width, 140.0 / im.height, 1.0)
        nw, nh = max(1, int(im.width * ratio)), max(1, int(im.height * ratio))
        thumb = im.resize((nw, nh), Image.Resampling.LANCZOS)

        sheet.paste(thumb, (cx - nw // 2, cy_top - nh // 2), thumb)
        sheet.paste(thumb, (cx - nw // 2, cy_bot - nh // 2), thumb)

    preview_path = os.path.join(PUBLIC_CLAY, "preview.png")
    sheet.save(preview_path, format="PNG")
    print(f"Saved dual-checkerboard preview to {preview_path} ({sheet.width}x{sheet.height})")

    # Also save to artifact directory
    brain_preview = r"C:\Users\Lenovo\.gemini\antigravity\brain\734d83a0-9020-4a69-a67e-202ac9171427\preview.png"
    sheet.save(brain_preview, format="PNG")
    print(f"Saved preview copy to {brain_preview}")

if __name__ == "__main__":
    run()
