const { spawn } = require("child_process");
const http = require("http");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9234;
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
      await new Promise((r) => setTimeout(r, 1200));

      const heights = await send("Runtime.evaluate", {
        expression: `
          (() => {
            const secs = ['hero', 'species', 'farm', 'shipping', 'reviews', 'contact'];
            return secs.map(id => {
              const el = document.getElementById(id);
              return {
                id,
                height: el ? el.offsetHeight : 0,
                screens: el ? (el.offsetHeight / 844).toFixed(1) : 0
              };
            });
          })()
        `,
        returnByValue: true,
      });

      console.log("BEFORE 390px Section Heights:");
      console.log(JSON.stringify(heights.result.value, null, 2));

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
