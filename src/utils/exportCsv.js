/**
 * Utility function to export data to a CSV file.
 * @param {Array} data - Array of records to export.
 * @param {Array} columns - Column configuration. Each column should have `header` (for the CSV header) and either `accessor` or a custom `csvCell` / `cell` formatter.
 * @param {string} filename - Output filename (defaults to 'export.csv').
 */
export const exportToCsv = (data, columns, filename = 'export.csv') => {
  if (!data || !data.length) {
    return;
  }

  // Filter columns to only export those with headers (ignore pure action/style columns without names)
  const exportableColumns = columns.filter(col => col.header && col.header !== 'Action');
  
  const headers = exportableColumns.map(col => col.header);

  // Generate rows
  const rows = data.map((row) => {
    return exportableColumns.map((col) => {
      let val = '';
      if (col.csvCell) {
        val = col.csvCell(row);
      } else if (col.accessor && row[col.accessor] !== undefined) {
        val = row[col.accessor];
      } else if (col.cell) {
        try {
          const rendered = col.cell(row);
          if (typeof rendered === 'string' || typeof rendered === 'number') {
            val = rendered;
          }
        } catch (e) {
          val = '';
        }
      }

      // Clean value: stringify, escape double quotes, wrap in quotes if contains comma, newline, or quotes
      const stringVal = val === null || val === undefined ? '' : String(val);
      const escapedVal = stringVal.replace(/"/g, '""');
      if (escapedVal.search(/("|,|\n)/g) >= 0) {
        return `"${escapedVal}"`;
      }
      return escapedVal;
    });
  });

  // Construct CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Utility function to download a file from an API blob response.
 * @param {Object} response - The Axios response object containing the blob data
 * @param {string} defaultFilename - The fallback filename if none is provided in headers
 */
export const downloadFileFromResponse = (response, defaultFilename = 'export.csv') => {
  let filename = defaultFilename;
  let blobData = response;

  if (response && response.headers) {
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length === 2) {
        filename = filenameMatch[1];
      }
    }
    blobData = response.data;
  }

  const blob = new Blob([blobData]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
