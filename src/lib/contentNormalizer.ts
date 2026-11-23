/* ===================================================================
   AXONPASS — Editorial Content Normalizer & Structure Extractor
   Cleans PDF artifacts, raw bullet glyphs, ligatures, watermarks,
   unbalanced Markdown, and extracts callouts + anchor headings.
   =================================================================== */

export interface SectionHeading {
  id: string;
  level: number;
  text: string;
}

const WATERMARK_LINE_PATTERNS: RegExp[] = [
  /^https?:\/\/(?:www\.)?diontraining\.com\/?$/i,
  /^©\s*\d{4}\s*COPYRIGHT\s+FIFA.*ALL\s+RIGHTS\s+RESERVED\.?$/i,
  /^CompTIA\s+Security\+\s*\(Study\s+Notes\)\s*$/i,
  /^Page\s+\d+(?:\s+of\s+\d+)?\s*$/i,
];

const CALLOUT_PREFIXES: Array<{ tag: string; regex: RegExp }> = [
  { tag: '[!TIP]', regex: /^(?:\*\*)?(?:Exam\s+Tip|Exam\s+Watch(?:\s+Alert)?|Pro\s+Tip)(?:\*\*)?:\s*(.+)$/i },
  { tag: '[!WARNING]', regex: /^(?:\*\*)?(?:Warning|Caution|Common\s+Pitfall|Exam\s+Trap)(?:\*\*)?:\s*(.+)$/i },
  { tag: '[!DEFINITION]', regex: /^(?:\*\*)?(?:Definition|Key\s+Term)(?:\*\*)?:\s*(.+)$/i },
  { tag: '[!TAKEAWAY]', regex: /^(?:\*\*)?(?:Key\s+Takeaway|Summary|Remember)(?:\*\*)?:\s*(.+)$/i },
  { tag: '[!NOTE]', regex: /^(?:\*\*)?(?:Note|Important)(?:\*\*)?:\s*(.+)$/i },
];

export function cleanEditorialTitle(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\uFB00/g, 'ff')
    .replace(/\uFB01/g, 'fi')
    .replace(/\uFB02/g, 'fl')
    .replace(/\uFB03/g, 'ffi')
    .replace(/\uFB04/g, 'ffl')
    .replace(/\u00A0/g, ' ')
    .replace(/^Also Good For CC exam\s+/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function slugifyHeading(text: string, index: number): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 48);
  return `sec-${slug || 'heading'}-${index}`;
}

export function repairUnbalancedBold(line: string): string {
  const matches = line.match(/\*\*/g);
  if (!matches || matches.length % 2 === 0) return line;
  // Unbalanced "**" — strip trailing/leading orphan "**" cleanly
  const firstIdx = line.indexOf('**');
  const lastIdx = line.lastIndexOf('**');
  if (firstIdx === 0 && lastIdx === 0) {
    return `${line}**`;
  }
  return line.slice(0, lastIdx) + line.slice(lastIdx + 2);
}

function formatBareUrls(line: string): string {
  // Replace bare URLs not already preceded by ]( or " or <
  return line.replace(/(^|[\s(])(https?:\/\/[^\s)<>]+)/g, (_m, lead: string, url: string) => {
    const cleanUrl = url.replace(/[.,;!?]+$/, '');
    const trailing = url.slice(cleanUrl.length);
    try {
      const host = new URL(cleanUrl).hostname.replace(/^www\./, '');
      return `${lead}[${host}](${cleanUrl})${trailing}`;
    } catch {
      return `${lead}[link](${cleanUrl})${trailing}`;
    }
  });
}

function isPlainProseLine(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  if (
    t.startsWith('#') ||
    t.startsWith('>') ||
    t.startsWith('|') ||
    t.startsWith('```') ||
    t === '---' ||
    t === '***' ||
    t === '___' ||
    /^[-*+]\s+/.test(t) ||
    /^\d+\.\s+/.test(t)
  ) {
    return false;
  }
  return true;
}

export function normalizeEditorialMarkdown(raw: string): string {
  if (!raw) return '';

  // 1. Replace Unicode PDF ligatures & non-breaking spaces
  const preCleaned = raw
    .replace(/\uFB00/g, 'ff')
    .replace(/\uFB01/g, 'fi')
    .replace(/\uFB02/g, 'fl')
    .replace(/\uFB03/g, 'ffi')
    .replace(/\uFB04/g, 'ffl')
    .replace(/\u00A0/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  const rawLines = preCleaned.split('\n');
  const normalizedLines: string[] = [];
  let inCodeFence = false;

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeFence = !inCodeFence;
      normalizedLines.push(line);
      continue;
    }

    if (inCodeFence) {
      normalizedLines.push(line);
      continue;
    }

    // 2. Strip repeated PDF watermarks & stray page lines
    if (WATERMARK_LINE_PATTERNS.some((p) => p.test(trimmed))) {
      continue;
    }

    // 3. Convert PDF bullet glyphs (●, ○, ▪, ■, •, ‣) & sub-bullet `o `
    line = line
      .replace(/^\s*[●▪■•‣]+\s*/, '- ')
      .replace(/^\s*[○◦]+\s*/, '  - ')
      .replace(/^\s*o\s+(?=[A-Z0-9])/u, '  - ')
      .replace(/\s*[●▪■‣]+\s*/g, '\n- ');

    // Split inline Dion-style ` o Subtopic` inside prose/list lines into indented sub-bullets
    line = line.replace(/(?<=[a-z0-9.)\]])\s+o\s+(?=[A-Z][a-zA-Z0-9(])/g, '\n  - ');

    const subLines = line.split('\n');
    for (let sub of subLines) {
      const subTrim = sub.trim();
      if (!subTrim) {
        normalizedLines.push('');
        continue;
      }

      // 4. Repair unbalanced bold markers and bare URLs
      if (!subTrim.startsWith('|')) {
        sub = repairUnbalancedBold(sub);
        sub = formatBareUrls(sub);
      }

      // 5. Join accidental hard line-wraps inside prose/list continuation
      const prevIdx = normalizedLines.length - 1;
      if (
        prevIdx >= 0 &&
        normalizedLines[prevIdx] !== '' &&
        isPlainProseLine(sub) &&
        (/^[a-z(]/.test(sub.trim())) &&
        (isPlainProseLine(normalizedLines[prevIdx]) || /^\s*[-*+]\s+/.test(normalizedLines[prevIdx])) &&
        !/[.!?:;]$/.test(normalizedLines[prevIdx].trim())
      ) {
        normalizedLines[prevIdx] = `${normalizedLines[prevIdx].trimEnd()} ${sub.trim()}`;
        continue;
      }

      // 6. Promote semantic prefix lines (`Exam Tip:`, `Warning:`, `Definition:`, etc.) to callouts
      if (isPlainProseLine(sub) && (prevIdx < 0 || normalizedLines[prevIdx] === '')) {
        let matchedCallout = false;
        for (const cp of CALLOUT_PREFIXES) {
          const m = sub.trim().match(cp.regex);
          if (m && m[1]) {
            normalizedLines.push(`> ${cp.tag}`);
            normalizedLines.push(`> ${m[1].trim()}`);
            matchedCallout = true;
            break;
          }
        }
        if (matchedCallout) continue;
      }

      normalizedLines.push(sub);
    }
  }

  // Collapse 3+ consecutive blank lines down to 2
  return normalizedLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function extractSectionHeadings(markdown: string): SectionHeading[] {
  const clean = normalizeEditorialMarkdown(markdown);
  if (!clean) return [];
  const headings: SectionHeading[] = [];
  const lines = clean.split('\n');
  let inCode = false;
  let count = 0;

  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = t.match(/^(#{2,3})\s+(.+)$/);
    if (m) {
      const text = m[2].replace(/[*_`]/g, '').trim();
      headings.push({
        id: slugifyHeading(text, count++),
        level: m[1].length,
        text,
      });
    }
  }
  return headings;
}
