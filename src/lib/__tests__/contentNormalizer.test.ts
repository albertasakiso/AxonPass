import { describe, it, expect } from 'vitest';
import {
  cleanEditorialTitle,
  extractSectionHeadings,
  normalizeEditorialMarkdown,
  repairUnbalancedBold,
} from '../contentNormalizer';
import { segmentDocumentForSpeech, splitParagraphSafely } from '../audio/speechSegmenter';

describe('contentNormalizer & speechSegmenter editorial pipeline', () => {
  it('cleans PDF ligatures, repeated Dion/FIFA watermarks, and noisy titles', () => {
    expect(cleanEditorialTitle('Also Good For CC exam     CompTIA Security+ — Pages 37–54')).toBe(
      'CompTIA Security+ — Pages 37–54'
    );

    const raw = [
      '● Automated tools manage conﬁguration inﬂuence cleanly.',
      'https://www.DionTraining.com',
      '© 2024 COPYRIGHT FIFA AND THE OPEN UNIVERSITY PARTNERSHIP. ALL RIGHTS RESERVED.',
      'CompTIA Security+ (Study Notes)',
    ].join('\n');

    const cleaned = normalizeEditorialMarkdown(raw);
    expect(cleaned).toContain('- Automated tools manage configuration influence cleanly.');
    expect(cleaned).not.toContain('DionTraining.com');
    expect(cleaned).not.toContain('COPYRIGHT FIFA');
    expect(cleaned).not.toContain('CompTIA Security+ (Study Notes)');
  });

  it('converts raw inline PDF `o ` sub-bullets into nested markdown bullets', () => {
    const raw =
      '- Provides backend software needed for your service o Platform as a Service (PaaS)\n- Standard infrastructure o Security as a Service (SECaaS)';
    const cleaned = normalizeEditorialMarkdown(raw);
    expect(cleaned).toContain('\n  - Platform as a Service (PaaS)');
    expect(cleaned).toContain('\n  - Security as a Service (SECaaS)');

    const { blocks } = segmentDocumentForSpeech(raw);
    const listBlock = blocks.find((b) => b.type === 'list');
    expect(listBlock?.ordered).toBe(false);
    expect(listBlock?.sentences.some((s) => s.indentLevel === 1)).toBe(true);
    expect(listBlock?.sentences[0]?.raw.startsWith('- ')).toBe(false);
  });

  it('preserves ordered list semantics separately from bulleted lists', () => {
    const md = '1. First step\n2. Second step\n\n- Bullet alpha\n- Bullet beta';
    const { blocks } = segmentDocumentForSpeech(md);
    const lists = blocks.filter((b) => b.type === 'list');
    expect(lists).toHaveLength(2);
    expect(lists[0].ordered).toBe(true);
    expect(lists[1].ordered).toBe(false);
  });

  it('never slices inside an open **bold** span during sentence segmentation', () => {
    const text = '**1.1.2 Audit Charter. This is bold across a period.** Next regular sentence.';
    const parts = splitParagraphSafely(text);
    expect(parts).toEqual([
      '**1.1.2 Audit Charter. This is bold across a period.**',
      'Next regular sentence.',
    ]);
    expect(repairUnbalancedBold('**Dangling bold start')).toBe('**Dangling bold start**');
  });

  it('promotes semantic callout lines and extracts H2/H3 outline headings', () => {
    const md = [
      '## Domain Overview',
      'Exam Tip: Always isolate compromised hosts before imaging memory.',
      '### Containment Steps',
      'First contain the endpoint.',
    ].join('\n\n');

    const { blocks } = segmentDocumentForSpeech(md);
    expect(blocks.some((b) => b.type === 'callout' && b.calloutKind === 'tip')).toBe(true);

    const headings = extractSectionHeadings(md);
    expect(headings).toHaveLength(2);
    expect(headings[0].level).toBe(2);
    expect(headings[1].level).toBe(3);
  });
});
