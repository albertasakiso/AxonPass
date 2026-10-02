/* ===================================================================
   APILIGU LEARNING PASS — Lesson Progress Store (Zustand)
   Tracks completed subtopics, relearn queues, and chapter completions
   with instant local storage persistence and reactivity.
   =================================================================== */

import { create } from 'zustand';

interface LessonProgressState {
  completedSubtopicIds: Set<string>;
  relearnSubtopicIds: Set<string>;
  completedChapterNumbers: Set<number>;

  // Actions
  toggleSubtopicComplete: (subtopicId: string) => boolean;
  toggleSubtopicRelearn: (subtopicId: string) => boolean;
  toggleChapterComplete: (chapterNumber: number) => boolean;
  isSubtopicCompleted: (subtopicId: string) => boolean;
  isSubtopicRelearn: (subtopicId: string) => boolean;
  isChapterCompleted: (chapterNumber: number) => boolean;
  getDomainCompletionStats: (domainSubtopicIds: string[]) => { completed: number; total: number; percent: number };
}

const STORAGE_KEY_COMPLETED = 'alp_completed_subtopics';
const STORAGE_KEY_RELEARN = 'alp_relearn_subtopics';
const STORAGE_KEY_CHAPTERS = 'alp_completed_chapters';

const loadSetFromStorage = (key: string): Set<any> => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(arr);
  } catch {
    return new Set();
  }
};

const saveSetToStorage = (key: string, set: Set<any>) => {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.warn('Storage save error:', err);
  }
};

export const useLessonProgressStore = create<LessonProgressState>((set, get) => ({
  completedSubtopicIds: loadSetFromStorage(STORAGE_KEY_COMPLETED),
  relearnSubtopicIds: loadSetFromStorage(STORAGE_KEY_RELEARN),
  completedChapterNumbers: loadSetFromStorage(STORAGE_KEY_CHAPTERS),

  toggleSubtopicComplete: (subtopicId: string) => {
    const currentCompleted = new Set(get().completedSubtopicIds);
    const currentRelearn = new Set(get().relearnSubtopicIds);

    let isNowCompleted = false;
    if (currentCompleted.has(subtopicId)) {
      currentCompleted.delete(subtopicId);
      isNowCompleted = false;
    } else {
      currentCompleted.add(subtopicId);
      // Remove from relearn if completed
      currentRelearn.delete(subtopicId);
      isNowCompleted = true;
    }

    saveSetToStorage(STORAGE_KEY_COMPLETED, currentCompleted);
    saveSetToStorage(STORAGE_KEY_RELEARN, currentRelearn);

    set({
      completedSubtopicIds: currentCompleted,
      relearnSubtopicIds: currentRelearn,
    });

    return isNowCompleted;
  },

  toggleSubtopicRelearn: (subtopicId: string) => {
    const currentRelearn = new Set(get().relearnSubtopicIds);
    const currentCompleted = new Set(get().completedSubtopicIds);

    let isNowRelearn = false;
    if (currentRelearn.has(subtopicId)) {
      currentRelearn.delete(subtopicId);
      isNowRelearn = false;
    } else {
      currentRelearn.add(subtopicId);
      // Remove from completed if needs relearn
      currentCompleted.delete(subtopicId);
      isNowRelearn = true;
    }

    saveSetToStorage(STORAGE_KEY_RELEARN, currentRelearn);
    saveSetToStorage(STORAGE_KEY_COMPLETED, currentCompleted);

    set({
      relearnSubtopicIds: currentRelearn,
      completedSubtopicIds: currentCompleted,
    });

    return isNowRelearn;
  },

  toggleChapterComplete: (chapterNumber: number) => {
    const current = new Set(get().completedChapterNumbers);
    let isNowComplete = false;
    if (current.has(chapterNumber)) {
      current.delete(chapterNumber);
      isNowComplete = false;
    } else {
      current.add(chapterNumber);
      isNowComplete = true;
    }

    saveSetToStorage(STORAGE_KEY_CHAPTERS, current);
    set({ completedChapterNumbers: current });
    return isNowComplete;
  },

  isSubtopicCompleted: (subtopicId: string) => {
    return get().completedSubtopicIds.has(subtopicId);
  },

  isSubtopicRelearn: (subtopicId: string) => {
    return get().relearnSubtopicIds.has(subtopicId);
  },

  isChapterCompleted: (chapterNumber: number) => {
    return get().completedChapterNumbers.has(chapterNumber);
  },

  getDomainCompletionStats: (domainSubtopicIds: string[]) => {
    if (!domainSubtopicIds || domainSubtopicIds.length === 0) {
      return { completed: 0, total: 0, percent: 0 };
    }
    const completedSet = get().completedSubtopicIds;
    let completedCount = 0;
    domainSubtopicIds.forEach((id) => {
      if (completedSet.has(id)) completedCount++;
    });
    const percent = Math.round((completedCount / domainSubtopicIds.length) * 100);
    return { completed: completedCount, total: domainSubtopicIds.length, percent };
  },
}));
