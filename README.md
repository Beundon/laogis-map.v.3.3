# 🇱🇦 Laos GIS Mapper

> **Cross-platform GIS mapping application exclusively designed for the Lao People's Democratic Republic (Lao PDR)**

A Progressive Web App (PWA) with intelligent automatic regional detection, UTM coordinate conversion, precision measurement tools, GPS track recording, and point marking — all locked to operate **only within Laos national boundaries**.

---

## 📋 Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Data Formats](#data-formats)
- [Offline Support](#offline-support)
- [Laos Geo-Fence](#laos-geo-fence)
- [Mobile Installation](#mobile-installation)
- [API & Coordinate Systems](#api--coordinate-systems)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## ✨ Features

### 🎯 Automatic Laos Detection
- **GPS Bounding Box Detection**: Automatically verifies if device coordinates fall within Laos (13.9°N–22.5°N, 100.1°E–107.7°E)
- **UTM Zone Auto-Selection**: 
  - **Zone 48N (EPSG:32648)** — default for eastern Laos (Vientiane, Luang Prabang, Pakse)
  - **Zone 47N (EPSG:32647)** — auto-switch for western Laos (Bokeo, Sayabouly) west of 102°E
- **Coordinate System Lock**: App enforces Laos-only operation via real-time geo-fencing

### 🗺️ Mapping & Basemaps
- **Default**: OpenTopoMap (contour lines for Lao terrain)
- **Alternatives**: OpenStreetMap, Esri Satellite, CyclOSM Terrain
- **GPS Live Position**: Real-time marker with accuracy circle
- **Compass Widget**: Heading direction indicator (top-right)

### 📍 Point Marking & Survey
- Click any location to save survey points with:
  - **Name** & **Description**
  - **Category**: Survey Point, Boundary, Landmark, Village, Forest, Agriculture, Water, Road
  - **Elevation** (auto-filled from GPS)
  - **UTM Easting/Northing** (auto-calculated)
  - **UTM Zone** (auto-detected)
  - **Custom Tags**
- **Persistent Storage**: Saved to browser `localStorage`
- **Export**: All points as CSV with full coordinate data

### 🛤️ GPS Track Recording
- **Start/Stop/Pause** track recording
- **Live Stats**: Distance, Duration, Points, Elevation Gain/Loss, Max/Min Elevation
- **Export Formats**:
  - **GPX** — compatible with Garmin, Strava, QGIS
  - **CSV** — spreadsheet with Lat/Lon/Elev/UTM columns
- **Visual Track**: Orange polyline drawn in real-time on map

### 📏 Precision Measurement
- **Distance Tool**: Multi-segment line measurement
  - Output: Meters (m) and Kilometers (km)
  - Per-segment breakdown
- **Area Tool**: Polygon area measurement
  - Output: Square Meters (m²), Hectares (ha), Square Kilometers (km²), **Rai (ไร่)**
- **Minimize Panel**: Measurement panels can be collapsed during use

### 📁 GIS File Import
Drag-and-drop support for:
| Format | Extensions | Notes |
|--------|-----------|-------|
| Shapefile | `.shp`, `.shx`, `.dbf`, `.prj` | Zipped or multi-file |
| KML/KMZ | `.kml`, `.kmz` | Google Earth compatible |
| GPX | `.gpx` | GPS tracks & waypoints |
| GeoJSON | `.json`, `.geojson` | Standard web format |
| GeoPackage | `.gpkg` | SQLite-based spatial |
| CSV | `.csv` | Auto-detects Lao field names (Easting/Northing, Lat/Lon, X/Y) |

### 💾 Offline Support (PWA)
- **Service Worker** caches app assets for offline use
- **IndexedDB / localStorage** for data persistence
- **Installable**: Add to Home Screen on iOS/Android
- **Works without internet** after first load (previously viewed map tiles cached)

---

## 📸 Screenshots

| Clean Map View | Field HUD | Measurement Panel |
|---|---|---|
| OpenTopoMap basemap centered on Laos | Live DD + UTM coordinates, elevation, compass | Distance/Area with minimize button |

| Track Recording | Point Marking Form | Saved Points List |
|---|---|---|
| Live stats + Export GPX/CSV | Name, Category, Elevation, UTM, Tags | Export all, zoom-to, clear |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Laos GIS Mapper (PWA)                     │
├─────────────────────────────────────────────────────────────┤
│  UI Layer:     HTML5 + CSS3 + Vanilla JS (no build step)    │
│  Map Engine:   Leaflet 1.9.4 + Proj4js 2.9.0                │
│  Geodesic:     Turf.js 6.5.0                                │
│  Storage:      localStorage + Service Worker Cache          │
│  PWA:          Web App Manifest + Service Worker            │
└─────────────────────────────────────────────────────────────┘
```

**No build tools required** — pure static HTML/CSS/JS that runs directly in any modern browser.

---

## 📁 File Structure

```
laos-gis-mapper/
├── index.html              ← Main application (single file, ~50KB)
├── manifest.json           ← PWA manifest (icons, theme, display mode)
├── service-worker.js       ← Offline caching & background sync
├── favicon.svg             ← Browser tab icon
├── icons/
│   └── icon.svg            ← Home screen / install icon
└── README.md               ← This file
```

> **Note**: The `index.html` is self-contained. All dependencies (Leaflet, Turf, Proj4) are loaded via CDN.

---

## 🚀 Quick Start

### Option 1: Open Directly (No Setup)
1. Download the latest release ZIP
2. Extract and open `index.html` in any browser
3. Allow GPS/location access when prompted

### Option 2: Deploy to GitHub Pages (Recommended)

```bash
# 1. Fork or create a new GitHub repository
# 2. Upload all files to the repository root
# 3. Enable GitHub Pages:
#    Settings → Pages → Source: Deploy from a branch → main / (root)
# 4. Visit: https://YOUR_USERNAME.github.io/laos-gis-mapper/
```

### Option 3: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Then open: http://localhost:8000
```

---

## 📱 Mobile Installation

### iPhone (Safari)
1. Open the app URL in Safari
2. Tap **Share** (⬆️) → **"Add to Home Screen"**
3. Tap **Add** — app icon appears on home screen
4. Launches in full-screen mode, no browser chrome

### Android (Chrome)
1. Open the app URL in Chrome
2. Tap **Menu (⋮)** → **"Add to Home Screen"** or **"Install App"**
3. App installs as standalone PWA

### After Install
- Works **offline** for previously viewed map areas
- GPS tracking continues in background
- Data persists between sessions via `localStorage`

---

## 📖 Usage Guide

### 1. Default View
When you open the app:
- Map centers on **Laos** (18.0°N, 103.0°E)
- **OpenTopoMap** loads as default basemap
- **UTM Zone badge** shows at top (47N or 48N)
- **Field HUD** shows live coordinates at bottom
- **Compass** shows heading at top-right

### 2. Mark a Survey Point
1. Click **📍 Mark Point** in toolbar
2. Click on map where you want to mark
3. Fill the form:
   - Name, Description, Category
   - Elevation, Easting, Northing, UTM Zone (auto-filled)
   - Custom tags
4. Click **💾 Save Point**
5. Purple marker appears — tap it to see details

### 3. Record a GPS Track
1. Click **🛤️ Track** in toolbar
2. Click **🔴 Start Recording**
3. Walk or drive — orange line traces your path
4. Watch live stats: distance, elevation gain
5. Click **⏹️ Stop** when done
6. Export as **GPX** (for Garmin) or **CSV** (for Excel)

### 4. Measure Distance
1. Click **📏 Distance**
2. Click multiple points on map
3. See live total in meters/kilometers
4. Double-click to finish
5. Panel shows per-segment breakdown

### 5. Measure Area
1. Click **📐 Area**
2. Click vertices to draw a polygon
3. See area in m², ha, km², and **Rai (ไร่)**
4. Double-click to close polygon

### 6. Import GIS Files
1. Click **📁 Import**
2. Drag & drop files or click to browse
3. Supported: SHP, KML, KMZ, GPX, GeoJSON, CSV, GeoPackage
4. Imported layers appear on map and in Layer Manager

### 7. View Saved Points
1. Click **📌 Saved Points**
2. See list of all marked points
3. Click any point to **zoom to it**
4. Click **📤 Export All** to download CSV
5. Click **🗑️ Clear All** to delete all

---

## 📊 Data Formats

### Export: Saved Points CSV
```csv
ID,Name,Description,Category,Latitude,Longitude,Elevation,Easting,Northing,UTM Zone,Tags,Saved At
1718901234567,"Village Boundary","North edge of Ban Nongping","boundary",20.123456,101.987654,452.3,812034.56,2290748.17,"UTM Zone 48N","village,boundary,2026",2026-06-20T12:34:56.789Z
```

### Export: Track GPX
```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1">
  <trk>
    <name>Laos-GIS-Track-2026-06-20</name>
    <trkseg>
      <trkpt lat="18.1234567" lon="102.9876543">
        <ele>452.5</ele>
        <time>2026-06-20T12:00:00Z</time>
      </trkpt>
    </trkseg>
  </trk>
</gpx>
```

### Import: CSV Auto-Detection
The app automatically detects these column names in CSV files:
- **Lat/Lon**: `lat`, `latitude`, `lon`, `lng`, `longitude`
- **UTM**: `easting`, `northing`, `x`, `y`, `utm_e`, `utm_n`
- **Lao language**: `ລະຕິຈູດ`, `ລອງຈິຈູດ`, `ຕາເວັນອອກ`, `ຕາເວັນຕົກ`

---

## 🔒 Laos Geo-Fence

The app enforces a **strict geographic boundary**:

| Boundary | Value |
|----------|-------|
| North | 22.5°N |
| South | 13.9°N |
| East | 107.7°E |
| West | 100.1°E |

**Behavior:**
- ✅ **Inside Laos**: Full app functionality
- ❌ **Outside Laos**: Complete lock screen with "Outside Laos Territory" message
- 🔄 **Recheck**: Tap "Recheck Position" to retry if you move into Laos
- 🔴 **Auto-stop**: Active track recording stops immediately if you exit Laos

> This ensures the app is used exclusively for surveying and mapping within Lao PDR territory.

---

## 🌐 Offline Support

| Feature | Online Required | Offline Capable |
|---------|----------------|-----------------|
| Map viewing (cached tiles) | First view only | ✅ Yes |
| GPS tracking | ❌ No | ✅ Yes |
| Point marking | ❌ No | ✅ Yes |
| Distance/Area measurement | ❌ No | ✅ Yes |
| Saved data access | ❌ No | ✅ Yes |
| File import | ❌ No | ✅ Yes (local files) |
| Export GPX/CSV | ❌ No | ✅ Yes |
| Basemap switching | ❌ No | ⚠️ Cached tiles only |

---

## 🛠️ API & Coordinate Systems

### Supported Coordinate Systems
| System | EPSG | Coverage |
|--------|------|----------|
| WGS 84 (Decimal Degrees) | EPSG:4326 | Global |
| UTM Zone 47N | EPSG:32647 | Western Laos (Bokeo, Sayabouly) |
| UTM Zone 48N | EPSG:32648 | Eastern Laos (Vientiane, Luang Prabang, Pakse) |

### Auto-Switch Logic
```
If longitude < 102.0°E → UTM Zone 47N
If longitude ≥ 102.0°E → UTM Zone 48N
```

### Distance Calculation
- **Haversine formula** for 2D ground distance
- **Elevation-corrected 3D distance** when GPS elevation available

### Area Calculation
- **Turf.js geodesic area** for accurate polygon measurement on Earth's surface
- **Planar fallback** (shoelace formula) for offline use

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Outside Laos Territory" lock | Ensure GPS is enabled and you're physically within Laos. Tap "Recheck Position" |
| Map not loading | Check internet connection for first load. CDN links must be accessible |
| GPS not accurate | Enable "High Accuracy" mode in phone settings. Wait for better satellite lock |
| Compass not rotating | Compass needs GPS heading data. Walk a few meters to activate |
| Install prompt not showing | Visit the site twice within 5 minutes, or use "Add to Home Screen" manually |
| Saved points lost | Points are stored in browser localStorage. Don't clear browser data |
| Track export fails | Ensure track has at least 2 points before exporting |
| Measurement panel won't minimize | Click the ▼ button in the panel header |

---

## 🗺️ Laos Coverage Map

```
     100.1°E                              107.7°E
        ┌────────────────────────────────────┐
  22.5°N│  ████  Luang Namtha               │
        │  ████  Oudomxay    Luang Prabang  │
        │  ████  Sayabouly   ████████████   │
        │  ████  Bokeo       ████  Xieng   │
  18.0°N│  ████  █████████  ████  Khouang │ ← Center
        │  Vientiane  ████  ████  Vientiane│
        │  ████  Khammouane  ████  Bolikh  │
        │  ████  Savannakhet ████  Phongs  │
  13.9°N│  ████  Champasak   Pakse  Attapeu│
        └────────────────────────────────────┘

        UTM 47N ←─── 102°E ───→ UTM 48N
```

---

## 🤝 Contributing

This project is designed specifically for use in Lao PDR. Contributions welcome for:
- Lao language localization
- Additional basemap sources
- Enhanced offline tile caching
- Integration with Lao national spatial data infrastructure

---

## 📜 License

**MIT License**

Copyright (c) 2026 Laos GIS Mapper Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

---

## 🙏 Acknowledgments

- **OpenStreetMap** & **OpenTopoMap** contributors for basemap data
- **Leaflet** team for the mapping library
- **Proj4js** for coordinate transformation
- **Turf.js** for geodesic calculations
- **Lao PDR** — for whom this app is built

---

> **🇱🇦 Built for Laos. Works in Laos. Locked to Laos.**
