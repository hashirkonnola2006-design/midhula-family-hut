const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9236;
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
        width: 390,
        height: 844,
        deviceScaleFactor: 1,
        mobile: true,
      });
      await new Promise((r) => setTimeout(r, 1000));

      console.log("=== TESTING MOBILE INTERACTIONS ===");

      // 1. Open mobile hamburger menu
      await send("Runtime.evaluate", {
        expression: `document.querySelector('button[aria-label=\"Open menu\"]').click();`,
      });
      await new Promise((r) => setTimeout(r, 400));

      const menuCheck = await send("Runtime.evaluate", {
        expression: `
          (() => {
            const drawer = document.querySelector('div.fixed.inset-0.z-50.md\\\\:hidden');
            const bodyOverflow = document.body.style.overflow;
            const floatingWa = document.querySelector('aside[aria-label=\"Contact on WhatsApp\"]');
            const links = Array.from(document.querySelectorAll('div.relative.w-full.bg-\\\\[\\\\#FFF8E7\\\\] a')).map(a => ({
              text: a.innerText.trim(),
              height: a.offsetHeight
            }));
            return {
              isOpen: !!drawer,
              bodyLocked: bodyOverflow === 'hidden',
              floatingWaHidden: !floatingWa,
              links
            };
          })()
        `,
        returnByValue: true,
      });

      console.log("Mobile Drawer Open:", menuCheck.result.value.isOpen);
      console.log("Body Scroll Locked:", menuCheck.result.value.bodyLocked);
      console.log("Floating WhatsApp Hidden while menu open:", menuCheck.result.value.floatingWaHidden);
      console.log("Drawer link heights (>=44px required):", menuCheck.result.value.links);

      // Screenshot open drawer
      const brainDir = "C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\734d83a0-9020-4a69-a67e-202ac9171427";
      const ssDrawer = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(brainDir, "390-drawer-open.png"), Buffer.from(ssDrawer.data, "base64"));
      console.log("Saved 390-drawer-open.png");

      // 2. Close mobile menu via Escape key
      await send("Input.dispatchKeyEvent", { type: "rawKeyDown", windowsVirtualKeyCode: 27, key: "Escape" });
      await send("Input.dispatchKeyEvent", { type: "keyUp", windowsVirtualKeyCode: 27, key: "Escape" });
      await new Promise((r) => setTimeout(r, 400));

      const closeCheck = await send("Runtime.evaluate", {
        expression: `
          (() => {
            const drawer = document.querySelector('div.fixed.inset-0.z-50.md\\\\:hidden');
            const bodyOverflow = document.body.style.overflow;
            return {
              isClosed: !drawer,
              bodyUnlocked: bodyOverflow === ''
            };
          })()
        `,
        returnByValue: true,
      });

      console.log("Mobile Drawer Closed on Escape:", closeCheck.result.value.isClosed);
      console.log("Body Scroll Unlocked:", closeCheck.result.value.bodyUnlocked);

      // 3. Test Filter Chips
      const chipCheck = await send("Runtime.evaluate", {
        expression: `
          (() => {
            const btn = document.querySelector('button[data-category="guppies"]');
            const allBtns = Array.from(document.querySelectorAll('#species button')).map(b => ({
              text: b.innerText,
              cat: b.getAttribute('data-category')
            }));
            return {
              hasGuppyBtn: !!btn,
              buttons: allBtns
            };
          })()
        `,
        returnByValue: true,
      });
      console.log("Filter Chip Diagnostic:", chipCheck.result.value);

      await send("Runtime.evaluate", {
        expression: `
          const guppyChip = document.querySelector('button[data-category="guppies"]');
          if (guppyChip) {
            guppyChip.click();
          }
        `,
      });
      await new Promise((r) => setTimeout(r, 600));

      const filterGuppy = await send("Runtime.evaluate", {
        expression: `document.querySelectorAll('#species .clay-tile').length`,
        returnByValue: true,
      });
      console.log("Cards count after filtering to Guppies:", filterGuppy.result.value);

      // Filter back to All
      await send("Runtime.evaluate", {
        expression: `
          const allChip = document.querySelector('button[data-category="all"]');
          if (allChip) allChip.click();
        `,
      });
      await new Promise((r) => setTimeout(r, 600));

      const filterAll = await send("Runtime.evaluate", {
        expression: `document.querySelectorAll('#species .clay-tile').length`,
        returnByValue: true,
      });
      console.log("Cards count after clicking All:", filterAll.result.value);

      // 4. Test Card Description Expand / Collapse Toggle
      const expandTest = await send("Runtime.evaluate", {
        expression: `
          (() => {
            const firstCard = document.querySelector('#species .clay-tile');
            const toggleBtn = firstCard.querySelector('button');
            const descBefore = firstCard.querySelector('p.font-medium').className;
            const textBefore = toggleBtn.innerText;
            toggleBtn.click();
            return { textBefore, hasClampBefore: descBefore.includes('line-clamp-2') };
          })()
        `,
        returnByValue: true,
      });
      await new Promise((r) => setTimeout(r, 200));

      const expandAfter = await send("Runtime.evaluate", {
        expression: `
          (() => {
            const firstCard = document.querySelector('#species .clay-tile');
            const toggleBtn = firstCard.querySelector('button');
            const descAfter = firstCard.querySelector('p.font-medium').className;
            const textAfter = toggleBtn.innerText;
            return { textAfter, hasClampAfter: descAfter.includes('line-clamp-2') };
          })()
        `,
        returnByValue: true,
      });
      console.log("Card expand test:", { before: expandTest.result.value, after: expandAfter.result.value });

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
