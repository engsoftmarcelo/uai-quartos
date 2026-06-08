import { createHmac, timingSafeEqual } from 'crypto';

export function signPayload(payload: unknown, secret: string): string {
  return createHmac('sha256', secret)
    .update(stableStringify(payload))
    .digest('hex');
}

export function verifyPayloadSignature(
  payload: unknown,
  signature: string | undefined,
  secret: string,
): boolean {
  if (!signature) {
    return false;
  }

  const expected = signPayload(payload, secret);
  const received = signature.replace(/^sha256=/i, '').trim();
  const expectedBuffer = Buffer.from(expected, 'hex');
  const receivedBuffer = Buffer.from(received, 'hex');

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}
