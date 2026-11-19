const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9260;
const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  "http://localhost:3000",
]);

const brainDir = "C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427";

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

      await send("Network.setCacheDisabled", { cacheDisabled: true });
      await send("Page.reload", { ignoreCache: true });
      await new Promise((r) => setTimeout(r, 2000));

      const viewports = [
        { name: "desktop-1440", width: 1440, height: 900, mobile: false },
        { name: "tablet-768", width: 768, height: 1024, mobile: false },
        { name: "mobile-390", width: 390, height: 844, mobile: true },
      ];

      const sections = ["hero", "species", "farm", "shipping", "reviews"];

      for (const vp of viewports) {
        await send("Emulation.setDeviceMetricsOverride", {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.mobile,
        });
        await new Promise((r) => setTimeout(r, 600));

        for (const sec of sections) {
          // Scroll section into view so lazy images load
          await send("Runtime.evaluate", {
            expression: `(() => {
              const el = document.getElementById("${sec}");
              if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
            })()`,
          });
          await new Promise((r) => setTimeout(r, 600));

          const evalRes = await send("Runtime.evaluate", {
            expression: `(() => {
              const el = document.getElementById("${sec}");
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height };
            })()`,
            returnByValue: true,
          });

          const rect = evalRes.result?.value;
          if (rect) {
            const snap = await send("Page.captureScreenshot", {
              format: "png",
              clip: {
                x: Math.max(0, rect.x),
                y: Math.max(0, rect.y),
                width: rect.width,
                height: Math.min(rect.height, 1200),
                scale: 1,
              },
              captureBeyondViewport: true,
            });
            const outPath = path.join(brainDir, `decor-${sec}-${vp.name}.png`);
            fs.writeFileSync(outPath, Buffer.from(snap.data, "base64"));
            console.log(`Saved ${outPath}`);
          }
        }
      }

      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error("Error capturing screenshots:", err);
    chrome.kill();
    process.exit(1);
  }
}, 2500);
