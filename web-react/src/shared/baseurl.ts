// Mirror src/app/shared/baseurl.ts. The Vite dev server proxies the API paths
// so we just use root-relative URLs in code; tests can override with MSW or
// when running against a remote backend.
export const baseURL = '/';
