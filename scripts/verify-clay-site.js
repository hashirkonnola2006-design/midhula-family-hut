const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9228;
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
  console.log("Starting Chrome CDP verification...");
  await new Promise((r) => setTimeout(r, 1200));

  let version;
  for (let i = 0; i < 10; i++) {
    try {
      version = await getJson(`http://127.0.0.1:${port}/json/version`);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  const pageWsUrl = list[0].webSocketDebuggerUrl;
  const ws = new WebSocket(pageWsUrl);

  await new Promise((r) => (ws.onopen = r));

  const consoleErrors = [];
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
      consoleErrors.push(msg.params.args.map((a) => a.value || a.description).join(" "));
    }
  });

  await sendCommand(ws, "Runtime.enable");
  await sendCommand(ws, "Page.enable");
  await sendCommand(ws, "DOM.enable");
  await sendCommand(ws, "CSS.enable");

  const artifactDir = "C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427";

  async function setViewport(w, h) {
    await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
      width: w,
      height: h,
      deviceScaleFactor: 1,
      mobile: w < 768,
    });
    await sendCommand(ws, "Emulation.setVisibleSize", { width: w, height: h });
  }

  async function takeScreenshot(filePath, clip = null) {
    const params = { format: "png" };
    if (clip) params.clip = clip;
    const res = await sendCommand(ws, "Page.captureScreenshot", params);
    fs.writeFileSync(filePath, Buffer.from(res.data, "base64"));
    console.log(`Saved screenshot: ${path.basename(filePath)}`);
  }

  // 1. Desktop Verification (1440x900)
  await setViewport(1440, 900);
  await sendCommand(ws, "Page.navigate", { url: "http://localhost:3000" });
  await new Promise((r) => setTimeout(r, 2000));

  const desktopChecks = await sendCommand(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        // 1. Check fish hierarchy & direction
        const fishLanes = Array.from(document.querySelectorAll('.fish-lane'));
        const fishDetails = fishLanes.map((lane, i) => {
          const flip = lane.querySelector('.fish-flip');
          const bob = lane.querySelector('.fish-bob');
          const img = lane.querySelector('img');
          const isLtr = lane.classList.contains('fish-track-ltr');
          const isRtl = lane.classList.contains('fish-track-rtl');
          const flipTransform = flip ? window.getComputedStyle(flip).transform : null;
          const isFlipped = flipTransform && flipTransform.includes('-1');
          
          // Head rule:
          // Source fish face RIGHT.
          // LTR moves left-to-right -> head leads if NOT flipped (isFlipped === false).
          // RTL moves right-to-left -> head leads if FLIPPED (isFlipped === true).
          const headLeads = (isLtr && !isFlipped) || (isRtl && isFlipped);

          const playState = window.getComputedStyle(lane).animationPlayState;

          return {
            index: i,
            direction: isLtr ? 'ltr' : (isRtl ? 'rtl' : 'none'),
            isFlipped,
            headLeads,
            playState,
            hasFlipWrapper: !!flip,
            hasBobWrapper: !!bob,
            src: img ? img.src : null
          };
        });

        // 2. Check Bubbles & Removed Droplets/Stars
        const risingBubbles = document.querySelectorAll('.bubble-rise');
        const oldDroplets = document.querySelectorAll('.clay-droplets');
        const oldStars = document.querySelectorAll('.clay-star');
        const oldRays = document.querySelectorAll('.clay-rays');

        // 3. Horizontal Overflow
        const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;

        // 4. Icons verification
        const icons = Array.from(document.querySelectorAll('img[src*="/clay/icons/"]')).map(img => img.src);

        return {
          fishCount: fishLanes.length,
          allHeadLeads: fishDetails.every(f => f.headLeads),
          fishDetails,
          risingBubblesCount: risingBubbles.length,
          oldDropletsCount: oldDroplets.length,
          oldStarsCount: oldStars.length,
          oldRaysCount: oldRays.length,
          hasHorizontalScroll,
          iconsCount: icons.length,
          uniqueIcons: Array.from(new Set(icons))
        };
      })()
    `,
    returnByValue: true,
  });

  console.log("\n=== DESKTOP 1440px CHECKS ===");
  console.log("Fish count:", desktopChecks.result.value.fishCount);
  console.log("All fish head leads direction:", desktopChecks.result.value.allHeadLeads);
  console.log("Rising bubbles count (desktop):", desktopChecks.result.value.risingBubblesCount);
  console.log("Old droplets count:", desktopChecks.result.value.oldDropletsCount);
  console.log("Old stars count:", desktopChecks.result.value.oldStarsCount);
  console.log("Old rays count:", desktopChecks.result.value.oldRaysCount);
  console.log("Horizontal overflow:", desktopChecks.result.value.hasHorizontalScroll);
  console.log("3D Clay icons found on page:", desktopChecks.result.value.iconsCount);
  console.log("Unique icons:", desktopChecks.result.value.uniqueIcons);

  // Take Desktop Screenshots
  await takeScreenshot(path.join(artifactDir, "1440-hero.png"), { x: 0, y: 0, width: 1440, height: 900, scale: 1 });

  // Scroll to Species Section
  await sendCommand(ws, "Runtime.evaluate", { expression: `document.getElementById('species').scrollIntoView();` });
  await new Promise((r) => setTimeout(r, 600));
  await takeScreenshot(path.join(artifactDir, "1440-species.png"), { x: 0, y: 0, width: 1440, height: 900, scale: 1 });

  // Scroll to Farm Section
  await sendCommand(ws, "Runtime.evaluate", { expression: `document.getElementById('farm').scrollIntoView();` });
  await new Promise((r) => setTimeout(r, 600));
  await takeScreenshot(path.join(artifactDir, "1440-farm.png"), { x: 0, y: 0, width: 1440, height: 900, scale: 1 });

  // Scroll to Shipping Section
  await sendCommand(ws, "Runtime.evaluate", { expression: `document.getElementById('shipping').scrollIntoView();` });
  await new Promise((r) => setTimeout(r, 600));
  await takeScreenshot(path.join(artifactDir, "1440-shipping.png"), { x: 0, y: 0, width: 1440, height: 900, scale: 1 });

  // Scroll to Reviews Section
  await sendCommand(ws, "Runtime.evaluate", { expression: `document.getElementById('reviews').scrollIntoView();` });
  await new Promise((r) => setTimeout(r, 600));
  await takeScreenshot(path.join(artifactDir, "1440-reviews.png"), { x: 0, y: 0, width: 1440, height: 900, scale: 1 });

  // Scroll to Footer
  await sendCommand(ws, "Runtime.evaluate", { expression: `document.getElementById('contact').scrollIntoView();` });
  await new Promise((r) => setTimeout(r, 600));
  await takeScreenshot(path.join(artifactDir, "1440-footer.png"), { x: 0, y: 0, width: 1440, height: 900, scale: 1 });

  // 2. Tablet Verification (768x1024)
  await setViewport(768, 1024);
  await sendCommand(ws, "Runtime.evaluate", { expression: `window.scrollTo(0, 0);` });
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot(path.join(artifactDir, "768-hero.png"), { x: 0, y: 0, width: 768, height: 1024, scale: 1 });

  const tabletChecks = await sendCommand(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        return {
          hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
        };
      })()
    `,
    returnByValue: true,
  });
  console.log("\n=== TABLET 768px CHECKS ===");
  console.log("Horizontal overflow:", tabletChecks.result.value.hasHorizontalScroll);

  // 3. Mobile Verification (390x844)
  await setViewport(390, 844);
  await sendCommand(ws, "Runtime.evaluate", { expression: `window.scrollTo(0, 0);` });
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot(path.join(artifactDir, "390-hero.png"), { x: 0, y: 0, width: 390, height: 844, scale: 1 });

  const mobileChecks = await sendCommand(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const visibleBubbles = Array.from(document.querySelectorAll('.bubble-rise')).filter(
          el => window.getComputedStyle(el).display !== 'none'
        );
        return {
          visibleBubblesCount: visibleBubbles.length,
          hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
        };
      })()
    `,
    returnByValue: true,
  });
  console.log("\n=== MOBILE 390px CHECKS ===");
  console.log("Visible rising bubbles count (mobile):", mobileChecks.result.value.visibleBubblesCount);
  console.log("Horizontal overflow:", mobileChecks.result.value.hasHorizontalScroll);

  console.log("\n=== CONSOLE ERRORS ===");
  console.log("Total console errors:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors);
  }

  ws.close();
  chrome.kill();
  console.log("\nVerification complete!");
}

run().catch((err) => {
  console.error("Verification error:", err);
  chrome.kill();
  process.exit(1);
});
