function escapeCsvValue(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function rowsToCsv<T extends Record<string, string>>(
  rows: T[],
  columns: (keyof T)[],
): string {
  const header = columns.map((column) => escapeCsvValue(String(column))).join(",");
  const body = rows.map((row) =>
    columns.map((column) => escapeCsvValue(row[column] ?? "")).join(","),
  );
  return [header, ...body].join("\n");
}
