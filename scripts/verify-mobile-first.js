const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9235;
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

      const consoleErrors = [];
      ws.addEventListener("message", (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
          consoleErrors.push(msg.params.args.map((a) => a.value || a.description).join(" "));
        }
      });

      await send("Runtime.enable");
      await send("Page.enable");
      await send("DOM.enable");

      const brainDir = "C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427";

      const viewports = [
        { name: "360-android", width: 360, height: 740, mobile: true },
        { name: "390-iphone", width: 390, height: 844, mobile: true },
        { name: "430-promax", width: 430, height: 932, mobile: true },
        { name: "768-tablet", width: 768, height: 1024, mobile: false },
        { name: "1440-desktop", width: 1440, height: 900, mobile: false },
      ];

      console.log("=== MULTI-VIEWPORT VERIFICATION ===");

      for (const vp of viewports) {
        await send("Emulation.setDeviceMetricsOverride", {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.mobile,
        });
        await send("Runtime.evaluate", {
          expression: `
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, 0);
          `,
        });
        await new Promise((r) => setTimeout(r, 600));

        // Evaluate checks
        const checks = await send("Runtime.evaluate", {
          expression: `
            (() => {
              const overflow = document.documentElement.scrollWidth > window.innerWidth;
              const floatingWa = document.querySelector('aside[aria-label=\"Contact on WhatsApp\"]');
              const filterChips = document.querySelectorAll('button.clay-pill, button.clay-pill-orange');
              const fishCards = document.querySelectorAll('#species .clay-tile');
              
              // Verify fish positions on mobile: none should be between 18% and 85%
              const heroFish = Array.from(document.querySelectorAll('#hero .fish-lane')).filter(
                el => window.getComputedStyle(el).display !== 'none'
              );
              const fishTops = heroFish.map(f => parseFloat(f.style.top));

              return {
                overflow,
                hasFloatingWa: !!floatingWa,
                filterChipsCount: filterChips.length,
                fishCardsCount: fishCards.length,
                visibleHeroFishCount: heroFish.length,
                fishTops,
                heroTextClear: fishTops.every(t => t < 18 || t > 85)
              };
            })()
          `,
          returnByValue: true,
        });

        const c = checks.result.value;
        console.log(`\n[Viewport: ${vp.name} (${vp.width}x${vp.height})]`);
        console.log(`  Horizontal overflow: ${c.overflow ? "FAIL" : "PASS"}`);
        console.log(`  Floating WhatsApp button: ${c.hasFloatingWa ? "PRESENT" : "MISSING"}`);
        console.log(`  Category filter chips: ${c.filterChipsCount}`);
        console.log(`  Species cards: ${c.fishCardsCount}`);
        console.log(`  Hero visible fish: ${c.visibleHeroFishCount} (tops: ${c.fishTops.join(", ")}%)`);
        console.log(`  Hero text zone 100% clear of fish: ${c.heroTextClear ? "PASS" : "FAIL"}`);

        // Capture hero screenshot
        const ssHero = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(path.join(brainDir, `${vp.name}-hero.png`), Buffer.from(ssHero.data, "base64"));

        // Capture species section screenshot
        const speciesPos = await send("Runtime.evaluate", {
          expression: `document.getElementById('species').offsetTop`,
          returnByValue: true,
        });
        await send("Runtime.evaluate", {
          expression: `window.scrollTo(0, ${speciesPos.result.value})`,
        });
        await new Promise((r) => setTimeout(r, 400));

        const ssSpecies = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(path.join(brainDir, `${vp.name}-species.png`), Buffer.from(ssSpecies.data, "base64"));
      }

      console.log(`\nTotal console errors: ${consoleErrors.length}`);
      if (consoleErrors.length > 0) console.log(consoleErrors);

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
