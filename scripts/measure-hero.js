const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9235',
  'http://localhost:3000'
]);

setTimeout(async () => {
  const list = await new Promise(res => http.get('http://127.0.0.1:9235/json/list', r => {
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

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const hero = document.querySelector('#hero').getBoundingClientRect();
        const title = document.querySelector('.hero-title-scroll-container').getBoundingClientRect();
        const sub = document.querySelector('#hero p').getBoundingClientRect();
        const btn = document.querySelector('.clay-btn-green').getBoundingClientRect();
        return {
          hero: { height: hero.height },
          title: { y: title.y, height: title.height },
          sub: { y: sub.y, height: sub.height },
          btn: { y: btn.y, height: btn.height }
        };
      })()`,
      returnByValue: true
    });

    console.log("Hero layout:", evalRes.result.value);
    ws.close();
    chrome.kill();
    process.exit(0);
  };
}, 1500);
