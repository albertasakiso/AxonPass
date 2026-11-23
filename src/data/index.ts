/* ===================================================================
   ANOXPASS — Data Barrel Exports
   =================================================================== */

export { CERT_VERSION_DELTAS } from './certVersionDeltas';
export type { DeltaFeature, DomainWeightComparison, CertDeltaMatrix } from './certVersionDeltas';

export { CERTIFICATION_PATHS, PATHS_BY_TIER } from './certificationPaths';
export { PUBLIC_SPEAKING_CURRICULUM } from './publicSpeakingCurriculum';
export { READING_MASTERY_CURRICULUM } from './readingMasteryCurriculum';
export { LEADERSHIP_CURRICULUM } from './leadershipCurriculum';
export { LEADERSHIP_BOOKS } from './leadershipBooks';
export {
  COURSE_CATALOG,
  loadCourseByCertId,
  type CourseCatalogItem,
} from './courses';

import { PUBLIC_SPEAKING_CURRICULUM } from './publicSpeakingCurriculum';
import { READING_MASTERY_CURRICULUM } from './readingMasteryCurriculum';
import { LEADERSHIP_CURRICULUM } from './leadershipCurriculum';
import type { AcademyTrack } from '../types/academy';

export const ACADEMY_TRACKS: AcademyTrack[] = [
  PUBLIC_SPEAKING_CURRICULUM,
  READING_MASTERY_CURRICULUM,
  LEADERSHIP_CURRICULUM,
];
