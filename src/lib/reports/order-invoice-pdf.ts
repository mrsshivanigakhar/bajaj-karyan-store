import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, StoreSettings } from '@/types/database';
import { formatDate, formatUnit } from '@/lib/utils';

/**
 * Generates a clean, compact, professional PDF invoice for an order.
 * Designed specifically for A4 portrait printing and digital storage.
 */
export function generateOrderInvoicePdf(order: Order, settings: StoreSettings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 12;
  let cursorY = 10;

  // 1. Top Brand Accent Band
  doc.setFillColor(89, 13, 34); // #590d22
  doc.rect(0, 0, pageWidth, 4, 'F');

  // 2. Compact Header (Store info on left, Invoice Info on right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(89, 13, 34);
  doc.text(settings.store_name || 'BAJAJ KARYANA STORE', marginX, cursorY);

  // Right side: INVOICE title
  doc.setFontSize(12);
  doc.setTextColor(128, 15, 47); // #800f2f
  doc.text('TAX INVOICE / RECEIPT', pageWidth - marginX, cursorY, { align: 'right' });

  cursorY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(75, 75, 75);

  const addressText = [settings.address, settings.city, settings.state ? `${settings.state} - ${settings.pincode}` : settings.pincode]
    .filter(Boolean)
    .join(', ');
  doc.text(addressText || 'Confectionery & Daily Kiryana', marginX, cursorY);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text(`Order #${order.order_number}`, pageWidth - marginX, cursorY, { align: 'right' });

  cursorY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 75, 75);
  doc.text(`Phone: ${settings.phone || '-'} | Email: ${settings.email || '-'}`, marginX, cursorY);
  doc.text(`Date: ${formatDate(order.created_at)}`, pageWidth - marginX, cursorY, { align: 'right' });

  cursorY += 3.5;
  // Divider
  doc.setDrawColor(215, 215, 215);
  doc.setLineWidth(0.3);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);

  cursorY += 4;

  // 3. Compact 2-Column Info (Order Details & Customer / Delivery)
  const colWidth = (pageWidth - marginX * 2 - 6) / 2;
  const leftX = marginX;
  const rightX = marginX + colWidth + 6;
  const cardHeight = 22;

  // Background card for metadata
  doc.setFillColor(253, 248, 250);
  doc.roundedRect(leftX, cursorY, colWidth, cardHeight, 1.5, 1.5, 'F');
  doc.roundedRect(rightX, cursorY, colWidth, cardHeight, 1.5, 1.5, 'F');

  doc.setDrawColor(240, 220, 225);
  doc.setLineWidth(0.2);
  doc.roundedRect(leftX, cursorY, colWidth, cardHeight, 1.5, 1.5, 'S');
  doc.roundedRect(rightX, cursorY, colWidth, cardHeight, 1.5, 1.5, 'S');

  // Left Content: Order Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(128, 15, 47);
  doc.text('ORDER & PAYMENT DETAILS', leftX + 3, cursorY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(50, 50, 50);
  doc.text(`Status: ${order.status.toUpperCase().replace('_', ' ')}`, leftX + 3, cursorY + 9);
  doc.text(`Payment: ${order.payment_status.toUpperCase()} (${order.payment_method.toUpperCase()})`, leftX + 3, cursorY + 13.5);
  doc.text(`Total Items: ${order.order_items?.length || 0}`, leftX + 3, cursorY + 18);

  // Right Content: Customer Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(128, 15, 47);
  doc.text('DELIVERY & CUSTOMER INFO', rightX + 3, cursorY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(50, 50, 50);
  doc.text(`Customer: ${order.customer_name} (${order.customer_phone})`, rightX + 3, cursorY + 9);
  const deliveryAddressStr = `${order.delivery_address}${order.landmark ? `, ${order.landmark}` : ''}, ${order.city} - ${order.pincode}`;
  const splitAddress = doc.splitTextToSize(`Address: ${deliveryAddressStr}`, colWidth - 6);
  doc.text(splitAddress.slice(0, 2), rightX + 3, cursorY + 13.5);

  cursorY += cardHeight + 4;

  // 4. Items Table using autoTable
  const head = [['#', 'Item Description', 'Unit', 'Qty / Wt', 'Rate (INR)', 'Total (INR)']];
  const body = (order.order_items || []).map((item, idx) => {
    let desc = item.product_name;
    if (item.customer_notes) {
      desc += `\n[Note: ${item.customer_notes}]`;
    }
    const unitStr = formatUnit(item.unit_type, item.unit_value);
    const qtyStr = `${item.quantity}${item.requested_weight ? ` (${item.requested_weight})` : ''}`;
    const rateStr = item.unit_price !== null ? `Rs. ${item.unit_price}` : 'On Request';
    const totalStr = item.line_total !== null ? `Rs. ${item.line_total}` : 'Pending';

    return [idx + 1, desc, unitStr, qtyStr, rateStr, totalStr];
  });

  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head,
    body,
    theme: 'plain',
    headStyles: {
      fillColor: [128, 15, 47], // #800f2f
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [40, 40, 40],
    },
    alternateRowStyles: {
      fillColor: [253, 248, 250],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 'auto', halign: 'left' },
      2: { cellWidth: 26, halign: 'center' },
      3: { cellWidth: 26, halign: 'center' },
      4: { cellWidth: 24, halign: 'right' },
      5: { cellWidth: 26, halign: 'right' },
    },
    tableLineColor: [230, 230, 230],
    tableLineWidth: 0.1,
  });

  // 5. Totals & Notes Section
  // @ts-expect-error autoTable adds lastAutoTable
  let finalY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 4 : cursorY + 40;

  // Check if we need a new page for totals if close to bottom
  if (finalY > 250) {
    doc.addPage();
    finalY = 15;
  }

  // Notes on Left
  const notesWidth = pageWidth - marginX * 2 - 68;
  if (order.customer_notes || order.admin_notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.text('Notes / Instructions:', marginX, finalY + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    let noteY = finalY + 7;
    if (order.customer_notes) {
      const splitNote = doc.splitTextToSize(`Customer: ${order.customer_notes}`, notesWidth);
      doc.text(splitNote, marginX, noteY);
      noteY += splitNote.length * 3.5;
    }
    if (order.admin_notes) {
      const splitAdmin = doc.splitTextToSize(`Store: ${order.admin_notes}`, notesWidth);
      doc.text(splitAdmin, marginX, noteY);
    }
  }

  // Totals Box on Right
  const totalsX = pageWidth - marginX - 62;
  const totalsHeight = order.discount > 0 ? 27 : 23;
  doc.setFillColor(253, 248, 250);
  doc.roundedRect(totalsX, finalY, 62, totalsHeight, 1.5, 1.5, 'F');
  doc.setDrawColor(240, 220, 225);
  doc.setLineWidth(0.2);
  doc.roundedRect(totalsX, finalY, 62, totalsHeight, 1.5, 1.5, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);

  let curTotalY = finalY + 5;
  // Subtotal
  doc.text('Subtotal:', totalsX + 3, curTotalY);
  doc.text(`Rs. ${order.subtotal}`, totalsX + 59, curTotalY, { align: 'right' });

  // Discount
  if (order.discount > 0) {
    curTotalY += 4.5;
    doc.text('Discount:', totalsX + 3, curTotalY);
    doc.setTextColor(180, 30, 60);
    doc.text(`-Rs. ${order.discount}`, totalsX + 59, curTotalY, { align: 'right' });
    doc.setTextColor(70, 70, 70);
  }

  // Delivery
  curTotalY += 4.5;
  doc.text('Delivery Charge:', totalsX + 3, curTotalY);
  const deliveryChargeStr = order.delivery_charge === 0 ? 'Free' : `Rs. ${order.delivery_charge}`;
  doc.text(deliveryChargeStr, totalsX + 59, curTotalY, { align: 'right' });

  // Grand Total Line
  curTotalY += 3;
  doc.setDrawColor(128, 15, 47);
  doc.setLineWidth(0.3);
  doc.line(totalsX + 3, curTotalY, totalsX + 59, curTotalY);

  curTotalY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(89, 13, 34); // #590d22
  doc.text('Grand Total:', totalsX + 3, curTotalY);
  const totalAmount = order.final_total || order.estimated_total;
  doc.text(`Rs. ${totalAmount}`, totalsX + 59, curTotalY, { align: 'right' });

  // 6. Compact Footer
  const footerY = Math.max(finalY + totalsHeight + 8, 280);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(marginX, footerY, pageWidth - marginX, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(89, 13, 34);
  doc.text('Thank you for choosing Bajaj Karyana Store!', pageWidth / 2, footerY + 3.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `For queries or returns, please call ${settings.phone || '-'} | Official computer-generated invoice.`,
    pageWidth / 2,
    footerY + 7,
    { align: 'center' }
  );

  // Save the PDF
  doc.save(`Invoice-${order.order_number}.pdf`);
}
