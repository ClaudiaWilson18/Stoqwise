import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Export product data as a CSV file.
export function exportCSV(rows, filename = 'products.csv') {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('No data available to export.');
  }

  const headers = Object.keys(rows[0]);

  const escapeCSV = (value) => {
    const text = value === null || value === undefined ? '' : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) =>
      headers.map((header) => escapeCSV(row[header])).join(',')
    ),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Export product data as a PDF file.
export function exportPDF(title, columns, rows) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(title, 14, 18);

  autoTable(doc, {
    startY: 26,
    head: [columns],
    body: rows,
  });

  const filename = title.toLowerCase().replace(/\s+/g, '-') + '.pdf';
  doc.save(filename);
}