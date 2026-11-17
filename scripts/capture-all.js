const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9225;
const userDataDir = path.join(process.env.TEMP, "chrome_cdp_capture_v2_" + Date.now());

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
  // Wait for Chrome to listen
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

  await sendCommand(ws, "Page.enable");
  await sendCommand(ws, "DOM.enable");
  await sendCommand(ws, "Network.enable");
  await sendCommand(ws, "Network.setCacheDisabled", { cacheDisabled: true });
  await sendCommand(ws, "Page.navigate", { url: "http://localhost:3000" });

  // Wait 3s for images, fonts, and animation initialization
  await new Promise((r) => setTimeout(r, 3000));

  const outDir = path.join(__dirname, "..", "public");

  // 1. Desktop 1440x900 Viewport
  console.log("Capturing 1440x900...");
  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 0);" });
  await new Promise((r) => setTimeout(r, 800));
  const snap1440 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(outDir, "screenshot-1440.png"), Buffer.from(snap1440.data, "base64"));
  console.log("Saved screenshot-1440.png");

  // 2. Desktop 1253x870 Viewport
  console.log("Capturing 1253x870...");
  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1253,
    height: 870,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 0);" });
  await new Promise((r) => setTimeout(r, 800));
  const snap1253 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(outDir, "screenshot-1253.png"), Buffer.from(snap1253.data, "base64"));
  console.log("Saved screenshot-1253.png");

  // 3. Mobile 390x844 Viewport
  console.log("Capturing 390x844...");
  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 0);" });
  await new Promise((r) => setTimeout(r, 800));
  const snap390 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(outDir, "screenshot-390.png"), Buffer.from(snap390.data, "base64"));
  console.log("Saved screenshot-390.png");

  // 4. Scroll Morph Screenshots on 1440x900
  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Morph 0%: scroll = 0
  console.log("Capturing Scroll Morph 0%...");
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 0);" });
  await new Promise((r) => setTimeout(r, 600));
  const snapMorph0 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(outDir, "screenshot-morph-0.png"), Buffer.from(snapMorph0.data, "base64"));
  console.log("Saved screenshot-morph-0.png");

  // Morph 20%: 0.20 * 900 = 180px
  console.log("Capturing Scroll Morph 20%...");
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 180);" });
  await new Promise((r) => setTimeout(r, 600));
  const snapMorph20 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(outDir, "screenshot-morph-20.png"), Buffer.from(snapMorph20.data, "base64"));
  console.log("Saved screenshot-morph-20.png");

  // Morph 40%: 0.40 * 900 = 360px
  console.log("Capturing Scroll Morph 40%...");
  await sendCommand(ws, "Runtime.evaluate", { expression: "window.scrollTo(0, 360);" });
  await new Promise((r) => setTimeout(r, 600));
  const snapMorph40 = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(outDir, "screenshot-morph-40.png"), Buffer.from(snapMorph40.data, "base64"));
  console.log("Saved screenshot-morph-40.png");

  ws.close();
  chrome.kill();
  console.log("All captures completed successfully!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Capture error:", err);
  try {
    chrome.kill();
  } catch {}
  process.exit(1);
});
