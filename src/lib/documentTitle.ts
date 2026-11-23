/* ===================================================================
   ANOXPASS — Filename & Study Material Title Beautifier
   =================================================================== */

export function formatCleanDocumentTitle(fileName: string): string {
  if (!fileName) return 'Study Material';
  let clean = fileName;

  let partSuffix = '';
  const partMatch = clean.match(/\.part_(\d+)$/i);
  if (partMatch) {
    partSuffix = ` — Part ${partMatch[1]}`;
    clean = clean.replace(/\.part_\d+$/i, '');
  }

  clean = clean.replace(/\.(pdf|epub|docx|txt|doc|md)$/i, '');
  clean = clean.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[_-]?/i, '');
  clean = clean.replace(/^\d{10,}[_-]?/, '');
  clean = clean.replace(/[_-]+/g, ' ').trim();

  const acronyms = [
    'CISA', 'CISSP', 'ISC2', 'CC', 'AWS', 'SAA', 'C03', 'NIST', 'CRISC',
    'CISM', 'GRC', 'FIFA', 'SOC', 'ITAF', 'ISO', 'IEC', 'CSF', 'RMF',
    'PMP', 'BIA', 'BCP', 'DRP', 'CIA', 'IAM', 'RBAC', 'AI', 'COBIT',
    'IRP', 'DR', 'BC', 'CBK', 'DLP', 'CYSA', 'CCSP', 'CGEIT',
  ];

  const words = clean.split(' ').map((w) => {
    const upper = w.toUpperCase();
    if (acronyms.includes(upper)) return upper;
    if (w.length <= 3 && !['and', 'for', 'the', 'of', 'in', 'to', 'on', 'at', 'by', 'vs', 'with'].includes(w.toLowerCase())) {
      return upper;
    }
    return w.charAt(0).toUpperCase() + w.slice(1);
  });

  return words.join(' ') + partSuffix;
}
