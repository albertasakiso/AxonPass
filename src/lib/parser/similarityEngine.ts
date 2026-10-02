/* ===================================================================
   APILIGU LEARNING PASS — Similarity & Duplicate Clustering Engine
   N-gram token Jaccard and Levenshtein similarity clustering
   for question deduplication (§7.5).
   =================================================================== */

import type { ParsedQuestion, DuplicateCluster } from '../../types';

/**
 * Tokenize string into lowercase alphanumeric words.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Create character n-grams from a word array or text.
 */
function getWordBigrams(words: string[]): Set<string> {
  const bigrams = new Set<string>();
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.add(`${words[i]}_${words[i + 1]}`);
  }
  return bigrams;
}

/**
 * Calculate Jaccard similarity between two token sets.
 * Returns a value from 0.0 (completely distinct) to 1.0 (identical).
 */
export function calculateJaccardSimilarity(textA: string, textB: string): number {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  const tokenScore = intersection.size / union.size;

  // Also calculate bigram overlap for phrase ordering
  const bigramsA = getWordBigrams(tokensA);
  const bigramsB = getWordBigrams(tokensB);

  let bigramScore = 0;
  if (bigramsA.size > 0 && bigramsB.size > 0) {
    const bgIntersection = new Set([...bigramsA].filter((x) => bigramsB.has(x)));
    const bgUnion = new Set([...bigramsA, ...bigramsB]);
    bigramScore = bgIntersection.size / bgUnion.size;
  }

  return tokenScore * 0.6 + bigramScore * 0.4;
}

/**
 * Cluster questions with similarity score >= threshold (default 0.72).
 */
export function clusterDuplicateQuestions(
  questions: ParsedQuestion[],
  similarityThreshold = 0.72
): DuplicateCluster[] {
  const clusters: DuplicateCluster[] = [];
  const assigned = new Set<number>();

  for (let i = 0; i < questions.length; i++) {
    if (assigned.has(i)) continue;

    const currentQ = questions[i];
    const matchingIndices: number[] = [i];

    for (let j = i + 1; j < questions.length; j++) {
      if (assigned.has(j)) continue;

      const otherQ = questions[j];
      const sim = calculateJaccardSimilarity(currentQ.stem, otherQ.stem);

      if (sim >= similarityThreshold) {
        matchingIndices.push(j);
        assigned.add(j);
      }
    }

    if (matchingIndices.length > 1) {
      matchingIndices.forEach((idx) => assigned.add(idx));
      clusters.push({
        id: `cluster-${i + 1}`,
        questions: matchingIndices.map((idx) => questions[idx]),
        similarityScore: calculateJaccardSimilarity(currentQ.stem, questions[matchingIndices[1]].stem),
        resolution: 'pending',
      });
    }
  }

  return clusters;
}
