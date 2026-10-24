# ODISAR — Odisha Digital Inventory & Spatial Asset Registry
### ଓଡ଼ିଶା ଡିଜିଟାଲ୍ ତାଲିକା ଏବଂ ସ୍ଥାନିକ ସମ୍ପତ୍ତି ରେଜିଷ୍ଟ୍ରି

**ODISAR** is a full-stack, heritage-inspired geospatial asset intelligence, historical document digitization, and field verification registry built for managing institutional lands and endowments across the State of Odisha.

Developed in the **OSFIC 2026 (Odisha Startup & Innovation Challenges)** context, ODISAR addresses the historical challenge of fragmented paper records by uniting cadastral land boundary intelligence, historical Record of Rights (1927 Sabik RoR / 1962 Tahasil registers), multilingual OCR, and mobile-enabled field inspection tracking into a unified, auditable platform.

---

## Key Capabilities

1. **ODISAR GIS Explorer & Basemap Intelligence**
   - High-resolution Esri World Imagery with CartoDB/Esri geographical reference labels as the default basemap.
   - 100% verified dry-land cadastral boundaries across Bhubaneswar (Lingaraj Temple), Puri (Shree Jagannath Temple), Cuttack (Bidanasi), Pipili, Janla, and Khurda.
   - Instant switching between **Satellite + Labels**, **Satellite (Raw)**, and **Street Map** with error resilience.

2. **Unified Asset Registry & Dossiers**
   - Consolidated index of ancient Debottar and Amruta Manohi endowments.
   - Comprehensive asset cards, property parameters (Khata, Plot, Kisam, Area), and inspection histories.
   - One-click official PDF dossiers (`generateSingleAssetPdf`) and UTF-8 encoded registry CSV downloads.

3. **Historical Document Digitization & Multilingual OCR**
   - Archival ledger viewer with image contrast enhancement, binarization, and dual-language OCR support (English and Odia script).
   - Human-in-the-loop audit process ensuring automated extractions require reviewer authorization before acceptance.

4. **Field Verification & Discrepancy Reporting**
   - GPS coordinate capture and accuracy tracking for on-site revenue inspectors.
   - Categorized reporting for physical discrepancies, unauthorized developments, or boundary markers.

5. **Role-Based Administration & Security**
   - Dedicated administration login portal (`/admin`) with multi-factor security simulation.
   - Granular roles: **Administrator** (Endowment Commissioner), **Reviewer** (Tahasil Revenue Officer), and **Data Entry Operator**.

---

## Technical Architecture

- **Frontend**: React 19, TypeScript, Leaflet.js, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node 22 native SQLite persistent storage (`khetra.db`), Express.js REST API with Vite middlewares.
- **Multimodal AI**: Google GenAI SDK with Search Grounding, Maps Grounding, Gemini 4 Argon High Thinking, and image synthesis.
- **Reports & Exports**: jsPDF for official dossier generation with bilingual Odia text handling.

---



---

## Governance & Disclaimer

*Demonstration Platform Only*: Sample property records, documents, geographic locations, and illustrative parcel boundaries are prepared for technological demonstration and evaluation purposes (OSFIC 2026). They do not constitute official legal title or cadastral survey determinations.
