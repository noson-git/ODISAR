/**
 * Record Completeness & Data Quality Indicator for Project Khetra-AI
 *
 * NOTE: Completeness is an operational measure of field population and
 * documentation presence. It does NOT represent legal ownership or official title.
 */

export interface AssetRecordFields {
  id: string;
  title: string;
  institutionId: string;
  district: string;
  tahasil: string;
  mouza: string;
  khataNo: string;
  plotNo: string;
  kisam: string;
  recordedArea: number;
  areaUnit: string;
  coordinates?: [number, number];
  geometry?: any;
  documentsCount?: number;
  photosCount?: number;
  verificationStatus?: string;
  reviewStatus?: string;
  notes?: string;
}

export interface CompletenessResult {
  score: number; // 0 to 100
  rating: 'Incomplete' | 'Basic' | 'Moderate' | 'Substantial' | 'Comprehensive';
  breakdown: {
    identity: { score: number; max: 20; details: string[] };
    geography: { score: number; max: 30; details: string[] };
    cadastral: { score: number; max: 25; details: string[] };
    evidence: { score: number; max: 25; details: string[] };
  };
  missingFields: string[];
  disclaimer: string;
}

export function calculateRecordCompleteness(record: Partial<AssetRecordFields>): CompletenessResult {
  let identityScore = 0;
  const identityDetails: string[] = [];
  const missingFields: string[] = [];

  if (record.id) {
    identityScore += 10;
    identityDetails.push('Asset ID present');
  } else {
    missingFields.push('Asset ID');
  }
  if (record.institutionId) {
    identityScore += 10;
    identityDetails.push('Institutional endowment linked');
  } else {
    missingFields.push('Institution Link');
  }

  let geoScore = 0;
  const geoDetails: string[] = [];
  if (record.district) {
    geoScore += 5;
  } else {
    missingFields.push('District');
  }
  if (record.tahasil) {
    geoScore += 5;
  } else {
    missingFields.push('Tahasil');
  }
  if (record.mouza) {
    geoScore += 5;
  } else {
    missingFields.push('Mouza / Village');
  }
  if (record.coordinates && record.coordinates[0] && record.coordinates[1]) {
    geoScore += 5;
    geoDetails.push('Point coordinates pinned');
  } else {
    missingFields.push('Coordinates');
  }
  if (record.geometry && record.geometry.coordinates && record.geometry.coordinates.length > 0) {
    geoScore += 10;
    geoDetails.push('Parcel boundary polygon mapped');
  } else {
    missingFields.push('GIS Parcel Boundary');
  }

  let cadastralScore = 0;
  const cadastralDetails: string[] = [];
  if (record.khataNo && record.khataNo.trim()) {
    cadastralScore += 8;
  } else {
    missingFields.push('Khata Number');
  }
  if (record.plotNo && record.plotNo.trim()) {
    cadastralScore += 8;
  } else {
    missingFields.push('Plot Number');
  }
  if (record.kisam && record.kisam.trim()) {
    cadastralScore += 5;
  } else {
    missingFields.push('Kisam / Land Classification');
  }
  if (record.recordedArea && record.recordedArea > 0 && record.areaUnit) {
    cadastralScore += 4;
  } else {
    missingFields.push('Recorded Area & Unit');
  }

  let evidenceScore = 0;
  const evidenceDetails: string[] = [];
  if (record.documentsCount && record.documentsCount > 0) {
    evidenceScore += 10;
    evidenceDetails.push(`${record.documentsCount} historical documents attached`);
  } else {
    missingFields.push('Historical Documents');
  }
  if (record.photosCount && record.photosCount > 0) {
    evidenceScore += 5;
    evidenceDetails.push(`${record.photosCount} field photographs linked`);
  }
  if (record.verificationStatus && record.verificationStatus !== 'Not Verified') {
    evidenceScore += 5;
    evidenceDetails.push(`Field status: ${record.verificationStatus}`);
  }
  if (record.reviewStatus === 'Approved' || record.reviewStatus === 'Published') {
    evidenceScore += 5;
    evidenceDetails.push(`Governance review completed`);
  }

  const totalScore = identityScore + geoScore + cadastralScore + evidenceScore;

  let rating: CompletenessResult['rating'] = 'Incomplete';
  if (totalScore >= 85) rating = 'Comprehensive';
  else if (totalScore >= 70) rating = 'Substantial';
  else if (totalScore >= 50) rating = 'Moderate';
  else if (totalScore >= 25) rating = 'Basic';

  return {
    score: totalScore,
    rating,
    breakdown: {
      identity: { score: identityScore, max: 20, details: identityDetails },
      geography: { score: geoScore, max: 30, details: geoDetails },
      cadastral: { score: cadastralScore, max: 25, details: cadastralDetails },
      evidence: { score: evidenceScore, max: 25, details: evidenceDetails },
    },
    missingFields,
    disclaimer:
      'Completeness score measures data entry thoroughness and does not constitute verification of legal ownership.',
  };
}
