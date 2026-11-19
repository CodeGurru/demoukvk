# AI Supervisor — FINAL BUILD FILE (Phase-by-Phase)
**Bijli Wala Aya · UKVK Services Technologies Pvt. Ltd. · Startup Buildathon India 2026 (Delhi)**
**Version:** 19 Nov 2026 · **Goal:** एक दिन में demo-ready prototype

---

## 0. इस file को कैसे इस्तेमाल करें (Kishan के लिए)
1. Antigravity (या कोई भी AI coding tool) में नया project खोलिए।
2. ये **तीनों files** project folder में `/docs` के अंदर डालिए:
   - `AI_Supervisor_FINAL_BUILD.md` (यही file, मुख्य निर्देश)
   - `AI_Supervisor_Physics_Chemistry_KB.md` (physics, gas, installation और झगड़ों के नियम)
   - `AI_Supervisor_Prototype_Plan.md` (pitch और demo की कहानी)
3. Agent को सिर्फ़ ये लिखिए:
   > "Read /docs/AI_Supervisor_FINAL_BUILD.md fully. Follow the AGENT RULES. Start Phase 0."
4. हर phase के बाद agent रुकेगा और **test checklist** देगा। आप वो test कीजिए:
   - सब ठीक हो तो लिखिए **"OK, next phase"**।
   - कुछ गलत हो तो लिखिए **"FIX: <क्या गलत है>"**।
5. ⭐ वाले phases demo के लिए **ज़रूरी** हैं। ☆ वाले सिर्फ़ तब करें जब समय बचे।

**एक दिन का अंदाज़ा (2 developers):**
| समय | Phases |
|---|---|
| सुबह 9–11 | P0, P1, P2 |
| 11–2 | P3, P4 |
| 2–5 | P5 (Live voice + camera) |
| 5–7 | P6, P7 |
| 7–9 | P8, P9 |
| 9–11 रात | P10 polish, demo rehearsal |

---

## 1. AGENT RULES (Antigravity के लिए — इसे सबसे पहले पढ़ें)
```
You are a senior full-stack + AI engineer building a demo-ready prototype in ONE DAY.
RULES:
1. Work strictly PHASE BY PHASE in the order below. Never start the next phase on your own.
2. At the end of each phase: (a) run the app/tests yourself, (b) print a short summary of
   what was built and which files changed, (c) print the phase's "ACCEPTANCE TESTS" as a
   checklist for the human, (d) STOP and wait for "OK, next phase" or "FIX: ...".
3. Read /docs/AI_Supervisor_Physics_Chemistry_KB.md for all physics/chemistry rules,
   reference values, installation and dispute rules. Never invent numbers; put all
   reference values in /config/reference-values.json with fields {value, unit, source,
   verified:false}.
4. Code quality: TypeScript strict, small modules, no secrets in client code, Zod
   validation on every API input, graceful error states, loading states, Hindi-first UI.
5. AI safety: AI never claims 100%; always shows confidence; never invents wiring diagrams;
   never overrides a rule-engine block; safety warnings on high-voltage/high-pressure steps.
6. Keep the demo path working at all times. If a feature is risky, build a simple version
   first, then improve.
7. If an API/model name fails, read it from env (MODEL_* variables) and tell the human
   which env var to change. Do not hardcode model IDs.
```

---

## 2. Product focus (क्या बनाना है, क्या नहीं)
**AI Supervisor** = technician का senior supervisor + ग्राहक का पहला सहायक।
सिर्फ़ **Split AC (inverter + non-inverter)** के लिए।

**⭐ Demo के लिए ज़रूरी (पूरी ताक़त इन पर):**
1. Technician को step-by-step guide करना: safety gate → appliance → readings → diagnosis → steps।
2. Physics और gas का rules engine: superheat, subcooling, ampere ratio, voltage। ये तय करता है कि gas डालने या part बदलने का step कब **ब्लॉक** हो।
3. **Live AI Supervisor:** camera और आवाज़ से real-time बातचीत (Gemini Live API), हिंदी में।
4. Photo से nameplate पढ़कर auto-fill, और error display या जले तार की photo समझना।
5. Company diagram (सिर्फ़ official) + आसान रंगीन legend + confidence %।
6. **Memory:** हर ग्राहक और हर AC की history याद रखना (Firestore)।
7. ग्राहक को आसान हिंदी में समझाना: gas, खर्च, low voltage, शर्तें।
8. Feedback loop: "AI सही था?" और उससे बनने वाला accuracy dashboard।

**छोटा और सीधा रखें:** ग्राहक chat → booking (location के साथ) → technician lead, FCM notification (☆)।

**नहीं बनाना (सिर्फ़ pitch में "आगे का plan"):** live GPS tracking, warranty claim workflow, payments, IoT device, दूसरे appliances। (Warranty: job पर सिर्फ़ "45 दिन warranty, X दिन बचे" का एक लेबल दिखेगा, कोई workflow नहीं।)

---

## 3. Google stack — "दिमाग, आँख, कान, मुँह, याद"
| अंग | Google tool | Prototype में इस्तेमाल |
|---|---|---|
| 🧠 दिमाग | Gemini API (Flash model, `MODEL_TEXT`) + हमारा physics rules engine | Diagnosis, समझाना, JSON output |
| 👁 आँख | Gemini multimodal (image input) + **Gemini Live API** (video frames ~1 FPS) | Nameplate/PCB photo, live camera |
| 👂 कान | Gemini Live API (audio stream) | Technician या ग्राहक बोलकर पूछे |
| 👄 मुँह | Gemini Live API native audio (`MODEL_LIVE`); backup: Gemini TTS (`MODEL_TTS`) या browser speechSynthesis | AI हिंदी में बोले |
| 🖼 Image बनाना ☆ | Gemini image model (`MODEL_IMAGE`) | सिर्फ़ official diagram का साफ़ रंगीन version। ये paid हो सकता है, इसलिए default बंद रखें |
| 🗂 याद (memory) | **Firebase Firestore** (real-time) | Customers, appliances, jobs, conversations, summaries |
| 📁 Files | Firebase Storage | Photos, diagrams |
| 🔐 Login | Firebase Auth | Role: customer / technician / admin |
| 📍 Location | Browser Geolocation → lat/lng → Firestore | पास का technician चुनना (Maps API ☆) |
| 🔔 Notification ☆ | Firebase Cloud Messaging (FCM) | Booking और job की सूचना |
| 👃 नाक | कोई API नहीं | आगे IoT gas/smoke sensor (pitch में) |

**Live API के बारे में ज़रूरी तथ्य:**
- ये audio, video या text की लगातार stream से real-time, कम देरी वाली बातचीत देता है।
- Firebase AI Logic के docs के मुताबिक `gemini-3.1-flash-live-preview` Gemini Developer API के free tier पर उपलब्ध है।
- Model के नाम बदलते रहते हैं, इसलिए उन्हें env में रखें।
- Video frames ~1 FPS पर भेजें, और audio input 16 kHz PCM रखें।
- **Image models free नहीं भी हो सकते।** Demo को उन पर निर्भर मत बनाइए।

**MongoDB क्यों नहीं:** Firestore real-time है, Auth और Storage के साथ सीधे जुड़ता है, और Google event में बेहतर दिखता है। Data layer को `/lib/db/` में अलग रखें, ताकि आगे MongoDB पर जाना आसान रहे।

---

## 4. Architecture
**एक ही Next.js app, तीन role sections, एक साझा दिमाग।**
```
/app
  /(auth)/login                   – role-based login (demo users)
  /(customer)/home                – chat + voice + photo, my AC history
  /(customer)/jobs/[id]           – quotation approve, consent, OTP, report
  /(technician)/jobs              – lead list
  /(technician)/jobs/[id]         – STEPPER (main demo screen)
  /(technician)/live/[jobId]      – Live AI Supervisor (camera + voice)
  /(technician)/tools             – calculators (bill, wire/MCB, capacitor, winding, PT/SH/SC)
  /(admin)/knowledge              – upload diagrams/manuals/error codes
  /(admin)/dashboard              – AI accuracy + stats
  /api/ai/chat  /api/ai/diagnose  /api/ai/vision  /api/ai/explain
  /api/ai/live-token              – short-lived token/config for Live API (no raw key in client)
  /api/kb/search  /api/jobs/*  /api/memory/*
/lib
  /physics/   electrical.ts capacity.ts wiring.ts compressor.ts capacitor.ts
              refrigerant.ts diagnosisMatrix.ts tripDecisionTree.ts energyLabel.ts
  /rules/     safety.ts  rootCause.ts  consent.ts
  /ai/        gemini.ts  live.ts  prompts.ts  schemas.ts  guardrails.ts
  /memory/    context.ts (build customer/appliance history), summarize.ts
  /kb/        search.ts
  /db/        firestore.ts (repository layer)
/config/reference-values.json   (all numeric thresholds, editable)
/data/seed/  brands, models, error-codes, diagrams, price-list, demo users/jobs
/tests/      vitest for /lib/physics and /lib/rules
/docs/       the 3 md files
```

**Security:** Gemini key सिर्फ़ server पर रहेगी। Live API के लिए client को server से छोटे समय वाला token या config मिलेगा, या Firebase AI Logic + App Check इस्तेमाल होगा। Firestore rules role के हिसाब से होंगे। AI routes पर rate limit, और images ≤5 MB।

---

## 5. Data model (Firestore) + Memory
```
users/{uid}            {name, role, phone, city, lat, lng, languagePref}
customers/{uid}/appliances/{applianceId}
                       {brand, model, type:"split", tonnage, inverter, refrigerant,
                        installDate, nameplatePhoto, qrId?}
jobs/{jobId}           {customerId, applianceId, technicianId, status, location{lat,lng},
                        issueSummary, consent{}, safety{}, readingsBefore{}, readingsAfter{},
                        ruleFindings[], diagnosis{}, steps[], blockedActions[], quotation{},
                        photos{}, otp, report{}, feedback{}, warrantyUntil, createdAt}
conversations/{id}     {jobId?, customerId, role, messages[{from,text,audioUrl?,ts}], channel:"chat|live"}
memory/{customerId}    {summary_hi, keyFacts[], lastIssues[], updatedAt}   // AI memory
kb_docs/{id}           {brand, modelPattern, docType, title, text, imageUrl, verified}
error_codes/{id}       {brand, code, meaning, causes[], checks[], sourceUrl, verified}
ai_feedback/{id}       {jobId, predicted, actual, wasCorrect, confidence, rating}
```
**Memory का तरीका:** हर AI call से पहले `/lib/memory/context.ts` ये सब जोड़कर prompt में देगा:
- ग्राहक की summary
- उस AC की पिछली jobs, readings और लगे parts
- पिछली बातचीत के आख़िरी कुछ संदेश

हर job या बातचीत ख़त्म होने पर `summarize.ts` memory summary update करेगा। ग्राहक दोबारा आए तो AI कहेगा: *"पिछली बार (12 Nov) आपके LG 1.5T में gas कम थी और flare से leak मिला था। क्या फिर से cooling कम है?"*

---

## 6. PHASES

---

### ⭐ PHASE 0 — Setup (30 min)
**Build:**
- Next.js (App Router) + TypeScript + Tailwind + Zod + Vitest।
- Firebase project: Auth, Firestore, Storage।
- `@google/genai` SDK।
- `.env.example`: `GEMINI_API_KEY, MODEL_TEXT, MODEL_LIVE, MODEL_TTS, MODEL_IMAGE, NEXT_PUBLIC_FIREBASE_*`।
- `.gitignore` (`.env`, `node_modules`), README skeleton, `/docs` folder।

**ACCEPTANCE TESTS (Kishan):**
- [ ] `npm run dev` चलता है और homepage खुलता है।
- [ ] `.env` में Gemini key डालने पर `/api/health` "AI OK" दिखाता है।
- [ ] GitHub पर `.env` नहीं गया।

---

### ⭐ PHASE 1 — Login, roles, layout, seed data (45 min)
**Build:**
- Demo login के तीन buttons: "ग्राहक – Kishan", "Technician – Kartik", "Admin"।
- Role के हिसाब से अलग bottom nav।
- Hindi-first UI, English sub-labels।
- Seed script: brands (LG, Daikin, Voltas, Samsung), 2 models each, error codes (LG CH38 = gas कम, CH05 = communication, आदि; सबमें `verified:false`), 2 official diagrams (placeholder image + text), price list, एक demo ग्राहक + उसका AC + एक पुरानी job (memory demo के लिए)।

**ACCEPTANCE TESTS:**
- [ ] तीनों role से login करके अलग screens दिखती हैं।
- [ ] Seed चलाने पर Firestore में data दिखता है।
- [ ] Mobile size (360px) पर layout ठीक है।

---

### ⭐ PHASE 2 — Physics & Chemistry Rules Engine + Tests (60 min)
**Build** (KB file के भाग A–C, E, F, L से):
- `electrical.ts`: power, current, bill, I²R, voltage drop, ampere ratio।
- `capacity.ts`: ton ↔ kW ↔ BTU, input power।
- `wiring.ts`: wire और MCB की सलाह (C-curve, DP, earthing)।
- `compressor.ts`: PSC (S–R = C–S + C–R), BLDC (U/V/W बराबर), insulation।
- `capacitor.ts`: ±6% tolerance।
- `refrigerant.ts`: PT tables (R22, R410A, R32, R290, R134a, R600a) + interpolation, superheat, subcooling, gas की metadata (formula, GWP, flammable, liquid-charge, "मिलाओ मत")।
- `diagnosisMatrix.ts`: LOW_CHARGE / OVERCHARGE / RESTRICTION / CONDENSER_AIRFLOW / EVAP_AIRFLOW / COMPRESSOR_WEAK / SUPPLY / SENSOR_PCB / NORMAL, evidence के साथ।
- `tripDecisionTree.ts`: Steps 0–8; `add_gas` तब तक BLOCKED जब तक leak test + vacuum + winding + voltage OK न हों; capacitor µF ठीक हो तो `replace_capacitor` BLOCKED।
- `rootCause.ts`: motor, compressor या PCB बदलने से पहले उसकी supply या signal की reading अनिवार्य।
- `safety.ts`: checklist gate, inverter DC bus < 36V, R32/R290 पर ज्वलनशील gas की चेतावनी।
- `energyLabel.ts`: label units × घंटे ÷ 1600, payback।
- `/tools` page पर calculators।
- **Vitest tests:** हर function के boundary cases।

**ACCEPTANCE TESTS:**
- [ ] `npm test` पर सारे tests pass होते हैं।
- [ ] Tools page: R32, suction 85 PSI, pipe 18°C डालने पर superheat ज़्यादा दिखता है और "gas कम?" लिखा आता है।
- [ ] Winding C–S 3.0, C–R 1.0, S–R 4.0 पर ✅; S–R 6.0 पर ❌।
- [ ] Capacitor 33.5 µF (rated 35) पर ✅ "बदलने की ज़रूरत नहीं"।
- [ ] Bill calculator: 800 units, 2400 घंटे, ₹7 → ₹8,400।

---

### ⭐ PHASE 3 — Technician Stepper (core flow, बिना AI) (60 min)
**Build** `/technician/jobs/[id]`:
1. **Consent status:** ग्राहक ने शर्तें मानी हैं या नहीं (Phase 8 से जुड़ेगा, अभी mock)।
2. **Safety gate:** checklist पूरी हुए बिना आगे के steps lock।
3. **Appliance form:** brand, model, type, ton, inverter, refrigerant, photo।
4. **Problem select:** no cooling / less cooling / water leak / noise / error code / trip / service।
5. **Field order (KB भाग G):** supply → touch/listen checklist → **clamp meter (V, A)** → pipe temps → gauge **सिर्फ़ तब, जब शक हो** ("gauge से थोड़ी gas जाती है" वाली चेतावनी के साथ)।
6. **Readings:** V, A, suction PSI, discharge PSI, suction pipe temp, liquid pipe temp, grill/room/outdoor temp, test mode (inverter)।
7. **Rule findings card:** engine का नतीजा, साथ में blocked actions 🔒 और उनकी वजह।
8. Draft auto-save (Firestore real-time)।

**ACCEPTANCE TESTS:**
- [ ] Safety tick किए बिना steps नहीं खुलते।
- [ ] Inverter AC चुनने पर "Test mode चलाइए" का prompt आता है।
- [ ] Low charge वाली readings पर "Gas भरें 🔒 – पहले leak test + vacuum" दिखता है।
- [ ] Page refresh करने पर भरा हुआ data बना रहता है।

---

### ⭐ PHASE 4 — Gemini Diagnosis + Vision + Error codes (75 min)
**Build:**
- `/api/ai/diagnose`: input = appliance + readings + ruleFindings + KB snippets + memory context + photos। Output (JSON schema) = faults (hi/en, confidence 0–100, reasoning, evidence), steps (safetyLevel), partsLikely, needsDiagram, customerExplanation_hi, disclaimer_hi।
  **Guardrails:** ruleFindings का उल्टा नहीं कहेगा, blocked action नहीं सुझाएगा, 100% नहीं कहेगा, जानकारी कम हो तो अगली reading माँगेगा।
- `/api/ai/vision`:
  - (a) Nameplate photo → brand, model, ton, refrigerant, rated current, हर field का confidence।
  - (b) Display या PCB photo → दिखी हुई दिक्कत + error code → `error_codes` lookup।
- Guided steps UI: हर step पर ✅/❌, नई reading डालने पर AI अगला step देगा।
- ConfidenceBadge (≥75 हरा, 50–74 पीला, <50 लाल "और जाँच करें")।
- Gemini fail हो तो सिर्फ़ rules-based सुझाव दिखें ("AI अभी उपलब्ध नहीं")।

**ACCEPTANCE TESTS:**
- [ ] Nameplate photo डालने पर form का 80%+ हिस्सा अपने-आप भर जाता है।
- [ ] Gas कम वाली readings पर diagnosis "Low refrigerant / leak" दिखाता है, confidence के साथ, और gas भरना blocked रहता है।
- [ ] Display पर "CH38" वाली photo से error का मतलब मिलता है।
- [ ] Internet या key बंद करने पर भी rules वाला सुझाव दिखता है।

---

### ⭐ PHASE 5 — Live AI Supervisor (camera + voice, Hindi) (2–3 hrs) ← **Demo का "वाह" वाला हिस्सा**
**Build** `/technician/live/[jobId]`:
- Live API session (`MODEL_LIVE`, response = AUDIO, input transcription on)। Mic audio 16 kHz PCM stream, camera से ~1 FPS JPEG frames।
- **System instruction:**
  - Persona: "आप Bijli Wala Aya के senior AC supervisor हैं"।
  - Hindi/Hinglish में छोटे, साफ़ वाक्य।
  - पहले safety पूछें।
  - Job context दें: appliance, readings, ruleFindings, blockedActions, memory।
  - Diagram की बात हो तो सिर्फ़ KB वाला official diagram।
- **Tool calling (function declarations):**
  - `getJobContext()`
  - `saveReading(name, value)` — technician बोलकर reading बताए, जैसे "suction 85 PSI", तो वो form में save हो।
  - `runRules()`
  - `searchKB(query)`
  - `markStepDone(stepId)`
- Transcript जैसे-जैसे बोला जाए, screen पर दिखे। Barge-in (AI को बीच में रोकना) काम करे।
- Fallback (Live API न चले): push-to-talk → Web Speech (hi-IN) → `/api/ai/chat` → TTS (`MODEL_TTS` या browser)।
- Bonus: ग्राहक की तरफ़ से भी यही "AI call" button (चैट में "AI से बात करें"), customer persona के साथ।

**ACCEPTANCE TESTS:**
- [ ] "AC ठंडा नहीं कर रहा" बोलने पर AI हिंदी में बोलकर पहले safety पूछता है।
- [ ] Camera outdoor unit या PCB की तरफ़ करने पर AI बताता है कि उसे क्या दिख रहा है।
- [ ] "Suction पचासी PSI है" बोलने पर reading form में save हो जाती है और AI rules के हिसाब से जवाब देता है।
- [ ] AI के बोलते समय बीच में बोलने पर वो रुककर सुनता है।
- [ ] Live API बंद करने पर fallback voice काम करता है।

---

### ⭐ PHASE 6 — Knowledge Base + Official Diagram Viewer (60 min)
**Build:**
- `/api/kb/search`: brand + modelPattern + keywords scoring।
- **DiagramViewer:** official image + Gemini से बना रंगीन legend (तार का रंग → terminal → काम: L, N, Earth, C/S/R, fan, sensors)। Zoom, और photo पर tap करके निशान।
- **Diagram न मिले तो:** "इस मॉडल का official diagram उपलब्ध नहीं – Admin से अपलोड कराएँ।" **कोई diagram generate नहीं होगा।**
- ☆ `MODEL_IMAGE` चालू हो तो official diagram का साफ़ रंगीन redraw, "AI redraw of official diagram – verify" watermark के साथ।
- Steps में "Diagram देखें" button।

**ACCEPTANCE TESTS:**
- [ ] Seed वाले LG model पर diagram और legend दिखते हैं।
- [ ] अनजान model पर "official diagram उपलब्ध नहीं" दिखता है, अंदाज़े वाला diagram नहीं।

---

### ⭐ PHASE 7 — Customer chat + Memory + Booking with location (75 min)
**Build** `/customer/home`:
- Chat (text, mic, photo)। Customer persona: सिर्फ़ सुरक्षित self-checks, AC खोलने या तार छूने को नहीं कहेगा। Gas, खर्च, low voltage, star rating और bill आसान हिंदी में समझाएगा।
- **Memory:** हर संदेश `conversations` में जाएगा, और `memory/{customerId}` summary में। दूसरी बार आने पर पिछली history का ज़िक्र होगा।
- "My AC" card: appliance, पिछली jobs, और warranty label ("45 दिन warranty – X दिन बचे")।
- **Auto booking:** ~3 turns में हल न हो तो AI JSON `{action:"book_service", issueSummary, urgency}` लौटाएगा। Location permission लेकर lat/lng job में save होगा, और सबसे पास का technician (seed के lat/lng से दूरी) assign होगा।
- Technician की lead list real-time update होगी (Firestore listener)।
- ☆ FCM: technician को "नई lead" notification।

**ACCEPTANCE TESTS:**
- [ ] "AC से पानी टपक रहा है" पर AI पहले आसान जाँच बताता है।
- [ ] 3 turns बाद booking हो जाती है, location save होता है, और technician की list में lead तुरंत आ जाती है।
- [ ] Logout करके दोबारा chat करने पर AI पिछली दिक्कत याद दिलाता है।
- [ ] Bill वाले सवाल पर star rating का हिसाब समझाता है।

---

### ⭐ PHASE 8 — Consent, Quotation, Evidence, OTP close, Report (60 min)
**Build** (KB भाग J):
- **Consent screen (काम से पहले):** जाँच का charge; gas सिर्फ़ leak test + vacuum के बाद; "gas के बाद compressor कमज़ोर निकला तो उसका खर्च अलग होगा"। ग्राहक app पर "मैं सहमत हूँ" दबाए (timestamp save होगा)।
- **Quotation:** seed price list + Gemini की हिंदी explanation। ग्राहक approve करे।
- **Low voltage evidence:** चलते समय का voltage <200V हो तो photo अनिवार्य। Job "Supply issue" mark होगा, और ग्राहक को stabilizer या तार की सलाह मिलेगी।
- **Evidence:** before/after readings और photos।
- **"ग्राहक को समझाओ" button:** Gemini readings और photos से शांत, आसान explanation बनाएगा (झगड़े के समय)।
- **OTP close** → auto **Report** (share link + print view): appliance, readings, fault, काम, parts, खर्च, AI confidence, technician, warranty तारीख।
- **Feedback:** "AI सही था?" 👍/👎 + असली खराबी → `ai_feedback`। Memory summary update।

**ACCEPTANCE TESTS:**
- [ ] Consent के बिना repair steps नहीं खुलते।
- [ ] 185V डालने पर "Supply issue" और ग्राहक के लिए explanation आती है।
- [ ] OTP डालते ही report बनती है और link खुलता है।
- [ ] Feedback देने के बाद dashboard का count बदलता है।

---

### ⭐ PHASE 9 — Admin: Knowledge upload + AI Accuracy Dashboard (45 min)
**Build:**
- **Knowledge:** diagram, manual text या error code upload (brand, modelPattern, docType, verified toggle), list और delete।
- **Reference values editor:** `/config/reference-values.json` के values UI से बदल सकें (verified flag)।
- **Dashboard:** कुल jobs, completed, AI accuracy %, fault type के हिसाब से accuracy, blocked actions की संख्या ("कितनी बार बेवजह gas या part बचा"), recent feedback।

**ACCEPTANCE TESTS:**
- [ ] नया diagram upload करते ही technician को उस model पर वही दिखता है।
- [ ] Dashboard पर accuracy % और "बचाए गए gas jobs" दिखते हैं।

---

### ⭐ PHASE 10 — Polish, Demo data, Deploy (60 min)
**Build:**
- Hindi copy की जाँच, loading और error states, accessibility (labels, contrast, aria-live)।
- "Demo mode" button: तैयार ग्राहक, technician और job, ताकि demo में अटकें नहीं।
- README: problem, solution, architecture (mermaid), Google APIs, setup, env, demo logins, roadmap।
- Deploy: Firebase App Hosting या Vercel। HTTPS ज़रूरी है (camera और mic के लिए)।

**ACCEPTANCE TESTS:**
- [ ] Phone पर live URL से पूरा demo (नीचे का script) 3 मिनट में बिना अटके चलता है।
- [ ] Camera और mic phone पर काम करते हैं।

---

### ☆ OPTIONAL (समय बचे तभी)
- FCM push notifications (booking, technician निकला, job बंद)।
- Google Maps पर technician की दूरी या ETA (Maps API billing चाहिए)।
- Installation Quality Certificate (KB भाग H5 checklist + photos)।
- Tier-3 / Tier-1 mode toggle।
- `MODEL_IMAGE` से diagram redraw।

---

## 7. Demo Script (3 मिनट, judges के सामने)
1. **(15s) समस्या:** "अयोध्या जैसे शहरों में trained technician नहीं मिलते। बिना जाँच gas भरी जाती है, part बदले जाते हैं, और ग्राहक से झगड़ा होता है।"
2. **(30s) ग्राहक:** हिंदी में chat → AI पिछली history याद दिलाता है → आसान जाँच → booking + location → technician के फ़ोन पर lead तुरंत आती है।
3. **(90s) Technician, मुख्य हिस्सा:**
   - Safety gate → nameplate photo से auto-fill → clamp meter readings।
   - **Live AI Supervisor:** camera outdoor unit पर, technician बोलता है "suction 85" → AI बोलता है: "Superheat 18, subcooling कम है, gas कम लगती है, 84% भरोसा। पर पहले leak ढूँढिए, gas भरना अभी लॉक है।"
   - CH38 photo → मतलब बताता है → official diagram + legend।
4. **(25s) भरोसा:** consent → quotation → 185V पर "supply issue" explanation → OTP → report।
5. **(20s) सीखता AI:** feedback 👍 → admin dashboard: accuracy %, "बचाई गई gas"।
6. **(10s) Vision:** "2021 से हमारे असली jobs का data हमारी ताक़त है। आगे IoT sensors, QR history, और हर appliance।"

---

## 8. Pitch में ईमानदार बातें (judges का भरोसा)
- AI 100% नहीं, confidence % दिखाता है, और आख़िरी फ़ैसला technician का है।
- Diagram सिर्फ़ official, AI अंदाज़े से नहीं बनाता।
- Physics के नियम code में हैं, AI उन्हें तोड़ नहीं सकता।
- Reference values "typical" हैं और admin उन्हें manual से verify करता है।

---

## Sources (APIs)
- [Firebase AI Logic – Gemini Live API](https://firebase.google.com/docs/ai-logic/live-api.md.txt)
- [Google Cloud – Gemini Live API overview](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/live-api?hl=en)
- [Gemini API pricing (Developer API)](https://ai.google.dev/gemini-api/docs/pricing)
- Physics/chemistry, installation और dispute के sources: `AI_Supervisor_Physics_Chemistry_KB.md` के आख़िर में।
