import { fail, ok } from "@creator-print-ai/core";
import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

export function apiOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(ok(data), init);
}

export function apiFail(code: string, message: string, status = 400, details?: unknown) {
  return NextResponse.json(fail(code, message, details), { status });
}

export async function parseJson<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  const body = await request.json().catch(() => undefined);
  return schema.parse(body);
}

export function routeError(error: unknown) {
  if (error instanceof ZodError) {
    return apiFail("VALIDATION_ERROR", "Request validation failed.", 422, error.flatten());
  }

  if (error instanceof Error) {
    return apiFail("REQUEST_FAILED", error.message, 400);
  }

  return apiFail("REQUEST_FAILED", "Unexpected request failure.", 500);
}
