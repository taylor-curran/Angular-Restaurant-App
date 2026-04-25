import { vi } from 'vitest';

export interface MockResponse {
  status?: number;
  body?: unknown;
  text?: string;
}

export interface MockHandlers {
  [methodAndUrl: string]: MockResponse | ((url: string, init?: RequestInit) => MockResponse);
}

export interface RequestRecord {
  method: string;
  url: string;
  body?: unknown;
}

// Lightweight helper that swaps in a fake `fetch` for the duration of a test
// and records every outgoing request. Lets us assert on HTTP method + path +
// body — the same contract the Angular app exercises against :8000.
export function installFetchMock(handlers: MockHandlers) {
  const calls: RequestRecord[] = [];
  const fakeFetch = vi.fn(async (input: RequestInfo, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : (input as Request).url;
    const method = (init?.method || 'GET').toUpperCase();
    const body = init?.body ? safeParse(init.body as string) : undefined;
    calls.push({ method, url, body });
    const key = `${method} ${url}`;
    let handler = handlers[key];
    if (!handler) {
      // Allow trailing query string match: e.g. handler key "GET /dishes" should match "GET /dishes?featured=true".
      const noQuery = `${method} ${url.split('?')[0]}`;
      handler = handlers[noQuery];
    }
    if (!handler) {
      return new Response('Not Found', { status: 404, statusText: 'Not Found' });
    }
    const resolved = typeof handler === 'function' ? handler(url, init) : handler;
    const status = resolved.status ?? 200;
    const text = resolved.text ?? JSON.stringify(resolved.body ?? null);
    return new Response(text, {
      status,
      statusText: status === 200 ? 'OK' : status === 404 ? 'Not Found' : '',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  const original = globalThis.fetch;
  globalThis.fetch = fakeFetch as unknown as typeof fetch;
  return {
    calls,
    restore() {
      globalThis.fetch = original;
    },
  };
}

function safeParse(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}
