const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9241',
  'http://localhost:3000'
]);

setTimeout(async () => {
  const list = await new Promise(res => http.get('http://127.0.0.1:9241/json/list', r => {
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

    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 1500));

    const info = await send('Runtime.evaluate', {
      expression: `(() => {
        const els = Array.from(document.querySelectorAll('section'));
        return els.map(el => {
          const rect = el.getBoundingClientRect();
          return {
            id: el.id,
            offsetTop: el.offsetTop,
            rectTop: rect.top,
            height: el.offsetHeight,
            bg: window.getComputedStyle(el).backgroundColor
          };
        });
      })()`,
      returnByValue: true
    });

    console.log("Sections:", info.result.value);

    // Let's capture the full page screenshot without any clip!
    const fullShot = await send('Page.captureScreenshot', {
      captureBeyondViewport: true
    });
    const fs = require('fs');
    const path = require('path');
    const brain = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427';
    fs.writeFileSync(path.join(brain, 'full-page-test.png'), Buffer.from(fullShot.data, 'base64'));
    console.log("Full page saved to full-page-test.png");

    ws.close();
    chrome.kill();
    process.exit(0);
  };
}, 1500);
