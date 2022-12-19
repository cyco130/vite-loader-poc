import express from "express";
import React, { useState, createElement } from "react";
import { renderToString } from "react-dom/server";
function App() {
  const [count, setCount] = useState(0);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "My App"), /* @__PURE__ */ React.createElement("p", null, "Hello world!"), /* @__PURE__ */ React.createElement("button", { onClick: () => setCount(count + 1) }, "Clicked ", count, " time(s)"));
}
async function handler(req, res, next) {
  const app2 = renderToString(createElement(App));
  let scripts = "";
  if (typeof __vite_dev_server__ === "undefined") {
    const manifest = await import("./assets/manifest-351c5a23.js");
    scripts += `<script type="module" src="/${manifest.default["entry-client.js"].file}"><\/script>`;
  } else {
    scripts += `<script type="module" src="/@vite/client"><\/script>`;
    scripts += `<script type="module" src="/entry-client.js"><\/script>`;
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
      <div id="app">${app2}</div>
    </body>
    </html>
    `;
    res.end(body);
  }
  next();
}
const app = express();
app.use(express.static("dist/client"));
app.use(handler);
app.listen(3e3, () => {
  console.log("Listening on http://localhost:3000");
});
