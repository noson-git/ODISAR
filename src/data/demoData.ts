/**
 * Shared Demonstration Dataset for ODISAR
 * Odisha Digital Inventory & Spatial Asset Registry
 *
 * Single authoritative source of truth for demonstration records across both
 * client-side fallback (for static deployment environments like Netlify) and server-side seeding.
 *
 * PROVENANCE NOTICE:
 * All property boundaries and identifiers are illustrative demonstration data
 * prepared for the OSFIC evaluation, reflecting real historical revenue nomenclature
 * (Khata, Plot, Kisam, Guntha, Mana) and verified dry-land locations in Odisha.
 */

import { AssetRecord, Institution, DocumentRecord, ObservationRecord, AuditLog, DashboardStats } from '../types';

export const DEMO_PROVENANCE_LABEL = 'Illustrative Demonstration Cadastre (OSFIC Evaluation Data)';

export const demoInstitutions: Institution[] = [
  {
    id: 'inst-lingaraj',
    name: 'Lingaraj Temple Endowment',
    name_odia: 'ଶ୍ରୀ ଲିଙ୍ଗରାଜ ମନ୍ଦିର ପ୍ରଶାସନ',
    headquarters: 'Ekamra Kshetra, Bhubaneswar',
    district: 'Khordha',
    founded_era: '11th Century CE (Somavamsi Dynasty)',
    description:
      'Ancient Saivite-Vaishnavite endowment dedicated to Lord Harihara, managing hereditary consecrated lands across Khordha and Puri districts.',
  },
  {
    id: 'inst-jagannath',
    name: 'Shree Jagannath Temple Administration',
    name_odia: 'ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର ପ୍ରଶାସନ (ପୁରୀ)',
    headquarters: 'Sri Nahara, Grand Road, Puri',
    district: 'Puri',
    founded_era: '12th Century CE (Eastern Ganga Dynasty)',
    description:
      'Apex endowment managing sacred properties (Amruta Manohi and Debottar lands) historically dedicated to Lord Jagannath across Puri, Khordha, and Cuttack.',
  },
];

export const demoAssets: AssetRecord[] = [
  {
    id: 'KHT-LGR-KHD-001',
    title: 'Bindusagar Parikrama Consecrated Orchard',
    institution_id: 'inst-lingaraj',
    asset_type: 'Land / Parcel',
    district: 'Khordha',
    tahasil: 'Bhubaneswar',
    mouza: 'Old Town',
    khata_no: '88/14',
    plot_no: '402',
    kisam: 'ବାଗାୟତ (Bagayat - Orchard)',
    recorded_area: 45.0,
    area_unit: 'Guntha',
    normalized_acres: 1.8,
    lat: 20.2372,
    lng: 85.8318,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [85.8308, 20.2362],
          [85.833, 20.2364],
          [85.8328, 20.2382],
          [85.8306, 20.238],
          [85.8308, 20.2362],
        ],
      ],
    },
    verification_status: 'Verified',
    review_status: 'Published',
    notes:
      'Consecrated floral orchard on dry land southwest of Lingaraj Temple, dedicated for flower offerings (Pushpa Seva) during Chandan Yatra.',
    created_at: '2026-10-15T09:00:00.000Z',
    updated_at: '2026-10-18T10:00:00.000Z',
  },
  {
    id: 'KHT-LGR-KHD-002',
    title: 'Kapileswar Sacred Dairy Pasture Land',
    institution_id: 'inst-lingaraj',
    asset_type: 'Land / Parcel',
    district: 'Khordha',
    tahasil: 'Bhubaneswar',
    mouza: 'Kapileswar',
    khata_no: '112/A',
    plot_no: '715',
    kisam: 'ଗୋଚର (Gochar - Grazing)',
    recorded_area: 3.2,
    area_unit: 'Mana',
    normalized_acres: 3.2,
    lat: 20.2265,
    lng: 85.8245,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [85.8228, 20.225],
          [85.8262, 20.2252],
          [85.826, 20.228],
          [85.8226, 20.2278],
          [85.8228, 20.225],
        ],
      ],
    },
    verification_status: 'Discrepancy Reported',
    review_status: 'Needs Review',
    notes:
      'Reported concern — not legally determined. Field team noted unrecorded boundary fencing on eastern margin of dry pasture land.',
    created_at: '2026-10-15T09:00:00.000Z',
    updated_at: '2026-10-16T14:30:00.000Z',
  },
  {
    id: 'KHT-LGR-PRI-003',
    title: 'Pipili Teisipur Agricultural Endowment',
    institution_id: 'inst-lingaraj',
    asset_type: 'Land / Parcel',
    district: 'Puri',
    tahasil: 'Pipili',
    mouza: 'Teisipur',
    khata_no: '304',
    plot_no: '1182',
    kisam: 'ଶାରଦ ଦୋଫସଲି (Sarada Dofasali - Double Crop Paddy)',
    recorded_area: 5.5,
    area_unit: 'Acre',
    normalized_acres: 5.5,
    lat: 20.115,
    lng: 85.822,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [85.82, 20.1135],
          [85.824, 20.1137],
          [85.8238, 20.1165],
          [85.8198, 20.1162],
          [85.82, 20.1135],
        ],
      ],
    },
    verification_status: 'Verification Pending',
    review_status: 'Approved',
    notes: 'Paddy revenue on fertile dry land dedicated to Maha Shivaratri ghee lighting rituals.',
    created_at: '2026-10-15T09:00:00.000Z',
    updated_at: '2026-10-17T11:00:00.000Z',
  },
  {
    id: 'KHT-LGR-KHD-004',
    title: 'Janla Paddy Holding (Jatani Tahasil)',
    institution_id: 'inst-lingaraj',
    asset_type: 'Land / Parcel',
    district: 'Khordha',
    tahasil: 'Jatani',
    mouza: 'Janla',
    khata_no: '52',
    plot_no: '320',
    kisam: 'ବାଜେଫସଲ (Bajefasali - Miscellaneous crop)',
    recorded_area: 80.0,
    area_unit: 'Guntha',
    normalized_acres: 3.2,
    lat: 20.205,
    lng: 85.735,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [85.733, 20.2035],
          [85.737, 20.2038],
          [85.7368, 20.2065],
          [85.7328, 20.2062],
          [85.733, 20.2035],
        ],
      ],
    },
    verification_status: 'Verified',
    review_status: 'Published',
    notes: 'Recorded in 1962 Tahasil register as Lingaraj Debottar property on dry agricultural plains.',
    created_at: '2026-10-15T09:00:00.000Z',
    updated_at: '2026-10-18T10:00:00.000Z',
  },
  {
    id: 'KHT-JGT-PRI-001',
    title: 'Balukhanda Amruta Manohi Casuarina Grove',
    institution_id: 'inst-jagannath',
    asset_type: 'Land / Parcel',
    district: 'Puri',
    tahasil: 'Puri Sadar',
    mouza: 'Balukhanda',
    khata_no: '215/3',
    plot_no: '984',
    kisam: 'ଜଙ୍ଗଲ / ତୋଟା (Forest/Plantation)',
    recorded_area: 12.4,
    area_unit: 'Acre',
    normalized_acres: 12.4,
    lat: 19.826,
    lng: 85.862,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [85.859, 19.824],
          [85.865, 19.8245],
          [85.8645, 19.828],
          [85.8585, 19.8275],
          [85.859, 19.824],
        ],
      ],
    },
    verification_status: 'Verified',
    review_status: 'Published',
    notes:
      'Part of historic Amruta Manohi coastal casuarina grove situated securely inland north of Marine Drive, dedicated for timber and temple firewood.',
    created_at: '2026-10-15T09:00:00.000Z',
    updated_at: '2026-10-18T10:00:00.000Z',
  },
  {
    id: 'KHT-JGT-PRI-002',
    title: 'Kundheibenta Sacred Herbal Garden (Puri Town)',
    institution_id: 'inst-jagannath',
    asset_type: 'Land / Parcel',
    district: 'Puri',
    tahasil: 'Puri Sadar',
    mouza: 'Kundheibenta',
    khata_no: '44',
    plot_no: '512',
    kisam: 'ବାଗାୟତ (Bagayat - Sacred Flora)',
    recorded_area: 2.1,
    area_unit: 'Mana',
    normalized_acres: 2.1,
    lat: 19.821,
    lng: 85.823,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [85.8215, 19.8195],
          [85.8245, 19.8198],
          [85.8242, 19.8225],
          [85.8212, 19.8222],
          [85.8215, 19.8195],
        ],
      ],
    },
    verification_status: 'Needs Further Review',
    review_status: 'Needs Review',
    notes:
      'Reported concern — not legally determined. Dry land herbal garden requiring joint surveyor re-inspection with municipal authority.',
    created_at: '2026-10-15T09:00:00.000Z',
    updated_at: '2026-10-17T15:00:00.000Z',
  },
  {
    id: 'KHT-JGT-KHD-003',
    title: 'Nayapalli Pilgrimage Rest Shelter Site (Bhubaneswar)',
    institution_id: 'inst-jagannath',
    asset_type: 'Building / Structure',
    district: 'Khordha',
    tahasil: 'Bhubaneswar',
    mouza: 'Nayapalli',
    khata_no: '601',
    plot_no: '1240',
    kisam: 'ଘରବାରୀ (Gharabari - Homestead/Structure)',
    recorded_area: 1.25,
    area_unit: 'Acre',
    normalized_acres: 1.25,
    lat: 20.298,
    lng: 85.815,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [85.8135, 20.2965],
          [85.8165, 20.2968],
          [85.8162, 20.2995],
          [85.8132, 20.2992],
          [85.8135, 20.2965],
        ],
      ],
    },
    verification_status: 'Verified',
    review_status: 'Published',
    notes:
      'Historical rest pavilion on dry urban land for pilgrims traveling along the Jagannath Sadak toward Puri Dham.',
    created_at: '2026-10-15T09:00:00.000Z',
    updated_at: '2026-10-18T10:00:00.000Z',
  },
  {
    id: 'KHT-JGT-KHD-004',
    title: 'Khurda Road Railway Junction Depot Parcel',
    institution_id: 'inst-jagannath',
    asset_type: 'Land / Parcel',
    district: 'Khordha',
    tahasil: 'Jatani',
    mouza: 'Khurda Road',
    khata_no: '189',
    plot_no: '76',
    kisam: 'ବାଜେଫସଲ (Miscellaneous Holding)',
    recorded_area: 50.0,
    area_unit: 'Guntha',
    normalized_acres: 2.0,
    lat: 20.158,
    lng: 85.712,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [85.71, 20.1565],
          [85.714, 20.1568],
          [85.7138, 20.1595],
          [85.7098, 20.1592],
          [85.71, 20.1565],
        ],
      ],
    },
    verification_status: 'Verification Pending',
    review_status: 'Approved',
    notes: 'Agricultural dry land historically leased for seasonal pulse cultivation.',
    created_at: '2026-10-15T09:00:00.000Z',
    updated_at: '2026-10-17T14:00:00.000Z',
  },
  {
    id: 'KHT-JGT-CTC-005',
    title: 'Bidanasi Agricultural & High-Bank Parcel (Cuttack)',
    institution_id: 'inst-jagannath',
    asset_type: 'Land / Parcel',
    district: 'Cuttack',
    tahasil: 'Cuttack Sadar',
    mouza: 'Bidanasi',
    khata_no: '409/2',
    plot_no: '1820',
    kisam: 'ଶାରଦ (Sarada Paddy)',
    recorded_area: 4.8,
    area_unit: 'Acre',
    normalized_acres: 4.8,
    lat: 20.468,
    lng: 85.834,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [85.8315, 20.4665],
          [85.8365, 20.4668],
          [85.8362, 20.4695],
          [85.8312, 20.4692],
          [85.8315, 20.4665],
        ],
      ],
    },
    verification_status: 'Discrepancy Reported',
    review_status: 'Needs Review',
    notes:
      'Reported concern — not legally determined. High-bank dry revenue land south of Mahanadi flood embankment requiring joint survey verification.',
    created_at: '2026-10-15T09:00:00.000Z',
    updated_at: '2026-10-16T18:00:00.000Z',
  },
  {
    id: 'KHT-LGR-KHD-005',
    title: 'Ekamra Kshetra Heritage Mandap Site',
    institution_id: 'inst-lingaraj',
    asset_type: 'Heritage Mandap',
    district: 'Khordha',
    tahasil: 'Bhubaneswar',
    mouza: 'Old Town',
    khata_no: '15',
    plot_no: '88',
    kisam: 'ଦେବସ୍ଥଳୀ (Devasthali - Sacred Site)',
    recorded_area: 15.0,
    area_unit: 'Guntha',
    normalized_acres: 0.6,
    lat: 20.236,
    lng: 85.835,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [85.834, 20.2352],
          [85.836, 20.2353],
          [85.8358, 20.2368],
          [85.8338, 20.2367],
          [85.834, 20.2352],
        ],
      ],
    },
    verification_status: 'Verified',
    review_status: 'Published',
    notes: 'Stone pavilion on dry sandstone ground used during Sitala Sasthi festivities.',
    created_at: '2026-10-15T09:00:00.000Z',
    updated_at: '2026-10-18T10:00:00.000Z',
  },
];

export const demoDocuments: DocumentRecord[] = [
  {
    id: 'DOC-1927-LGR-001',
    asset_id: 'KHT-LGR-KHD-001',
    title: '1927 Settlement Record of Rights (RoR Patta)',
    doc_type: 'Record of Rights (RoR)',
    period_year: '1927',
    language: 'Odia & English',
    scan_url: '/assets/scans/patta_1927_lgr.jpg',
    ocr_status: 'Human Verified',
    ocr_data: {
      deity_name: 'ଶ୍ରୀ ଲିଙ୍ଗରାଜ ମହାପ୍ରଭୁ ବଜେ ଭୁବନେଶ୍ୱର',
      institution_name: 'Lingaraj Temple',
      district: 'Khordha',
      tahasil: 'Bhubaneswar',
      mouza: 'Old Town',
      khata_no: '88/14',
      plot_no: '402',
      kisam: 'ବାଗାୟତ',
      recorded_area: '45 Guntha',
      confidence_score: 96.4,
      extracted_at: '2026-10-18T10:00:00Z',
      verified_by: 'Authorized Reviewer S. Mohapatra',
    },
    review_status: 'Approved',
    created_at: '2026-10-18T10:00:00Z',
  },
  {
    id: 'DOC-1962-JGT-002',
    asset_id: 'KHT-JGT-PRI-001',
    title: '1962 Tahasil Debottar Land Grant Record',
    doc_type: 'Revenue Grant Deed',
    period_year: '1962',
    language: 'Odia & English',
    scan_url: '/assets/scans/deed_1962_jgt.jpg',
    ocr_status: 'Extracted',
    ocr_data: {
      deity_name: 'ଶ୍ରୀ ଜଗନ୍ନାଥ ମହାପ୍ରଭୁ ବଜେ ପୁରୀ ଧାମ',
      institution_name: 'Shree Jagannath Temple Administration',
      district: 'Puri',
      tahasil: 'Puri Sadar',
      mouza: 'Balukhanda',
      khata_no: '215/3',
      plot_no: '984',
      kisam: 'ତୋଟା / ଜଙ୍ଗଲ',
      recorded_area: '12.40 Acre',
      confidence_score: 89.2,
      extracted_at: '2026-10-19T08:30:00Z',
      verified_by: null,
      flags: ['Tenant name blurred', 'Border crease on page 2'],
    },
    review_status: 'Pending',
    created_at: '2026-10-19T08:30:00Z',
  },
];

export const demoObservations: ObservationRecord[] = [
  {
    id: 'OBS-2026-001',
    asset_id: 'KHT-LGR-KHD-002',
    asset_title: 'Kapileswar Sacred Dairy Pasture Land',
    institution_id: 'inst-lingaraj',
    officer_name: 'Inspector R. K. Nayak (Khordha Zone)',
    gps_lat: 20.2268,
    gps_lng: 85.8248,
    accuracy_meters: 3.8,
    observation_date: '2026-10-15',
    discrepancy_category: 'Boundary Discrepancy',
    notes:
      'Physical inspection confirmed traditional pasture boundaries are intact on North and South. Eastern boundary shows recent unapproved brick mortar alignment (approx 15 meters length).',
    photo_url: '/assets/photos/obs_kapileswar.jpg',
    status: 'Under Review',
    reviewer_comments: 'Scheduled joint physical tahasil boundary survey for Nov 2026.',
    created_at: '2026-10-15T10:00:00.000Z',
  },
  {
    id: 'OBS-2026-002',
    asset_id: 'KHT-JGT-PRI-001',
    asset_title: 'Balukhanda Amruta Manohi Casuarina Grove',
    institution_id: 'inst-jagannath',
    officer_name: 'Field Officer D. Pradhan (Puri Coastal Sector)',
    gps_lat: 19.8262,
    gps_lng: 85.8622,
    accuracy_meters: 2.5,
    observation_date: '2026-10-17',
    discrepancy_category: 'Clear & Peaceful Possession',
    notes:
      'Casuarina and teak plantation grove inspected. Boundary pillars intact and verified matching 1962 cadastral survey lines.',
    photo_url: '/assets/photos/obs_balukhanda.jpg',
    status: 'Verified & Resolved',
    reviewer_comments: 'Approved by Assistant Commissioner of Endowments.',
    created_at: '2026-10-17T11:00:00.000Z',
  },
];

export const demoAuditLogs: AuditLog[] = [
  {
    id: 1,
    actor: 'System Initializer',
    role: 'Administrator',
    action: 'SYSTEM_BOOTSTRAP',
    target_id: 'khetra.db',
    summary: 'Initialized 10 verified dry-land demonstration asset parcels across Khordha, Puri, and Cuttack.',
    timestamp: '2026-10-15T09:00:00.000Z',
  },
  {
    id: 2,
    actor: 'S. Mohapatra',
    role: 'Reviewer',
    action: 'OCR_VERIFICATION',
    target_id: 'DOC-1927-LGR-001',
    summary: 'Verified Odia script transliteration for RoR Patta Khata 88/14 Plot 402.',
    timestamp: '2026-10-18T10:00:00.000Z',
  },
];

/**
 * Computes dashboard statistics from the demonstration dataset
 */
export function getDemoDashboardStats(): DashboardStats {
  const totalAssets = demoAssets.length;
  const verifiedCount = demoAssets.filter((a) => a.verification_status === 'Verified').length;
  const pendingVerification = demoAssets.filter((a) => a.verification_status === 'Verification Pending').length;
  const discrepanciesCount = demoAssets.filter((a) => a.verification_status === 'Discrepancy Reported').length;
  const needsReviewCount = demoAssets.filter((a) => a.review_status === 'Needs Review').length;
  const publishedCount = demoAssets.filter((a) => a.review_status === 'Published').length;

  const instCountMap: Record<string, number> = {};
  const distCountMap: Record<string, number> = {};
  let totalAreaAcres = 0;

  for (const a of demoAssets) {
    instCountMap[a.institution_id] = (instCountMap[a.institution_id] || 0) + 1;
    distCountMap[a.district] = (distCountMap[a.district] || 0) + 1;
    totalAreaAcres += a.normalized_acres;
  }

  return {
    totalAssets,
    verifiedCount,
    pendingVerification,
    discrepanciesCount,
    needsReviewCount,
    publishedCount,
    byInstitution: Object.entries(instCountMap).map(([institution_id, count]) => ({ institution_id, count })),
    byDistrict: Object.entries(distCountMap).map(([district, count]) => ({ district, count })),
    totalAreaAcres: Number(totalAreaAcres.toFixed(2)),
  };
}
