/**
 * Unit tests for the Sentry client init.
 *
 * Sentry v11 collects cookies, user info and request headers/bodies when
 * `dataCollection` is left unset, so the restrictive baseline must stay pinned.
 */

import * as Sentry from "@sentry/nextjs";

jest.mock("@sentry/nextjs", () => ({ init: jest.fn() }));

type InitOptions = NonNullable<Parameters<typeof Sentry.init>[0]>;

function loadInitOptions(): InitOptions {
  jest.isolateModules(() => {
    require("../../instrumentation-client");
  });
  const calls = (Sentry.init as jest.Mock).mock.calls;
  return calls[calls.length - 1][0];
}

describe("instrumentation-client Sentry.init", () => {
  it("disables user info, cookies and body/query collection", () => {
    const { dataCollection } = loadInitOptions();

    expect(dataCollection).toMatchObject({
      userInfo: false,
      cookies: false,
      httpBodies: [],
      databaseQueryData: false,
      queues: false,
      genAI: { inputs: false, outputs: false },
      graphQL: { document: false, variables: false },
    });
  });

  it("denies IP-revealing headers and query params", () => {
    const { dataCollection } = loadInitOptions();
    const deny = ["forwarded", "-ip", "remote-", "via", "-user"];

    expect(dataCollection?.httpHeaders).toEqual({
      request: { deny },
      response: { deny },
    });
    expect(dataCollection?.urlQueryParams).toEqual({ deny });
  });

  it("samples 10% of traces", () => {
    expect(loadInitOptions().tracesSampleRate).toBe(0.1);
  });

  it("beforeSend strips email and IP from the event user", () => {
    const { beforeSend } = loadInitOptions();
    const event = { user: { id: "1", email: "a@b.c", ip_address: "1.2.3.4" } };

    const result = beforeSend?.(event as never, {});

    expect(result).toEqual({ user: { id: "1" } });
  });
});
