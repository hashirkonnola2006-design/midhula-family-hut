const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9235;
const brainDir = "C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427";

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

      // 1. Desktop 1440
      await send("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await new Promise((r) => setTimeout(r, 1200));

      const ctaPos = await send("Runtime.evaluate", {
        expression: `
          (() => {
            const el = document.getElementById('cta');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {
              top: window.scrollY + r.top,
              height: el.offsetHeight,
              width: el.offsetWidth
            };
          })()
        `,
        returnByValue: true,
      });

      console.log("Desktop CTA pos:", ctaPos.result.value);
      if (ctaPos.result.value) {
        const top = ctaPos.result.value.top;
        await send("Runtime.evaluate", {
          expression: `
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, ${top});
          `,
        });
        await new Promise((r) => setTimeout(r, 800));

        // Clip to exact #cta bounding rect
        const ssDesk = await send("Page.captureScreenshot", {
          format: "png",
          clip: {
            x: 0,
            y: top,
            width: 1440,
            height: ctaPos.result.value.height,
            scale: 1,
          },
        });
        fs.writeFileSync(path.join(brainDir, "cta-1440-desktop.png"), Buffer.from(ssDesk.data, "base64"));
        fs.writeFileSync("public/reference/cta-1440-desktop.png", Buffer.from(ssDesk.data, "base64"));
        console.log("Saved cta-1440-desktop.png");

        // Also capture transition context (reviews bottom + cta + footer top)
        const ssTrans = await send("Page.captureScreenshot", {
          format: "png",
          clip: {
            x: 0,
            y: Math.max(0, top - 120),
            width: 1440,
            height: Math.min(1000, ctaPos.result.value.height + 240),
            scale: 1,
          },
        });
        fs.writeFileSync(path.join(brainDir, "cta-transition-desktop.png"), Buffer.from(ssTrans.data, "base64"));
        fs.writeFileSync("public/reference/cta-transition-desktop.png", Buffer.from(ssTrans.data, "base64"));
        console.log("Saved cta-transition-desktop.png");
      }

      // 2. Mobile 390
      await send("Emulation.setDeviceMetricsOverride", {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true,
      });
      await new Promise((r) => setTimeout(r, 1200));

      const ctaPosM = await send("Runtime.evaluate", {
        expression: `
          (() => {
            const el = document.getElementById('cta');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {
              top: window.scrollY + r.top,
              height: el.offsetHeight,
              width: el.offsetWidth
            };
          })()
        `,
        returnByValue: true,
      });

      console.log("Mobile CTA pos:", ctaPosM.result.value);
      if (ctaPosM.result.value) {
        const topM = ctaPosM.result.value.top;
        await send("Runtime.evaluate", {
          expression: `
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, ${topM});
          `,
        });
        await new Promise((r) => setTimeout(r, 800));

        const ssMob = await send("Page.captureScreenshot", {
          format: "png",
          clip: {
            x: 0,
            y: topM,
            width: 390,
            height: ctaPosM.result.value.height,
            scale: 1,
          },
        });
        fs.writeFileSync(path.join(brainDir, "cta-390-mobile.png"), Buffer.from(ssMob.data, "base64"));
        fs.writeFileSync("public/reference/cta-390-mobile.png", Buffer.from(ssMob.data, "base64"));
        console.log("Saved cta-390-mobile.png");
      }

      console.log("Done capturing CTA screenshots!");
      ws.close();
      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error("Error:", err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
