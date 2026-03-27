import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FREE_SHIPPING_THRESHOLD = 580;

export function generateDispatchSlip({ detail, displayAddress, notes }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const orderId   = detail.id?.slice(0, 8).toUpperCase() || 'UNKNOWN';
  const orderDate = new Date(detail.created_at).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const customerName  = detail.users?.full_name  || '—';
  const customerEmail = detail.users?.email       || '—';
  const customerPhone = detail.billing_info?.phone || '—';

  const items    = detail.order_items || [];
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const total    = parseFloat(detail.total_amount || 0);

  const pageW  = doc.internal.pageSize.getWidth();
  const margin = 18;
  const col2   = pageW / 2 + 2;

  // ── HEADER BAND ────────────────────────────────────────────────────────────
  doc.setFillColor(45, 90, 61);          // dark green #2d5a3d
  doc.rect(0, 0, pageW, 28, 'F');

  // Brand name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('Promise Organics', margin, 12);

  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 222, 206);       // #c8dece
  doc.text('Natural & Organic Haircare', margin, 18);

  // DISPATCH SLIP label (right-aligned)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('DISPATCH SLIP', pageW - margin, 12, { align: 'right' });

  // Order number + date (right-aligned, smaller)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 222, 206);
  doc.text(`Order #${orderId}`, pageW - margin, 19, { align: 'right' });
  doc.text(orderDate,           pageW - margin, 24, { align: 'right' });

  let y = 38;

  // ── CUSTOMER & DELIVERY ───────────────────────────────────────────────────
  // Section heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(74, 124, 89);         // #4a7c59
  doc.text('CUSTOMER & DELIVERY DETAILS', margin, y);
  y += 1.5;
  doc.setDrawColor(74, 124, 89);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 1, pageW - margin, y + 1);
  y += 5;

  // Two-column layout: Customer | Address
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Customer', margin, y);
  doc.text('Shipping Address', col2, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(customerName,  margin, y);

  // Address — wrap long text
  const addrLines = doc.splitTextToSize(displayAddress, pageW / 2 - margin - 4);
  doc.text(addrLines, col2, y);

  y += 5;
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text(customerEmail, margin, y);
  y += 4.5;
  doc.text(customerPhone, margin, y);

  // Give address block space to breathe
  const addrBlockH = addrLines.length * 4;
  y = Math.max(y + 6, 38 + 5 + 4 + addrBlockH + 14);

  // ── ITEMS ORDERED ─────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(74, 124, 89);
  doc.text('ITEMS ORDERED', margin, y);
  y += 1.5;
  doc.setDrawColor(74, 124, 89);
  doc.line(margin, y + 1, pageW - margin, y + 1);
  y += 4;

  const tableRows = items.map(item => [
    item.products?.name || 'Unknown product',
    String(item.quantity),
    `R${item.price.toFixed(2)}`,
    `R${(item.price * item.quantity).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Product', 'Qty', 'Unit Price', 'Line Total']],
    body: tableRows,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: [30, 30, 30],
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [45, 90, 61],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    alternateRowStyles: {
      fillColor: [247, 250, 248],
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 28, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' },
    },
    tableLineColor: [220, 220, 220],
    tableLineWidth: 0.2,
  });

  y = doc.lastAutoTable.finalY + 4;

  // ── TOTALS ────────────────────────────────────────────────────────────────
  const totalsX    = pageW - margin - 70;
  const valueX     = pageW - margin;
  const rowH       = 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);

  doc.text('Subtotal', totalsX, y);
  doc.text(`R${subtotal.toFixed(2)}`, valueX, y, { align: 'right' });
  y += rowH;

  doc.text('Shipping', totalsX, y);
  if (shipping === 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 90, 61);
    doc.text('FREE', valueX, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
  } else {
    doc.text(`R${shipping.toFixed(2)}`, valueX, y, { align: 'right' });
  }
  y += rowH;

  // Divider above total
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(totalsX, y - 1, valueX, y - 1);
  y += 1;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text('Order Total', totalsX, y);
  doc.text(`R${total.toFixed(2)}`, valueX, y, { align: 'right' });
  y += 10;

  // ── NOTES (if any) ────────────────────────────────────────────────────────
  const notesText = (notes || '').trim();
  if (notesText) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(74, 124, 89);
    doc.text('NOTES / SPECIAL INSTRUCTIONS', margin, y);
    y += 1.5;
    doc.setDrawColor(74, 124, 89);
    doc.line(margin, y + 1, pageW - margin, y + 1);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    const noteLines = doc.splitTextToSize(notesText, pageW - margin * 2);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 5 + 6;
  }

  // ── FOOTER ────────────────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(247, 250, 248);
  doc.rect(0, pageH - 16, pageW, 16, 'F');
  doc.setDrawColor(200, 222, 206);
  doc.setLineWidth(0.4);
  doc.line(0, pageH - 16, pageW, pageH - 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 120, 100);
  doc.text(
    'Promise Organics  ·  sales@promiseorganics.co.za  ·  promiseorganics.co.za  ·  079 616 1262',
    pageW / 2,
    pageH - 8,
    { align: 'center' },
  );

  // ── SAVE ──────────────────────────────────────────────────────────────────
  doc.save(`dispatch-slip-${orderId.toLowerCase()}.pdf`);
}
