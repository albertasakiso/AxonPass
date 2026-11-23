/* ===================================================================
   ANOXPASS — Lightweight Course Catalog Metadata & Dynamic Course Loader
   Avoids eagerly bundling 1.41 MB of all 16 course files into the initial
   app chunk; loads only the active certification's course on demand.
   =================================================================== */

import type { DifficultyTier } from '../../types/academy';
import type { CertificationCourse } from '../../types/course';
import { toCourseCertId } from '../../lib/textbookService';

export interface CourseCatalogItem {
  certId: string;
  certCode: string;
  title: string;
  provider: string;
  tier: DifficultyTier;
  tagline: string;
  estimatedTotalHours: number;
  domainCount: number;
  lessonCount: number;
}

export const COURSE_CATALOG: CourseCatalogItem[] = [
  {
    certId: 'isc2-cc',
    certCode: 'CC',
    title: 'ISC2 Certified in Cybersecurity (CC)',
    provider: 'ISC2',
    tier: 1,
    tagline: 'Zero-to-exam-ready mastery across all 5 ISC2 CC domains.',
    estimatedTotalHours: 35,
    domainCount: 5,
    lessonCount: 6,
  },
  {
    certId: 'comptia-a-plus',
    certCode: 'A+',
    title: 'CompTIA A+ (Core 1 220-1101 & Core 2 220-1102)',
    provider: 'CompTIA',
    tier: 1,
    tagline: 'Hands-on mastery of hardware, networking, virtualization, OS troubleshooting, and endpoint security.',
    estimatedTotalHours: 55,
    domainCount: 9,
    lessonCount: 3,
  },
  {
    certId: 'comptia-network-plus',
    certCode: 'NETWORK+',
    title: 'CompTIA Network+',
    provider: 'CompTIA',
    tier: 1,
    tagline: 'Master enterprise networking, IPv4/IPv6 subnetting, routing, switching, and wireless architectures.',
    estimatedTotalHours: 60,
    domainCount: 5,
    lessonCount: 2,
  },
  {
    certId: 'comptia-security-plus',
    certCode: 'SECURITY+',
    title: 'CompTIA Security+ (SY0-701)',
    provider: 'CompTIA',
    tier: 2,
    tagline: 'Master Zero Trust, cryptography, threats, architecture, SecOps, and governance for SY0-701.',
    estimatedTotalHours: 70,
    domainCount: 5,
    lessonCount: 3,
  },
  {
    certId: 'aws-saa-c03',
    certCode: 'SAA-C03',
    title: 'AWS Certified Solutions Architect – Associate (SAA-C03)',
    provider: 'AWS',
    tier: 2,
    tagline: 'Architect secure, resilient, high-performing, and cost-optimized distributed cloud systems on AWS.',
    estimatedTotalHours: 80,
    domainCount: 4,
    lessonCount: 2,
  },
  {
    certId: 'nist-grc',
    certCode: 'NIST',
    title: 'NIST CSF 2.0, NIST AI RMF & Enterprise GRC',
    provider: 'NIST / GRC',
    tier: 2,
    tagline: 'Operationalize NIST CSF 2.0 (6 Functions), NIST AI RMF 1.0, and SP 800-37 RMF.',
    estimatedTotalHours: 50,
    domainCount: 5,
    lessonCount: 2,
  },
  {
    certId: 'grc-enterprise',
    certCode: 'GRC',
    title: 'Enterprise Governance, Risk & Compliance (GRC) Practitioner',
    provider: 'OCEG / NIST / COSO',
    tier: 2,
    tagline: 'Master integrated governance, enterprise risk management, NIST, ISO 31000, and compliance assurance.',
    estimatedTotalHours: 55,
    domainCount: 4,
    lessonCount: 9,
  },
  {
    certId: 'comptia-cysa-plus',
    certCode: 'CYSA+',
    title: 'CompTIA Cybersecurity Analyst (CySA+ CS0-003)',
    provider: 'CompTIA',
    tier: 3,
    tagline: 'Master blue-team behavioral analytics, SIEM/EDR log triage, CVSS vulnerability management, and IR.',
    estimatedTotalHours: 75,
    domainCount: 5,
    lessonCount: 10,
  },
  {
    certId: 'cisa',
    certCode: 'CISA',
    title: 'ISACA Certified Information Systems Auditor (CISA v28 — 2024 Blueprint)',
    provider: 'ISACA',
    tier: 3,
    tagline: 'Master the ISACA auditor mindset across all 5 v28 exam domains, CAATs, SDLC, resilience, and security.',
    estimatedTotalHours: 110,
    domainCount: 5,
    lessonCount: 12,
  },
  {
    certId: 'crisc',
    certCode: 'CRISC',
    title: 'ISACA Certified in Risk and Information Systems Control (CRISC 7th Ed)',
    provider: 'ISACA',
    tier: 3,
    tagline: 'Master ISACA’s Risk IT practitioner mindset across Governance, Risk Assessment, Response & Reporting.',
    estimatedTotalHours: 95,
    domainCount: 4,
    lessonCount: 10,
  },
  {
    certId: 'fifa-agent',
    certCode: 'FIFA-AGENT',
    title: 'FIFA Licensed Football Agent Examination (2026 Edition)',
    provider: 'FIFA',
    tier: 3,
    tagline: 'Master the 1,010-page January 2026 FIFA Study Materials—FFAR, RSTP, DRC/PSC, and Guardianship.',
    estimatedTotalHours: 65,
    domainCount: 5,
    lessonCount: 10,
  },
  {
    certId: 'isc2-ccsp',
    certCode: 'CCSP',
    title: 'ISC2 Certified Cloud Security Professional',
    provider: 'ISC2',
    tier: 4,
    tagline: 'Architect, secure, and govern multi-cloud enterprise platforms across all 6 CCSP CBK domains.',
    estimatedTotalHours: 100,
    domainCount: 6,
    lessonCount: 14,
  },
  {
    certId: 'cissp',
    certCode: 'CISSP',
    title: 'ISC2 Certified Information Systems Security Professional',
    provider: 'ISC2',
    tier: 4,
    tagline: 'Master all 8 ISC2 CBK domains with the executive "Think Like a Manager" decision rubric.',
    estimatedTotalHours: 140,
    domainCount: 8,
    lessonCount: 19,
  },
  {
    certId: 'cism',
    certCode: 'CISM',
    title: 'ISACA Certified Information Security Manager',
    provider: 'ISACA',
    tier: 4,
    tagline: 'Lead business-aligned enterprise information security governance, risk programs, and incident command.',
    estimatedTotalHours: 100,
    domainCount: 4,
    lessonCount: 12,
  },
  {
    certId: 'cgeit',
    certCode: 'CGEIT',
    title: 'ISACA Certified in the Governance of Enterprise IT',
    provider: 'ISACA',
    tier: 5,
    tagline: 'Master board-level Enterprise IT Governance, COBIT 2019, IT Resources, Benefits Realization & Risk Optimization.',
    estimatedTotalHours: 90,
    domainCount: 4,
    lessonCount: 11,
  },
  {
    certId: 'gslc',
    certCode: 'GSLC',
    title: 'GIAC Security Leadership Certification',
    provider: 'GIAC / SANS',
    tier: 5,
    tagline: 'Fuse executive security leadership, team command, and deep hands-on technical mastery.',
    estimatedTotalHours: 85,
    domainCount: 4,
    lessonCount: 12,
  },
];

const courseModuleCache = new Map<string, CertificationCourse>();

/**
 * Dynamically code-splits and loads the full interactive CertificationCourse for one certification.
 */
export async function loadCourseByCertId(certId: string): Promise<CertificationCourse | undefined> {
  const normalized = toCourseCertId(certId);
  const cached = courseModuleCache.get(normalized);
  if (cached) return cached;

  let loaded: CertificationCourse | undefined;
  switch (normalized) {
    case 'isc2-cc':
      loaded = (await import('./isc2CcCourse')).ISC2_CC_COURSE;
      break;
    case 'comptia-a-plus':
      loaded = (await import('./comptiaAPlusCourse')).COMPTIA_A_PLUS_COURSE;
      break;
    case 'comptia-network-plus':
      loaded = (await import('./comptiaNetPlusCourse')).COMPTIA_NET_PLUS_COURSE;
      break;
    case 'comptia-security-plus':
      loaded = (await import('./comptiaSecPlusCourse')).COMPTIA_SEC_PLUS_COURSE;
      break;
    case 'aws-saa-c03':
      loaded = (await import('./awsSaaCourse')).AWS_SAA_COURSE;
      break;
    case 'nist-grc':
      loaded = (await import('./nistCsfCourse')).NIST_CSF_COURSE;
      break;
    case 'grc-enterprise':
      loaded = (await import('./grcCourse')).GRC_COURSE;
      break;
    case 'comptia-cysa-plus':
      loaded = (await import('./cysaCourse')).CYSA_COURSE;
      break;
    case 'cisa':
      loaded = (await import('./cisaCourse')).CISA_COURSE;
      break;
    case 'crisc':
      loaded = (await import('./criscCourse')).CRISC_COURSE;
      break;
    case 'fifa-agent':
      loaded = (await import('./fifaAgentCourse')).FIFA_AGENT_COURSE;
      break;
    case 'isc2-ccsp':
      loaded = (await import('./ccspCourse')).CCSP_COURSE;
      break;
    case 'cissp':
      loaded = (await import('./cisspCourse')).CISSP_COURSE;
      break;
    case 'cism':
      loaded = (await import('./cismCourse')).CISM_COURSE;
      break;
    case 'cgeit':
      loaded = (await import('./cgeitCourse')).CGEIT_COURSE;
      break;
    case 'gslc':
      loaded = (await import('./gslcCourse')).GSLC_COURSE;
      break;
    default:
      loaded = undefined;
  }

  if (loaded) {
    courseModuleCache.set(normalized, loaded);
  }
  return loaded;
}
