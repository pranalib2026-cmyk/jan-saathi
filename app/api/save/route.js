import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

export async function POST(request) {
  try {
    const payload = await request.json();

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const filePath = path.join(dataDir, "submissions.xlsx");

    let workbook;
    const timestamp = new Date().toISOString();

    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const ws = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
      rows.push({ ...payload, timestamp });
      const newWs = XLSX.utils.json_to_sheet(rows);
      workbook.Sheets[sheetName] = newWs;
    } else {
      workbook = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([{ ...payload, timestamp }]);
      XLSX.utils.book_append_sheet(workbook, ws, "Submissions");
    }

    try {
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      fs.writeFileSync(filePath, wbout);
    } catch (writeErr) {
      // Fallback: write to temp file then rename
      try {
        const tmpPath = filePath + ".tmp";
        const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        fs.writeFileSync(tmpPath, wbout);
        fs.renameSync(tmpPath, filePath);
      } catch (e) {
        throw new Error(`cannot save file ${filePath}`);
      }
    }

    return NextResponse.json({ ok: true, path: "/data/submissions.xlsx" });
  } catch (err) {
    console.error("Save route error:", err);
    return NextResponse.json({ ok: false, error: String(err) });
  }
}
