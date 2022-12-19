import { createElement } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export default async function handler(req, res, next) {
  const app = renderToString(createElement(App));

  let scripts = "";
  if (typeof __vite_dev_server__ === "undefined") {
    // Production

    // Client build runs before server build, so we can import the manifest
    const manifest = await import("./dist/client/manifest.json", {
      assert: { type: "json" },
    });

    scripts += `<script type="module" src="/${manifest.default["entry-client.js"].file}"></script>`;
  } else {
    // Development
    scripts += `<script type="module" src="/@vite/client"></script>`;
    scripts += `<script type="module" src="/entry-client.js"></script>`;
  }

  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    const body = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      ${scripts}
    </head>
    <body>
      <div id="app">${app}</div>
    </body>
    </html>
    `;
    res.end(body);
  }

  next();
}
