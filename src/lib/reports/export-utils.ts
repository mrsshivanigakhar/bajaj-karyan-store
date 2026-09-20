import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export interface PdfReportOptions {
  fileName: string;
  title: string;
  subtitle?: string;
  metaInfo?: { label: string; value: string | number }[];
  summaryCards?: { label: string; value: string | number }[];
  head: string[][];
  body: (string | number)[][];
  columnStyles?: Record<
    number,
    { halign?: "left" | "center" | "right"; cellWidth?: number | "auto" }
  >;
  orientation?: "portrait" | "landscape";
}

export interface ExcelReportOptions {
  fileName: string;
  sheetName?: string;
  title?: string;
  metaInfo?: { label: string; value: string | number }[];
  headers: string[];
  rows: (string | number | boolean | null | undefined)[][];
}

/**
 * Generate and download a branded PDF report using jsPDF & autoTable
 */
export function exportToPdf(options: PdfReportOptions) {
  const {
    fileName,
    title,
    subtitle,
    metaInfo = [],
    summaryCards = [],
    head,
    body,
    columnStyles = {},
    orientation = "portrait",
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  let cursorY = 15;

  // 1. Brand Header Band
  doc.setFillColor(89, 13, 34); // #590d22
  doc.rect(0, 0, pageWidth, 4, "F");

  // 2. Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(89, 13, 34); // #590d22
  doc.text("BAJAJ karyana STORE", marginX, cursorY);

  // Print timestamp on top right
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${dateStr}, ${timeStr}`, pageWidth - marginX, cursorY, {
    align: "right",
  });

  cursorY += 6;

  // 3. Report Title & Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(128, 15, 47); // #800f2f
  doc.text(title.toUpperCase(), marginX, cursorY);

  if (subtitle) {
    cursorY += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text(subtitle, marginX, cursorY);
  }

  cursorY += 4;

  // 4. Metadata Details (filters, total records)
  if (metaInfo.length > 0) {
    const metaString = metaInfo
      .map((m) => `${m.label}: ${m.value}`)
      .join("  |  ");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text(metaString, marginX, cursorY);
    cursorY += 4;
  }

  // 5. Summary KPI Cards (optional)
  if (summaryCards.length > 0) {
    cursorY += 2;
    const cardGap = 4;
    const totalCardsWidth = pageWidth - marginX * 2;
    const cardWidth =
      (totalCardsWidth - (summaryCards.length - 1) * cardGap) /
      summaryCards.length;
    const cardHeight = 13;

    summaryCards.forEach((card, idx) => {
      const cardX = marginX + idx * (cardWidth + cardGap);
      // Card background
      doc.setFillColor(254, 242, 244); // #fdf2f4
      doc.setDrawColor(244, 199, 208); // light border
      doc.roundedRect(cardX, cursorY, cardWidth, cardHeight, 2, 2, "FD");

      // Label
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(120, 80, 90);
      doc.text(card.label.toUpperCase(), cardX + 3, cursorY + 4.5);

      // Value
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(89, 13, 34);
      doc.text(String(card.value), cardX + 3, cursorY + 10);
    });

    cursorY += cardHeight + 4;
  } else {
    cursorY += 2;
  }

  // 6. Draw Table
  const autoTableFn = (autoTable as any).default || autoTable;
  autoTableFn(doc, {
    startY: cursorY,
    head,
    body,
    theme: "grid",
    headStyles: {
      fillColor: [128, 15, 47], // #800f2f
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "left",
      cellPadding: 2.2,
    },
    bodyStyles: {
      textColor: [40, 40, 40],
      fontSize: 7.5,
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: [254, 247, 248], // subtle rose
    },
    styles: {
      lineColor: [235, 215, 220],
      lineWidth: 0.15,
      overflow: "linebreak",
    },
    columnStyles,
    margin: { left: marginX, right: marginX, bottom: 15 },
    didDrawPage: (data: any) => {
      // Footer on each page
      const currentY = pageHeight - 8;
      doc.setDrawColor(230, 210, 215);
      doc.setLineWidth(0.2);
      doc.line(marginX, currentY - 2, pageWidth - marginX, currentY - 2);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      doc.text(
        "Bajaj karyana Store — Confidential Internal Business Report",
        marginX,
        currentY + 1.5,
      );

      const pageNumStr = `Page ${data.pageNumber}`;
      doc.text(pageNumStr, pageWidth - marginX, currentY + 1.5, {
        align: "right",
      });
    },
  });

  // Save the PDF
  const safeFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  doc.save(safeFileName);
}

/**
 * Generate and download an Excel (.xlsx) file using SheetJS
 */
export function exportToExcel(options: ExcelReportOptions) {
  const {
    fileName,
    sheetName = "Report",
    title,
    metaInfo,
    headers,
    rows,
  } = options;

  // Build rows array with optional title and metadata block
  const sheetData: any[][] = [];

  if (title) {
    sheetData.push(["BAJAJ karyana STORE"]);
    sheetData.push([title.toUpperCase()]);
    sheetData.push([`Generated on: ${new Date().toLocaleString("en-IN")}`]);
    if (metaInfo && metaInfo.length > 0) {
      sheetData.push(metaInfo.map((m) => `${m.label}: ${m.value}`));
    }
    sheetData.push([]); // blank separator row
  }

  // Add Headers
  sheetData.push(headers);

  // Add Data Rows
  rows.forEach((row) => sheetData.push(row));

  // Convert array of arrays to worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Calculate dynamic column widths based on maximum length in each column
  const colWidths: { wch: number }[] = headers.map((header, colIdx) => {
    let maxLen = header.length;
    rows.forEach((row) => {
      const cellVal = row[colIdx];
      if (cellVal !== null && cellVal !== undefined) {
        maxLen = Math.max(maxLen, String(cellVal).length);
      }
    });
    // Add padding, clamp between 10 and 50 characters
    return { wch: Math.min(Math.max(maxLen + 3, 10), 50) };
  });

  worksheet["!cols"] = colWidths;

  // Create workbook and append sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31)); // sheet name max 31 chars

  // Trigger download
  const safeFileName = fileName.endsWith(".xlsx")
    ? fileName
    : `${fileName}.xlsx`;
  XLSX.writeFile(workbook, safeFileName);
}
