/* ===================================================================
   APILIGU LEARNING PASS — Multi-File Pairing & Mapper
   Joins separate Question files + Answer Key files with
   answer-source conflict detection (§7.5).
   =================================================================== */

import type { ParsedQuestion } from '../../types';

export interface AnswerKeyEntry {
  questionNumber: number | string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  rationale?: string;
}

/**
 * Merge an array of parsed questions with a separate array of answer keys.
 * Detects and flags any conflict where inline answer disagrees with the separate key.
 */
export function mergeQuestionsWithAnswerKey(
  questions: ParsedQuestion[],
  answerKeys: AnswerKeyEntry[]
): {
  mergedQuestions: ParsedQuestion[];
  conflictsCount: number;
  unmatchedCount: number;
} {
  const keyMap = new Map<string, AnswerKeyEntry>();
  answerKeys.forEach((k) => {
    keyMap.set(String(k.questionNumber).trim().toLowerCase(), k);
  });

  let conflicts = 0;
  let unmatched = 0;

  const merged = questions.map((q, idx) => {
    // Look up key by externalId, rowNumber, or index + 1
    const lookupKeys = [
      String(q.rowNumber),
      String(idx + 1),
      q.externalId.toLowerCase().replace(/[^\d]/g, ''),
    ];

    let foundKey: AnswerKeyEntry | undefined;
    for (const lk of lookupKeys) {
      if (keyMap.has(lk)) {
        foundKey = keyMap.get(lk);
        break;
      }
    }

    if (!foundKey) {
      unmatched++;
      return q;
    }

    const inlineAns = q.correctAnswer;
    const keyAns = foundKey.correctAnswer;
    const isConflict = inlineAns && keyAns && inlineAns !== keyAns;

    if (isConflict) {
      conflicts++;
    }

    const updatedSources = [...q.answerSources];
    updatedSources.push({
      source: 'answer_key',
      answer: keyAns,
      confidence: 0.9,
    });

    const isCorroborated = !isConflict && Boolean(inlineAns && keyAns && inlineAns === keyAns);

    return {
      ...q,
      correctAnswer: keyAns || inlineAns || 'A',
      rationale: foundKey.rationale || q.rationale,
      confidence: isCorroborated ? ('verified' as const) : ('unverified' as const),
      answerSources: updatedSources,
      validationErrors: isConflict
        ? [...q.validationErrors, `Answer conflict: inline was ${inlineAns}, separate key is ${keyAns}`]
        : q.validationErrors,
    };
  });

  return {
    mergedQuestions: merged,
    conflictsCount: conflicts,
    unmatchedCount: unmatched,
  };
}
