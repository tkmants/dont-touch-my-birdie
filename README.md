# 🦅 Don't Touch My Birdie!
> **Developed by:** Fia Maan R. Alaano, Thomas Anthony S. Dator, Christian Aron R. Paneda, Pauleen Ann C. Rivera, Loren N. Tababan, Sean Martin Andrei V. Tabelisma

> **Discover. Collect. Protect.**
> A gamified citizen-science platform for discovering and protecting Philippine bird species through AI, geospatial mapping, and community science.

---

## 🌿 About the Project

**Don't Touch My Birdie!** transforms bird observations into actionable conservation insights. Built for the Philippines — home to over 700 bird species including 240+ endemics — the platform combines a Pokédex-style collection system, AI-powered identification, and an interactive habitat map to make bird conservation engaging and data-driven.

---

## ✨ Features

### 📖 BirdDex — Bird Collection
- Browse a catalogue of **40+ Philippine bird species** with photos, scientific names, local names, and conservation status
- Filter by status (`Common`, `Rare`, `Endangered`) or habitat (`Forest`, `Wetland`, `Coastal`)
- Search birds by common name, scientific name, or local name
- Click any bird card to open a detailed modal with fun facts, threats, and conservation info
- **Mark birds as discovered** to build your personal collection
- Progress banner showing collection completion percentage

### 🐦 Bird Profile Pages
- Full dedicated profile page for each bird (`bird-profile.html?id=<n>`)
- Hero section with high-resolution photo, badges, and population trend indicators
- Detailed sections: Fun Facts, Threats, Conservation Efforts, and Habitat Location
- Direct link to the bird's pin on the interactive map
- "Related Birds" section showing same-habitat species

### 🗺️ Interactive Habitat Map (`map.html`)
- Full-screen interactive map powered by **Leaflet.js** + OpenStreetMap, centred on the Philippines
- Colour-coded markers by conservation status (🟢 Common · 🟡 Rare · 🔴 Endangered · ⚫ Extinct · 🔵 Sighting)
- Toolbar filters: All Birds, Endangered, Rare, Common, Forest, Wetland, Coastal, Community Sightings
- **Community sighting pins** plotted from reported data
- Sidebar showing **Regional Progress** (Luzon, Mindanao, Visayas, Palawan) with discovery percentages
- Click map markers to view bird popups with photo, status badge, and quick-add to BirdDex
- URL parameter `?bird=<id>` flies the map directly to a specific bird's location

### 🤖 AI Bird Identifier (`identify.html`)
- Upload a bird photo (drag & drop, file browse, or image URL) for species identification
- Powered by two **Roboflow** computer vision models:
  - `bird-species-detector/851`
  - `birddetection-kw9nn/1`
- Displays top match with confidence score bar, conservation status badge, habitat, and region
- Lists additional possible matches with individual confidence bars
- "Add to BirdDex" button directly from identification results (+35 XP)
- Falls back to a smart demo mode when no API key is configured
- API key stored locally in the browser — never transmitted to the platform

### 📍 Report a Sighting (`report.html`)
- Submit community bird sightings with bird species, date/time, count, habitat type, and behaviour notes
- Optional photo upload with inline preview
- Interactive mini-map (Leaflet) to **pin the exact sighting location**
- **GPS button** to auto-fill your current coordinates
- Recent sightings feed showing the last 8 community reports
- Sightings are stored in `localStorage` and appear on the habitat map
- Earns **+15 XP** per submitted sighting for logged-in users

### 🏆 Achievements & Gamification (`achievements.html`)
- **XP system** — earn experience points for every action:
  - Discover a bird: **+25 XP**
  - AI identification: **+35 XP**
  - Report a sighting: **+15 XP**
  - Unlock achievement: **+50 – 1,000 XP**
  - Daily login streak bonuses
- **Level system** — level up as you accumulate XP; visual level-ring with progress percentage
- **16 achievement badges** across categories including:
  - Discovery milestones (First Sighting → Master Collector)
  - Habitat specialists (Forest Guardian, Wetland Explorer, Coastal Explorer)
  - Regional achievements (Palawan Discoverer)
  - Conservation awareness (Endangered Aware)
  - Community contributions (Field Reporter, Prolific Reporter)
  - Login streaks (Consistent Explorer, Dedicated Birder)
  - AI usage (Tech Explorer)
- Profile card showing username, total XP, birds discovered, sightings, streak, and earned badges
- Leaderboard-style badge display

### 🔐 User Authentication (`auth.html`)
- Sign In / Create Account with tabbed interface
- **Password strength meter** (Weak → Excellent) on registration
- Password visibility toggle
- Form validation with inline error messages
- Welcome XP bonus (+50 XP) awarded on first account creation
- Redirects to BirdDex after registration
- "Explore without an account" option — guests can browse and use the map
- Auth state persisted in `localStorage`

### 🌍 Mission Page (`mission.html`)
- Platform mission, core pillars, and impact chain (from sighting to conservation action)
- Live statistics: birds catalogued, regions mapped, community sightings, AI models, conservation partners
- Conservation partner profiles: Haribon Foundation, Philippine Eagle Foundation, WWF Philippines, DENR, Bird Researchers Network, Educators & Birdwatchers Alliance
- Platform beneficiaries overview

---

## 🗂️ Project Structure

```
dont-touch-my-birdie/
├── index.html              # Homepage (served from root/)
├── auth.html               # Sign in / Register
├── birddex.html            # Bird collection browser
├── bird-profile.html       # Individual bird profile (query: ?id=)
├── map.html                # Interactive habitat map
├── identify.html           # AI bird identifier
├── report.html             # Community sighting reporter
├── achievements.html       # XP, levels, and badges
├── mission.html            # Platform mission & partners
├── css/
│   └── app.css             # Global stylesheet
├── js/
│   └── auth.js             # Auth, XP, achievements, navbar logic
├── data/
│   └── birds.js            # Centralized bird database (BIRDS array)
├── public/
│   └── birds/              # Bird photo assets
└── logo.png
```

---

## 🚀 Getting Started

The project is a **pure front-end app** — no build tools or server required.

1. Clone or download the repository
2. Open `index.html` (in `root/`) in any modern browser, or serve the root directory with any static file server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .
```

3. To use the **AI Bird Identifier**, obtain a free API key from [Roboflow](https://app.roboflow.com) and enter it on the Identify page. Without a key, the feature runs in smart demo mode.

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| UI | Vanilla HTML, CSS, JavaScript |
| Maps | [Leaflet.js](https://leafletjs.com) + OpenStreetMap |
| AI Identification | [Roboflow](https://roboflow.com) Serverless Inference API |
| Data storage | `localStorage` (client-side) |
| Fonts | Google Fonts — Bricolage Grotesque |
| Assets | Custom CSS design system (`app.css`) |

---

## 🤝 Conservation Partners

- 🦅 [Haribon Foundation](https://haribon.org.ph)
- 🦁 [Philippine Eagle Foundation](https://philippineeaglefoundation.org)
- 🌿 [WWF Philippines](https://wwf.org.ph)
- 🏛️ [DENR — Department of Environment and Natural Resources](https://denr.gov.ph)
- 🔬 Bird Researchers Network
- 📚 Educators & Birdwatchers Alliance

---

## 📄 License

© 2025 Don't Touch My Birdie! — Protecting Philippine Biodiversity

