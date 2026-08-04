function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);

  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, normalize(value[key])]),
    );
  }

  throw new TypeError("Canonical JSON supports only JSON values.");
}

export function canonicalJson(value) {
  return JSON.stringify(normalize(value));
}
