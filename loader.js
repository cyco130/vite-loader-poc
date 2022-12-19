import path from "path";
import { pathToFileURL } from "url";
import { shouldExternalizeForSSR } from "@cyco130/vite";

export async function resolve(specifier, context, nextResolve) {
  if (typeof __vite_dev_server__ === "undefined") {
    return nextResolve(specifier, context);
  }

  if (specifier.match(/[?&]vavite-entry$/) && context.parentURL) {
    specifier = specifier.slice(0, -"?vavite-entry".length);
    const rootPath = __vite_dev_server__.config.root;
    const resolvedPath = path.resolve(rootPath, specifier);

    const resolved = await __vite_dev_server__.moduleGraph.resolveUrl(
      resolvedPath,
      true
    );

    if (resolved) {
      return {
        url: `vite:${addTimestamp(resolved[1])}`,
        shortCircuit: true,
      };
    }
  } else if (
    context.parentURL?.startsWith("vite:") &&
    !shouldExternalizeForSSR(specifier, __vite_dev_server__.config)
  ) {
    const parent = context.parentURL.slice("vite:".length);
    const resolved = await __vite_dev_server__.pluginContainer.resolveId(
      specifier,
      parent,
      { ssr: true }
    );

    if (resolved) {
      if (!resolved.external) {
        return { url: addTimestamp(`vite:${resolved.id}`), shortCircuit: true };
      } else {
        return { url: pathToFileURL(resolved.id).href, shortCircuit: true };
      }
    }
  }

  if (context.parentURL?.startsWith("vite:")) {
    context.parentURL = pathToFileURL(
      context.parentURL.slice("vite:".length)
    ).href;
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (typeof __vite_dev_server__ === "undefined") {
    return nextLoad(url, context);
  }

  if (url.startsWith("vite:")) {
    const id = url.slice("vite:".length);
    const loaded = await __vite_dev_server__.transformRequest(id, {
      ssr: true,
    });

    if (!loaded) {
      throw new Error(`Failed to load module ${id}`);
    }

    let code = loaded.code;
    const map = loaded.map;

    if (map) {
      code += `\n//# sourceMappingURL=data:application/json;base64,${Buffer.from(
        JSON.stringify(map)
      ).toString("base64")}`;
    }

    code = `import.meta.hot="Hello world!";` + code;

    return {
      format: "module",
      source: code,
      shortCircuit: true,
    };
  }

  return nextLoad(url, context);
}

function addTimestamp(id) {
  const ts =
    __vite_dev_server__?.moduleGraph.getModuleById(
      id
    )?.lastInvalidationTimestamp;

  if (ts) {
    id += `?t=${ts}`;
  }

  return id;
}
