/* ===================================================================
   ANOXPASS — Markdown Block & Sentence Segmenter for Read Aloud
   =================================================================== */

export interface ParsedSentence {
  index: number;
  raw: string;
  cleanSpeech: string;
}

export interface ParsedBlock {
  type: 'heading' | 'paragraph' | 'list' | 'blockquote' | 'code' | 'table' | 'divider';
  headingLevel?: number;
  raw: string;
  sentences: ParsedSentence[];
}

export function segmentDocumentForSpeech(markdown: string): {
  blocks: ParsedBlock[];
  allSentences: ParsedSentence[];
} {
  if (!markdown) return { blocks: [], allSentences: [] };

  const lines = markdown.split(/\r?\n/);
  const blocks: ParsedBlock[] = [];
  let currentBlockLines: string[] = [];
  let currentType: 'paragraph' | 'list' | 'blockquote' | 'code' | 'table' = 'paragraph';
  let inCodeBlock = false;

  const flushBlock = () => {
    if (currentBlockLines.length === 0) return;
    const rawText = currentBlockLines.join('\n');
    blocks.push({ type: currentType, raw: rawText, sentences: [] });
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
        continue;
      } else {
        flushBlock();
        inCodeBlock = true;
        currentType = 'code';
        currentBlockLines.push(line);
        continue;
      }
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
      blocks.push({
        type: 'heading',
        headingLevel: headingMatch[1].length,
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

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('+ ') || /^\d+\.\s/.test(trimmed)) {
      if (currentType !== 'list') {
        flushBlock();
        currentType = 'list';
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
      const headingClean = block.raw.replace(/^#{1,6}\s+/, '').trim();
      const sentence: ParsedSentence = {
        index: globalIndex++,
        raw: block.raw.replace(/^#{1,6}\s+/, ''),
        cleanSpeech: headingClean + '.',
      };
      block.sentences = [sentence];
      allSentences.push(sentence);
      continue;
    }

    if (block.type === 'list') {
      const listLines = block.raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
      for (const line of listLines) {
        const itemClean = line.replace(/^[-*+]\s+|\d+\.\s+/, '').trim();
        const sentence: ParsedSentence = {
          index: globalIndex++,
          raw: line,
          cleanSpeech: itemClean.replace(/[*_`]/g, '') + '.',
        };
        block.sentences.push(sentence);
        allSentences.push(sentence);
      }
      continue;
    }

    const regex = /(?<=[.!?])\s+(?=[A-Z0-9*#_`"'(])/g;
    const splitParts = block.raw.split(regex).map((s) => s.trim()).filter(Boolean);

    for (const part of splitParts) {
      const clean = part
        .replace(/^>\s+/, '')
        .replace(/[*_`#]/g, '')
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
        .trim();

      const sentence: ParsedSentence = {
        index: globalIndex++,
        raw: part,
        cleanSpeech: clean,
      };
      block.sentences.push(sentence);
      allSentences.push(sentence);
    }
  }

  return { blocks, allSentences };
}
