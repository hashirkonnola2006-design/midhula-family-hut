import cv2, numpy as np, os

pub = r'c:\Users\Lenovo\Documents\midhula hut\public\clay'
def analyze(path):
    im = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if im is None or len(im.shape) < 3 or im.shape[2] != 4: return None
    mask = im[:, :, 3] > 80
    if np.sum(mask) == 0: return None
    bgr = im[mask, :3]
    rgb = bgr[:, ::-1]
    hsv = cv2.cvtColor(im[:, :, :3], cv2.COLOR_BGR2HSV)[mask]
    mean_h = np.mean(hsv[:, 0]) * 2.0
    mean_s = np.mean(hsv[:, 1]) / 255.0
    mean_v = np.mean(hsv[:, 2]) / 255.0
    mean_rgb = np.mean(rgb, axis=0)
    return mean_h, mean_s, mean_v, mean_rgb

print(f"{'Asset':25s} | {'Hue':6s} | {'Sat':5s} | {'Val':5s} | {'Mean RGB':18s}")
print('-'*65)
for sub in ['fish', 'letters', 'props', 'logo']:
    d = os.path.join(pub, sub)
    if os.path.exists(d):
        for f in sorted(os.listdir(d)):
            if f.endswith('.webp'):
                res = analyze(os.path.join(d, f))
                if res:
                    h, s, v, rgb = res
                    print(f"{sub+'/'+f:25s} | {h:5.1f} | {s:5.2f} | {v:5.2f} | ({rgb[0]:.0f}, {rgb[1]:.0f}, {rgb[2]:.0f})")
