/* ===================================================================
   ANOXPASS — Study Notes Markdown Export & Printable Transcript
   100% Client-Side, Open-Source, Zero External Services.
   =================================================================== */

import type { ReadingProgressRecord } from '../stores/readingProgressStore';
import type { BookMasteryNote } from '../stores/academyProgressStore';

export function exportStudyNotesMarkdown(params: {
  certSlug: string;
  readingRecords: Record<string, ReadingProgressRecord>;
  bookNotes: BookMasteryNote[];
}): void {
  const { certSlug, readingRecords, bookNotes } = params;
  const lines: string[] = [
    `# AnoxPass Personal Study Notes & Highlights (${certSlug.toUpperCase()})`,
    `Exported: ${new Date().toLocaleString()}`,
    '',
    '---',
    '',
    '## Full Textbook Highlights & Notes',
    '',
  ];

  const matching = Object.values(readingRecords).filter(
    (r) =>
      r.certificationSlug === certSlug &&
      (r.highlights.length > 0 || (r.notesMarkdown && r.notesMarkdown.trim().length > 0))
  );

  if (matching.length === 0) {
    lines.push('_No textbook highlights or personal notes recorded for this track yet._', '');
  } else {
    matching.forEach((rec, idx) => {
      lines.push(`### Section #${idx + 1} (${rec.status})`);
      rec.highlights.forEach((hl) => {
        lines.push(`- **Highlight:** "${hl.text}"`);
      });
      if (rec.notesMarkdown.trim()) {
        lines.push('', '**Personal Notes:**', '', rec.notesMarkdown.trim(), '');
      }
      lines.push('');
    });
  }

  if (bookNotes.length > 0) {
    lines.push('---', '', '## Leadership & Book Mastery Notes', '');
    bookNotes.forEach((bn) => {
      lines.push(`- **[${bn.bookId} · ${bn.noteType}]** ${bn.content}`);
    });
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `anoxpass_${certSlug}_study_notes.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function openPrintableReadinessTranscript(params: {
  learnerName: string;
  certName: string;
  compositeScore: number;
  tierLabel: string;
  predictedScaledScore: number;
  overallAccuracy: number;
  totalAttempted: number;
  completedBookSections: number;
  totalBookSections: number;
}): void {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return;
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  w.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>AnoxPass Readiness Transcript — ${params.certName}</title>
  <style>
    body { font-family: Georgia, serif; padding: 48px; color: #0f172a; background: #fff; }
    .cert-frame { border: 6px double #1e3a8a; padding: 40px; max-width: 760px; margin: 0 auto; }
    h1 { color: #1e3a8a; margin-bottom: 6px; font-size: 28px; }
    .sub { color: #475569; font-size: 14px; margin-bottom: 28px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0; }
    .box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; background: #f8fafc; }
    .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
    .val { font-size: 22px; font-weight: bold; color: #0f172a; margin-top: 4px; }
    .footer { margin-top: 32px; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <div class="cert-frame">
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#1e3a8a;font-weight:bold;">AnoxPass Neural Mastery Transcript</div>
    <h1>${params.learnerName}</h1>
    <div class="sub">Official Readiness &amp; Curriculum Verification for <strong>${params.certName}</strong></div>
    <div class="grid">
      <div class="box"><div class="label">Composite Readiness Index</div><div class="val">${params.compositeScore}% (${params.tierLabel})</div></div>
      <div class="box"><div class="label">Predicted IRT Scaled Score</div><div class="val">${params.predictedScaledScore}</div></div>
      <div class="box"><div class="label">Verified Question Bank Accuracy</div><div class="val">${params.overallAccuracy}% (${params.totalAttempted} Qs)</div></div>
      <div class="box"><div class="label">Unabridged Book Mastery</div><div class="val">${params.completedBookSections} / ${params.totalBookSections} Sections</div></div>
    </div>
    <div class="footer">
      <span>Issued on ${dateStr}</span>
      <span>Verified via AnoxPass Client-Side Telemetry</span>
    </div>
    <p style="margin-top:24px;"><button onclick="window.print()">🖨️ Print / Save as PDF</button></p>
  </div>
</body>
</html>`);
  w.document.close();
}
