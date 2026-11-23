/* ===================================================================
   ANOXPASS — Markdown Block & Safe Sentence Segmenter for Read Aloud
   Normalizes PDF/Markdown first and preserves inline Markdown bounds
   so bold/italic/link tokens are NEVER split across sentences.
   =================================================================== */

import { normalizeEditorialMarkdown, slugifyHeading } from '../contentNormalizer';

export type CalloutKind = 'tip' | 'warning' | 'definition' | 'note' | 'takeaway';

export interface ParsedSentence {
  index: number;
  raw: string;
  cleanSpeech: string;
  indentLevel?: number;
}

export interface ParsedBlock {
  type: 'heading' | 'paragraph' | 'list' | 'blockquote' | 'callout' | 'code' | 'table' | 'divider';
  headingLevel?: number;
  headingId?: string;
  ordered?: boolean;
  calloutKind?: CalloutKind;
  raw: string;
  sentences: ParsedSentence[];
}

const CALLOUT_MARKER_MAP: Record<string, CalloutKind> = {
  '[!TIP]': 'tip',
  '[!WARNING]': 'warning',
  '[!CAUTION]': 'warning',
  '[!DEFINITION]': 'definition',
  '[!TAKEAWAY]': 'takeaway',
  '[!NOTE]': 'note',
  '[!IMPORTANT]': 'note',
};

/**
 * Split paragraph text on sentence boundaries ONLY when no **bold**, *italic*,
 * `code`, or [link](url) token is currently open — preventing broken literal `**`.
 */
export function splitParagraphSafely(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const results: string[] = [];
  let start = 0;
  let inBold = false;
  let inItalic = false;
  let inCode = false;
  let linkBracketDepth = 0;

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    const next = trimmed[i + 1];

    if (ch === '`') {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    if (ch === '*' && next === '*') {
      inBold = !inBold;
      i++;
      // If closing bold right after punctuation and followed by whitespace, allow sentence split
      if (!inBold && linkBracketDepth === 0 && !inItalic && /\s/.test(trimmed[i + 1] || '')) {
        const upToHere = trimmed.slice(start, i + 1);
        if (/[.!?]\*\*$/.test(upToHere)) {
          let j = i + 1;
          while (j < trimmed.length && /\s/.test(trimmed[j])) j++;
          const lookChar = trimmed[j];
          if (lookChar && /[A-Z0-9*#_`"'(]/.test(lookChar)) {
            const piece = upToHere.trim();
            if (piece) results.push(piece);
            start = j;
            i = j - 1;
          }
        }
      }
      continue;
    }
    if (ch === '*') {
      inItalic = !inItalic;
      continue;
    }
    if (ch === '[') {
      linkBracketDepth++;
      continue;
    }
    if (ch === ']' && linkBracketDepth > 0) {
      linkBracketDepth--;
      continue;
    }

    const isBalanced = !inBold && !inItalic && !inCode && linkBracketDepth === 0;
    if (isBalanced && (ch === '.' || ch === '!' || ch === '?') && /\s/.test(next || '')) {
      let j = i + 1;
      while (j < trimmed.length && /\s/.test(trimmed[j])) j++;
      const lookChar = trimmed[j];
      if (lookChar && /[A-Z0-9*#_`"'(]/.test(lookChar)) {
        const piece = trimmed.slice(start, i + 1).trim();
        if (piece) results.push(piece);
        start = j;
        i = j - 1;
      }
    }
  }

  const tail = trimmed.slice(start).trim();
  if (tail) results.push(tail);
  return results;
}

function toCleanSpeech(raw: string): string {
  return raw
    .replace(/^>\s+/, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function segmentDocumentForSpeech(markdown: string): {
  blocks: ParsedBlock[];
  allSentences: ParsedSentence[];
} {
  if (!markdown) return { blocks: [], allSentences: [] };

  const normalized = normalizeEditorialMarkdown(markdown);
  const lines = normalized.split('\n');
  const blocks: ParsedBlock[] = [];
  let currentBlockLines: string[] = [];
  let currentType: 'paragraph' | 'list' | 'blockquote' | 'code' | 'table' = 'paragraph';
  let currentOrdered = false;
  let inCodeBlock = false;
  let headingCounter = 0;

  const flushBlock = () => {
    if (currentBlockLines.length === 0) return;
    const rawText = currentBlockLines.join('\n');

    if (currentType === 'blockquote') {
      const firstLine = currentBlockLines[0].replace(/^>\s*/, '').trim().toUpperCase();
      const calloutKind = CALLOUT_MARKER_MAP[firstLine];
      if (calloutKind) {
        blocks.push({
          type: 'callout',
          calloutKind,
          raw: currentBlockLines.slice(1).join('\n'),
          sentences: [],
        });
        currentBlockLines = [];
        return;
      }
    }

    blocks.push({
      type: currentType,
      ordered: currentType === 'list' ? currentOrdered : undefined,
      raw: rawText,
      sentences: [],
    });
    currentBlockLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        currentBlockLines.push(line);
        flushBlock();
        inCodeBlock = false;
        currentType = 'paragraph';
      } else {
        flushBlock();
        inCodeBlock = true;
        currentType = 'code';
        currentBlockLines.push(line);
      }
      continue;
    }

    if (inCodeBlock) {
      currentBlockLines.push(line);
      continue;
    }

    if (!trimmed) {
      flushBlock();
      currentType = 'paragraph';
      continue;
    }

    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushBlock();
      blocks.push({ type: 'divider', raw: trimmed, sentences: [] });
      currentType = 'paragraph';
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushBlock();
      const level = headingMatch[1].length;
      const cleanTitle = headingMatch[2].replace(/[*_`]/g, '').trim();
      blocks.push({
        type: 'heading',
        headingLevel: level,
        headingId: level === 2 || level === 3 ? slugifyHeading(cleanTitle, headingCounter++) : undefined,
        raw: trimmed,
        sentences: [],
      });
      currentType = 'paragraph';
      continue;
    }

    if (trimmed.startsWith('>')) {
      if (currentType !== 'blockquote') {
        flushBlock();
        currentType = 'blockquote';
      }
      currentBlockLines.push(line);
      continue;
    }

    if (trimmed.startsWith('|') && trimmed.includes('|')) {
      if (currentType !== 'table') {
        flushBlock();
        currentType = 'table';
      }
      currentBlockLines.push(line);
      continue;
    }

    const isOrderedItem = /^\d+\.\s/.test(trimmed);
    const isBulletItem = /^[-*+]\s/.test(trimmed);
    if (isOrderedItem || isBulletItem) {
      if (currentType !== 'list' || currentOrdered !== isOrderedItem) {
        flushBlock();
        currentType = 'list';
        currentOrdered = isOrderedItem;
      }
      currentBlockLines.push(line);
      continue;
    }

    if (currentType !== 'paragraph') {
      flushBlock();
      currentType = 'paragraph';
    }
    currentBlockLines.push(line);
  }

  flushBlock();

  const allSentences: ParsedSentence[] = [];
  let globalIndex = 0;

  for (const block of blocks) {
    if (block.type === 'divider' || block.type === 'code' || block.type === 'table') {
      continue;
    }

    if (block.type === 'heading') {
      const rawText = block.raw.replace(/^#{1,6}\s+/, '').trim();
      const sentence: ParsedSentence = {
        index: globalIndex++,
        raw: rawText,
        cleanSpeech: `${toCleanSpeech(rawText)}.`,
      };
      block.sentences = [sentence];
      allSentences.push(sentence);
      continue;
    }

    if (block.type === 'list') {
      const listLines = block.raw.split('\n').filter((l) => l.trim().length > 0);
      for (const line of listLines) {
        const leadingSpaces = line.match(/^(\s*)/)?.[1].length || 0;
        const itemCleanRaw = line.trim().replace(/^[-*+]\s+|^\d+\.\s+/, '').trim();
        const sentence: ParsedSentence = {
          index: globalIndex++,
          raw: itemCleanRaw,
          cleanSpeech: `${toCleanSpeech(itemCleanRaw)}.`,
          indentLevel: leadingSpaces >= 2 ? 1 : 0,
        };
        block.sentences.push(sentence);
        allSentences.push(sentence);
      }
      continue;
    }

    const rawText =
      block.type === 'blockquote' || block.type === 'callout'
        ? block.raw
            .split('\n')
            .map((l) => l.replace(/^>\s*/, ''))
            .join(' ')
            .trim()
        : block.raw;

    const splitParts = splitParagraphSafely(rawText);
    for (const part of splitParts) {
      const sentence: ParsedSentence = {
        index: globalIndex++,
        raw: part,
        cleanSpeech: toCleanSpeech(part),
      };
      block.sentences.push(sentence);
      allSentences.push(sentence);
    }
  }

  return { blocks, allSentences };
}
