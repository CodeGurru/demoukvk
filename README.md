# ⚡ Bijli Wala Aya AI Supervisor (बिजली वाला आया)
**Senior AI Field Supervisor & Transparent Customer Assistant for Split ACs**  
**Startup Buildathon India 2026 (Delhi) · UKVK Services Technologies Pvt. Ltd.**  
*By Team Bijli Wala Aya: Kishan Pandey (Team Leader)*

---

## 📌 Executive Summary
In Tier-2 and Tier-3 Indian cities, 82% of home AC repairs suffer from guesswork, unnecessary part replacements (e.g. changing healthy capacitors), arbitrary gas charging fees, and dangerous safety shortcuts (handling R32 flammable refrigerant without vacuuming or discharging 440V capacitors).

**Bijli Wala Aya AI Supervisor** is an AI-powered field engineer and customer guardian built on **Google Gemini Multimodal AI** combined with a **hard Physics & Chemistry Rules Engine**. It operates as a WhatsApp-style conversational supervisor that guides technicians step-by-step, enforces mandatory safety gates with camera proof, locks fraudulent repairs, renders interactive physics gauges, and provides crystal-clear itemized quotations with a 45-day warranty in simple Hindi.

---

## 🌟 Google Stack Integration ("दिमाग, आँख, कान, मुँह, याद")

| Component | Google Technology | Role in Bijli Wala Aya AI Supervisor |
|---|---|---|
| 🧠 **दिमाग (Brain)** | **Google Gemini Flash API** (`@google/generative-ai`) + Physics Engine | Real-time diagnostic reasoning, root cause analysis, structured JSON outputs, safety guardrails |
| 👁 **आँख (Eyes)** | **Gemini Multimodal Vision** | Split AC nameplate auto-extraction (brand, tonnage, refrigerant, RLA), safety proof verification, schematic diagrams |
| 👂 **कान (Ears)** | **Gemini Live / Web Speech Recognition** | Hands-free Hindi & Hinglish voice input from field technicians |
| 👄 **मुँह (Voice)** | **Gemini TTS / Browser Speech Synthesis** | Instant Hindi spoken instructions, alerts, and customer transparent explanations |
| 📐 **इंजीनियरिंग (Physics)** | **Deterministic Rules Engine** (`/lib/physics/`) | Ohm's law, RLA load ratio, R32/R410A PT tables, capacitor ±6% replacement lock, 500-micron vacuum gate |

---

## 🔒 Hard Safety & Anti-Fraud Locks (Physics First)
Unlike generic chatbots that hallucinate repair advice, the AI Supervisor enforces hard algorithmic locks:
1. **Safety Gate Lockout:** All diagnostic tools and repair steps are physically locked until the technician ticks the 3 safety rules (MCB OFF, 440V capacitor discharged, rubber gloves worn) and uploads photo proof.
2. **Refrigerant Charging Lockout:** Direct gas charging is **strictly locked 🔒** if suction pressure is below standard (e.g. < 115 PSI for R32). The system requires leak detection (soap bubbles on flare nuts), nitrogen pressure testing, and vacuuming down to `< 500 microns` before gas can be added.
3. **Capacitor Fraud Lockout:** If a 35µF capacitor measures within manufacturer tolerance (±6%, e.g. 33.5µF), the replacement action is **locked 🔒** with the message *"बदलने की ज़रूरत नहीं"*, preventing unnecessary customer billing.

---

## 🏗 Project Architecture & Clean Structure

```
c:/Users/.../Desktop/AI_Supervisor_Docs/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── chat/route.ts         # Gemini-powered Senior Supervisor chat endpoint
│   │   │   ├── diagnose/route.ts     # Physics-guarded structured diagnostic endpoint
│   │   │   └── vision/route.ts       # Multimodal nameplate & photo scanner endpoint
│   │   ├── health/route.ts           # System status & Gemini API connection health check
│   │   └── physics/
│   │       └── evaluate/route.ts     # Pure physics & safety rules evaluation endpoint
│   ├── globals.css                   # Custom styles, rotating needle gauges, LCD displays
│   ├── layout.tsx                    # Next.js root layout with Hindi localization
│   └── page.tsx                      # Single-page WhatsApp conversational supervisor UI
├── config/
│   └── reference-values.json         # Reference tables for R32/R410A/R22, wire sizes, MCB curves
├── lib/
│   ├── gemini/
│   │   ├── client.ts                 # GoogleGenerativeAI client singleton
│   │   └── prompts.ts                # Structured system prompts and nameplate extraction
│   └── physics/
│       ├── capacitor.ts              # Capacitor ±6% tolerance & replacement blocker
│       ├── capacity.ts               # Ton ↔ kW ↔ BTU cooling capacity calculations
│       ├── compressor.ts             # PSC winding sum test & BLDC 3-phase balance
│       ├── electrical.ts             # Ohm's law, voltage drop, power factor, bill calculator
│       ├── refrigerant.ts            # Temperature-pressure (PT) charts, leak probabilities
│       ├── rulesEngine.ts            # Unified rules engine & hard safety lockout logic
│       └── index.ts                  # Clean barrel exports
├── tests/
│   ├── physics.test.ts               # TypeScript test suite
│   └── run-tests.mjs                 # Automated Node test runner for acceptance tests
├── docs/                             # Architecture & Knowledge Base specifications
├── package.json                      # Next.js 14, Tailwind, Zod, Lucide, @google/generative-ai
└── README.md                         # This documentation
```

---

## 🚀 Quick Start Guide

### 1. Requirements
- Node.js v18+ (tested on Node v24.20.0)
- npm v10+

### 2. Setup Environment Variables
Copy `.env.example` to `.env.local` and add your Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
MODEL_TEXT=gemini-1.5-flash
MODEL_VISION=gemini-1.5-flash
MODEL_LIVE=gemini-2.0-flash-exp
NEXT_PUBLIC_APP_NAME="Bijli Wala Aya AI Supervisor"
NEXT_PUBLIC_COMPANY="UKVK Services Technologies Pvt. Ltd."
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Automated Physics Unit Tests
```bash
npm test
```
*Output:*
```
▶ ⚡ Phase 2: Physics & Chemistry Knowledge Base Acceptance Tests
  ✔ 1. Winding Rule: C-S 3.0, C-R 1.0, S-R 4.0 PASS; S-R 6.0 FAIL
  ✔ 2. Capacitor 33.5 µF (rated 35 µF) -> REPLACE_BLOCKED (within ±6%)
  ✔ 3. Bill Calculator: 1.5 kW, 8 hrs, 30 days @ ₹7 = ₹2,520 (360 kWh)
  ✔ 4. R32 Gas Pressure: 37 PSI flags LEAK_EMPTY (< 115 PSI)
✔ Passed in 4.3ms
```

### 5. Build for Production
```bash
npm run build
```

### 6. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 3-Minute Demo Pitch Flow for Judges

1. **Step 1: Arrival & Multimodal Photo Scan**
   - Click "📷 एसी नेमप्लेट स्कैन करें" -> Gemini Multimodal Vision reads Brand (LG), Tonnage (1.5 TR), and Refrigerant (R32).
2. **Step 2: Mandatory Safety Gate**
   - Technician checks: MCB OFF ⚡, Capacitor Discharged 🧯, Insulated Rubber Gloves 🧤.
   - Upload safety proof -> Safety Gate unlocks.
3. **Step 3: Interactive Physical Meters**
   - Manifold Pressure Gauge: Dynamic rotating needle showing **37 PSI** (Flags: *गैस बहुत कम / लीकेज!*).
   - Digital Clamp Meter: LCD display showing **3.8A** (Flags: *लो लोड - कंप्रेसर गैस के बिना हल्का चल रहा है*).
   - Digital Multimeter: LCD display showing **220V** (*नॉर्मल वोल्टेज*).
4. **Step 4: AI Diagnosis & Colorized Schematic**
   - Gemini renders an interactive color-coded wiring schematic for LG BLDC/AC Blower Motor (`CN-FAN` connector: Phase Red 230V, Neutral Blue, Feedback Yellow, 3.5µF Capacitor).
   - Rules Engine enforces: **Gas Charge LOCKED 🔒** until nitrogen hold test + 500 microns vacuum completed.
5. **Step 5: Customer Transparent Quotation & OTP Close**
   - Itemized bill in simple Hindi: ₹1,399 with 45-day warranty.
   - Customer OTP verification closes the job and logs to history.

---

## 🛡️ License & Team
Developed with ❤️ by **Bijli Wala Aya** (UKVK Services Technologies Pvt. Ltd.) for **Startup Buildathon India 2026**.
All rights reserved.
