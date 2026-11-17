const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9230;
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
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await new Promise((r) => setTimeout(r, 1500));

      // Get section positions
      const posRes = await send("Runtime.evaluate", {
        expression: `
          (() => {
            const secs = ['species', 'farm', 'shipping', 'reviews', 'contact'];
            return secs.map(id => {
              const el = document.getElementById(id);
              const rect = el ? el.getBoundingClientRect() : null;
              return { id, top: el ? window.scrollY + rect.top : null, height: el ? el.offsetHeight : null };
            });
          })()
        `,
        returnByValue: true,
      });

      console.log("Section positions:", posRes.result.value);
      const brainDir = "C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427";

      for (const sec of posRes.result.value) {
        if (sec.top !== null) {
          // Temporarily disable smooth scroll for instant jump
          await send("Runtime.evaluate", {
            expression: `
              document.documentElement.style.scrollBehavior = 'auto';
              window.scrollTo(0, ${sec.top});
            `,
          });
          await new Promise((r) => setTimeout(r, 600));

          const ss = await send("Page.captureScreenshot", { format: "png" });
          const outPath = path.join(brainDir, `1440-${sec.id}.png`);
          fs.writeFileSync(outPath, Buffer.from(ss.data, "base64"));
          console.log(`Saved screenshot: 1440-${sec.id}.png at scroll ${sec.top}`);
        }
      }

      console.log("All screenshots captured!");
      ws.close();
      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error("Error:", err);
    chrome.kill();
    process.exit(1);
  }
}, 1800);
