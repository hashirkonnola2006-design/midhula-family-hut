const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9227;
const userDataDir = path.join(process.env.TEMP, "chrome_cdp_scroll_" + Date.now());

const chrome = spawn(chromePath, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  "about:blank",
]);

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (d) => (data += d));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener("message", handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  for (let i = 0; i < 20; i++) {
    try {
      const list = await getJson(`http://127.0.0.1:${port}/json/list`);
      if (list && list.length > 0) break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  const targetPage = list.find((t) => t.type === "page") || list[0];
  const ws = new WebSocket(targetPage.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  const consoleErrors = [];
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
      consoleErrors.push(msg.params.args.map((a) => a.value || a.description).join(" "));
    }
    if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error") {
      consoleErrors.push(msg.params.entry.text);
    }
  });

  await sendCommand(ws, "Page.enable");
  await sendCommand(ws, "DOM.enable");
  await sendCommand(ws, "Network.enable");
  await sendCommand(ws, "Log.enable");
  await sendCommand(ws, "Network.setCacheDisabled", { cacheDisabled: true });
  await sendCommand(ws, "Page.navigate", { url: "http://localhost:3000" });

  await new Promise((r) => setTimeout(r, 2500));

  const artifactDir = "C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427";

  // =========================================================================
  // 1. DESKTOP 1440px Verification
  // =========================================================================
  console.log("=== DESKTOP 1440px ===");
  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 0);" });
  await new Promise((r) => setTimeout(r, 500));

  // Screenshot at scroll = 0
  const snapTop = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "scroll-0.png"), Buffer.from(snapTop.data, "base64"));

  // Check initial state
  const state0 = await sendCommand(ws, "Runtime.evaluate", {
    expression: `(() => {
      const title = document.querySelector('.hero-title-scroll-container');
      const fishField = document.querySelector('#hero [class*=\"z-5\"]');
      const csTitle = window.getComputedStyle(title);
      const csFish = window.getComputedStyle(fishField);
      return {
        titleOpacity: csTitle.opacity,
        titleTransform: csTitle.transform,
        fishOpacity: csFish.opacity,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      };
    })()`,
    returnByValue: true,
  });
  console.log("State at scroll 0:", state0.result.value);

  // Scroll to 200px (mid-fade)
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 200);" });
  await new Promise((r) => setTimeout(r, 300));
  const snapMid = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "scroll-200.png"), Buffer.from(snapMid.data, "base64"));

  const state200 = await sendCommand(ws, "Runtime.evaluate", {
    expression: `(() => {
      const title = document.querySelector('.hero-title-scroll-container');
      const fishField = document.querySelector('#hero [class*=\"z-5\"]');
      const navLogo = document.querySelector('header a img');
      const titleRect = title.getBoundingClientRect();
      const logoRect = navLogo ? navLogo.getBoundingClientRect() : null;
      const csTitle = window.getComputedStyle(title);
      const csFish = window.getComputedStyle(fishField);
      
      const overlap = logoRect ? (
        !(titleRect.right < logoRect.left || 
          titleRect.left > logoRect.right || 
          titleRect.bottom < logoRect.top || 
          titleRect.top > logoRect.bottom)
      ) : false;

      return {
        titleOpacity: csTitle.opacity,
        titleTransform: csTitle.transform,
        fishOpacity: csFish.opacity,
        titleOverlapsLogo: overlap,
      };
    })()`,
    returnByValue: true,
  });
  console.log("State at scroll 200:", state200.result.value);

  // Scroll to 450px (fully faded title)
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 450);" });
  await new Promise((r) => setTimeout(r, 300));
  const snap450 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "scroll-450.png"), Buffer.from(snap450.data, "base64"));

  const state450 = await sendCommand(ws, "Runtime.evaluate", {
    expression: `(() => {
      const title = document.querySelector('.hero-title-scroll-container');
      const fishField = document.querySelector('#hero [class*=\"z-5\"]');
      const csTitle = window.getComputedStyle(title);
      const csFish = window.getComputedStyle(fishField);
      return {
        titleOpacity: csTitle.opacity,
        titleTransform: csTitle.transform,
        fishOpacity: csFish.opacity,
      };
    })()`,
    returnByValue: true,
  });
  console.log("State at scroll 450:", state450.result.value);

  // =========================================================================
  // 2. PRODUCT CARDS AUDIT (Species Section)
  // =========================================================================
  console.log("=== PRODUCT CARDS AUDIT ===");
  await sendCommand(ws, "Runtime.evaluate", { expression: "document.querySelector('#species').scrollIntoView();" });
  await new Promise((r) => setTimeout(r, 800));

  const snapSpecies = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "species-section.png"), Buffer.from(snapSpecies.data, "base64"));

  const cardsAudit = await sendCommand(ws, "Runtime.evaluate", {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('#species .clay-tile'));
      return cards.map(c => {
        const title = c.querySelector('h3')?.innerText;
        const badge = c.querySelector('span')?.innerText;
        const img = c.querySelector('img');
        const imgContainer = img?.parentElement;
        return {
          title,
          badge,
          imgSrc: img?.getAttribute('src'),
          naturalWidth: img?.naturalWidth,
          naturalHeight: img?.naturalHeight,
          aspectRatio: imgContainer ? window.getComputedStyle(imgContainer).aspectRatio : null,
          loading: img?.getAttribute('loading'),
          alt: img?.getAttribute('alt'),
        };
      });
    })()`,
    returnByValue: true,
  });
  console.log("Product Cards Audit Results:", JSON.stringify(cardsAudit.result.value, null, 2));

  // =========================================================================
  // 3. TABLET (768px) and MOBILE (390px)
  // =========================================================================
  console.log("=== TABLET 768px ===");
  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 768,
    height: 1024,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 0);" });
  await new Promise((r) => setTimeout(r, 400));
  const snap768Top = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "768-top.png"), Buffer.from(snap768Top.data, "base64"));

  const scroll768 = await sendCommand(ws, "Runtime.evaluate", {
    expression: "({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })",
    returnByValue: true,
  });
  console.log("768px scroll:", scroll768.result.value);

  console.log("=== MOBILE 390px ===");
  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 0);" });
  await new Promise((r) => setTimeout(r, 400));
  const snap390Top = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "390-top.png"), Buffer.from(snap390Top.data, "base64"));

  const scroll390 = await sendCommand(ws, "Runtime.evaluate", {
    expression: "({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })",
    returnByValue: true,
  });
  console.log("390px scroll:", scroll390.result.value);

  // Scroll to species on mobile
  await sendCommand(ws, "Runtime.evaluate", { expression: "document.querySelector('#species').scrollIntoView();" });
  await new Promise((r) => setTimeout(r, 600));
  const snap390Species = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "390-species.png"), Buffer.from(snap390Species.data, "base64"));

  console.log("Console errors recorded:", consoleErrors);

  ws.close();
  chrome.kill();
  console.log("Verification completed successfully!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Verification error:", err);
  try {
    chrome.kill();
  } catch {}
  process.exit(1);
});
