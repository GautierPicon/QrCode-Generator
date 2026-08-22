// SPA mode: the page reads search params at runtime, which is incompatible
// with prerendering. Served via the adapter-static index.html fallback.
export const ssr = false;
export const prerender = false;
