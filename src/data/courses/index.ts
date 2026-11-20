/* ===================================================================
   ANOXPASS — End-to-End Certification Courses Registry
   Covers all 15 Certification Paths + Enterprise GRC Deep Dive (16 courses)
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

import { ISC2_CC_COURSE } from './isc2CcCourse';
import { COMPTIA_A_PLUS_COURSE } from './comptiaAPlusCourse';
import { COMPTIA_NET_PLUS_COURSE } from './comptiaNetPlusCourse';
import { COMPTIA_SEC_PLUS_COURSE } from './comptiaSecPlusCourse';
import { AWS_SAA_COURSE } from './awsSaaCourse';
import { NIST_CSF_COURSE } from './nistCsfCourse';
import { GRC_COURSE } from './grcCourse';
import { CYSA_COURSE } from './cysaCourse';
import { CISA_COURSE } from './cisaCourse';
import { CRISC_COURSE } from './criscCourse';
import { FIFA_AGENT_COURSE } from './fifaAgentCourse';
import { CCSP_COURSE } from './ccspCourse';
import { CISSP_COURSE } from './cisspCourse';
import { CISM_COURSE } from './cismCourse';
import { CGEIT_COURSE } from './cgeitCourse';
import { GSLC_COURSE } from './gslcCourse';

export {
  ISC2_CC_COURSE,
  COMPTIA_A_PLUS_COURSE,
  COMPTIA_NET_PLUS_COURSE,
  COMPTIA_SEC_PLUS_COURSE,
  AWS_SAA_COURSE,
  NIST_CSF_COURSE,
  GRC_COURSE,
  CYSA_COURSE,
  CISA_COURSE,
  CRISC_COURSE,
  FIFA_AGENT_COURSE,
  CCSP_COURSE,
  CISSP_COURSE,
  CISM_COURSE,
  CGEIT_COURSE,
  GSLC_COURSE,
};

export const CERTIFICATION_COURSES: CertificationCourse[] = [
  ISC2_CC_COURSE,
  COMPTIA_A_PLUS_COURSE,
  COMPTIA_NET_PLUS_COURSE,
  COMPTIA_SEC_PLUS_COURSE,
  AWS_SAA_COURSE,
  NIST_CSF_COURSE,
  GRC_COURSE,
  CYSA_COURSE,
  CISA_COURSE,
  CRISC_COURSE,
  FIFA_AGENT_COURSE,
  CCSP_COURSE,
  CISSP_COURSE,
  CISM_COURSE,
  CGEIT_COURSE,
  GSLC_COURSE,
];

export const COURSES_BY_CERT_ID: Record<string, CertificationCourse> = Object.fromEntries(
  CERTIFICATION_COURSES.map((course) => [course.certId, course]),
);

export function getCourseByCertId(certId: string): CertificationCourse | undefined {
  return (
    COURSES_BY_CERT_ID[certId] ??
    CERTIFICATION_COURSES.find(
      (c) =>
        c.certId.toLowerCase() === certId.toLowerCase() ||
        c.certCode.toLowerCase() === certId.toLowerCase(),
    )
  );
}
