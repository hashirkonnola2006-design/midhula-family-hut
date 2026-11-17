import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import distance_transform_edt, gaussian_filter

os.makedirs('public/clay/icons', exist_ok=True)

def render_clay_layer(mask, diffuse_rgb, height=22.0, light_dir=(-0.45, -0.55, 0.7), specular_power=22, gloss=0.45, rim_strength=0.25):
    """
    Renders a mask into a 3D clay object with Blinn-Phong lighting, top-left highlight, bottom-right shade.
    """
    if not np.any(mask):
        return Image.new('RGBA', (mask.shape[1], mask.shape[0]), (0,0,0,0))
    
    dist = distance_transform_edt(mask)
    max_d = np.percentile(dist[mask], 85) if np.any(mask) else 1.0
    z = np.sin(np.clip(dist / max(max_d * 0.55, 1.0), 0, 1) * (np.pi / 2)) * height
    z = gaussian_filter(z, sigma=1.6)
    
    dzdy, dzdx = np.gradient(z)
    nx = -dzdx
    ny = -dzdy
    nz = np.ones_like(z) * 6.5
    norm = np.sqrt(nx**2 + ny**2 + nz**2)
    norm[norm == 0] = 1.0
    nx /= norm
    ny /= norm
    nz /= norm
    
    # Light direction
    lx, ly, lz = light_dir
    l_len = np.sqrt(lx**2 + ly**2 + lz**2)
    lx, ly, lz = lx/l_len, ly/l_len, lz/l_len
    
    diffuse = np.clip(nx * lx + ny * ly + nz * lz, 0, 1)
    ambient = 0.45
    
    # Half vector for Blinn-Phong
    hx, hy, hz = lx, ly, lz + 1.0
    h_len = np.sqrt(hx**2 + hy**2 + hz**2)
    hx, hy, hz = hx/h_len, hy/h_len, hz/h_len
    
    spec = np.clip(nx * hx + ny * hy + nz * hz, 0, 1) ** specular_power
    
    # Bottom-right bounce light
    rx, ry, rz = 0.45, 0.55, 0.35
    rim = np.clip(nx * rx + ny * ry + nz * rz, 0, 1) * rim_strength
    
    # Support RGB tuple or 2D/3D gradient array
    if isinstance(diffuse_rgb, tuple):
        r_base = np.full_like(z, diffuse_rgb[0])
        g_base = np.full_like(z, diffuse_rgb[1])
        b_base = np.full_like(z, diffuse_rgb[2])
    else:
        r_base = diffuse_rgb[:, :, 0]
        g_base = diffuse_rgb[:, :, 1]
        b_base = diffuse_rgb[:, :, 2]
    
    shade = np.clip(ambient + (1.0 - ambient) * diffuse + rim, 0.15, 1.0)
    
    r = np.clip(r_base * shade + 255.0 * gloss * spec, 0, 255)
    g = np.clip(g_base * shade + 255.0 * gloss * spec, 0, 255)
    b = np.clip(b_base * shade + 255.0 * gloss * spec, 0, 255)
    
    alpha = np.clip(dist * 2.5, 0, 1) * 255.0
    
    img_data = np.stack([r, g, b, alpha], axis=-1).astype(np.uint8)
    return Image.fromarray(img_data, 'RGBA')

def add_drop_shadow(img, offset=(0, 10), blur=14, opacity=0.35):
    """Adds a soft 3D clay drop shadow behind the image."""
    alpha = img.split()[-1]
    shadow = Image.new('RGBA', img.size, (20, 15, 40, int(255 * opacity)))
    shadow.putalpha(Image.eval(alpha, lambda a: int(a * opacity)))
    
    # Blur shadow
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    
    # Create final composite
    result = Image.new('RGBA', img.size, (0, 0, 0, 0))
    result.paste(shadow, offset, shadow)
    result.paste(img, (0, 0), img)
    return result

# ==============================================================================
# 1. YOUTUBE ICON
# ==============================================================================
def gen_youtube():
    W, H = 256, 256
    # Base red clay pill
    base_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(base_mask_img)
    draw.rounded_rectangle([28, 52, 228, 204], radius=48, fill=255)
    base_mask = np.array(base_mask_img) > 128
    
    base_layer = render_clay_layer(base_mask, (245, 35, 45), height=24.0, gloss=0.48)
    
    # White clay play triangle
    tri_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(tri_mask_img)
    draw.polygon([(108, 92), (170, 128), (108, 164)], fill=255)
    tri_mask = np.array(tri_mask_img) > 128
    
    tri_layer = render_clay_layer(tri_mask, (255, 252, 248), height=14.0, gloss=0.6, specular_power=26)
    
    # Composite
    comp = Image.new('RGBA', (W, H), (0,0,0,0))
    comp.paste(base_layer, (0,0), base_layer)
    comp.paste(tri_layer, (0,0), tri_layer)
    return add_drop_shadow(comp)

# ==============================================================================
# 2. INSTAGRAM ICON
# ==============================================================================
def gen_instagram():
    W, H = 256, 256
    # Gradient base rounded rect
    base_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(base_mask_img)
    draw.rounded_rectangle([32, 32, 224, 224], radius=54, fill=255)
    base_mask = np.array(base_mask_img) > 128
    
    # Clay sunset gradient
    Y, X = np.ogrid[:H, :W]
    grad = np.clip((X * 0.4 + Y * 0.6) / 256.0, 0, 1)
    
    # Gradient from warm amber-yellow (255, 175, 40) -> hot magenta (235, 40, 125) -> deep purple (135, 30, 180)
    r = (1.0 - grad) * 255 + grad * 190
    g = (1.0 - grad) * 160 + grad * 35
    b = (1.0 - grad) * 40 + grad * 175
    gradient_rgb = np.stack([r, g, b], axis=-1)
    
    base_layer = render_clay_layer(base_mask, gradient_rgb, height=24.0, gloss=0.52)
    
    # White clay camera ring + lens dot + flash dot
    cam_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(cam_mask_img)
    # Camera rounded square outline
    draw.rounded_rectangle([72, 72, 184, 184], radius=32, outline=255, width=15)
    # Center lens circle outline
    draw.ellipse([102, 102, 154, 154], outline=255, width=14)
    # Flash dot
    draw.ellipse([160, 88, 172, 100], fill=255)
    cam_mask = np.array(cam_mask_img) > 128
    
    cam_layer = render_clay_layer(cam_mask, (255, 252, 248), height=14.0, gloss=0.6, specular_power=26)
    
    comp = Image.new('RGBA', (W, H), (0,0,0,0))
    comp.paste(base_layer, (0,0), base_layer)
    comp.paste(cam_layer, (0,0), cam_layer)
    return add_drop_shadow(comp)

# ==============================================================================
# 3. WHATSAPP ICON
# ==============================================================================
def gen_whatsapp():
    W, H = 256, 256
    # Green clay speech bubble with rounded tail
    bubble_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(bubble_mask_img)
    draw.ellipse([32, 26, 224, 218], fill=255)
    # Speech tail at bottom left
    draw.polygon([(56, 176), (34, 228), (96, 212)], fill=255)
    bubble_mask = np.array(bubble_mask_img) > 128
    
    base_layer = render_clay_layer(bubble_mask, (37, 211, 102), height=25.0, gloss=0.48)
    
    # Phone handset mask
    phone_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(phone_mask_img)
    # Curved handset shape using thick lines and ellipses
    draw.line([(88, 98), (108, 118)], fill=255, width=24)
    draw.line([(108, 118), (142, 152)], fill=255, width=18)
    draw.line([(142, 152), (162, 172)], fill=255, width=24)
    draw.ellipse([78, 88, 108, 118], fill=255)
    draw.ellipse([142, 152, 172, 182], fill=255)
    phone_mask = np.array(phone_mask_img) > 128
    
    phone_layer = render_clay_layer(phone_mask, (255, 255, 252), height=15.0, gloss=0.62, specular_power=28)
    
    comp = Image.new('RGBA', (W, H), (0,0,0,0))
    comp.paste(base_layer, (0,0), base_layer)
    comp.paste(phone_layer, (0,0), phone_layer)
    return add_drop_shadow(comp)

# ==============================================================================
# 4. LOCATION PIN ICON
# ==============================================================================
def gen_location():
    W, H = 256, 256
    pin_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(pin_mask_img)
    # Teardrop: circle at top, triangle to bottom tip
    draw.ellipse([54, 24, 202, 172], fill=255)
    draw.polygon([(68, 136), (128, 234), (188, 136)], fill=255)
    pin_mask = np.array(pin_mask_img) > 128
    
    base_layer = render_clay_layer(pin_mask, (31, 79, 255), height=25.0, gloss=0.52)
    
    # Center white clay circle
    center_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(center_mask_img)
    draw.ellipse([98, 68, 158, 128], fill=255)
    center_mask = np.array(center_mask_img) > 128
    
    center_layer = render_clay_layer(center_mask, (255, 248, 230), height=14.0, gloss=0.58)
    
    comp = Image.new('RGBA', (W, H), (0,0,0,0))
    comp.paste(base_layer, (0,0), base_layer)
    comp.paste(center_layer, (0,0), center_layer)
    return add_drop_shadow(comp)

# ==============================================================================
# 5. COMMUNITY / PEOPLE ICON
# ==============================================================================
def gen_community():
    W, H = 256, 256
    # 3 chubby figures (Center blue, Left orange, Right green)
    comp = Image.new('RGBA', (W, H), (0,0,0,0))
    
    # Left figure (orange)
    left_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(left_mask_img)
    draw.ellipse([46, 76, 102, 132], fill=255) # head
    draw.rounded_rectangle([32, 136, 116, 214], radius=34, fill=255) # body
    left_layer = render_clay_layer(np.array(left_mask_img) > 128, (255, 106, 19), height=18.0)
    
    # Right figure (green)
    right_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(right_mask_img)
    draw.ellipse([154, 76, 210, 132], fill=255) # head
    draw.rounded_rectangle([140, 136, 224, 214], radius=34, fill=255) # body
    right_layer = render_clay_layer(np.array(right_mask_img) > 128, (31, 122, 62), height=18.0)
    
    # Center figure (larger electric blue)
    center_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(center_mask_img)
    draw.ellipse([94, 44, 162, 112], fill=255) # head
    draw.rounded_rectangle([80, 114, 176, 222], radius=40, fill=255) # body
    center_layer = render_clay_layer(np.array(center_mask_img) > 128, (31, 79, 255), height=24.0, gloss=0.55)
    
    comp.paste(left_layer, (0,0), left_layer)
    comp.paste(right_layer, (0,0), right_layer)
    comp.paste(center_layer, (0,0), center_layer)
    return add_drop_shadow(comp)

# ==============================================================================
# 6. SHIELD ICON
# ==============================================================================
def gen_shield():
    W, H = 256, 256
    # Classic rounded heraldic shield
    shield_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(shield_mask_img)
    draw.polygon([(46, 40), (210, 40), (210, 136), (128, 228), (46, 136)], fill=255)
    # Round the corners with morphological smoothing
    shield_mask = gaussian_filter((np.array(shield_mask_img) > 128).astype(float), sigma=6.0) > 0.4
    
    base_layer = render_clay_layer(shield_mask, (31, 79, 255), height=24.0, gloss=0.52)
    
    # Gold/cream clay checkmark
    check_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(check_mask_img)
    draw.line([(88, 124), (116, 154)], fill=255, width=22)
    draw.line([(116, 154), (174, 94)], fill=255, width=22)
    draw.ellipse([78, 114, 98, 134], fill=255)
    draw.ellipse([164, 84, 184, 104], fill=255)
    check_mask = np.array(check_mask_img) > 128
    
    check_layer = render_clay_layer(check_mask, (255, 205, 50), height=14.0, gloss=0.62)
    
    comp = Image.new('RGBA', (W, H), (0,0,0,0))
    comp.paste(base_layer, (0,0), base_layer)
    comp.paste(check_layer, (0,0), check_layer)
    return add_drop_shadow(comp)

# ==============================================================================
# 7. TRUCK ICON
# ==============================================================================
def gen_truck():
    W, H = 256, 256
    comp = Image.new('RGBA', (W, H), (0,0,0,0))
    
    # Main cargo box (cream/clay orange)
    cargo_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(cargo_mask_img)
    draw.rounded_rectangle([32, 64, 160, 174], radius=24, fill=255)
    cargo_layer = render_clay_layer(np.array(cargo_mask_img) > 128, (255, 106, 19), height=20.0)
    
    # Cab (electric blue)
    cab_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(cab_mask_img)
    draw.rounded_rectangle([152, 94, 224, 174], radius=22, fill=255)
    cab_layer = render_clay_layer(np.array(cab_mask_img) > 128, (31, 79, 255), height=22.0)
    
    # Cab window (light sky blue)
    win_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(win_mask_img)
    draw.rounded_rectangle([170, 106, 214, 138], radius=10, fill=255)
    win_layer = render_clay_layer(np.array(win_mask_img) > 128, (190, 235, 245), height=10.0, gloss=0.7)
    
    # 2 Wheels (dark navy clay with white center)
    wheel_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(wheel_mask_img)
    draw.ellipse([64, 156, 114, 206], fill=255)
    draw.ellipse([160, 156, 210, 206], fill=255)
    wheel_layer = render_clay_layer(np.array(wheel_mask_img) > 128, (35, 40, 55), height=16.0, gloss=0.4)
    
    hub_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(hub_mask_img)
    draw.ellipse([78, 170, 100, 192], fill=255)
    draw.ellipse([174, 170, 196, 192], fill=255)
    hub_layer = render_clay_layer(np.array(hub_mask_img) > 128, (255, 248, 230), height=10.0, gloss=0.55)
    
    comp.paste(cargo_layer, (0,0), cargo_layer)
    comp.paste(cab_layer, (0,0), cab_layer)
    comp.paste(win_layer, (0,0), win_layer)
    comp.paste(wheel_layer, (0,0), wheel_layer)
    comp.paste(hub_layer, (0,0), hub_layer)
    return add_drop_shadow(comp)

# Generate and save all 7
icons = {
    'instagram.webp': gen_instagram(),
    'youtube.webp': gen_youtube(),
    'whatsapp.webp': gen_whatsapp(),
    'location.webp': gen_location(),
    'community.webp': gen_community(),
    'shield.webp': gen_shield(),
    'truck.webp': gen_truck(),
}

for name, img in icons.items():
    out_path = os.path.join('public/clay/icons', name)
    img.save(out_path, 'WEBP', quality=95)
    print(f"Generated {out_path}: {img.size}")

print("All 7 clay icons generated successfully!")
