export const exportToCsv = (filename: string, rows: any[]) => {
  if (!rows || !rows.length) return;

  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            
            if (Array.isArray(cell)) {
              cell = cell.join('|');
            } else if (typeof cell === 'string') {
              cell = cell.replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const parseCsv = (csvText: string): any[] => {
  if (!csvText) return [];
  
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Handle quotes in CSV
    const values = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"' && line[j+1] === '"') {
        currentValue += '"';
        j++; // skip next quote
      } else if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue);

    if (values.length !== headers.length) continue;

    const obj: any = {};
    headers.forEach((header, index) => {
      let val: any = values[index];
      
      // Parse basic types
      if (val === '') val = null;
      else if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (typeof val === 'string' && val.includes('|')) {
        val = val.split('|').map(v => v.trim()).filter(Boolean);
      }
      
      obj[header] = val;
    });
    
    result.push(obj);
  }
  
  return result;
};
