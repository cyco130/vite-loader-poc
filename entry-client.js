import { createElement } from "react";
import { hydrate } from "react-dom";
import App from "./App";

const div = document.getElementById("app");
const app = createElement(App);

hydrate(app, div);
