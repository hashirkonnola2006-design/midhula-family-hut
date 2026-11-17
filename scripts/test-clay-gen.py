import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import distance_transform_edt, gaussian_filter

def create_clay_surface(mask, height=25.0, light_dir=(-0.4, -0.5, 0.75), diffuse_color=(255, 60, 60), specular_power=20, gloss=0.45):
    """
    Given a 2D boolean mask, generates a 3D clay normal map and lights it with Blinn-Phong shading.
    """
    dist = distance_transform_edt(mask)
    # Smooth the distance field to create rounded organic clay bevel
    # Clamping distance gives a flat-top puffy bevel
    max_d = np.percentile(dist[mask], 85) if np.any(mask) else 1.0
    z = np.sin(np.clip(dist / max(max_d * 0.6, 1.0), 0, 1) * (np.pi / 2)) * height
    z = gaussian_filter(z, sigma=1.8)
    
    # Calculate gradients
    dzdy, dzdx = np.gradient(z)
    
    # Normal vector
    nx = -dzdx
    ny = -dzdy
    nz = np.ones_like(z) * 8.0 # scale factor for steepness
    norm = np.sqrt(nx**2 + ny**2 + nz**2)
    norm[norm == 0] = 1.0
    nx /= norm
    ny /= norm
    nz /= norm
    
    # Normalize light dir
    lx, ly, lz = light_dir
    l_len = np.sqrt(lx**2 + ly**2 + lz**2)
    lx, ly, lz = lx/l_len, ly/l_len, lz/l_len
    
    # Diffuse lighting (N . L)
    diffuse = np.clip(nx * lx + ny * ly + nz * lz, 0, 1)
    
    # Ambient
    ambient = 0.42
    
    # Specular (Blinn-Phong)
    # View dir is (0, 0, 1)
    # Half vector H = (L + V) / |L + V|
    hx, hy, hz = lx, ly, lz + 1.0
    h_len = np.sqrt(hx**2 + hy**2 + hz**2)
    hx, hy, hz = hx/h_len, hy/h_len, hz/h_len
    
    spec = np.clip(nx * hx + ny * hy + nz * hz, 0, 1) ** specular_power
    
    # Bottom-right bounce/rim light
    rx, ry, rz = 0.4, 0.5, 0.4
    rim = np.clip(nx * rx + ny * ry + nz * rz, 0, 1) * 0.25
    
    # Compose final RGB
    r_base, g_base, b_base = diffuse_color
    
    # Dark shadow tint at bottom-right
    shadow_shade = np.clip(0.3 + 0.7 * diffuse + rim, 0.15, 1.0)
    
    r = np.clip(r_base * (ambient + (1.0 - ambient) * shadow_shade) + 255 * gloss * spec, 0, 255)
    g = np.clip(g_base * (ambient + (1.0 - ambient) * shadow_shade) + 255 * gloss * spec, 0, 255)
    b = np.clip(b_base * (ambient + (1.0 - ambient) * shadow_shade) + 255 * gloss * spec, 0, 255)
    
    # Alpha mask with slight anti-aliasing
    alpha = np.clip(dist * 2.0, 0, 1) * 255.0
    
    img_data = np.stack([r, g, b, alpha], axis=-1).astype(np.uint8)
    return Image.fromarray(img_data, 'RGBA')

print("Test generator script loaded")
