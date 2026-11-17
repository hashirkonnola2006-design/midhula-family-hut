const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9233;
const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  "http://localhost:3000",
]);

setTimeout(async () => {
  try {
    const list = await new Promise((res, rej) =>
      http.get(`http://127.0.0.1:${port}/json/list`, (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => res(JSON.parse(d)));
      }).on("error", rej)
    );

    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    ws.onopen = async () => {
      const send = (m, p = {}) =>
        new Promise((res) => {
          const id = Math.floor(Math.random() * 1e6);
          const h = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.id === id) {
              ws.removeEventListener("message", h);
              res(msg.result);
            }
          };
          ws.addEventListener("message", h);
          ws.send(JSON.stringify({ id, method: m, params: p }));
        });

      await send("Emulation.setDeviceMetricsOverride", {
        width: 1200,
        height: 750,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await new Promise((r) => setTimeout(r, 1200));

      const frames = [];
      const frameDir = path.join(process.env.TEMP, "hero_frames_" + Date.now());
      fs.mkdirSync(frameDir, { recursive: true });

      console.log("Capturing 8 sequential frames to verify continuous motion...");
      for (let i = 0; i < 8; i++) {
        const ss = await send("Page.captureScreenshot", { format: "png" });
        const fPath = path.join(frameDir, `frame_${i}.png`);
        fs.writeFileSync(fPath, Buffer.from(ss.data, "base64"));
        frames.push(fPath);
        await new Promise((r) => setTimeout(r, 250)); // 250ms interval
      }

      console.log(`Captured ${frames.length} frames in ${frameDir}`);
      
      // Save frame paths for python gif compiler
      fs.writeFileSync(
        path.join(frameDir, "frames.json"),
        JSON.stringify({ frames, outDir: "C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427" })
      );

      ws.close();
      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
