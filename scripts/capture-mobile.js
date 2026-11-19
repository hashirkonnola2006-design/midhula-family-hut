const { spawn } = require('child_process');
const http = require('http');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const brain = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427';
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9242',
  'http://localhost:3000'
]);

setTimeout(async () => {
  const list = await new Promise(res => http.get('http://127.0.0.1:9242/json/list', r => {
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

    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 1500));

    const fullShot = await send('Page.captureScreenshot', { captureBeyondViewport: true });
    const mobileFullPath = path.join(brain, 'mobile-full.png');
    fs.writeFileSync(mobileFullPath, Buffer.from(fullShot.data, 'base64'));

    const meta = await sharp(mobileFullPath).metadata();
    console.log("Mobile full size:", meta.width, meta.height);

    // Extract mobile hero: top 0, height 844 * 2 = 1688
    await sharp(mobileFullPath).extract({ left: 0, top: 0, width: meta.width, height: Math.min(meta.height, 1688) })
      .toFile(path.join(brain, 'mobile-hero-verified.png'));

    ws.close();
    chrome.kill();
    process.exit(0);
  };
}, 1500);
