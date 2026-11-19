const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9232;
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

      // 1. Desktop: 1440x900
      await send("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height: 1200,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await new Promise((r) => setTimeout(r, 2000));

      // Inspect elements on page
      const checkRes = await send("Runtime.evaluate", {
        expression: `(() => {
          const greenBtn = document.querySelector('.clay-btn-green');
          const navLinks = Array.from(document.querySelectorAll('header nav a')).map(a => a.textContent.trim());
          const navCircleBtn = document.querySelector('header a[href*="wa.me"] img[src*="whatsapp-circle-btn"]');
          const raysImg = document.querySelector('img[src*="rays.webp"]');
          const blueShellImg = document.querySelector('img[src*="blue-shell.webp"]');
          return {
            hasGreenCta: !!greenBtn,
            greenCtaText: greenBtn ? greenBtn.textContent.trim() : null,
            navLinks,
            hasNavCircleBtn: !!navCircleBtn,
            hasRays: !!raysImg,
            hasBlueShell: !!blueShellImg
          };
        })()`,
        returnByValue: true,
      });

      console.log("DOM Verification Results:", checkRes.result.value);

      // Take Desktop Screenshot (Hero + Species)
      const desktopShot = await send("Page.captureScreenshot", {
        clip: { x: 0, y: 0, width: 1440, height: 1200, scale: 1 },
      });
      fs.writeFileSync(
        path.join(brainDir, "redesign-1440-desktop.png"),
        Buffer.from(desktopShot.data, "base64")
      );
      console.log("Saved redesign-1440-desktop.png");

      // 2. Mobile: 390x844
      await send("Emulation.setDeviceMetricsOverride", {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true,
      });
      await new Promise((r) => setTimeout(r, 1500));

      const mobileShot = await send("Page.captureScreenshot", {
        clip: { x: 0, y: 0, width: 390, height: 844, scale: 2 },
      });
      fs.writeFileSync(
        path.join(brainDir, "redesign-390-mobile.png"),
        Buffer.from(mobileShot.data, "base64")
      );
      console.log("Saved redesign-390-mobile.png");

      ws.close();
      chrome.kill();
      process.exit(0);
    };
  } catch (e) {
    console.error("Error during verification:", e);
    chrome.kill();
    process.exit(1);
  }
}, 2000);
