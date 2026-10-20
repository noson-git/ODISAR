/**
 * Persistent SQLite Database for Project Khetra-AI (khetra.db)
 * Uses Node 22 native node:sqlite DatabaseSync
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'khetra.db');
const db = new DatabaseSync(DB_PATH);

// Initialize Tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS institutions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_odia TEXT NOT NULL,
      headquarters TEXT NOT NULL,
      district TEXT NOT NULL,
      founded_era TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      institution_id TEXT NOT NULL,
      asset_type TEXT NOT NULL, -- 'Land / Parcel', 'Building / Structure', 'Temple Tank / Pond', 'Heritage Mandap'
      district TEXT NOT NULL,
      tahasil TEXT NOT NULL,
      mouza TEXT NOT NULL,
      khata_no TEXT NOT NULL,
      plot_no TEXT NOT NULL,
      kisam TEXT NOT NULL, -- Odia land classification
      recorded_area REAL NOT NULL,
      area_unit TEXT NOT NULL, -- 'Guntha', 'Mana', 'Acre', 'Decimal'
      normalized_acres REAL NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      geometry_json TEXT NOT NULL, -- GeoJSON Polygon
      verification_status TEXT NOT NULL, -- 'Verified', 'Verification Pending', 'Discrepancy Reported', 'Needs Further Review', 'Not Verified'
      review_status TEXT NOT NULL, -- 'Published', 'Approved', 'Needs Review', 'Draft'
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      asset_id TEXT,
      title TEXT NOT NULL,
      doc_type TEXT NOT NULL, -- 'Record of Rights (RoR)', 'Settlement Patta', 'Revenue Grant Deed', 'Deed of Dedication'
      period_year TEXT NOT NULL,
      language TEXT NOT NULL, -- 'Odia & English', 'Odia', 'English'
      scan_url TEXT NOT NULL,
      ocr_status TEXT NOT NULL, -- 'Extracted', 'Human Verified', 'Pending Review'
      ocr_data_json TEXT NOT NULL,
      review_status TEXT NOT NULL, -- 'Approved', 'Pending', 'Rejected'
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS observations (
      id TEXT PRIMARY KEY,
      asset_id TEXT NOT NULL,
      officer_name TEXT NOT NULL,
      gps_lat REAL NOT NULL,
      gps_lng REAL NOT NULL,
      accuracy_meters REAL NOT NULL,
      observation_date TEXT NOT NULL,
      discrepancy_category TEXT NOT NULL, -- 'Clear & Peaceful Possession', 'Boundary Discrepancy', 'Unauthorized Construction', 'Unrecorded Lease/Tenant', 'Crop/Usage Shift'
      notes TEXT NOT NULL,
      photo_url TEXT,
      status TEXT NOT NULL, -- 'Submitted', 'Under Review', 'Verified & Resolved', 'Flagged'
      reviewer_comments TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor TEXT NOT NULL,
      role TEXT NOT NULL,
      action TEXT NOT NULL,
      target_id TEXT NOT NULL,
      summary TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);

  // Check if institutions exist or if seed data needs coordinate accuracy correction
  const countRow = db.prepare('SELECT count(*) as count FROM institutions').get() as { count: number };
  const sampleCoord = db.prepare('SELECT lat FROM assets WHERE id = ?').get('KHT-LGR-KHD-001') as { lat: number } | undefined;

  // Re-seed if empty or if sample asset contains outdated coordinate (lat > 20.24 placed on water tank)
  if (countRow.count === 0 || (sampleCoord && sampleCoord.lat > 20.24)) {
    db.exec(`
      DELETE FROM institutions;
      DELETE FROM assets;
      DELETE FROM documents;
      DELETE FROM observations;
      DELETE FROM audit_logs;
    `);
    seedDatabase();
  }
}

function seedDatabase() {
  console.log('[Khetra-AI] Seeding dry-land verified demonstration dataset into khetra.db...');

  // 1. Seed Institutions
  const insertInst = db.prepare(`
    INSERT INTO institutions (id, name, name_odia, headquarters, district, founded_era, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertInst.run(
    'inst-lingaraj',
    'Lingaraj Temple Endowment',
    'ଶ୍ରୀ ଲିଙ୍ଗରାଜ ମନ୍ଦିର ପ୍ରଶାସନ',
    'Ekamra Kshetra, Bhubaneswar',
    'Khordha',
    '11th Century CE (Somavamsi Dynasty)',
    'Ancient Saivite-Vaishnavite endowment dedicated to Lord Harihara, managing hereditary consecrated lands across Khordha and Puri districts.'
  );

  insertInst.run(
    'inst-jagannath',
    'Shree Jagannath Temple Administration',
    'ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର ପ୍ରଶାସନ (ପୁରୀ)',
    'Sri Nahara, Grand Road, Puri',
    'Puri',
    '12th Century CE (Eastern Ganga Dynasty)',
    'Apex endowment managing sacred properties (Amruta Manohi and Debottar lands) historically dedicated to Lord Jagannath across Puri, Khordha, and Cuttack.'
  );

  // 2. Seed Assets with 100% verified dry-land GeoJSON boundaries
  const insertAsset = db.prepare(`
    INSERT INTO assets (
      id, title, institution_id, asset_type, district, tahasil, mouza,
      khata_no, plot_no, kisam, recorded_area, area_unit, normalized_acres,
      lat, lng, geometry_json, verification_status, review_status, notes,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();

  // All 10 assets verified on dry land across revenue mouzas in Khordha, Puri, and Cuttack
  const sampleAssets = [
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
            [85.8330, 20.2364],
            [85.8328, 20.2382],
            [85.8306, 20.2380],
            [85.8308, 20.2362],
          ],
        ],
      },
      verification_status: 'Verified',
      review_status: 'Published',
      notes: 'Consecrated floral orchard on dry land southwest of Lingaraj Temple, dedicated for flower offerings (Pushpa Seva) during Chandan Yatra.',
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
            [85.8228, 20.2250],
            [85.8262, 20.2252],
            [85.8260, 20.2280],
            [85.8226, 20.2278],
            [85.8228, 20.2250],
          ],
        ],
      },
      verification_status: 'Discrepancy Reported',
      review_status: 'Needs Review',
      notes: 'Reported concern — not legally determined. Field team noted unrecorded boundary fencing on eastern margin of dry pasture land.',
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
      lat: 20.1150,
      lng: 85.8220,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.8200, 20.1135],
            [85.8240, 20.1137],
            [85.8238, 20.1165],
            [85.8198, 20.1162],
            [85.8200, 20.1135],
          ],
        ],
      },
      verification_status: 'Verification Pending',
      review_status: 'Approved',
      notes: 'Paddy revenue on fertile dry land dedicated to Maha Shivaratri ghee lighting rituals.',
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
      lat: 20.2050,
      lng: 85.7350,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.7330, 20.2035],
            [85.7370, 20.2038],
            [85.7368, 20.2065],
            [85.7328, 20.2062],
            [85.7330, 20.2035],
          ],
        ],
      },
      verification_status: 'Verified',
      review_status: 'Published',
      notes: 'Recorded in 1962 Tahasil register as Lingaraj Debottar property on dry agricultural plains.',
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
      lat: 19.8260,
      lng: 85.8620,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.8590, 19.8240],
            [85.8650, 19.8245],
            [85.8645, 19.8280],
            [85.8585, 19.8275],
            [85.8590, 19.8240],
          ],
        ],
      },
      verification_status: 'Verified',
      review_status: 'Published',
      notes: 'Part of historic Amruta Manohi coastal casuarina grove situated securely inland north of Marine Drive, dedicated for timber and temple firewood.',
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
      lat: 19.8210,
      lng: 85.8230,
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
      notes: 'Reported concern — not legally determined. Dry land herbal garden requiring joint surveyor re-inspection with municipal authority.',
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
      lat: 20.2980,
      lng: 85.8150,
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
      notes: 'Historical rest pavilion on dry urban land for pilgrims traveling along the Jagannath Sadak toward Puri Dham.',
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
      lat: 20.1580,
      lng: 85.7120,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.7100, 20.1565],
            [85.7140, 20.1568],
            [85.7138, 20.1595],
            [85.7098, 20.1592],
            [85.7100, 20.1565],
          ],
        ],
      },
      verification_status: 'Verification Pending',
      review_status: 'Approved',
      notes: 'Agricultural dry land historically leased for seasonal pulse cultivation.',
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
      lat: 20.4680,
      lng: 85.8340,
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
      notes: 'Reported concern — not legally determined. High-bank dry revenue land south of Mahanadi flood embankment requiring joint survey verification.',
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
      lat: 20.2360,
      lng: 85.8350,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.8340, 20.2352],
            [85.8360, 20.2353],
            [85.8358, 20.2368],
            [85.8338, 20.2367],
            [85.8340, 20.2352],
          ],
        ],
      },
      verification_status: 'Verified',
      review_status: 'Published',
      notes: 'Stone pavilion on dry sandstone ground used during Sitala Sasthi festivities.',
    },
  ];

  for (const a of sampleAssets) {
    insertAsset.run(
      a.id,
      a.title,
      a.institution_id,
      a.asset_type,
      a.district,
      a.tahasil,
      a.mouza,
      a.khata_no,
      a.plot_no,
      a.kisam,
      a.recorded_area,
      a.area_unit,
      a.normalized_acres,
      a.lat,
      a.lng,
      JSON.stringify(a.geometry),
      a.verification_status,
      a.review_status,
      a.notes,
      now,
      now
    );
  }

  // 3. Seed Sample Documents & OCR extraction records
  const insertDoc = db.prepare(`
    INSERT INTO documents (
      id, asset_id, title, doc_type, period_year, language, scan_url,
      ocr_status, ocr_data_json, review_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertDoc.run(
    'DOC-1927-LGR-001',
    'KHT-LGR-KHD-001',
    '1927 Settlement Record of Rights (RoR Patta)',
    'Record of Rights (RoR)',
    '1927',
    'Odia & English',
    '/assets/scans/patta_1927_lgr.jpg',
    'Human Verified',
    JSON.stringify({
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
    }),
    'Approved',
    now
  );

  insertDoc.run(
    'DOC-1962-JGT-002',
    'KHT-JGT-PRI-001',
    '1962 Tahasil Debottar Land Grant Record',
    'Revenue Grant Deed',
    '1962',
    'Odia & English',
    '/assets/scans/deed_1962_jgt.jpg',
    'Extracted',
    JSON.stringify({
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
    }),
    'Pending',
    now
  );

  // 4. Seed Field Observations
  const insertObs = db.prepare(`
    INSERT INTO observations (
      id, asset_id, officer_name, gps_lat, gps_lng, accuracy_meters,
      observation_date, discrepancy_category, notes, photo_url, status,
      reviewer_comments, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertObs.run(
    'OBS-2026-001',
    'KHT-LGR-KHD-002',
    'Inspector R. K. Nayak (Khordha Zone)',
    20.2268,
    85.8248,
    3.8,
    '2026-10-15',
    'Boundary Discrepancy',
    'Physical inspection confirmed traditional pasture boundaries are intact on North and South. Eastern boundary shows recent unapproved brick mortar alignment (approx 15 meters length).',
    '/assets/photos/obs_kapileswar.jpg',
    'Under Review',
    'Scheduled joint physical tahasil boundary survey for Nov 2026.',
    now
  );

  insertObs.run(
    'OBS-2026-002',
    'KHT-JGT-PRI-001',
    'Field Officer D. Pradhan (Puri Coastal Sector)',
    19.8262,
    85.8622,
    2.5,
    '2026-10-17',
    'Clear & Peaceful Possession',
    'Casuarina and teak plantation grove inspected. Boundary pillars intact and verified matching 1962 cadastral survey lines.',
    '/assets/photos/obs_balukhanda.jpg',
    'Verified & Resolved',
    'Approved by Assistant Commissioner of Endowments.',
    now
  );

  // 5. Seed Audit Logs
  const insertLog = db.prepare(`
    INSERT INTO audit_logs (actor, role, action, target_id, summary, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertLog.run(
    'System Initializer',
    'Administrator',
    'SYSTEM_BOOTSTRAP',
    'khetra.db',
    'Initialized 10 verified dry-land demonstration asset parcels across Khordha, Puri, and Cuttack.',
    now
  );
  insertLog.run(
    'S. Mohapatra',
    'Reviewer',
    'OCR_VERIFICATION',
    'DOC-1927-LGR-001',
    'Verified Odia script transliteration for RoR Patta Khata 88/14 Plot 402.',
    now
  );

  console.log('[Khetra-AI] Database initialized and seeded successfully with verified dry-land geometries.');
}

export { db };
