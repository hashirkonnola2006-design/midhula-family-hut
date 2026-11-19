const { spawn } = require('child_process');
const http = require('http');
const sharp = require('sharp');
const path = require('path');

const brain = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427';
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9234',
  'http://localhost:3000'
]);

setTimeout(async () => {
  const list = await new Promise(res => http.get('http://127.0.0.1:9234/json/list', r => {
    let d = '';
    r.on('data', c => d += c);
    r.on('end', () => res(JSON.parse(d)));
  }));

  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  ws.onopen = async () => {
    const send = (m, p = {}) => new Promise(res => {
      const id = Math.floor(Math.random()*1e6);
      const h = e => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', h);
          res(msg.result);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method: m, params: p }));
    });

    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1600, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 2000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const b = document.querySelector('.clay-btn-green').getBoundingClientRect();
        const s = document.querySelector('img[src*="blue-shell"]').getBoundingClientRect();
        const n = document.querySelector('header').getBoundingClientRect();
        return {
          button: { x: b.x, y: b.y, width: b.width, height: b.height },
          shell: { x: s.x, y: s.y, width: s.width, height: s.height },
          header: { x: n.x, y: n.y, width: n.width, height: n.height }
        };
      })()`,
      returnByValue: true
    });

    const rects = evalRes.result.value;
    console.log("Rects:", rects);

    // Capture full hero + species screenshot (1440 x 1500)
    const shot = await send("Page.captureScreenshot", {
      clip: { x: 0, y: 0, width: 1440, height: 1500, scale: 1 },
    });
    const fullPath = path.join(brain, "redesign-hero-species-full.png");
    fs.writeFileSync(fullPath, Buffer.from(shot.data, "base64"));
    console.log("Saved redesign-hero-species-full.png");

    // Crop around CTA button and rays
    const ctaY = Math.max(0, Math.floor(rects.button.y - 40));
    const ctaX = Math.max(0, Math.floor(rects.button.x - 80));
    const ctaW = Math.min(1440 - ctaX, Math.floor(rects.button.width + 160));
    const ctaH = Math.min(1500 - ctaY, Math.floor(rects.button.height + 80));
    await sharp(fullPath).extract({ left: ctaX, top: ctaY, width: ctaW, height: ctaH })
      .toFile(path.join(brain, "verified-cta.png"));

    // Crop around shell
    const shellY = Math.max(0, Math.floor(rects.shell.y - 20));
    const shellX = Math.max(0, Math.floor(rects.shell.x - 20));
    const shellW = Math.min(1440 - shellX, Math.floor(rects.shell.width + 40));
    const shellH = Math.min(1500 - shellY, Math.floor(rects.shell.height + 40));
    await sharp(fullPath).extract({ left: shellX, top: shellY, width: shellW, height: shellH })
      .toFile(path.join(brain, "verified-shell.png"));

    console.log("Crops created!");
    ws.close();
    chrome.kill();
    process.exit(0);
  };
}, 1500);
