import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import distance_transform_edt, gaussian_filter

os.makedirs('public/clay/icons', exist_ok=True)

def render_clay_layer(mask, diffuse_rgb, height=22.0, light_dir=(-0.45, -0.55, 0.7), specular_power=22, gloss=0.45, rim_strength=0.25):
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
    
    lx, ly, lz = light_dir
    l_len = np.sqrt(lx**2 + ly**2 + lz**2)
    lx, ly, lz = lx/l_len, ly/l_len, lz/l_len
    
    diffuse = np.clip(nx * lx + ny * ly + nz * lz, 0, 1)
    ambient = 0.45
    
    hx, hy, hz = lx, ly, lz + 1.0
    h_len = np.sqrt(hx**2 + hy**2 + hz**2)
    hx, hy, hz = hx/h_len, hy/h_len, hz/h_len
    
    spec = np.clip(nx * hx + ny * hy + nz * hz, 0, 1) ** specular_power
    
    rx, ry, rz = 0.45, 0.55, 0.35
    rim = np.clip(nx * rx + ny * ry + nz * rz, 0, 1) * rim_strength
    
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
    alpha = img.split()[-1]
    shadow = Image.new('RGBA', img.size, (20, 15, 40, int(255 * opacity)))
    shadow.putalpha(Image.eval(alpha, lambda a: int(a * opacity)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    result = Image.new('RGBA', img.size, (0, 0, 0, 0))
    result.paste(shadow, offset, shadow)
    result.paste(img, (0, 0), img)
    return result

def gen_whatsapp():
    W, H = 256, 256
    bubble_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(bubble_mask_img)
    draw.ellipse([30, 26, 226, 218], fill=255)
    # Speech tail at bottom left
    draw.polygon([(56, 178), (30, 232), (100, 214)], fill=255)
    bubble_mask = np.array(bubble_mask_img) > 128
    
    base_layer = render_clay_layer(bubble_mask, (37, 211, 102), height=25.0, gloss=0.48)
    
    # Curved handset: earpiece, curved bridge, mouthpiece
    phone_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(phone_mask_img)
    
    # Earpiece pill
    draw.rounded_rectangle([76, 82, 116, 122], radius=16, fill=255)
    # Mouthpiece pill
    draw.rounded_rectangle([140, 146, 180, 186], radius=16, fill=255)
    
    # Arc bridge connecting them
    draw.arc([76, 80, 180, 184], start=45, end=210, fill=255, width=22)
    # Thicken bridge with small circles along arc
    for t in np.linspace(0.8, 2.3, 15):
        cx = 130 - int(42 * np.cos(t))
        cy = 130 + int(42 * np.sin(t))
        draw.ellipse([cx-10, cy-10, cx+10, cy+10], fill=255)

    phone_mask = np.array(phone_mask_img) > 128
    phone_layer = render_clay_layer(phone_mask, (255, 255, 252), height=15.0, gloss=0.62, specular_power=28)
    
    comp = Image.new('RGBA', (W, H), (0,0,0,0))
    comp.paste(base_layer, (0,0), base_layer)
    comp.paste(phone_layer, (0,0), phone_layer)
    return add_drop_shadow(comp)

def gen_shield():
    W, H = 256, 256
    shield_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(shield_mask_img)
    # Smooth shield with curved top and rounded point
    draw.rounded_rectangle([42, 38, 214, 150], radius=32, fill=255)
    draw.polygon([(46, 120), (210, 120), (128, 230)], fill=255)
    # Round bottom tip
    draw.ellipse([108, 206, 148, 234], fill=255)
    
    shield_mask = gaussian_filter((np.array(shield_mask_img) > 128).astype(float), sigma=4.0) > 0.4
    base_layer = render_clay_layer(shield_mask, (31, 79, 255), height=25.0, gloss=0.52)
    
    # Gold/cream clay checkmark
    check_mask_img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(check_mask_img)
    draw.line([(88, 126), (116, 156)], fill=255, width=22)
    draw.line([(116, 156), (174, 96)], fill=255, width=22)
    draw.ellipse([78, 116, 98, 136], fill=255)
    draw.ellipse([164, 86, 184, 106], fill=255)
    draw.ellipse([105, 145, 127, 167], fill=255)
    check_mask = np.array(check_mask_img) > 128
    
    check_layer = render_clay_layer(check_mask, (255, 205, 50), height=14.0, gloss=0.62)
    
    comp = Image.new('RGBA', (W, H), (0,0,0,0))
    comp.paste(base_layer, (0,0), base_layer)
    comp.paste(check_layer, (0,0), check_layer)
    return add_drop_shadow(comp)

gen_whatsapp().save('public/clay/icons/whatsapp.webp', 'WEBP', quality=95)
gen_shield().save('public/clay/icons/shield.webp', 'WEBP', quality=95)
print("Updated whatsapp and shield")
