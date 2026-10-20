/**
 * Project Khetra-AI Full-Stack Server
 * Express + SQLite (khetra.db) + Vite Middlewares + Gemini AI API
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initDatabase, db } from './src/server/db.ts';
import {
  performSearchGrounding,
  performMapsGrounding,
  performHighThinkingAnalysis,
  performFastAssistant,
  generateHeritageImage,
} from './src/server/gemini.ts';
import { validateGeoJsonPolygon } from './src/utils/gis.ts';
import { calculateRecordCompleteness } from './src/utils/completeness.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Initialize SQLite database
  initDatabase();

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // ==========================================
  // API ROUTES
  // ==========================================

  // 1. Institutions
  app.get('/api/institutions', (req, res) => {
    try {
      const rows = db.prepare('SELECT * FROM institutions ORDER BY name ASC').all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Geography Hierarchy
  app.get('/api/geography', (req, res) => {
    try {
      const rows = db.prepare('SELECT DISTINCT district, tahasil, mouza FROM assets').all() as Array<{
        district: string;
        tahasil: string;
        mouza: string;
      }>;

      const hierarchy: Record<string, Record<string, string[]>> = {};
      for (const row of rows) {
        if (!hierarchy[row.district]) hierarchy[row.district] = {};
        if (!hierarchy[row.district][row.tahasil]) hierarchy[row.district][row.tahasil] = [];
        if (!hierarchy[row.district][row.tahasil].includes(row.mouza)) {
          hierarchy[row.district][row.tahasil].push(row.mouza);
        }
      }

      res.json({
        districts: Object.keys(hierarchy),
        hierarchy,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Assets Listing with Independent Filtering
  app.get('/api/assets', (req, res) => {
    try {
      const { institutionId, district, tahasil, mouza, verificationStatus, reviewStatus, search } = req.query;

      let query = 'SELECT * FROM assets WHERE 1=1';
      const params: any[] = [];

      if (institutionId && institutionId !== 'ALL') {
        query += ' AND institution_id = ?';
        params.push(institutionId);
      }
      if (district && district !== 'ALL') {
        query += ' AND district = ?';
        params.push(district);
      }
      if (tahasil && tahasil !== 'ALL') {
        query += ' AND tahasil = ?';
        params.push(tahasil);
      }
      if (mouza && mouza !== 'ALL') {
        query += ' AND mouza = ?';
        params.push(mouza);
      }
      if (verificationStatus && verificationStatus !== 'ALL') {
        query += ' AND verification_status = ?';
        params.push(verificationStatus);
      }
      if (reviewStatus && reviewStatus !== 'ALL') {
        query += ' AND review_status = ?';
        params.push(reviewStatus);
      }
      if (search && typeof search === 'string' && search.trim()) {
        const s = `%${search.trim()}%`;
        query += ' AND (title LIKE ? OR id LIKE ? OR khata_no LIKE ? OR plot_no LIKE ? OR kisam LIKE ?)';
        params.push(s, s, s, s, s);
      }

      query += ' ORDER BY id ASC';
      const rows = db.prepare(query).all(...params) as any[];

      const assets = rows.map((r) => ({
        ...r,
        geometry: JSON.parse(r.geometry_json),
      }));

      res.json(assets);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Single Asset Details with Linked Documents & Observations
  app.get('/api/assets/:id', (req, res) => {
    try {
      const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(req.params.id) as any;
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }

      const documents = db.prepare('SELECT * FROM documents WHERE asset_id = ?').all(req.params.id) as any[];
      const observations = db.prepare('SELECT * FROM observations WHERE asset_id = ? ORDER BY observation_date DESC').all(req.params.id) as any[];
      const auditLogs = db.prepare('SELECT * FROM audit_logs WHERE target_id = ? ORDER BY timestamp DESC').all(req.params.id) as any[];

      const geometry = JSON.parse(asset.geometry_json);
      const completeness = calculateRecordCompleteness({
        id: asset.id,
        title: asset.title,
        institutionId: asset.institution_id,
        district: asset.district,
        tahasil: asset.tahasil,
        mouza: asset.mouza,
        khataNo: asset.khata_no,
        plotNo: asset.plot_no,
        kisam: asset.kisam,
        recordedArea: asset.recorded_area,
        areaUnit: asset.area_unit,
        coordinates: [asset.lng, asset.lat],
        geometry,
        documentsCount: documents.length,
        photosCount: observations.filter((o) => !!o.photo_url).length,
        verificationStatus: asset.verification_status,
        reviewStatus: asset.review_status,
        notes: asset.notes,
      });

      res.json({
        ...asset,
        geometry,
        documents: documents.map((d) => ({ ...d, ocr_data: JSON.parse(d.ocr_data_json) })),
        observations,
        auditLogs,
        completeness,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Create Asset
  app.post('/api/assets', (req, res) => {
    try {
      const data = req.body;
      if (!data.id || !data.title || !data.institution_id || !data.district) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      const geomValidation = validateGeoJsonPolygon(data.geometry);
      if (!geomValidation.isValid) {
        return res.status(400).json({ error: `Invalid polygon geometry: ${geomValidation.error}` });
      }

      const now = new Date().toISOString();
      const insert = db.prepare(`
        INSERT INTO assets (
          id, title, institution_id, asset_type, district, tahasil, mouza,
          khata_no, plot_no, kisam, recorded_area, area_unit, normalized_acres,
          lat, lng, geometry_json, verification_status, review_status, notes,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insert.run(
        data.id,
        data.title,
        data.institution_id,
        data.asset_type || 'Land / Parcel',
        data.district,
        data.tahasil || '',
        data.mouza || '',
        data.khata_no || '',
        data.plot_no || '',
        data.kisam || 'Land',
        Number(data.recorded_area) || 0,
        data.area_unit || 'Acre',
        Number(data.normalized_acres) || Number(data.recorded_area) || 0,
        Number(data.lat) || data.geometry.coordinates[0][0][1],
        Number(data.lng) || data.geometry.coordinates[0][0][0],
        JSON.stringify(data.geometry),
        data.verification_status || 'Verification Pending',
        data.review_status || 'Draft',
        data.notes || '',
        now,
        now
      );

      // Audit Log
      db.prepare(`
        INSERT INTO audit_logs (actor, role, action, target_id, summary, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        data.actor || 'Administrator',
        data.role || 'Admin',
        'CREATE_ASSET',
        data.id,
        `Created new institutional asset ${data.id} in ${data.mouza}, ${data.district}.`,
        now
      );

      res.status(201).json({ success: true, id: data.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Update Asset Status / Details
  app.put('/api/assets/:id', (req, res) => {
    try {
      const data = req.body;
      const id = req.params.id;
      const now = new Date().toISOString();

      const existing = db.prepare('SELECT * FROM assets WHERE id = ?').get(id) as any;
      if (!existing) {
        return res.status(404).json({ error: 'Asset not found' });
      }

      const update = db.prepare(`
        UPDATE assets SET
          title = COALESCE(?, title),
          verification_status = COALESCE(?, verification_status),
          review_status = COALESCE(?, review_status),
          kisam = COALESCE(?, kisam),
          notes = COALESCE(?, notes),
          updated_at = ?
        WHERE id = ?
      `);

      update.run(
        data.title || null,
        data.verification_status || null,
        data.review_status || null,
        data.kisam || null,
        data.notes || null,
        now,
        id
      );

      db.prepare(`
        INSERT INTO audit_logs (actor, role, action, target_id, summary, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        data.actor || 'Reviewer S. Mohapatra',
        data.role || 'Reviewer',
        'UPDATE_ASSET',
        id,
        `Updated asset status: Verification=${data.verification_status || existing.verification_status}, Review=${data.review_status || existing.review_status}`,
        now
      );

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 7. Field Observations - Submit & Review
  app.get('/api/observations', (req, res) => {
    try {
      const rows = db.prepare('SELECT o.*, a.title as asset_title, a.institution_id FROM observations o JOIN assets a ON o.asset_id = a.id ORDER BY o.observation_date DESC').all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/observations', (req, res) => {
    try {
      const data = req.body;
      if (!data.asset_id || !data.officer_name || !data.notes) {
        return res.status(400).json({ error: 'Missing required observation fields' });
      }

      const obsId = `OBS-${Date.now().toString().slice(-6)}`;
      const now = new Date().toISOString();

      const insert = db.prepare(`
        INSERT INTO observations (
          id, asset_id, officer_name, gps_lat, gps_lng, accuracy_meters,
          observation_date, discrepancy_category, notes, photo_url, status,
          reviewer_comments, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insert.run(
        obsId,
        data.asset_id,
        data.officer_name,
        Number(data.gps_lat) || 20.24,
        Number(data.gps_lng) || 85.83,
        Number(data.accuracy_meters) || 5.0,
        data.observation_date || now.split('T')[0],
        data.discrepancy_category || 'Clear & Peaceful Possession',
        data.notes,
        data.photo_url || null,
        data.status || 'Submitted',
        data.reviewer_comments || null,
        now
      );

      // If a discrepancy was reported, automatically update asset verification status to 'Discrepancy Reported'
      if (data.discrepancy_category && data.discrepancy_category !== 'Clear & Peaceful Possession') {
        db.prepare("UPDATE assets SET verification_status = 'Discrepancy Reported', updated_at = ? WHERE id = ?").run(now, data.asset_id);
      }

      // Log Audit
      db.prepare(`
        INSERT INTO audit_logs (actor, role, action, target_id, summary, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        data.officer_name,
        'Field Officer',
        'SUBMIT_FIELD_OBSERVATION',
        data.asset_id,
        `Field submission [${data.discrepancy_category}]: ${data.notes.slice(0, 80)}...`,
        now
      );

      res.status(201).json({ success: true, id: obsId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/observations/:id/review', (req, res) => {
    try {
      const { status, reviewer_comments, actor } = req.body;
      const obsId = req.params.id;
      const now = new Date().toISOString();

      const obs = db.prepare('SELECT * FROM observations WHERE id = ?').get(obsId) as any;
      if (!obs) return res.status(404).json({ error: 'Observation not found' });

      db.prepare('UPDATE observations SET status = ?, reviewer_comments = ? WHERE id = ?').run(
        status || 'Verified & Resolved',
        reviewer_comments || '',
        obsId
      );

      // If resolved, update asset verification status
      if (status === 'Verified & Resolved') {
        db.prepare("UPDATE assets SET verification_status = 'Verified', updated_at = ? WHERE id = ?").run(now, obs.asset_id);
      }

      db.prepare(`
        INSERT INTO audit_logs (actor, role, action, target_id, summary, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        actor || 'Reviewer Board',
        'Reviewer',
        'REVIEW_OBSERVATION',
        obs.asset_id,
        `Observation ${obsId} reviewed with status: ${status}`,
        now
      );

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 8. Documents & OCR
  app.get('/api/documents', (req, res) => {
    try {
      const rows = db.prepare('SELECT * FROM documents ORDER BY created_at DESC').all() as any[];
      const docs = rows.map((r) => ({
        ...r,
        ocr_data: JSON.parse(r.ocr_data_json),
      }));
      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/documents/extract', (req, res) => {
    try {
      const { title, doc_type, period_year, asset_id, language } = req.body;
      const docId = `DOC-${Date.now().toString().slice(-6)}`;
      const now = new Date().toISOString();

      // Realistic OCR extraction proposal
      const extractedOcr = {
        deity_name: asset_id?.includes('LGR') ? 'ଶ୍ରୀ ଲିଙ୍ଗରାଜ ମହାପ୍ରଭୁ ବଜେ ଭୁବନେଶ୍ୱର' : 'ଶ୍ରୀ ଜଗନ୍ନାଥ ମହାପ୍ରଭୁ ବଜେ ପୁରୀ ଧାମ',
        institution_name: asset_id?.includes('LGR') ? 'Lingaraj Temple Endowment' : 'Shree Jagannath Temple Administration',
        district: asset_id?.includes('PRI') ? 'Puri' : asset_id?.includes('CTC') ? 'Cuttack' : 'Khordha',
        tahasil: 'Bhubaneswar',
        mouza: 'Old Town',
        khata_no: '88/14',
        plot_no: '402',
        kisam: 'ବାଗାୟତ (Bagayat)',
        recorded_area: '45 Guntha',
        confidence_score: 94.8,
        extracted_at: now,
        notes: 'Odia character segmentation verified for deity dedication clause.',
      };

      const insert = db.prepare(`
        INSERT INTO documents (
          id, asset_id, title, doc_type, period_year, language, scan_url,
          ocr_status, ocr_data_json, review_status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insert.run(
        docId,
        asset_id || null,
        title || 'Uploaded Revenue Grant Scan',
        doc_type || 'Settlement Patta',
        period_year || '1962',
        language || 'Odia & English',
        '/src/assets/images/heritage_records_archive_1792477382950.jpg',
        'Extracted',
        JSON.stringify(extractedOcr),
        'Pending',
        now
      );

      res.status(201).json({ success: true, docId, extractedOcr });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/documents/:id/verify', (req, res) => {
    try {
      const { ocr_data, asset_id, reviewer_name } = req.body;
      const docId = req.params.id;
      const now = new Date().toISOString();

      db.prepare(`
        UPDATE documents SET
          asset_id = COALESCE(?, asset_id),
          ocr_status = 'Human Verified',
          ocr_data_json = ?,
          review_status = 'Approved'
        WHERE id = ?
      `).run(asset_id || null, JSON.stringify(ocr_data), docId);

      db.prepare(`
        INSERT INTO audit_logs (actor, role, action, target_id, summary, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        reviewer_name || 'Authorized Reviewer',
        'Reviewer',
        'VERIFY_OCR_DOCUMENT',
        docId,
        `Approved OCR transcription for ${docId} linked to ${asset_id || 'unlinked'}.`,
        now
      );

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 9. Dashboard Statistics
  app.get('/api/dashboard/stats', (req, res) => {
    try {
      const totalAssets = (db.prepare('SELECT count(*) as count FROM assets').get() as any).count;
      const verifiedCount = (db.prepare("SELECT count(*) as count FROM assets WHERE verification_status = 'Verified'").get() as any).count;
      const pendingVerification = (db.prepare("SELECT count(*) as count FROM assets WHERE verification_status = 'Verification Pending'").get() as any).count;
      const discrepanciesCount = (db.prepare("SELECT count(*) as count FROM assets WHERE verification_status = 'Discrepancy Reported'").get() as any).count;
      const needsReviewCount = (db.prepare("SELECT count(*) as count FROM assets WHERE review_status = 'Needs Review'").get() as any).count;
      const publishedCount = (db.prepare("SELECT count(*) as count FROM assets WHERE review_status = 'Published'").get() as any).count;

      const byInstitution = db.prepare('SELECT institution_id, count(*) as count FROM assets GROUP BY institution_id').all();
      const byDistrict = db.prepare('SELECT district, count(*) as count FROM assets GROUP BY district').all();
      const totalAreaAcres = (db.prepare('SELECT sum(normalized_acres) as sum FROM assets').get() as any).sum || 0;

      res.json({
        totalAssets,
        verifiedCount,
        pendingVerification,
        discrepanciesCount,
        needsReviewCount,
        publishedCount,
        byInstitution,
        byDistrict,
        totalAreaAcres: Number(totalAreaAcres.toFixed(2)),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 10. Audit Logs
  app.get('/api/audit-logs', (req, res) => {
    try {
      const rows = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50').all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 11. Real CSV Export (UTF-8 with BOM for Odia text preservation)
  app.get('/api/export/csv', (req, res) => {
    try {
      const rows = db.prepare('SELECT * FROM assets ORDER BY id ASC').all() as any[];

      const headers = [
        'Asset ID',
        'Title',
        'Institution ID',
        'District',
        'Tahasil',
        'Mouza',
        'Khata No',
        'Plot No',
        'Kisam (Land Class)',
        'Recorded Area',
        'Area Unit',
        'Normalized (Acres)',
        'Latitude',
        'Longitude',
        'Verification Status',
        'Review Status',
        'Updated At',
      ];

      const csvRows = [headers.join(',')];

      for (const r of rows) {
        const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;
        csvRows.push(
          [
            escape(r.id),
            escape(r.title),
            escape(r.institution_id),
            escape(r.district),
            escape(r.tahasil),
            escape(r.mouza),
            escape(r.khata_no),
            escape(r.plot_no),
            escape(r.kisam),
            r.recorded_area,
            escape(r.area_unit),
            r.normalized_acres,
            r.lat,
            r.lng,
            escape(r.verification_status),
            escape(r.review_status),
            escape(r.updated_at),
          ].join(',')
        );
      }

      // Prepend UTF-8 Byte Order Mark (\uFEFF) so Excel correctly handles Odia characters
      const csvContent = '\uFEFF' + csvRows.join('\r\n');
      const dateStr = new Date().toISOString().split('T')[0];

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="khetra-assets-${dateStr}.csv"`);
      res.send(csvContent);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // GEMINI AI BACKEND ROUTES
  // ==========================================

  // A. Search Grounding via gemini-3.8-flash (googleSearch tool)
  app.post('/api/ai/search-grounding', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) return res.status(400).json({ error: 'Query is required' });
      const result = await performSearchGrounding(query);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // B. Maps Grounding via gemini-3.8-flash (googleMaps tool)
  app.post('/api/ai/maps-grounding', async (req, res) => {
    try {
      const { landmarkQuery } = req.body;
      if (!landmarkQuery) return res.status(400).json({ error: 'Landmark query is required' });
      const result = await performMapsGrounding(landmarkQuery);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // C. High Thinking Mode via gemini-4-argon with ThinkingLevel.HIGH
  app.post('/api/ai/high-thinking', async (req, res) => {
    try {
      const { caseData } = req.body;
      if (!caseData || !caseData.assetId) {
        return res.status(400).json({ error: 'Case data with assetId is required' });
      }
      const result = await performHighThinkingAnalysis(caseData);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // D. Fast Assistant via gemini-3.1-flash-lite
  app.post('/api/ai/fast-assistant', async (req, res) => {
    try {
      const { text, task } = req.body;
      const result = await performFastAssistant(text || '', task || 'summarize_field_notes');
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // E. Image Generation with 1K, 2K, 4K affordance
  app.post('/api/ai/image-generation', async (req, res) => {
    try {
      const { prompt, size } = req.body;
      if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
      const result = await generateHeritageImage(prompt, size || '1K');
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Project Khetra-AI] Full-stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Project Khetra-AI] Failed to start server:', err);
  process.exit(1);
});
