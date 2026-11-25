// A small stand-in for Playwright, for import-cardnews.mjs on machines without it: drives the
// installed Google Chrome over the DevTools protocol (Node's built-in WebSocket, no packages).
// It only does what the import needs: open a page, read text, take PNG screenshots.
//   CHROME_PATH=<chrome executable> overrides where Chrome is looked for.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

export function findChrome() {
  return CANDIDATES.find((p) => fs.existsSync(p));
}

/** Starts headless Chrome and returns one page with a fixed viewport. */
export async function launchChrome({ width, height }) {
  const exe = findChrome();
  if (!exe) throw new Error("Neither Playwright nor Google Chrome was found. Set CHROME_PATH or install playwright.");
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cardnews-chrome-"));
  const proc = spawn(exe, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], {
    stdio: ["ignore", "ignore", "pipe"],
  });
  const port = await new Promise((resolve, reject) => {
    let log = "";
    const timer = setTimeout(() => reject(new Error(`Chrome did not start:\n${log}`)), 20000);
    proc.stderr.on("data", (d) => {
      log += d;
      const m = log.match(/DevTools listening on ws:\/\/[^:]+:(\d+)\//);
      if (m) {
        clearTimeout(timer);
        resolve(m[1]);
      }
    });
    proc.on("exit", () => reject(new Error(`Chrome exited:\n${log}`)));
  });
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let id = 0;
  const pending = new Map();
  const listeners = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    } else if (msg.method) for (const fn of listeners.get(msg.method) ?? []) fn(msg.params);
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      pending.set(++id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  const on = (method, fn) => listeners.set(method, [...(listeners.get(method) ?? []), fn]);
  const once = (method) => new Promise((resolve) => on(method, function handler(p) {
    listeners.set(method, listeners.get(method).filter((f) => f !== handler));
    resolve(p);
  }));
  const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;

  await send("Page.enable");
  await send("Network.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
  const failed = new Set();
  const requests = new Map();
  on("Network.requestWillBeSent", (p) => requests.set(p.requestId, p.request.url));
  on("Network.loadingFailed", (p) => failed.add(requests.get(p.requestId)));
  on("Network.responseReceived", (p) => p.response.status >= 400 && failed.add(p.response.url));

  return {
    /** URLs that failed to load on any page opened so far. */
    failed,
    async goto(url) {
      const loaded = once("Page.loadEventFired");
      await send("Page.navigate", { url });
      await loaded;
      // Web fonts and background images, then one more frame.
      await evaluate("document.fonts.ready.then(() => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 300))))");
    },
    /** innerText and page position of every element matching `selector`. */
    elements: (selector) =>
      evaluate(`[...document.querySelectorAll(${JSON.stringify(selector)})].map((e) => {
        const r = e.getBoundingClientRect();
        return { text: e.innerText, clip: { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height } };
      })`),
    bodyText: () => evaluate("document.body.innerText"),
    async screenshot(clip) {
      const { data } = await send("Page.captureScreenshot", { format: "png", clip: { ...clip, scale: 1 }, captureBeyondViewport: true });
      return Buffer.from(data, "base64");
    },
    async close() {
      ws.close();
      proc.kill();
      await new Promise((r) => setTimeout(r, 500));
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 3 });
    },
  };
}
