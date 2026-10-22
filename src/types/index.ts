/**
 * TypeScript Data Models for ODISAR
 * Odisha Digital Inventory & Spatial Asset Registry
 */

export interface Institution {
  id: string;
  name: string;
  name_odia: string;
  headquarters: string;
  district: string;
  founded_era: string;
  description: string;
}

export type VerificationStatus =
  | 'Verified'
  | 'Verification Pending'
  | 'Discrepancy Reported'
  | 'Needs Further Review'
  | 'Not Verified';

export type ReviewStatus = 'Published' | 'Approved' | 'Needs Review' | 'Draft';

export interface AssetRecord {
  id: string;
  title: string;
  institution_id: string;
  asset_type: 'Land / Parcel' | 'Building / Structure' | 'Temple Tank / Pond' | 'Heritage Mandap';
  district: string;
  tahasil: string;
  mouza: string;
  khata_no: string;
  plot_no: string;
  kisam: string;
  recorded_area: number;
  area_unit: string;
  normalized_acres: number;
  lat: number;
  lng: number;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // GeoJSON [ [ [lng, lat], ... ] ]
  };
  verification_status: VerificationStatus;
  review_status: ReviewStatus;
  cadastral_accuracy?: 'Ground Verified Cadastre' | 'Illustrative Boundary';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentRecord {
  id: string;
  asset_id?: string;
  title: string;
  doc_type: string;
  period_year: string;
  language: string;
  scan_url: string;
  ocr_status: 'Extracted' | 'Human Verified' | 'Pending Review';
  ocr_data: {
    deity_name?: string;
    institution_name?: string;
    district?: string;
    tahasil?: string;
    mouza?: string;
    khata_no?: string;
    plot_no?: string;
    kisam?: string;
    recorded_area?: string;
    confidence_score?: number;
    extracted_at?: string;
    verified_by?: string | null;
    notes?: string;
    flags?: string[];
  };
  review_status: 'Approved' | 'Pending' | 'Rejected';
  created_at: string;
}

export interface ObservationRecord {
  id: string;
  asset_id: string;
  asset_title?: string;
  institution_id?: string;
  officer_name: string;
  gps_lat: number;
  gps_lng: number;
  accuracy_meters: number;
  observation_date: string;
  discrepancy_category:
    | 'Clear & Peaceful Possession'
    | 'Boundary Discrepancy'
    | 'Unauthorized Construction'
    | 'Unrecorded Lease/Tenant'
    | 'Crop/Usage Shift';
  notes: string;
  photo_url?: string | null;
  status: 'Submitted' | 'Under Review' | 'Verified & Resolved' | 'Flagged';
  reviewer_comments?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: number;
  actor: string;
  role: string;
  action: string;
  target_id: string;
  summary: string;
  timestamp: string;
}

export interface DashboardStats {
  totalAssets: number;
  verifiedCount: number;
  pendingVerification: number;
  discrepanciesCount: number;
  needsReviewCount: number;
  publishedCount: number;
  byInstitution: Array<{ institution_id: string; count: number }>;
  byDistrict: Array<{ district: string; count: number }>;
  totalAreaAcres: number;
}
