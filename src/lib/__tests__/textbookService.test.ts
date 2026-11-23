import { describe, it, expect } from 'vitest';
import { toDbCertSlug, toCourseCertId } from '../textbookService';
import { formatCleanDocumentTitle } from '../documentTitle';

describe('Canonical Slug Mapping & Title Formatting', () => {
  it('maps between UI course IDs and canonical DB certification slugs symmetrically', () => {
    expect(toDbCertSlug('aws-saa-c03')).toBe('aws-csaa');
    expect(toDbCertSlug('isc2-ccsp')).toBe('ccsp');
    expect(toDbCertSlug('comptia-cysa-plus')).toBe('cysa');
    expect(toCourseCertId('aws-csaa')).toBe('aws-saa-c03');
    expect(toCourseCertId('giac-security-leadership')).toBe('gslc');
  });

  it('cleanly formats ingested document archive filenames', () => {
    expect(formatCleanDocumentTitle('cisa_review_manual_28th_edition.part_1.pdf')).toContain('CISA');
  });
});
