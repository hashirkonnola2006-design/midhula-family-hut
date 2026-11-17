const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9245;
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

      const brainDir = "C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427";

      // 1. Desktop (1440x900)
      await send("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await new Promise((r) => setTimeout(r, 600));

      await send("Runtime.evaluate", {
        expression: `window.scrollTo(0, document.body.scrollHeight);`,
      });
      await new Promise((r) => setTimeout(r, 1000));

      const ssDesktop = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(brainDir, "footer-1440-desktop.png"), Buffer.from(ssDesktop.data, "base64"));
      console.log("Saved footer-1440-desktop.png");

      // 2. Mobile (390x844)
      await send("Emulation.setDeviceMetricsOverride", {
        width: 390,
        height: 844,
        deviceScaleFactor: 1,
        mobile: true,
      });
      await new Promise((r) => setTimeout(r, 600));

      await send("Runtime.evaluate", {
        expression: `window.scrollTo(0, document.body.scrollHeight);`,
      });
      await new Promise((r) => setTimeout(r, 1000));

      const ssMobile = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(brainDir, "footer-390-mobile.png"), Buffer.from(ssMobile.data, "base64"));
      console.log("Saved footer-390-mobile.png");

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
