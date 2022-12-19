# Vite Node Loader

This is a proof-of-concept [ESM loader](https://nodejs.org/api/esm.html#loaders)](https://nodejs.org/api/esm.html#loaders) that uses Vite to compile modules. It requires [this PR](https://github.com/vitejs/vite/pull/11411) so the experiment uses the package `@cyco130/vite` instead of `vite`, which is published with the PR merged.

The resolver adds a timestamp so that if a module is imported after a change, a new instance will be created. This is similar to how `ssrLoadModule` works in Vite.

This is just one possible approach to using Vite in a Node ESM loader. Its advantage is its simplicity, a simple `vite dev` command can be used to run the server. But it's possible to create the server in a separate process and communicate with it via IPC, for example.
