import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Compass,
  Layers,
  Search,
  Filter,
  Sliders,
  MapPin,
  ExternalLink,
  Download,
  Eye,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  RefreshCw,
  Info,
} from 'lucide-react';
import { AssetRecord, Institution } from '../types';
import { demoInstitutions, demoAssets, DEMO_PROVENANCE_LABEL } from '../data/demoData';
import { generateSingleAssetPdf, generateRegistrySummaryPdf } from '../utils/pdfExport';
import { sqMetersToUnits, validateGeoJsonPolygon } from '../utils/gis';

interface GisExplorerProps {
  onSelectAsset: (asset: AssetRecord) => void;
  onNavigate: (view: any) => void;
}

export const GisExplorer: React.FC<GisExplorerProps> = ({ onSelectAsset, onNavigate }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Data states
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Independent Filters
  const [selectedInstId, setSelectedInstId] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedTahasil, setSelectedTahasil] = useState<string>('ALL');
  const [selectedMouza, setSelectedMouza] = useState<string>('ALL');
  const [selectedVerificationStatus, setSelectedVerificationStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Map Controls - Satellite + Labels is the required initial default
  const [basemap, setBasemap] = useState<'satellite_labels' | 'satellite' | 'streets'>('satellite_labels');
  const [tileNotice, setTileNotice] = useState<string | null>(null);
  const [polygonOpacity, setPolygonOpacity] = useState<number>(55);
  const [sidebarTab, setSidebarTab] = useState<'list' | 'detail'>('list');

  // Robust data loader with fallback to bundled demonstration dataset
  const loadData = async (isRetry = false) => {
    if (isRetry) {
      setRetrying(true);
    } else {
      setLoading(true);
    }

    let loadedInstitutions: Institution[] | null = null;
    let loadedAssets: AssetRecord[] | null = null;
    let fallbackNeeded = false;

    try {
      const [instRes, assetRes] = await Promise.all([
        fetch('/api/institutions').catch(() => null),
        fetch('/api/assets').catch(() => null),
      ]);

      if (instRes && instRes.ok && instRes.headers.get('content-type')?.includes('application/json')) {
        const instData = await instRes.json();
        if (Array.isArray(instData) && instData.length > 0) {
          loadedInstitutions = instData;
        }
      }

      if (assetRes && assetRes.ok && assetRes.headers.get('content-type')?.includes('application/json')) {
        const assetData = await assetRes.json();
        if (Array.isArray(assetData) && assetData.length > 0) {
          loadedAssets = assetData;
        }
      }

      if (!loadedInstitutions || !loadedAssets) {
        fallbackNeeded = true;
      }
    } catch (err) {
      console.warn('[ODISAR] API unavailable, using bundled demonstration cadastre:', err);
      fallbackNeeded = true;
    }

    if (fallbackNeeded || !loadedInstitutions || !loadedAssets) {
      setInstitutions(demoInstitutions);
      setAssets(demoAssets);
      setIsDemoMode(true);
    } else {
      setInstitutions(loadedInstitutions);
      setAssets(loadedAssets);
      setIsDemoMode(false);
    }

    setLoading(false);
    setRetrying(false);
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Filter Hierarchy calculations
  const availableDistricts = Array.from(new Set(assets.map((a) => a.district))).sort();
  const availableTahasils = Array.from(
    new Set(
      assets
        .filter((a) => selectedDistrict === 'ALL' || a.district === selectedDistrict)
        .map((a) => a.tahasil)
    )
  ).sort();
  const availableMouzas = Array.from(
    new Set(
      assets
        .filter(
          (a) =>
            (selectedDistrict === 'ALL' || a.district === selectedDistrict) &&
            (selectedTahasil === 'ALL' || a.tahasil === selectedTahasil)
        )
        .map((a) => a.mouza)
    )
  ).sort();

  // Reset dependent filters if invalid
  const handleDistrictChange = (d: string) => {
    setSelectedDistrict(d);
    setSelectedTahasil('ALL');
    setSelectedMouza('ALL');
  };
  const handleTahasilChange = (t: string) => {
    setSelectedTahasil(t);
    setSelectedMouza('ALL');
  };

  // Filtered Assets list
  const filteredAssets = assets.filter((asset) => {
    if (selectedInstId !== 'ALL' && asset.institution_id !== selectedInstId) return false;
    if (selectedDistrict !== 'ALL' && asset.district !== selectedDistrict) return false;
    if (selectedTahasil !== 'ALL' && asset.tahasil !== selectedTahasil) return false;
    if (selectedMouza !== 'ALL' && asset.mouza !== selectedMouza) return false;
    if (selectedVerificationStatus !== 'ALL' && asset.verification_status !== selectedVerificationStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = asset.title.toLowerCase().includes(q);
      const matchId = asset.id.toLowerCase().includes(q);
      const matchKhata = asset.khata_no.toLowerCase().includes(q);
      const matchPlot = asset.plot_no.toLowerCase().includes(q);
      const matchMouza = asset.mouza.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchKhata && !matchPlot && !matchMouza) return false;
    }
    return true;
  });

  // Color coding by verification status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return '#65745B'; // Muted sage green
      case 'Verification Pending':
        return '#C6A15B'; // Antique gold
      case 'Discrepancy Reported':
        return '#c026d3'; // Magenta/crimson
      case 'Needs Further Review':
        return '#e11d48'; // Deep red
      default:
        return '#854d0e'; // Bronze
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center near Bhubaneswar/Puri corridor (Odisha)
    const map = L.map(mapContainerRef.current, {
      center: [20.15, 85.82],
      zoom: 11,
      zoomControl: true,
    });

    mapInstanceRef.current = map;
    geojsonLayerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Layer — Three options with Satellite + Labels as default
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers while strictly preserving GeoJSON polygons and markers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    setTileNotice(null);

    if (basemap === 'satellite_labels') {
      // 1. Satellite + Labels (Default)
      // Base Satellite Imagery (Esri World Imagery)
      const baseImagery = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 19,
        }
      );

      // Reference Places & Boundaries Overlay (Labels rendered above imagery)
      const referenceLabels = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Labels &copy; Esri',
          maxZoom: 19,
        }
      );

      baseImagery.on('tileerror', () => {
        setTileNotice('Satellite imagery tile server latency. Reconnecting to primary imagery cache; parcel geometries remain intact.');
      });
      baseImagery.on('tileload', () => {
        setTileNotice(null);
      });

      baseImagery.addTo(map);
      referenceLabels.addTo(map);
    } else if (basemap === 'satellite') {
      // 2. Satellite (Imagery only — no reference labels overlay)
      const baseImagery = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 19,
        }
      );

      baseImagery.on('tileerror', () => {
        setTileNotice('Satellite imagery tile server latency. Reconnecting to primary imagery cache; parcel geometries remain intact.');
      });
      baseImagery.on('tileload', () => {
        setTileNotice(null);
      });

      baseImagery.addTo(map);
    } else {
      // 3. Street Map (OpenStreetMap)
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });

      streetLayer.on('tileerror', () => {
        setTileNotice('Street map tile server response delayed. Retrying connection; parcel geometries remain intact.');
      });
      streetLayer.on('tileload', () => {
        setTileNotice(null);
      });

      streetLayer.addTo(map);
    }
  }, [basemap]);

  // Update GeoJSON Polygons on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = geojsonLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const bounds = L.latLngBounds([]);

    filteredAssets.forEach((asset) => {
      const color = getStatusColor(asset.verification_status);
      const isSelected = selectedAsset?.id === asset.id;

      try {
        const isPolygonValid = validateGeoJsonPolygon(asset.geometry);

        const popupContent = `
          <div style="font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.4;">
            <div style="font-weight: bold; color: #C6A15B; font-size: 13px; margin-bottom: 2px;">
              ${asset.title}
            </div>
            <div style="color: #D8C5A3; font-size: 11px; margin-bottom: 6px;">
              ${asset.id} • ${asset.mouza}, ${asset.district}
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Khata/Plot:</strong> ${asset.khata_no} / ${asset.plot_no}<br/>
              <strong>Kisam:</strong> ${asset.kisam}<br/>
              <strong>Recorded Area:</strong> ${asset.recorded_area} ${asset.area_unit} (${asset.normalized_acres} Acres)
            </div>
            <div style="margin-top: 6px; padding: 2px 6px; display: inline-block; border-radius: 4px; background: rgba(198,161,91,0.2); color: #F1E5CC; font-size: 10px; font-weight: bold;">
              ${asset.verification_status}
            </div>
          </div>
        `;

        if (isPolygonValid) {
          const polygon = L.geoJSON(asset.geometry as any, {
            style: {
              color: isSelected ? '#ffffff' : color,
              weight: isSelected ? 3.5 : 2,
              opacity: 0.95,
              fillColor: color,
              fillOpacity: polygonOpacity / 100,
            },
          });

          polygon.bindPopup(popupContent);
          polygon.on('click', () => {
            handleSelectAssetInList(asset);
          });
          layerGroup.addLayer(polygon);

          if (asset.geometry.coordinates?.[0]) {
            asset.geometry.coordinates[0].forEach(([lng, lat]) => {
              bounds.extend([lat, lng]);
            });
          }
        }

        // Add Marker at centroid (always displayed and clickable)
        const marker = L.circleMarker([asset.lat, asset.lng], {
          radius: isSelected ? 7 : 5,
          color: isSelected ? '#ffffff' : '#F1E5CC',
          fillColor: color,
          fillOpacity: 1,
          weight: isSelected ? 2.5 : 1.5,
        });

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          handleSelectAssetInList(asset);
        });

        layerGroup.addLayer(marker);
        bounds.extend([asset.lat, asset.lng]);
      } catch (err) {
        console.error('Failed to render parcel GeoJSON:', err);
      }
    });

    if (filteredAssets.length > 0 && bounds.isValid() && !selectedAsset) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [filteredAssets, selectedAsset, polygonOpacity]);

  // Fit bounds or fly to selected asset on map
  const handleSelectAssetInList = (asset: AssetRecord) => {
    setSelectedAsset(asset);
    setSidebarTab('detail');
    const map = mapInstanceRef.current;
    if (map) {
      if (asset.geometry?.coordinates?.[0]?.length > 0) {
        const polyBounds = L.latLngBounds([]);
        asset.geometry.coordinates[0].forEach(([lng, lat]) => {
          polyBounds.extend([lat, lng]);
        });
        if (polyBounds.isValid()) {
          map.fitBounds(polyBounds, { padding: [60, 60], maxZoom: 17 });
          return;
        }
      }
      map.flyTo([asset.lat, asset.lng], 16, { duration: 1.2 });
    }
  };

  const handleResetFilters = () => {
    setSelectedInstId('ALL');
    setSelectedDistrict('ALL');
    setSelectedTahasil('ALL');
    setSelectedMouza('ALL');
    setSelectedVerificationStatus('ALL');
    setSearchQuery('');
    setSelectedAsset(null);
  };

  // Client-safe CSV download that works in Demo / static mode without 404
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Title',
      'Institution',
      'District',
      'Tahasil',
      'Mouza',
      'Khata No',
      'Plot No',
      'Kisam',
      'Recorded Area',
      'Area Unit',
      'Normalized Acres',
      'Latitude',
      'Longitude',
      'Verification Status',
      'Review Status',
    ];
    const rows = filteredAssets.map((a) => [
      `"${a.id}"`,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.institution_id}"`,
      `"${a.district}"`,
      `"${a.tahasil}"`,
      `"${a.mouza}"`,
      `"${a.khata_no}"`,
      `"${a.plot_no}"`,
      `"${a.kisam.replace(/"/g, '""')}"`,
      a.recorded_area,
      `"${a.area_unit}"`,
      a.normalized_acres,
      a.lat,
      a.lng,
      `"${a.verification_status}"`,
      `"${a.review_status}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `odisar_parcels_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col bg-[#1A1411] text-[#F1E5CC] overflow-hidden">
      {/* Top Filter Bar */}
      <div className="bg-[#201814] border-b border-[#C6A15B]/25 px-4 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Filter Dropdowns - Independent Institution & Geographic Selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Institution Context Filter */}
            <div className="flex items-center gap-1.5 bg-[#251D18] px-2.5 py-1.5 rounded-md border border-[#C6A15B]/30">
              <span className="text-[#C6A15B] font-bold uppercase text-[10px]">Institution:</span>
              <select
                value={selectedInstId}
                onChange={(e) => setSelectedInstId(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#251D18]">All Institutions</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id} className="bg-[#251D18]">
                    {inst.name.split(' ')[0]} {inst.name.split(' ')[1]} ({inst.district})
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div className="flex items-center gap-1.5 bg-[#251D18] px-2.5 py-1.5 rounded-md border border-[#C6A15B]/30">
              <span className="text-[#C6A15B] font-bold uppercase text-[10px]">District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#251D18]">All Districts</option>
                {availableDistricts.map((d) => (
                  <option key={d} value={d} className="bg-[#251D18]">{d}</option>
                ))}
              </select>
            </div>

            {/* Tahasil Filter */}
            <div className="flex items-center gap-1.5 bg-[#251D18] px-2.5 py-1.5 rounded-md border border-[#C6A15B]/30">
              <span className="text-[#C6A15B] font-bold uppercase text-[10px]">Tahasil:</span>
              <select
                value={selectedTahasil}
                onChange={(e) => handleTahasilChange(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#251D18]">All Tahasils</option>
                {availableTahasils.map((t) => (
                  <option key={t} value={t} className="bg-[#251D18]">{t}</option>
                ))}
              </select>
            </div>

            {/* Mouza Filter */}
            <div className="flex items-center gap-1.5 bg-[#251D18] px-2.5 py-1.5 rounded-md border border-[#C6A15B]/30">
              <span className="text-[#C6A15B] font-bold uppercase text-[10px]">Mouza:</span>
              <select
                value={selectedMouza}
                onChange={(e) => setSelectedMouza(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#251D18]">All Mouzas</option>
                {availableMouzas.map((m) => (
                  <option key={m} value={m} className="bg-[#251D18]">{m}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-[#251D18] px-2.5 py-1.5 rounded-md border border-[#C6A15B]/30">
              <span className="text-[#C6A15B] font-bold uppercase text-[10px]">Status:</span>
              <select
                value={selectedVerificationStatus}
                onChange={(e) => setSelectedVerificationStatus(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#251D18]">All Statuses</option>
                <option value="Verified" className="bg-[#251D18]">Verified</option>
                <option value="Verification Pending" className="bg-[#251D18]">Pending</option>
                <option value="Discrepancy Reported" className="bg-[#251D18]">Discrepancy</option>
                <option value="Needs Further Review" className="bg-[#251D18]">Needs Review</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="p-1.5 rounded-md bg-[#251D18] hover:bg-[#382b22] text-[#D8C5A3] border border-[#C6A15B]/30 flex items-center gap-1 text-[11px]"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Search & Export Actions */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#D8C5A3]/60" />
              <input
                type="text"
                placeholder="Search Plot, Khata, Mouza..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 rounded bg-[#251D18] border border-[#C6A15B]/30 text-xs text-white placeholder-[#D8C5A3]/50 focus:outline-none focus:border-[#C6A15B] w-48"
              />
            </div>

            <button
              onClick={() => generateRegistrySummaryPdf(filteredAssets, 'Filtered GIS Parcels')}
              className="px-2.5 py-1 rounded bg-[#5B1F24] text-[#F1E5CC] border border-[#C6A15B]/40 hover:bg-[#72272e] text-xs font-semibold flex items-center gap-1 transition-all"
              title="Generate genuine PDF report"
            >
              <Download className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-2.5 py-1 rounded bg-[#251D18] text-[#C6A15B] border border-[#C6A15B]/40 hover:bg-[#352920] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              title="Download UTF-8 CSV with Odia script"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demo Mode Notice Banner — Displayed clearly when running offline or static */}
      {isDemoMode && (
        <div className="bg-[#5B1F24] border-b border-[#C6A15B]/40 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 text-[#F1E5CC] shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#C6A15B] shrink-0" />
            <span className="text-[12px]">
              <strong className="text-white font-semibold">Demo Mode — Backend unavailable.</strong> Sample data only; changes are not synchronized to the server.
            </span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-[11px] text-[#D8C5A3]/80 italic hidden lg:inline">
              {DEMO_PROVENANCE_LABEL}
            </span>
            <button
              onClick={() => loadData(true)}
              disabled={retrying}
              className="px-3 py-1 rounded bg-[#251D18] hover:bg-[#382b22] border border-[#C6A15B]/40 text-[#C6A15B] font-semibold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Test connection to Express backend server"
            >
              <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin text-[#C6A15B]' : 'text-[#C6A15B]'}`} />
              <span>{retrying ? 'Connecting...' : 'Retry Connection'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace (Map + Sidebar) */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        {/* Leaflet Map Container */}
        <div className="flex-1 relative h-full">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Floating Map Controls Panel (Basemap + Opacity) */}
          <div className="absolute top-4 right-4 z-[400] bg-[#251D18]/90 backdrop-blur-md p-3.5 rounded-xl border border-[#C6A15B]/40 shadow-2xl space-y-3 w-64 max-w-[calc(100vw-2rem)]">
            <div className="flex items-center justify-between text-xs font-bold text-[#C6A15B] uppercase border-b border-[#C6A15B]/20 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>GIS Basemap</span>
              </div>
              <span className="text-[9px] font-mono text-[#D8C5A3]/60">WGS84</span>
            </div>

            {/* Basemap Switch — 3 Required Options */}
            <div className="flex flex-col gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setBasemap('satellite_labels')}
                className={`w-full py-2 px-2.5 rounded-lg font-medium text-left transition-all flex items-center justify-between border ${
                  basemap === 'satellite_labels'
                    ? 'bg-[#5B1F24] text-[#F1E5CC] border-[#C6A15B] shadow-sm font-semibold'
                    : 'bg-[#1c1511] text-[#D8C5A3]/80 border-transparent hover:border-[#C6A15B]/30 hover:text-white'
                }`}
              >
                <span>Satellite + Labels</span>
                {basemap === 'satellite_labels' && (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#C6A15B] text-[#251D18]">
                    Default
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setBasemap('satellite')}
                className={`w-full py-2 px-2.5 rounded-lg font-medium text-left transition-all flex items-center justify-between border ${
                  basemap === 'satellite'
                    ? 'bg-[#5B1F24] text-[#F1E5CC] border-[#C6A15B] shadow-sm font-semibold'
                    : 'bg-[#1c1511] text-[#D8C5A3]/80 border-transparent hover:border-[#C6A15B]/30 hover:text-white'
                }`}
              >
                <span>Satellite</span>
                <span className="text-[10px] text-[#D8C5A3]/50">No labels</span>
              </button>

              <button
                type="button"
                onClick={() => setBasemap('streets')}
                className={`w-full py-2 px-2.5 rounded-lg font-medium text-left transition-all flex items-center justify-between border ${
                  basemap === 'streets'
                    ? 'bg-[#5B1F24] text-[#F1E5CC] border-[#C6A15B] shadow-sm font-semibold'
                    : 'bg-[#1c1511] text-[#D8C5A3]/80 border-transparent hover:border-[#C6A15B]/30 hover:text-white'
                }`}
              >
                <span>Street Map</span>
                <span className="text-[10px] text-[#D8C5A3]/50">OpenStreetMap</span>
              </button>
            </div>

            {/* Tile Error / Notice Advisory */}
            {tileNotice && (
              <div className="p-2 rounded bg-amber-950/80 border border-amber-600/40 text-[10px] text-amber-200 leading-snug">
                {tileNotice}
              </div>
            )}

            {/* Polygon Opacity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#D8C5A3]/80">
                <span>Parcel Fill Opacity:</span>
                <span className="font-bold text-[#C6A15B]">{polygonOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={polygonOpacity}
                onChange={(e) => setPolygonOpacity(Number(e.target.value))}
                className="w-full accent-[#C6A15B] cursor-pointer"
              />
            </div>

            {/* Legend */}
            <div className="space-y-1 pt-1 border-t border-[#C6A15B]/20 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#65745B]"></span>
                <span className="text-[#D8C5A3]">Verified Possession</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C6A15B]"></span>
                <span className="text-[#D8C5A3]">Verification Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c026d3]"></span>
                <span className="text-[#D8C5A3]">Discrepancy Reported</span>
              </div>
            </div>
          </div>

          {/* Demonstration Notice Watermark */}
          <div className="absolute bottom-6 left-4 z-[400] bg-[#251D18]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#C6A15B]/40 text-[10px] text-[#D8C5A3] shadow-md max-w-sm pointer-events-none">
            <span className="text-[#C6A15B] font-bold block">Demonstration GIS Registry</span>
            Parcel polygons are illustrative representations for OSFIC 2026. Satellite imagery does not constitute legal title.
          </div>
        </div>

        {/* Right Sidebar (List or Detail Inspector) */}
        <div className="w-full md:w-96 bg-[#201814] border-l border-[#C6A15B]/25 flex flex-col h-1/2 md:h-full shrink-0">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-[#C6A15B]/20 bg-[#1c1511]">
            <button
              onClick={() => setSidebarTab('list')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                sidebarTab === 'list'
                  ? 'border-[#C6A15B] text-[#C6A15B] bg-[#251D18]'
                  : 'border-transparent text-[#D8C5A3]/60 hover:text-white'
              }`}
            >
              Parcels ({filteredAssets.length})
            </button>
            <button
              onClick={() => setSidebarTab('detail')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                sidebarTab === 'detail'
                  ? 'border-[#C6A15B] text-[#C6A15B] bg-[#251D18]'
                  : 'border-transparent text-[#D8C5A3]/60 hover:text-white'
              }`}
            >
              Inspector {selectedAsset ? `(${selectedAsset.id})` : ''}
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sidebarTab === 'list' ? (
              <>
                <div className="text-[11px] text-[#D8C5A3]/60 flex items-center justify-between pb-1">
                  <span>Displaying matching parcels</span>
                  <span className="text-[#C6A15B] font-semibold">{filteredAssets.length} found</span>
                </div>

                {filteredAssets.length === 0 ? (
                  <div className="text-center py-10 space-y-2 text-xs text-[#D8C5A3]/60">
                    <p>No parcels found matching the active filters.</p>
                    <button
                      onClick={handleResetFilters}
                      className="text-[#C6A15B] underline cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  filteredAssets.map((asset) => {
                    const isSelected = selectedAsset?.id === asset.id;
                    const statusColor = getStatusColor(asset.verification_status);
                    return (
                      <div
                        key={asset.id}
                        onClick={() => handleSelectAssetInList(asset)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? 'bg-[#5B1F24]/40 border-[#C6A15B] shadow-md'
                            : 'bg-[#251D18] border-[#C6A15B]/20 hover:border-[#C6A15B]/50 hover:bg-[#2b211a]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-[#C6A15B]">
                            {asset.id}
                          </span>
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase"
                            style={{
                              backgroundColor: `${statusColor}25`,
                              color: statusColor,
                              border: `1px solid ${statusColor}50`,
                            }}
                          >
                            {asset.verification_status}
                          </span>
                        </div>

                        <h4 className="font-heading text-xs font-bold text-white line-clamp-1">
                          {asset.title}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] text-[#D8C5A3]/80">
                          <span>
                            {asset.mouza}, {asset.district}
                          </span>
                          <span className="font-medium text-[#C6A15B]">
                            {asset.recorded_area} {asset.area_unit}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#D8C5A3]/60 border-t border-[#C6A15B]/10 pt-1">
                          <span>Plot: {asset.plot_no} | Khata: {asset.khata_no}</span>
                          <span className="italic">{asset.kisam.split(' ')[0]}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            ) : selectedAsset ? (
              /* Selected Asset Detail Inspector */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#C6A15B]/20 pb-2">
                  <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider">
                    {selectedAsset.id}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#5B1F24] text-[#C6A15B] border border-[#C6A15B]/40 font-semibold">
                    {selectedAsset.asset_type}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading text-base font-bold text-white">
                    {selectedAsset.title}
                  </h3>
                  <p className="text-xs text-[#D8C5A3]/80 mt-0.5">
                    Institution: <strong className="text-white">{selectedAsset.institution_id}</strong>
                  </p>
                </div>

                {/* Cadastral Specs Card */}
                <div className="p-3 rounded-lg bg-[#1c1511] border border-[#C6A15B]/20 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-[#C6A15B]/10 pb-1">
                    <span className="text-[#D8C5A3]/60">District / Tahasil:</span>
                    <span className="font-medium text-white">{selectedAsset.district} / {selectedAsset.tahasil}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#C6A15B]/10 pb-1">
                    <span className="text-[#D8C5A3]/60">Mouza / Village:</span>
                    <span className="font-medium text-white">{selectedAsset.mouza}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#C6A15B]/10 pb-1">
                    <span className="text-[#D8C5A3]/60">Khata / Plot No:</span>
                    <span className="font-medium text-white">{selectedAsset.khata_no} / {selectedAsset.plot_no}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#C6A15B]/10 pb-1">
                    <span className="text-[#D8C5A3]/60">Kisam (Land Class):</span>
                    <span className="font-medium text-[#C6A15B]">{selectedAsset.kisam}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#C6A15B]/10 pb-1">
                    <span className="text-[#D8C5A3]/60">Recorded Area:</span>
                    <span className="font-bold text-white">{selectedAsset.recorded_area} {selectedAsset.area_unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#D8C5A3]/60">Normalized Acreage:</span>
                    <span className="font-bold text-[#C6A15B]">{selectedAsset.normalized_acres} Acres</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center p-2 rounded bg-[#251D18] border border-[#C6A15B]/20">
                    <span className="text-[#D8C5A3]/70">Field Status:</span>
                    <span className="font-bold text-emerald-400">{selectedAsset.verification_status}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-[#251D18] border border-[#C6A15B]/20">
                    <span className="text-[#D8C5A3]/70">Review Status:</span>
                    <span className="font-bold text-[#C6A15B]">{selectedAsset.review_status}</span>
                  </div>
                </div>

                {/* Notes */}
                {selectedAsset.notes && (
                  <div className="p-2.5 rounded bg-[#1c1511] border border-[#C6A15B]/20 text-xs text-[#D8C5A3]/90">
                    <span className="text-[10px] text-[#C6A15B] uppercase font-bold block mb-0.5">Notes</span>
                    {selectedAsset.notes}
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-[#C6A15B]/20">
                  <button
                    onClick={() => onSelectAsset(selectedAsset)}
                    className="w-full py-2.5 rounded-md bg-[#C6A15B] hover:brightness-110 text-[#251D18] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Full Asset Profile</span>
                  </button>

                  <button
                    onClick={() => generateSingleAssetPdf(selectedAsset)}
                    className="w-full py-2 rounded-md bg-[#5B1F24] hover:bg-[#72272e] text-[#F1E5CC] border border-[#C6A15B]/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Download PDF Dossier</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-[#D8C5A3]/60 space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-[#C6A15B]/40" />
                <p>Click on any parcel on the map to inspect its cadastral record.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
