const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const brain = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427';
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9236',
  'http://localhost:3000'
]);

setTimeout(async () => {
  const list = await new Promise(res => http.get('http://127.0.0.1:9236/json/list', r => {
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

    // 1. Desktop Hero (1440x900)
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 2000));

    const heroShot = await send("Page.captureScreenshot", {
      clip: { x: 0, y: 0, width: 1440, height: 900, scale: 1 },
    });
    fs.writeFileSync(path.join(brain, "screen-desktop-hero.png"), Buffer.from(heroShot.data, "base64"));
    console.log("Saved screen-desktop-hero.png");

    // Scroll down to Species section
    await send("Runtime.evaluate", {
      expression: `window.scrollTo(0, document.querySelector('#species').offsetTop - 60)`,
    });
    await new Promise(r => setTimeout(r, 1200));

    const speciesShot = await send("Page.captureScreenshot", {
      clip: { x: 0, y: 0, width: 1440, height: 900, scale: 1 },
    });
    fs.writeFileSync(path.join(brain, "screen-desktop-species.png"), Buffer.from(speciesShot.data, "base64"));
    console.log("Saved screen-desktop-species.png");

    // 2. Mobile Hero (390x844)
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await send("Runtime.evaluate", { expression: `window.scrollTo(0, 0)` });
    await new Promise(r => setTimeout(r, 1500));

    const mobileHeroShot = await send("Page.captureScreenshot", {
      clip: { x: 0, y: 0, width: 390, height: 844, scale: 2 },
    });
    fs.writeFileSync(path.join(brain, "screen-mobile-hero.png"), Buffer.from(mobileHeroShot.data, "base64"));
    console.log("Saved screen-mobile-hero.png");

    // Mobile Species
    await send("Runtime.evaluate", {
      expression: `window.scrollTo(0, document.querySelector('#species').offsetTop - 60)`,
    });
    await new Promise(r => setTimeout(r, 1200));

    const mobileSpeciesShot = await send("Page.captureScreenshot", {
      clip: { x: 0, y: 0, width: 390, height: 844, scale: 2 },
    });
    fs.writeFileSync(path.join(brain, "screen-mobile-species.png"), Buffer.from(mobileSpeciesShot.data, "base64"));
    console.log("Saved screen-mobile-species.png");

    ws.close();
    chrome.kill();
    process.exit(0);
  };
}, 1500);
