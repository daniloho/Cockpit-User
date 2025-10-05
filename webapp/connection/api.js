sap.ui.define([], () => {
  "use strict";

  async function handle(res) {
    if (!res.ok) {
      // tenta ler o corpo para mostrar detalhes do erro
      const text = await res.text().catch(() => "");
      throw new Error(text || `HTTP ${res.status}`);
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
  }

  // headers básicos pra JSON
  const jsonHeaders = { "Content-Type": "application/json" };

  return {
    get: async (url) =>
      handle(await fetch(url)),

    post: async (url, data) =>
      handle(await fetch(url, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(data)
      })),

    patch: async (url, data) =>
      handle(await fetch(url, {
        method: "PATCH",
        headers: jsonHeaders,
        body: JSON.stringify(data)
      })),

    del: async (url) =>
      handle(await fetch(url, { method: "DELETE" }))
  };
});
