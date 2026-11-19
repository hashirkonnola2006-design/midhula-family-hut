const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9245',
  'http://localhost:3000'
]);

setTimeout(async () => {
  const list = await new Promise(res => http.get('http://127.0.0.1:9245/json/list', r => {
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

    const styleInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const img = document.querySelectorAll('#species img[src*="platies"]')[0];
        if (!img) return null;
        const s = window.getComputedStyle(img);
        const rect = img.getBoundingClientRect();
        const parentRect = img.parentElement.getBoundingClientRect();
        return {
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
          parentRect: { top: parentRect.top, left: parentRect.left, width: parentRect.width, height: parentRect.height },
          opacity: s.opacity,
          display: s.display,
          visibility: s.visibility,
          zIndex: s.zIndex,
          position: s.position
        };
      })()`,
      returnByValue: true
    });

    console.log("Platy img style on mobile:", styleInfo.result.value);
    ws.close();
    chrome.kill();
    process.exit(0);
  };
}, 1500);
