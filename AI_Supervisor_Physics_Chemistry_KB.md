# AI Supervisor – Physics & Chemistry Knowledge Base (AC)
**Bijli Wala Aya · UKVK Services Technologies Pvt. Ltd.**
**उद्देश्य:** AI Supervisor के "Rules Engine" के लिए बिजली (physics) और gas (chemistry) के पक्के नियम, ताकि diagnosis अंदाज़े पर नहीं, हिसाब पर हो, और gas, capacitor या compressor बर्बाद न हों।

> ⚠️ **ज़रूरी:** इस file के सभी आँकड़े **"सामान्य / लगभग" (typical)** हैं। हर brand और model के लिए **manufacturer का service manual, nameplate और PT chart ही अंतिम सच है।** AI Supervisor में ये values config में रहेंगी, और admin इन्हें बदल सकेगा।

---

## भाग A — बिजली (Electrical Physics)

### A1. बुनियादी नियम
| नियम | Formula | AC में काम |
|---|---|---|
| Ohm का नियम | V = I × R | Winding या तार का resistance → current |
| Power (single phase, AC load) | P = V × I × PF | Compressor कितनी बिजली ले रहा है |
| Power factor (PF) | PF = P ÷ (V × I) | Motor load पर लगभग 0.85–0.98; inverter AC में PFC circuit से ~0.95+ |
| ऊर्जा (energy) | kWh = kW × घंटे | Bill का हिसाब |
| तार में गर्मी | Heat = I² × R × t | Current दोगुना → गर्मी **चार गुना**। इसीलिए पतला तार या ढीला जोड़ जलता है |
| Voltage drop | Vdrop = I × R(तार) | लंबा या पतला तार → AC तक कम voltage पहुँचता है |
| Capacitor reactance | Xc = 1 ÷ (2π × f × C) | f = 50 Hz; µF कम हुआ → start/run कमज़ोर |

**ज़रूरी समझ (AI को यही समझाना है):**
- **Voltage गिरेगा तो ampere बढ़ेगा।** Compressor को उतना ही काम करना है (P ≈ स्थिर), इसलिए I = P ÷ (V × PF)। 230V पर 7A लेने वाला compressor 190V पर लगभग 8.5A लेगा। इससे गर्मी बढ़ती है, OLP trip होता है और winding कमज़ोर होती है।
- **Starting current (LRA):** Non-inverter compressor start होते समय running current का **3–6 गुना** खींचता है, इसलिए MCB "C-curve" का लगाया जाता है।
- **Inverter AC** धीरे-धीरे speed बढ़ाता है (soft start), इसलिए उसमें बड़ा starting झटका नहीं होता।

### A2. Ton → BTU → kW (AC का "ton" कैसे पक्का करें)
| Ton (TR) | Cooling capacity | Model number में आम तौर पर |
|---|---|---|
| 1.0 | 12,000 BTU/h ≈ 3.52 kW | "12" |
| 1.5 | 18,000 BTU/h ≈ 5.28 kW | "18" |
| 2.0 | 24,000 BTU/h ≈ 7.03 kW | "24" |

- **1 TR = 3.517 kW cooling।** ये cooling की ताक़त है, **बिजली की खपत नहीं।**
- **बिजली की खपत (input power) = Cooling ÷ EER।** EER या ISEER = AC की efficiency, यानी जितना ज़्यादा, उतनी कम बिजली।
- **Ton पक्का करने के 3 तरीके** (AI इसी क्रम में चलेगा):
  1. Nameplate पर "Cooling Capacity (W या BTU/h)" (photo से AI पढ़ेगा)।
  2. Model number के अंक (12/18/24), हर brand का पैटर्न knowledge base में होगा।
  3. मौके पर अंदाज़ा (हवा वाला हिसाब): **Q(W) ≈ 1.2 × हवा का बहाव (m³/s) × 1005 × ΔT(°C)**, जहाँ ΔT = indoor return हवा और grill हवा के तापमान का अंतर। ये सिर्फ़ मोटा अंदाज़ा है, क्योंकि नमी हटाने वाली cooling इसमें नहीं गिनी जाती।

### A3. Running current (मोटा अंदाज़ा, 230V)
| AC | Non-inverter running current | Inverter (rated test mode पर) |
|---|---|---|
| 1.0 TR | ~4.5–6 A | ~3–5 A |
| 1.5 TR | ~6.5–8.5 A | ~4–7 A |
| 2.0 TR | ~9–11 A | ~6–9 A |

👉 **असली मानक हमेशा nameplate का "Rated Current / RLA" है।** AI इसी से तुलना करेगा: **I(measured) ÷ I(rated)**।
- < 70% → gas कम, compressor कमज़ोर, या (inverter में) कम speed।
- 100–120% → condenser में हवा नहीं, gas ज़्यादा, कम voltage, या winding में ख़राबी।
- > 125% → ख़तरा, trip होगा। तुरंत जाँच कीजिए।

### A4. बिजली का bill
**महीने का bill = kW × रोज़ के घंटे × 30 × ₹ प्रति unit**

| उदाहरण | हिसाब | Bill (₹7/unit) |
|---|---|---|
| 1.5 TR non-inverter, ~1.5 kW, 8 घंटे/दिन | 1.5 × 8 × 30 = 360 units | ~₹2,520/महीना |
| 1.5 TR inverter, औसत ~0.9 kW, 8 घंटे/दिन | 0.9 × 8 × 30 = 216 units | ~₹1,512/महीना |

- Inverter AC का औसत load कमरे के तापमान, बाहर की गर्मी और set temp पर निर्भर है।
- **हर 1°C कम set temp पर बिजली ~6% बढ़ती है** (आम तौर पर कहा जाने वाला अंदाज़ा)। 24°C की सलाह इसी वजह से दी जाती है।

### A5. तार (wire) और MCB — AC के लिए
**सुनहरा नियम:** MCB **तार की रक्षा** के लिए होता है। इसलिए **MCB rating ≤ तार की सुरक्षित क्षमता** होनी चाहिए। तार की क्षमता से बड़ा MCB लगाने पर MCB trip नहीं होगा, उससे पहले तार जल जाएगा।

**Copper तार की लगभग सुरक्षित क्षमता** (PVC, conduit में, घरेलू wiring; IS standards और installation के हिसाब से थोड़ा बदलती है):
| तार | लगभग क्षमता |
|---|---|
| 1.5 mm² | ~10–14 A (AC के लिए **नहीं**) |
| 2.5 mm² | ~16–20 A |
| 4.0 mm² | ~24–28 A |
| 6.0 mm² | ~32–36 A |

**AC के लिए सामान्य सलाह:**
| AC | तार (copper) | MCB |
|---|---|---|
| 1.0 TR | 2.5 mm² | 16 A, C-curve, Double Pole (DP) |
| 1.5 TR | 2.5 mm² (लंबी दूरी पर 4 mm²) | 16–20 A, C-curve, DP |
| 2.0 TR | 4.0 mm² | 20–25 A, C-curve, DP |
| 3.0 TR | 4–6 mm² | 25–32 A, C-curve, DP |

**MCB के curve:**
| Curve | कितने current पर तुरंत trip | कहाँ लगाएँ |
|---|---|---|
| B | 3–5 × rating | Light, पंखे, resistive load |
| **C** | 5–10 × rating | **AC, motor, compressor** (starting झटका सहता है) |
| D | 10–20 × rating | भारी motor, transformer |

- **Double Pole (DP) MCB:** phase और neutral दोनों एक साथ कटते हैं, इसलिए AC के लिए ज़्यादा सुरक्षित है।
- **Earthing अनिवार्य है** (body leakage से करंट लगने से बचाव)। Earth और neutral के बीच voltage आम तौर पर < 2–5V होना चाहिए।
- RCCB (30 mA) पूरे घर पर लगा हो तो leakage से सुरक्षा मिलती है।
- **ढीला terminal = ज़्यादा resistance = I²R गर्मी = जला हुआ socket या plug।** AC के लिए 16A socket या सीधा MCB connection होना चाहिए, 6A socket कभी नहीं।
- Voltage कम या ज़्यादा होता हो (< 200V या > 250V) तो stabilizer लगाइए। कई inverter AC का wide-range operation होता है, manual देखिए।

### A6. Capacitor (Non-inverter AC)
- **Dual run capacitor** के 3 terminals होते हैं: **C (common), HERM (compressor), FAN**। जैसे "35 + 2.5 µF, 440V AC"।
- **जाँच:** discharge करने के बाद µF meter से मापिए। Rating से **±5–6%** के अंदर हो तो ठीक है। ज़्यादा कम हो, उभरा या फूला हो, या तेल रिस रहा हो, तो बदलिए।
- **कमज़ोर capacitor के लक्षण:** compressor "hum" करता है पर start नहीं होता, ampere ज़्यादा रहता है, OLP trip होता है, या fan धीमा चलता है।
- **बदलते समय:** µF और voltage rating बिल्कुल वही (या voltage उससे ज़्यादा) होनी चाहिए। **ज़्यादा µF लगाना गलत है,** इससे start winding गर्म होकर जल सकती है।
- **Discharge करना ज़रूरी है:** 440V capacitor में charge बना रह सकता है। Insulated resistor (जैसे 20 kΩ, 5W) से discharge कीजिए, screwdriver से short मत कीजिए।

### A7. Compressor winding की जाँच
**Non-inverter (single-phase PSC compressor) – terminals C, S, R:**
- R(C–R) सबसे कम, R(C–S) बीच वाला, R(S–R) सबसे ज़्यादा।
- **नियम: R(S–R) = R(C–S) + R(C–R)।** (लगभग ±5%) अगर ये न मिले → winding shorted है या terminal की पहचान गलत है।
- Value अनंत (∞) हो → winding open है, या **internal OLP खुला है** (compressor गर्म हो तो 30–60 मिनट ठंडा होने दें, फिर दोबारा नापें)।
- **Insulation (earth से):** Megger से 500V DC पर **> 2 MΩ** अच्छा, 1 MΩ से कम हो तो ख़राब। (Multimeter पर हमेशा "∞" आना चाहिए।)

**Inverter AC (BLDC / PMSM compressor) – terminals U, V, W:**
- तीनों जोड़ों (U–V, V–W, W–U) का resistance **बराबर** होना चाहिए, आम तौर पर कुछ Ω, जैसे ~0.5–3 Ω (model पर निर्भर)। असमान हो तो winding ख़राब है।
- **Inverter compressor में capacitor नहीं होता।** इसे IPM (Intelligent Power Module) चलाता है। Capacitor बदलना पैसे की बर्बादी है।
- Compressor के तारों पर AC voltage और frequency बदलती रहती है। Normal multimeter से गलत reading आ सकती है।

### A8. Inverter PCB के हिस्से (deep level)
| हिस्सा | काम | आम ख़राबी / जाँच |
|---|---|---|
| Fuse | Short से बचाव | उड़ा fuse मतलब आगे कहीं short है। सीधे fuse मत बदलिए, पहले कारण ढूँढिए |
| Varistor (MOV) | Voltage spike सोखना | फटा या काला मतलब spike आया था |
| Bridge rectifier (diodes) | AC → DC | Diode test: एक दिशा में ~0.4–0.7V, उल्टी दिशा में OL |
| PFC (reactor/choke + IGBT/MOSFET) | Power factor सुधार, DC bus स्थिर रखना | Reactor गर्म या बदबूदार, PFC IGBT short |
| DC bus capacitors (बड़े electrolytic) | ~300–400V DC जमा रखना | फूले capacitor। ⚡ **बंद करने के बाद भी कई मिनट तक ख़तरनाक voltage रहता है** |
| IPM (6 IGBT + driver) | DC → compressor के लिए 3-phase AC | U/V/W का diode test असमान, या IPM error code |
| SMPS (छोटा power supply) | 5V/12V/15V देना | Display बंद, कोई LED नहीं |
| MCU (microcontroller) | पूरा control | Communication error code |
| Thermistors (NTC sensors) | Room, coil, discharge, outdoor temp | Resistance vs temperature table से मिलाइए (जैसे 5k/10k/15k/50k at 25°C, brand पर निर्भर) |
| EEV (electronic expansion valve) | Gas का बहाव control | फँसी valve से गलत superheat; coil resistance जाँचिए |
| Relay | Fan या 4-way valve on/off | Click नहीं होता, contacts जले हुए |
| Opto-coupler | Indoor–outdoor communication में isolation | Communication error |

⚡ **Inverter PCB की safety rule (AI अनिवार्य gate):** power बंद करने के बाद **DC bus voltage नापिए। ये < 36V आने के बाद ही PCB छुएँ।** (कई manuals 5–10 मिनट इंतज़ार कहते हैं।)

### A9. ⚠️ NTC sensor कैसे जाँचें
- Sensor निकालकर resistance नापिए, फिर उसी तापमान पर brand की table से मिलाइए।
- Sensor गलत value दे (जैसे coil sensor को गर्म बताए) → PCB compressor को धीमा या बंद कर देगा, और ग्राहक को "cooling नहीं" लगेगा जबकि gas ठीक है। **इस हालत में gas डालना बेकार है।**

---

## भाग B — Gas (Refrigerant Chemistry)

### B1. Refrigerants की पहचान
| Gas | रसायन (Formula) | प्रकार | ODP | GWP (लगभग) | Safety class | ख़ास बात |
|---|---|---|---|---|---|---|
| R22 | CHClF₂ (chlorodifluoromethane) | HCFC | ~0.055 | ~1,810 | A1 (non-flammable) | पुराने AC; ozone को नुकसान, इसलिए phase-out हो रहा है |
| R410A | R32 + R125 का 50/50 मिश्रण (CH₂F₂ + C₂HF₅) | HFC blend | 0 | ~2,090 | A1 | R22 से ~1.6 गुना ज़्यादा pressure; **liquid रूप में ही भरें** |
| R32 | CH₂F₂ (difluoromethane) | HFC (single) | 0 | ~675 | **A2L (हल्का ज्वलनशील)** | आज के ज़्यादातर नए AC; "Green R32" इसी का marketing नाम है |
| R290 | C₃H₈ (propane) | Hydrocarbon | 0 | ~3 | **A3 (अत्यधिक ज्वलनशील)** | कुछ AC; बहुत eco-friendly पर बहुत सावधानी चाहिए |
| R134a | CH₂FCF₃ | HFC | 0 | ~1,430 | A1 | पुराने fridge, car AC |
| R600a | C₄H₁₀ (isobutane) | Hydrocarbon | 0 | ~3 | A3 | आज के ज़्यादातर fridge |

> "R210" नाम की कोई आम AC gas नहीं है। आप शायद **R290** (propane) की बात कर रहे थे।

**"Green R32" का मतलब:** R32 का ozone पर असर शून्य है (ODP = 0), और GWP R410A का लगभग एक-तिहाई है। साथ ही ये single-component gas है, इसलिए leak के बाद top-up करने पर मिश्रण नहीं बिगड़ता, और कम मात्रा में ज़्यादा cooling देती है। "Green" इसकी chemistry नहीं, marketing का शब्द है।

### B2. Gas के 6 सुनहरे नियम (AI इन्हें तोड़ने नहीं देगा)
1. **Gas कभी मिलाइए मत।** R22 वाले AC में R32 या R410A नहीं, और उल्टा भी नहीं। Pressure, oil और valve सब अलग हैं।
2. **R410A (blend) हमेशा liquid रूप में भरें** (cylinder उल्टा करके या dip tube से)। Vapour भरने से मिश्रण का अनुपात बिगड़ जाता है।
3. **R32 और R290 ज्वलनशील हैं।** आग या चिंगारी से दूर रखें, कमरे में हवा का बहाव रखें, brazing से पहले पूरी gas निकाल लें, और nitrogen से flush करें।
4. **नकली या लोकल gas का ख़तरा:** कुछ नकली cylinders में **R40 (methyl chloride)** जैसी ख़तरनाक मिलावट पाई गई है, जो aluminium से react करके compressor ख़राब कर सकती है या धमाके का ख़तरा पैदा कर सकती है। इसलिए **सिर्फ़ भरोसेमंद brand या dealer से, seal और batch number वाला cylinder ही लें।** असली gas महँगी होने की यही वजह है: शुद्धता, testing और सुरक्षित packaging।
5. **"Top-up" अंदाज़े से नहीं।** सही तरीका है: leak ढूँढें → ठीक करें → nitrogen pressure test → vacuum (≤ 500 microns) → nameplate पर लिखा charge **तौलकर** (weighing scale से) भरें।
6. **Vacuum क्यों ज़रूरी है:** हवा (non-condensable gas) high-side pressure बढ़ाती है, जिससे compressor गर्म होता है। नमी oil और gas के साथ मिलकर **acid** बनाती है, जो winding की insulation खा जाता है और capillary में बर्फ़ से रुकावट बनती है।

### B3. Pressure–Temperature (PT) रिश्ता — सबसे ज़रूरी physics
जब तक cylinder या system में **liquid और vapour दोनों मौजूद हैं, pressure सिर्फ़ तापमान पर निर्भर करता है, gas की मात्रा पर नहीं।**

👉 **इसका मतलब:** बंद AC का **standing pressure** सिर्फ़ ये बताता है कि gas **है**, ये नहीं कि **पूरी** है। थोड़ी-सी gas बची हो तब भी standing pressure "normal" दिख सकता है। इसलिए gas की कमी **चलते AC की readings, superheat और ampere** से ही पकड़ी जाती है।

**लगभग saturation pressure (PSIG), PT chart से पक्का करें:**
| Saturation temp | R22 | R410A | R32 |
|---|---|---|---|
| 0°C | ~58 | ~101 | ~103 |
| 5°C | ~70 | ~120 | ~123 |
| 10°C | ~84 | ~143 | ~146 |
| 35°C (बंद AC, गर्मी में) | ~180 | ~295 | ~305 |
| 45°C | ~230 | ~380 | ~390 |
| 50°C | ~260 | ~425 | ~440 |

**चलते AC की सामान्य readings** (indoor ~27°C, outdoor ~35°C, full speed या test mode):
| | R22 | R410A / R32 |
|---|---|---|
| Suction (low side) | ~60–75 PSIG | ~110–140 PSIG |
| Discharge (high side) | ~230–280 PSIG | ~380–450 PSIG |
| Standing (बंद, equalized) | बाहर के तापमान का saturation | बाहर के तापमान का saturation |

> **Back pressure** = suction pressure (low side, service valve पर)। **Standing pressure** = AC बंद होने पर दोनों sides बराबर होने के बाद का pressure।

> **Inverter AC:** compressor की speed बदलती रहती है, इसलिए pressure भी बदलता है। **सही readings के लिए remote या PCB से "Test mode / Forced cooling / Rated frequency" चलाइए** (हर brand का तरीका knowledge base में होगा)। बिना इसके reading पर फ़ैसला मत कीजिए।

### B4. Superheat और Subcooling — gas कम है या ज़्यादा, पक्का तरीका
- **Superheat (SH)** = suction pipe का असली तापमान − suction pressure का saturation तापमान।
- **Subcooling (SC)** = condenser का saturation तापमान − liquid pipe का असली तापमान।

| हालत | Suction PSI | Superheat | Subcooling | Ampere | Indoor coil |
|---|---|---|---|---|---|
| ✅ सही gas | Normal | ~5–8 K | ~4–7 K | Rated के पास | पूरी ठंडी |
| ❌ Gas कम / leak | कम | **ज़्यादा** | कम | कम (non-inverter) | आधी ठंडी, पीछे गर्म |
| ❌ Gas ज़्यादा भरी | ज़्यादा | बहुत कम (~0) | **ज़्यादा** | ज़्यादा | Suction pipe पर पसीना या बर्फ़ |
| ❌ Capillary/strainer/EEV choke | **बहुत कम** | **ज़्यादा** | **ज़्यादा** | कम/normal | रुकावट वाली जगह बर्फ़ या ठंडक |
| ❌ Condenser गंदा / fan ख़राब | ज़्यादा | Normal/कम | Normal | **ज़्यादा** | कम cooling, outdoor गर्म हवा कम |
| ❌ Indoor हवा कम (filter/coil गंदा, blower) | कम | कम | Normal | कम | Coil पर बर्फ़ |
| ❌ Compressor कमज़ोर (internal leak) | **ज़्यादा** | Normal/ज़्यादा | कम | कम या असामान्य | कम cooling |

👉 **Gas कम और choke को अलग पहचानना (बहुत ज़रूरी):** दोनों में suction कम रहता है। पर **gas कम में subcooling कम होता है, जबकि choke में subcooling ज़्यादा होता है** (gas condenser में ही रुकी रहती है)। Choke में gas डालने से overcharge होगा और पैसा बर्बाद होगा।

---

## भाग C — असली केस: "Gas भी डाली, capacitor भी बदला, फिर भी compressor 30 मिनट चलकर गर्म होकर trip हो जाता है"

### C1. इसके पीछे की physics
- **Hermetic compressor को ठंडक suction gas से मिलती है।** ठंडी return gas motor winding को ठंडा करती है।
- Gas कम हो, choke हो, या suction gas बहुत गर्म हो (ज़्यादा superheat) → motor ठंडी नहीं होती → **Discharge temperature बढ़ता है → OLP या discharge sensor trip करता है।**
- High-side pressure ज़्यादा हो (हवा, गंदा condenser, overcharge) → compressor पर ज़्यादा काम पड़ता है → **ज़्यादा ampere → I²R गर्मी → trip।**
- Voltage कम हो → ज़्यादा ampere → गर्मी।
- Winding या bearing कमज़ोर हो → घर्षण और ज़्यादा current → गर्मी।
- **Inverter AC:** discharge sensor या IPM का तापमान ज़्यादा हो → PCB पहले compressor की speed घटाता है (cooling कम हो जाती है), फिर रोक देता है (error code)।

### C2. सबसे आम कारण, जिनमें "gas + capacitor" से कुछ नहीं बदलता
1. **Leak ठीक नहीं हुआ।** Gas डाली, फिर से निकल गई। (सबसे आम कारण।)
2. **Vacuum नहीं किया।** System में हवा या नमी रह गई → high pressure → overheating।
3. **Capillary, strainer या EEV choke।**
4. **Condenser गंदा, या outdoor fan या fan capacitor कमज़ोर।**
5. **Voltage कम है या तार पतला है** (voltage drop सिर्फ़ load पर दिखता है)।
6. **Compressor अंदर से कमज़ोर** (valve या रोटर घिसा हुआ) या winding आंशिक रूप से short।
7. **OLP ख़ुद कमज़ोर** (non-inverter), जो जल्दी trip कर देता है।
8. **गलत sensor या PCB की ख़राबी** (inverter)।
9. **Gas ज़्यादा भर दी** (overcharge), जिससे high pressure और ज़्यादा ampere।
10. **गलत या नकली gas।**

### C3. Gas या capacitor पर पैसा लगाने से **पहले** की जाँच (AI Supervisor का decision tree)
> नियम: **"पहले नापो, फिर बदलो।"** हर step का data app में जाएगा, और AI अगला step बताएगा।

```
STEP 0 — Safety gate (power off, capacitor/DC bus discharge, gloves) ✅
STEP 1 — Voltage (load पर, compressor चलते समय)
         < 200V → stabilizer/तार/supply ठीक करो → STOP (gas/capacitor नहीं)
STEP 2 — Winding resistance + insulation
         S–R ≠ C–S + C–R  या  U/V/W असमान  या  insulation < 1–2 MΩ
         → compressor ख़राब → gas मत भरो (बर्बाद होगी)
STEP 3 — Capacitor µF (non-inverter) — rating ±6% में? हाँ → capacitor ठीक, मत बदलो
STEP 4 — Condenser/airflow — coil साफ़? outdoor fan सही RPM? fan capacitor ठीक?
         outdoor हवा का ΔT (आने-जाने वाली) ~8–12°C?
STEP 5 — Running test (inverter: TEST MODE) 10–15 मिनट
         नापो: suction PSI, discharge PSI (अगर port है), suction pipe temp, liquid pipe temp,
               ampere, indoor ΔT, compressor body/discharge pipe temp (IR thermometer)
STEP 6 — AI गणना: superheat, subcooling, I/I_rated, discharge temp
         ├─ Low suction + High SH + Low SC  → GAS कम → STEP 7 (leak पहले!)
         ├─ Low suction + High SH + High SC → CHOKE → gas नहीं; capillary/strainer/EEV
         ├─ High discharge + High amp + normal SH → airflow/हवा/overcharge
         ├─ High suction + Low discharge + low amp → compressor internal leak (कमज़ोर)
         └─ Readings normal पर trip → OLP/sensor/PCB/voltage dip जाँचो
STEP 7 — Gas कम हो तो: पहले LEAK ढूँढो (साबुन का घोल, electronic detector,
         nitrogen pressure test — manufacturer की सीमा तक) → ठीक करो → vacuum ≤500 micron
         (10 मिनट hold) → nameplate charge तौलकर भरो
STEP 8 — 30–45 मिनट का run test; discharge temp और amp स्थिर? ✅ job close
```

**Discharge pipe का तापमान (IR से), मोटा संकेत:** आम तौर पर ~70–95°C। **105–110°C से ऊपर लगातार रहे तो ख़तरे का संकेत है** (oil बिगड़ता है, compressor घिसता है)। Brand की सीमा manual से लें।

### C4. AI Supervisor ग्राहक या technician को क्या कहेगा (उदाहरण)
> "Suction 85 PSI (R32), superheat 18 K, subcooling 2 K, current rated का 62% है। ये **gas की कमी** के लक्षण हैं (भरोसा 84%)। पर gas भरने से पहले **leak ढूँढना ज़रूरी है**, वरना gas फिर निकल जाएगी और compressor गर्म होकर trip करता रहेगा। Capacitor 34.1 µF (rated 35) है, यानी ठीक है, इसे बदलने की ज़रूरत नहीं।"

---

## भाग D — दूसरे appliances पर यही physics
| Appliance | ज़रूरी नियम |
|---|---|
| Refrigerator | R600a/R134a का PT chart; capillary choke बनाम gas कम; PTC relay और OLP; defrost heater (Ohm का नियम); NTC sensor |
| Washing machine | BLDC/universal motor की winding; drain pump की coil; door lock (PTC); heater resistance (P = V²/R); unbalance sensor |
| Geyser | Heater: R = V²/P (2 kW → ~26 Ω); thermostat; earthing और ELCB अनिवार्य |
| Microwave | HV capacitor (ख़तरनाक, discharge ज़रूरी); HV diode; magnetron filament (~<1 Ω) |
| Inverter/UPS, TV | SMPS, MOSFET, diode, capacitor ESR |

---

## भाग E — इसे AI Supervisor में कैसे डालें (Build Prompt Addendum)
नीचे का हिस्सा पहले वाले build prompt के साथ जोड़ें:

````markdown
# ADDENDUM: PHYSICS & CHEMISTRY RULES ENGINE
Create `/lib/physics/` with pure, unit-tested TypeScript functions (no AI inside):
- electrical.ts: power(V,I,PF), currentFromPower(P,V,PF), energyKWh(kW,h),
  monthlyBill(kW,hoursPerDay,days,tariff), heatI2R(I,R,t), voltageDrop(I,R_wire),
  capacitorReactance(f,uF), currentRatio(measured, rated) → status.
- capacity.ts: tonToBTU, tonToKW (1 TR = 3.517 kW), inputPower(coolingKW, EER),
  airSideCapacityW(airflow_m3s, deltaT_C) = 1.2*airflow*1005*deltaT (label "approx").
- wiring.ts: recommendWireAndMCB(tonnage, runLength_m) using config table; validate
  mcbRating <= wireCapacity; MCB curve must be C for AC; DP recommended; earthing check.
- compressor.ts: checkPSCWindings(CS, CR, SR) → ok if |SR-(CS+CR)| <= 5%;
  checkBLDCWindings(UV, VW, WU) → balanced within 5%; insulationOk(MOhm >= 2).
- capacitor.ts: capacitorOk(measuredUF, ratedUF, tol=0.06).
- refrigerant.ts: PT tables per refrigerant (R22, R410A, R32, R290, R134a, R600a) as JSON
  config with interpolation: saturationTempFromPSIG(ref, psig), psigFromTemp(ref, tempC);
  superheat(suctionPSIG, suctionPipeTempC, ref); subcooling(dischargePSIG, liquidPipeTempC, ref).
  Refrigerant metadata: formula, type, ODP, GWP, safety class, chargeAsLiquid(bool),
  flammable(bool), compatibleWith[] (never mix).
- diagnosisMatrix.ts: classify(suction, SH, SC, ampRatio, dischargeTemp) →
  {LOW_CHARGE, OVERCHARGE, RESTRICTION, CONDENSER_AIRFLOW, EVAP_AIRFLOW,
   COMPRESSOR_INEFFICIENT, ELECTRICAL_SUPPLY, SENSOR_PCB, NORMAL} with evidence list.
- tripDecisionTree.ts: implements STEP 0–8 above as a state machine; each step returns
  {nextStep, blockedActions[] e.g. "add_gas", "replace_capacitor", reason_hi}.
  Rule: "add_gas" is BLOCKED until leakTestDone && vacuumDone (≤500 micron) && compressor
  windings OK && voltage OK. "replace_capacitor" BLOCKED if measured µF within tolerance.
- Inverter rule: pressure/amp-based diagnosis requires testMode=true; otherwise ask the
  technician to run Test/Forced-cooling mode (brand-specific instructions from KB).
- Safety rules: inverter PCB work requires DC bus < 36V reading; flammable refrigerants
  (R32/R290) show ventilation/no-flame warning; never braze with refrigerant inside.

All numeric reference values live in `/config/reference-values.json` with a
`source` and `verified:boolean` field, editable from Admin. UI shows "typical value –
verify with manufacturer manual" when verified=false.

Gemini's role: explain rule outputs in simple Hindi, ask for the next missing measurement,
and combine with KB (manuals/error codes). Gemini must NEVER override a blocked action or
contradict rule findings. Add Vitest tests for every function (boundary cases).

Add a "Calculator" tab for technicians: Bill calculator, Wire/MCB advisor, Capacitor check,
Winding check, PT/Superheat/Subcooling calculator, Ton finder.
````

---

## भाग F — BEE Star Rating और "साल भर के units"
- AC पर लगे BEE label में star (1–5), **ISEER** और **साल भर की बिजली की खपत (kWh/year)** लिखी होती है।
- **ये units इस मान्यता पर निकाले जाते हैं कि AC साल में 1,600 घंटे चलेगा,** 24–43°C के बाहरी तापमान के bins पर।
- **ISEER** = साल भर में निकाली गई कुल गर्मी (CSTL) ÷ साल भर में खर्च हुई बिजली (CSEC)। जितना ज़्यादा, उतनी कम बिजली।
- BEE समय-समय पर star की सीमाएँ कड़ी करता है। इसलिए **star की गिनती से ज़्यादा भरोसेमंद ISEER की संख्या है।** Label की validity भी देखिए।

**ग्राहक का असली bill (AI calculator):**
```
आपके साल के units = Label के units × (आपके साल भर के घंटे ÷ 1600)
साल का bill (₹)   = आपके साल के units × ₹ प्रति unit
```
| उदाहरण | हिसाब | Bill (₹7/unit) |
|---|---|---|
| Label 800 units, आप 2,400 घंटे/साल | 800 × 2400 ÷ 1600 = 1,200 units | ~₹8,400/साल |
| 3-star (मान लें 1,000 units) बनाम 5-star (मान लें 750 units), 1,600 घंटे | 250 units का फ़र्क़ | ~₹1,750/साल की बचत |

AI ग्राहक को ये भी बताएगा कि ज़्यादा star वाला AC महँगा क्यों है, और कितने साल में वो अतिरिक्त दाम बचत से वसूल हो जाएगा (payback = दाम का अंतर ÷ साल की बचत)।

---

## भाग G — Ground level technician की सोच (AI Supervisor इसी क्रम में guide करेगा)

### G1. जाने से पहले (फ़ोन पर)
- दिक्कत क्या है: cooling नहीं, पानी टपकना, आवाज़, error code, या बार-बार trip।
- AC कौन सा है: brand, ton, inverter या नहीं, कितना पुराना। आख़िरी service और gas कब भरवाई।
- हाल में कुछ हुआ: बिजली गई थी, voltage ऊपर-नीचे हुआ, AC shift किया, या किसी और ने छेड़ा।
- इसी से तय होता है कि कौन से tools और parts साथ ले जाने हैं: clamp meter, gauge, capacitor, vacuum pump।

### G2. पहुँचकर: पहले सुनना और देखना (सबसे सस्ती जाँच पहले)
1. ग्राहक से पूरी कहानी सुनना: कब से, अचानक या धीरे-धीरे।
2. Supply: socket, MCB, voltage।
3. Remote: mode (Cool/Dry/Fan), set temp, timer।
4. Filter और indoor coil की सफ़ाई, blower की हवा।
5. Outdoor: fan चल रहा है या नहीं, compressor की आवाज़, हवा के निकलने की जगह।

### G3. हाथ, कान और नाक से जाँच (meter से पहले)
- Outdoor का **मोटा (suction/gas) pipe** छूकर: ठंडा और पसीने वाला = gas आम तौर पर ठीक; सामान्य तापमान = gas कम या compressor नहीं चल रहा।
- **बर्फ़ कहाँ जमी है:** मोटे pipe या indoor coil पर बर्फ़ = gas कम **या** indoor हवा कम (गंदा filter/coil, blower धीमा)। पहले filter और हवा देखिए, फिर gas। Service valve या capillary के पास पतले pipe पर बर्फ़ या ठंडक = **choke/restriction** का शक।
- Compressor "hum" करके बंद हो जाए = capacitor, low voltage या compressor जाम।
- जलने की बदबू = तार, PCB या motor।

### G4. 👉 पहले clamp meter, फिर gauge (आपकी बात)
- **Gauge लगाने और निकालने में हर बार थोड़ी gas निकल जाती है।** Inverter और R32/R410A वाले छोटे charge के AC में ये फ़र्क़ डालता है, और service port की pin या cap भी leak का कारण बन सकती है।
- इसलिए क्रम ये है: **Voltage → Ampere (clamp meter) → pipe का तापमान (thermometer) → तब भी शक हो तो gauge।**
- Gauge लगाएँ तो छोटी hose या low-loss fittings इस्तेमाल करें। निकालते समय valve cap वापस कसें और port पर साबुन से leak जाँचें।

### G5. PCB, तार और wiring की जाँच
- Indoor–outdoor के बीच के तार: terminal ढीले या जले, गलत क्रम (L, N, signal, earth), अंदर कटा तार।
- Communication error (जैसे LG में CH05): ज़्यादातर wiring, signal तार या PCB का।
- Inverter PCB: fuse, फूले capacitor, जला MOV, IPM, और sensors का resistance (भाग A8 और A9)।
- **नया part लगाने से पहले उसकी "वजह" जाँचिए** (भाग J3)।

### G6. ग्राहक को समझाना और खर्च बताना
- पहले नतीजा बताइए, फिर सबूत दिखाइए (reading या photo), फिर विकल्प (सस्ता बनाम पक्का), फिर लिखित quotation।

### G7. शहर के हिसाब से फ़र्क़
| | Tier 3 / छोटा शहर (जैसे अयोध्या) | Tier 1 / बड़ा शहर |
|---|---|---|
| Tools | Clamp meter, analog gauge, अनुभव; vacuum pump अक्सर नहीं | Digital gauge, vacuum pump, micron gauge, leak detector |
| बड़ी दिक्कतें | Voltage का ऊपर-नीचे होना, धूल, पतले तार, लोकल gas, parts देर से मिलना | ऊँची इमारतें, लंबे pipe, warranty और सबूत की माँग |
| ग्राहक | Budget पर ध्यान; "gas डाल दो" सोच; हिंदी में आसान समझाना ज़रूरी | ज़्यादा सवाल, bill/GST, online review |
| AI Supervisor का फ़ायदा | Hindi voice guidance, offline checklist, सस्ता पर सही क्रम | Digital report, warranty records, तेज़ diagnosis |

---

## भाग H — Installation का सही तरीका और सामान (ग्राहक का भरोसा)

### H1. Copper pipe
- **R410A और R32 के लिए कम से कम 0.8 mm दीवार वाला copper pipe चाहिए।** कई manufacturers साफ़ लिखते हैं कि 0.7 mm या उससे पतला pipe इस्तेमाल न करें, क्योंकि R410A में R22 से ज़्यादा pressure होता है।
- Pipe का size (जैसे liquid 1/4", gas 3/8" या 1/2") model के manual से लें।
- सिर्फ़ ACR-grade (refrigeration वाला, अंदर से साफ़ और सूखा, ढक्कन लगा) copper लें। Plumbing वाला copper या पतला "लोकल" pipe नहीं।
- **ग्राहक के लिए AI की लाइन:** "मोटा और असली copper ऊँचा pressure सहता है और जल्दी नहीं फटता। पतला pipe सस्ता है, पर बाद में gas leak और दोबारा खर्च का कारण बनता है।"

### H2. Flare जोड़ और Teflon tape (ज़रूरी सुधार)
- **Flare पर teflon tape या "leak lock" जैसे sealant नहीं लगाने चाहिए।** ये refrigerant circuit के लिए बने ही नहीं हैं, और अंदर चले जाएँ तो दिक्कत पैदा करते हैं।
- Flare का seal **धातु से धातु** पर बनता है, threads पर नहीं।
- सही तरीका: सही flaring tool से बराबर flare बनाइए। **Flare के मुँह पर compatible refrigerant oil लगाइए (threads पर नहीं)। Torque wrench से manufacturer के torque पर कसिए, और gas छोड़ने से पहले leak test कीजिए।**
- Flare leak के आम कारण: flare छोटा या टेढ़ा, **flare के मुँह पर खरोंच**, ज़्यादा या कम कसना, burr साफ़ न करना।

### H3. Insulation, cotton tape और सफ़ेद पट्टी
- **Insulation:** closed-cell **nitrile rubber (NBR) foam** लें। ये नमी नहीं सोखता और आग-रोधी होता है।
- **मोटाई:** gas (suction) pipe पर आम तौर पर **≥ 13 mm**। उदाहरण के लिए Daikin का एक manual gas pipe insulation ≥ 13 mm और liquid pipe ≥ 10 mm कहता है। ज़्यादा नमी वाली जगह पर इससे भी मोटा।
- **दोनों pipes का insulation अलग-अलग** होना चाहिए, ताकि गर्म और ठंडे pipe के बीच गर्मी का लेन-देन न हो।
- **Suction pipe ठीक से ढका न हो तो** हवा की नमी उस पर पानी बनकर टपकती है, cooling बर्बाद होती है, और pipe में जंग लगती है।
- **Cotton tape (अंदर) + सफ़ेद PVC पट्टी (बाहर, नीचे से ऊपर की ओर लपेटी हुई):** pipes, तार और drain pipe को एक साथ बाँधती है, धूप और धूल से बचाती है। बाहर के हिस्से में **धूप (UV) से बचाव ज़रूरी है,** वरना insulation टूट जाता है।
- **ग्राहक के लिए AI की लाइन:** "मोटा insulation ठंडक को रास्ते में बर्बाद नहीं होने देता और pipe से पानी नहीं टपकता। इससे bill और दीवार दोनों बचते हैं।"

### H4. तार, drain और outdoor unit
- Indoor–outdoor connecting cable: manual में लिखी core और mm² वाली copper की cable। जोड़ के बीच में tape लगाकर बीच से जोड़ना नहीं।
- **Drain pipe:** लगातार नीचे की ढलान, कहीं ऊपर की ओर मोड़ नहीं। बाहर का सिरा पानी में डूबा न हो, और पानी पड़ोसी या दीवार पर न गिरे। (LG India 18 mm diameter का drain hose सुझाता है।)
- **Indoor unit:** पूरी तरह level में, drain की तरफ़ थोड़ा झुका हुआ।
- **Outdoor unit:** पीछे और ऊपर हवा के लिए खुली जगह, मज़बूत stand, धूप और बारिश से बचाव, गर्म हवा दोबारा न खींचे।
- **बिजली:** अलग DP MCB, सही तार, earthing (भाग A5)।
- **Vacuum** (≤500 micron) और flare पर leak test के बाद ही valves खोलें।

### H5. ग्राहक को दिखाने वाली "Installation quality checklist" (app में photo के साथ)
- [ ] Copper की मोटाई या brand की photo (≥0.8 mm)
- [ ] Insulation की मोटाई या brand (NBR, ≥13 mm gas pipe)
- [ ] Flare: torque, oil, बिना tape
- [ ] Nitrogen pressure test या leak test (photo)
- [ ] Vacuum reading (micron, photo)
- [ ] Drain test (पानी डालकर निकलना दिखाया)
- [ ] Voltage, MCB, earthing reading
- [ ] Running readings: ampere, suction PSI, grill temp

---

## भाग I — Inverter AC में धीरे-धीरे gas कम होना (LG, Voltas और दूसरे brands)
- **LG के अनुसार CH38 (कुछ models में F4) error का मतलब है refrigerant कम है।** ये चेतावनी appliance को नुकसान से बचाने के लिए है।
- LG ये भी कहता है कि installation या shift करने के तुरंत बाद आए error में gas की कमी की संभावना ज़्यादा है, जबकि इस्तेमाल के दौरान आया error कभी-कभी बिजली की अस्थिरता से भी अस्थायी हो सकता है।
- **धीमे leak की आम जगहें:** flare nut, service valve की pin या cap, indoor coil के U-bend या छोटे छेद, और outdoor coil (जंग या कंपन)।
- **Variable-speed (inverter) AC में gas का सही इलाज:** पूरी gas निकालिए, तौलिए कि कितनी कम थी, leak ढूँढकर ठीक कीजिए, फिर तौलकर दोबारा भरिए।
- **Oil choke (forum के अनुभव, अपुष्ट):** कुछ users ने बताया है कि service engineer ने indoor coil में compressor oil जमने को कम cooling का कारण बताया। इस पर कोई official guideline नहीं मिली, इसलिए AI इसे "संभावना" के तौर पर ही रखेगा, पक्के diagnosis के तौर पर नहीं।
- **Indian field data:** छोटे शहरों के grid में voltage वाले codes और gas से जुड़े codes (जैसे LG CH38, Daikin E4) ज़्यादा दिखते हैं। (ये एक blog का दावा है, पक्का आँकड़ा नहीं।)

---

## भाग J — झगड़े रोकना: ग्राहक और technician के बीच भरोसा

### J1. काम से पहले लिखित शर्तें (AI quotation में अपने-आप)
कई खराबियाँ खोलने, gas डालने या load पर चलाने के **बाद** ही पता चलती हैं। इसलिए AI काम शुरू होने से पहले ग्राहक को ये दिखाकर app पर "हाँ" लेगा:
> "जाँच का charge ₹__ है। Gas भरने के बाद अगर compressor load नहीं ले पाया या trip हुआ, तो compressor की जाँच और repair का खर्च अलग होगा। Gas का खर्च ₹__ है, जो leak test और vacuum के बाद भरी जाएगी।"

### J2. Low voltage से trip: सबूत और समझाना
- Technician AC **चलते समय** का voltage नापकर photo लेगा (app में timestamp के साथ)।
- 200V से कम हो तो AI ग्राहक को दिखाएगा: "Voltage कम होने पर compressor ज़्यादा current खींचता है और गर्म होकर trip करता है। ये AC की नहीं, supply की दिक्कत है।" फिर stabilizer, मोटा तार या बिजली विभाग से शिकायत की सलाह देगा।
- **Technician का भुगतान:** जाँच और जो काम हुआ उसका charge बनता है। ये बात पहले ही (J1) तय रहेगी।

### J3. "नया part भी जल गया": पहले वजह, फिर part
- **आपका उदाहरण:** indoor motor ख़राब था। नया motor लगाया, वो भी ख़राब हो गया, क्योंकि असली दिक्कत PCB में थी।
- **AI नियम:** नया motor, compressor या PCB लगाने से पहले उसको **जाने वाली supply या signal** नापिए।
  - Indoor BLDC fan motor: PCB से DC supply (जैसे ~310V DC, 15V, control signal) और feedback; पुराना AC motor: capacitor और winding।
  - Compressor: IPM output, winding (A7)।
  - PCB बदलने से पहले: sensors, wiring और motor short तो नहीं।
- PCB ख़राब हो तो **पहले PCB ठीक कीजिए, फिर नया motor लगाइए।** वरना नया part भी जलेगा।
- **ग्राहक को:** "पुराना part जलने की वजह PCB थी। हमने वजह ठीक कर दी है, इसलिए नया part सुरक्षित रहेगा।" (Photo और reading के सबूत के साथ।)
- **Part की warranty:** लगाने से पहले part का brand, warranty और bill app में दर्ज हो। Supplier की warranty बनी रहे, इसके लिए पुराना part और photo संभालकर रखें।

### J4. बहस के समय AI का "शांत मध्यस्थ" वाला काम
- Technician app में "ग्राहक को समझाओ" दबाए, तो AI ग्राहक की भाषा में readings, photo और नियम दिखाकर आसान explanation दे।
- दोनों तरफ़ की बात दर्ज हो। Company (Bijli Wala Aya) का support बीच में आ सके।
- Technician की सुरक्षा: बिना approval कोई बड़ा काम नहीं, सबूत save, और OTP से job बंद।

---

## भाग K — Technician और ग्राहक communities में सबसे आम सवाल (research)
| सवाल | सही जवाब (AI का) |
|---|---|
| "Pipe पर बर्फ़ जम रही है" | मोटा pipe या indoor coil पर बर्फ़: पहले filter, coil और blower (हवा कम)। फिर gas कम। **Gas कम में subcooling कम, choke में subcooling ज़्यादा** (C/B4)। Indoor हवा कम (low load) भी बर्फ़ का आम कारण है |
| "Gas हर साल डलवानी पड़ती है" | Gas ख़त्म नहीं होती। अगर कम है तो **leak है।** Leak ठीक किए बिना gas भरना पैसे की बर्बादी है |
| "CH38 / gas कम error" | Leak test → ठीक करना → vacuum → तौलकर charge। Installation के तुरंत बाद आए तो installation वाली gas या flare की जाँच |
| "CH05 / communication error" | Indoor–outdoor wiring, signal तार, PCB। Shift के बाद आम |
| "Cooling कम, हवा कमज़ोर" | Filter, coil की सफ़ाई, blower; फिर outdoor की सफ़ाई और हवा; फिर gas |
| "पानी अंदर टपक रहा है" | Drain choke या ढलान गलत, indoor unit level में नहीं, insulation फटा (pipe का पसीना) |
| "Bill ज़्यादा आ रहा है" | Set temp, गंदा filter या coil, gas कम (compressor लगातार चलता है), voltage, कमरे की धूप या insulation; label units से तुलना (भाग F) |
| "Stabilizer चाहिए?" | Voltage की range देखिए; कई inverter AC wide range में चलते हैं, model का manual देखिए |
| "Inverter में capacitor बदल दो" | Inverter compressor में capacitor नहीं होता (A7) |
| "Pipe पर teflon लगाओ" | Flare पर नहीं (H2) |

> **सीमा:** ये research सिर्फ़ उन्हीं websites और forums से है जो search में खुले। बंद WhatsApp और Facebook groups शामिल नहीं हैं। आपके अपने technicians के 2021 से अब तक के jobs का data इस table को सबसे ज़्यादा मज़बूत बनाएगा, इसलिए उसे भी AI के knowledge base में डालिए।

---

## भाग L — Build Prompt Addendum 2 (पहले के prompt और Addendum 1 के साथ जोड़ें)
````markdown
# ADDENDUM 2: FIELD WORKFLOW, INSTALLATION QUALITY, DISPUTES, ENERGY LABEL
1. energyLabel.ts: personalAnnualUnits(labelKWh, userHours) = labelKWh*userHours/1600;
   annualBill(units, tariff); paybackYears(priceDiff, annualSaving). UI: "Star vs Star" compare.
2. Technician workflow order enforced in stepper: Phone intake → Visual/Supply checks →
   Touch/Listen checklist → Clamp meter (V, A) → Pipe temps → Gauge ONLY if
   suspectRefrigerant=true (show warning "gauge लगाने से थोड़ी gas जाती है") → PCB/wiring checks.
3. installationChecklist: copper ≥0.8 mm (R410A/R32), ACR grade, flare (oil on face,
   torque, NO teflon/leak-lock), NBR insulation ≥13 mm suction, separate insulation,
   UV-protected wrap, drain slope test, outdoor clearance, DP MCB + earth, N2 pressure test,
   vacuum ≤500 micron. Each item = photo + value; generates "Installation Quality Certificate"
   for customer.
4. rootCauseBeforeReplace rule: replacing fan motor / compressor / PCB is BLOCKED until the
   upstream supply/signal reading is entered and within range.
5. consentAndTerms: before work, customer approves conditional terms (diagnosis fee,
   possible post-charge compressor failure, gas charged only after leak test + vacuum).
   Store signed consent with timestamp.
6. lowVoltageEvidence: running voltage reading + photo; if <200V, generate customer
   explanation + stabilizer/wiring advice; mark job "supply issue" (technician fee protected).
7. disputeAssist: "Explain to customer" button → Gemini creates Hindi explanation from
   readings/photos/rules; log both parties' notes; escalate to company support.
8. errorCodeKB: brand-wise codes (e.g. LG CH38 = low refrigerant, CH05 = indoor/outdoor
   communication) with source link + verified flag.
9. tierMode: "Tier-3 mode" = simpler Hindi voice, fewer tools assumed, offline checklist;
   "Tier-1 mode" = digital gauge/micron inputs, detailed PDF report.
````

---

## Sources और जाँच
- Ton और kW conversion, Ohm का नियम, P = VI·PF, I²R और Xc ये सब मानक physics हैं।
- Refrigerant formula, ODP, GWP और safety class (ASHRAE 34 / IPCC AR4 के मोटे values): PT values लगभग हैं, इसलिए **demo से पहले manufacturer के PT chart से मिलाएँ।**
- तार, MCB, current और pressure की ranges आम field practice के अनुमान हैं। **IS standards (जैसे IS 732, IS 694), brand manuals और नियमों से पक्का करें।** AI Supervisor में ये config values हैं, जिन्हें admin बदल सकता है।

**Research links (भाग F–K):**
- [BEE Schedule 24 – ISEER, 1600 hours](https://beeindia.gov.in/sites/default/files/Schedule_24_LCAC.pdf)
- [CAG – ISEER overview](https://www.cag.org.in/newsletters/public-newsense/indian-seasonal-energy-efficiency-ratio-iseer-overview)
- [LG India – star ratings explained](https://www.lg.com/in/magazine/what-star-ratings-really-mean-when-buying-an-ac-in-india/)
- [HVAC School – no Teflon/Leak Lock on flares](https://hvacrschool.com/5-simple-service-valve-tips/)
- [Clean Heat Connect – flare fitting do's](https://cleanheatconnect.ny.gov/assets/pdf/always-do-this.pdf)
- [AC Service Tech – why flares leak](https://acservicetech.com/post/10-reasons-why-a-mini-split-ductless-flare-may-leak-refrigerant)
- [Sanyo manual – never <0.8 mm tubing for R410A](https://www.manualslib.com/manual/728306/Sanyo-Cool.html?page=30)
- [Daikin manual – pipe & insulation thickness](https://manualslib.es/manual/507805/Daikin-Ftx20K2V1B.html?page=22)
- [Airconspares – insulation best practices](https://www.airconspares.com/pages/blog-post-7)
- [MRCOOL – UV protection of line insulation](https://portal.mrcool.com/?p=26559)
- [ACHR News – why AC systems freeze](https://www.achrnews.com/articles/142476-why-air-conditioning-systems-freeze-and-how-to-fix-them)
- [ACHR News – diagnosing ductless systems](https://www.achrnews.com/articles/152658-diagnosing-ductless-hvac-systems)
- [LG – CH38 / CH05 error codes](https://www.lg.com/lk/support/product-help/CT30012676-20154779556369)
- [LG – error code guide (CH38 after use)](https://www.lg.com/us/support/help-library/lg-air-conditioner-guide-to-error-codes--20155047719306)
- [LG India – drain hose 18 mm](https://www.lg.com/in/support/product-support/troubleshoot/help-library/cs-CT00022939-20154779550960/)
- [TechEnclave forum – LG oil choke (user report)](https://techenclave.com/t/lg-ac-gas-oil-choke/268816)
- [DesiUtility – Indian error code guide](https://desiutility.com/blog/ac-error-codes-self-diagnosis-guide)
