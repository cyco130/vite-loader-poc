// This file is only used in production, it has no effect in development.

import express from "express";
import handler from "./handler";

const app = express();

app.use(express.static("dist/client"));
app.use(handler);

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
