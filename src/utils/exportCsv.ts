/**
 * Client-side CSV Exporter Utility
 */
export function exportToCsv(filename: string, rows: Record<string, any>[], columnHeaders?: { key: string; label: string }[]) {
  if (!rows || rows.length === 0) return;

  const headers = columnHeaders || Object.keys(rows[0]).map(k => ({ key: k, label: k }));

  const csvRows = [];
  // Header row
  csvRows.push(headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(','));

  // Data rows
  for (const row of rows) {
    const values = headers.map(h => {
      const val = row[h.key] !== undefined && row[h.key] !== null ? String(row[h.key]) : '';
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
