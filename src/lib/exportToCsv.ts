import type { Record } from "@/types";

const escapeCell = (value: string | null | undefined): string => {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const buildCsvString = (data: Record[]): string => {
  const headers = ["question", "answer", "nickname", "commentary"];
  const rows = data.map((record) =>
    [
      escapeCell(record.question),
      escapeCell(record.answer),
      escapeCell(
        Array.isArray(record.nickname)
          ? record.nickname.join(", ")
          : record.nickname,
      ),
      escapeCell(record.commentary),
    ].join(","),
  );
  return "\uFEFF" + [headers.join(","), ...rows].join("\n");
};

export const exportToCsv = (data: Record[], filename: string): void => {
  const csv = buildCsvString(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};
