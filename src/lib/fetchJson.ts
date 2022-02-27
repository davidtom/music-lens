// Source: github.com/vercel/next.js/blob/canary/examples/with-iron-session/lib/fetchJson.ts

export default async function fetchJson<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const response = await fetch(input, init);

  // if the server replies, there's always some data in json
  // if there's a network error, it will throw at the previous line
  const data = await response.json();

  // response.ok is true when res.status is 2xx
  // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
  if (response.ok) {
    return data;
  }

  const err = new FetchError(response.statusText, response.status, data);

  throw err;
}

export class FetchError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);

    this.status = status;
    this.data = data;
  }
}
