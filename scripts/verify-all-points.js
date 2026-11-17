const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9226;
const userDataDir = path.join(process.env.TEMP, "chrome_cdp_verify_" + Date.now());

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

  // 1. Check at 1440px width
  console.log("Checking 1440px width...");
  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 0);" });
  await new Promise((r) => setTimeout(r, 600));

  const snap1440 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "verify-1440.png"), Buffer.from(snap1440.data, "base64"));

  // Check horizontal scroll at 1440
  const scrollCheck1440 = await sendCommand(ws, "Runtime.evaluate", {
    expression: "({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })",
    returnByValue: true,
  });
  console.log("1440px scroll check:", scrollCheck1440.result.value);

  // 2. Check at 768px width (tablet)
  console.log("Checking 768px width (tablet)...");
  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 768,
    height: 1024,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 0);" });
  await new Promise((r) => setTimeout(r, 600));

  const snap768 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "verify-768.png"), Buffer.from(snap768.data, "base64"));

  const scrollCheck768 = await sendCommand(ws, "Runtime.evaluate", {
    expression: "({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })",
    returnByValue: true,
  });
  console.log("768px scroll check:", scrollCheck768.result.value);

  // 3. Check at 390px width (mobile)
  console.log("Checking 390px width (mobile)...");
  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 0);" });
  await new Promise((r) => setTimeout(r, 600));

  const snap390 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "verify-390.png"), Buffer.from(snap390.data, "base64"));

  const scrollCheck390 = await sendCommand(ws, "Runtime.evaluate", {
    expression: "({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })",
    returnByValue: true,
  });
  console.log("390px scroll check:", scrollCheck390.result.value);

  // 4. Test clicking anywhere in the hero produces no pellets or ripples
  console.log("Testing clicks on hero...");
  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  
  // Click at several coordinates in hero
  const clickCoords = [
    { x: 500, y: 300 },
    { x: 720, y: 450 },
    { x: 300, y: 600 },
    { x: 1000, y: 200 },
  ];

  for (const pt of clickCoords) {
    await sendCommand(ws, "Input.dispatchMouseEvent", { type: "mousePressed", x: pt.x, y: pt.y, button: "left", clickCount: 1 });
    await sendCommand(ws, "Input.dispatchMouseEvent", { type: "mouseReleased", x: pt.x, y: pt.y, button: "left", clickCount: 1 });
    await new Promise((r) => setTimeout(r, 100));
  }

  // Check DOM for any canvas or pellet elements
  const domCheck = await sendCommand(ws, "Runtime.evaluate", {
    expression: "({ canvasCount: document.querySelectorAll('canvas').length, pelletCount: document.querySelectorAll('[class*=\"pellet\"]').length, rippleCount: document.querySelectorAll('[class*=\"ripple\"]').length })",
    returnByValue: true,
  });
  console.log("DOM elements check after clicks:", domCheck.result.value);

  // 5. Test fish animation frames (t=0s, t=2s, t=4.5s) to verify swimming & flipping
  console.log("Capturing animation frames of swimming fish...");
  const snapT0 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "verify-swim-t0.png"), Buffer.from(snapT0.data, "base64"));

  await new Promise((r) => setTimeout(r, 2200));
  const snapT2 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "verify-swim-t2.png"), Buffer.from(snapT2.data, "base64"));

  await new Promise((r) => setTimeout(r, 2300));
  const snapT4 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(artifactDir, "verify-swim-t4.png"), Buffer.from(snapT4.data, "base64"));

  console.log("Console errors recorded:", consoleErrors);

  ws.close();
  chrome.kill();
  console.log("Verification finished successfully!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Verification error:", err);
  try {
    chrome.kill();
  } catch {}
  process.exit(1);
});
