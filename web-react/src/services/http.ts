// Tiny fetch wrapper that mirrors the error-message shape produced by the
// Angular ProcessHTTPMsgService: "<status> - <statusText> <body>". Anything
// that consumes a service result will get the same string when the backend
// fails, so loading/error states render the same way as on :4200.
export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function readErrorBody(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

async function processResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await readErrorBody(res);
    const msg = `${res.status} - ${res.statusText || ''} ${body}`.trim();
    throw new HttpError(msg, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function networkErrorMessage(err: unknown): string {
  if (err instanceof HttpError) return err.message;
  const m = err instanceof Error ? err.message : String(err);
  return m;
}

export async function httpGet<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (err) {
    throw new Error(networkErrorMessage(err));
  }
  return processResponse<T>(res);
}

export async function httpPost<T>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(networkErrorMessage(err));
  }
  return processResponse<T>(res);
}

export async function httpPut<T>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(networkErrorMessage(err));
  }
  return processResponse<T>(res);
}
