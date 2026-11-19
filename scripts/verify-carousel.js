const { spawn } = require('child_process');
const http = require('http');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const brain = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427';
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9243',
  'http://localhost:3000'
]);

setTimeout(async () => {
  const list = await new Promise(res => http.get('http://127.0.0.1:9243/json/list', r => {
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

    // 1. Desktop: 1440x900
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll to #species
    const speciesPos = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('#species');
        return el ? el.offsetTop : 0;
      })()`,
      returnByValue: true
    });
    const sTop = speciesPos.result.value;
    console.log("Species top:", sTop);

    // Verify 3 cards in view on desktop
    const cardsCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const track = document.querySelector('#species .overflow-x-auto.snap-x');
        const cards = Array.from(track.children);
        const trackRect = track.getBoundingClientRect();
        const visibleCards = cards.filter(c => {
          const r = c.getBoundingClientRect();
          return r.right > trackRect.left && r.left < trackRect.right;
        });
        return {
          totalCards: cards.length,
          visibleCount: visibleCards.length,
          firstThreeTitles: visibleCards.map(c => c.querySelector('h3')?.textContent.trim())
        };
      })()`,
      returnByValue: true
    });
    console.log("Cards check on desktop:", cardsCheck.result.value);

    // Capture desktop full page and extract species
    const fullShot = await send('Page.captureScreenshot', { captureBeyondViewport: true });
    const fullPath = path.join(brain, 'verify-full-desktop.png');
    fs.writeFileSync(fullPath, Buffer.from(fullShot.data, 'base64'));

    await sharp(fullPath)
      .extract({ left: 0, top: sTop, width: 1440, height: 850 })
      .toFile(path.join(brain, 'new-carousel-desktop.png'));
    console.log("Saved new-carousel-desktop.png");

    // 2. Mobile: 390x844
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 1500));

    const mobileSpeciesPos = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('#species');
        return el ? el.offsetTop : 0;
      })()`,
      returnByValue: true
    });
    const mTop = mobileSpeciesPos.result.value;

    const mFullShot = await send('Page.captureScreenshot', { captureBeyondViewport: true });
    const mFullPath = path.join(brain, 'verify-full-mobile.png');
    fs.writeFileSync(mFullPath, Buffer.from(mFullShot.data, 'base64'));

    const mMeta = await sharp(mFullPath).metadata();
    await sharp(mFullPath)
      .extract({ left: 0, top: Math.floor(mTop * 2), width: 780, height: Math.min(1500, mMeta.height - Math.floor(mTop * 2)) })
      .toFile(path.join(brain, 'new-carousel-mobile.png'));
    console.log("Saved new-carousel-mobile.png");

    ws.close();
    chrome.kill();
    process.exit(0);
  };
}, 1500);
