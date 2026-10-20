import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRecordCompleteness } from './completeness.ts';

test('calculateRecordCompleteness scores fully populated asset high', () => {
  const result = calculateRecordCompleteness({
    id: 'KHT-PURI-001',
    title: 'Jagannath Temple Orchard',
    institutionId: 'inst-jagannath',
    district: 'Puri',
    tahasil: 'Puri Sadar',
    mouza: 'Balukhanda',
    khataNo: '142',
    plotNo: '891',
    kisam: 'Bagayat',
    recordedArea: 3.5,
    areaUnit: 'Acre',
    coordinates: [85.824, 19.805],
    geometry: { type: 'Polygon', coordinates: [[[85.82, 19.8], [85.83, 19.8], [85.83, 19.81], [85.82, 19.8]]] },
    documentsCount: 2,
    photosCount: 3,
    verificationStatus: 'Verified',
    reviewStatus: 'Published',
  });

  assert.equal(result.score, 100);
  assert.equal(result.rating, 'Comprehensive');
  assert.equal(result.missingFields.length, 0);
});

test('calculateRecordCompleteness handles partial or draft record gracefully', () => {
  const result = calculateRecordCompleteness({
    id: 'DRAFT-002',
    institutionId: 'inst-lingaraj',
    district: 'Khordha',
  });

  assert.ok(result.score < 50);
  assert.ok(result.missingFields.includes('Khata Number'));
  assert.ok(result.missingFields.includes('Plot Number'));
  assert.ok(result.missingFields.includes('Coordinates'));
  assert.match(result.disclaimer, /does not constitute verification of legal ownership/i);
});
