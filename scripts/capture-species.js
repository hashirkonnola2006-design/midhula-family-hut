const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const brain = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427';
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9239',
  'http://localhost:3000'
]);

setTimeout(async () => {
  const list = await new Promise(res => http.get('http://127.0.0.1:9239/json/list', r => {
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

    // Get #species position
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('#species');
        return el ? el.offsetTop : 0;
      })()`,
      returnByValue: true
    });

    const top = evalRes.result.value;
    console.log("Species offsetTop:", top);

    // In CDP, clip coordinates are relative to document page!
    const shot = await send('Page.captureScreenshot', {
      clip: { x: 0, y: top, width: 1440, height: 900, scale: 1 }
    });

    fs.writeFileSync(path.join(brain, 'species-1440.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved species-1440.png');

    // Also mobile species:
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 1000));
    const mobileTopRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('#species');
        return el ? el.offsetTop : 0;
      })()`,
      returnByValue: true
    });
    const mTop = mobileTopRes.result.value;
    const mobileShot = await send('Page.captureScreenshot', {
      clip: { x: 0, y: mTop, width: 390, height: 844, scale: 2 }
    });
    fs.writeFileSync(path.join(brain, 'species-390.png'), Buffer.from(mobileShot.data, 'base64'));
    console.log('Saved species-390.png');

    ws.close();
    chrome.kill();
    process.exit(0);
  };
}, 1500);
