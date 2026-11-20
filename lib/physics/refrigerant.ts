/**
 * Bijli Wala Aya AI Supervisor - Refrigerant Chemistry & Pressure Engine
 * Reference: AI_Supervisor_Physics_Chemistry_KB.md
 */

export type RefrigerantType = 'R32' | 'R410A' | 'R22';

export interface RefrigerantSpecs {
  minSuctionPsi: number;
  maxSuctionPsi: number;
  nominalSuctionPsi: number;
  dischargeMinPsi: number;
  dischargeMaxPsi: number;
  flammability: string;
  ecoRating: string;
  boilingPointC: number;
}

export const REFRIGERANT_DATABASE: Record<RefrigerantType, RefrigerantSpecs> = {
  R32: {
    minSuctionPsi: 115,
    maxSuctionPsi: 135,
    nominalSuctionPsi: 125,
    dischargeMinPsi: 350,
    dischargeMaxPsi: 420,
    flammability: "A2L (ज्वलनशील - स्पार्क या आग से दूर रखें)",
    ecoRating: "GWP 675 (पर्यावरण सुरक्षित)",
    boilingPointC: -51.7
  },
  R410A: {
    minSuctionPsi: 120,
    maxSuctionPsi: 140,
    nominalSuctionPsi: 130,
    dischargeMinPsi: 380,
    dischargeMaxPsi: 450,
    flammability: "A1 (अज्वलनशील)",
    ecoRating: "GWP 2088 (Blend of R32+R125)",
    boilingPointC: -48.5
  },
  R22: {
    minSuctionPsi: 60,
    maxSuctionPsi: 75,
    nominalSuctionPsi: 65,
    dischargeMinPsi: 220,
    dischargeMaxPsi: 280,
    flammability: "A1 (पुराना HCFC)",
    ecoRating: "ओजोन हानिकारक (Phase-out)",
    boilingPointC: -40.8
  }
};

export interface PressureAnalysis {
  status: 'LEAK_EMPTY' | 'UNDERCHARGE' | 'OPTIMAL' | 'OVERCHARGE';
  deviationPsi: number;
  confidence: number;
  diagnosisText: string;
  leakProbable: boolean;
  blockedAction?: string;
}

export function evaluateRefrigerantPressure(
  gas: RefrigerantType,
  measuredPsi: number
): PressureAnalysis {
  const specs = REFRIGERANT_DATABASE[gas] || REFRIGERANT_DATABASE.R32;
  const deviationPsi = Math.round(measuredPsi - specs.nominalSuctionPsi);

  if (measuredPsi < 60) {
    return {
      status: 'LEAK_EMPTY',
      deviationPsi,
      confidence: 0.94,
      diagnosisText: `अत्यधिक गंभीर गैस लीकेज: सक्शन प्रेशर सिर्फ ${measuredPsi} PSI है (होना चाहिए ${specs.nominalSuctionPsi} PSI)। आउटडोर फ्लेयर नट या सर्विस वाल्व से भारी रिसाव।`,
      leakProbable: true,
      blockedAction: 'सीधी गैस डालना सख्त मना है 🔒। पहले नाइट्रोजन प्रेशर से लीक ढूंढकर ठीक करें, फिर 500 माइक्रोन तक वैक्यूम करें।'
    };
  }

  if (measuredPsi < specs.minSuctionPsi) {
    return {
      status: 'UNDERCHARGE',
      deviationPsi,
      confidence: 0.88,
      diagnosisText: `गैस कम है (Undercharged): प्रेशर ${measuredPsi} PSI है, जबकि सामान्य ${specs.minSuctionPsi}-${specs.maxSuctionPsi} PSI होना चाहिए। कूलिंग धीमी होगी।`,
      leakProbable: true,
      blockedAction: 'गैस टॉप-अप से पहले साबुन के पानी से फ्लेयर नट चेक करें।'
    };
  }

  if (measuredPsi > specs.maxSuctionPsi + 10) {
    return {
      status: 'OVERCHARGE',
      deviationPsi,
      confidence: 0.86,
      diagnosisText: `गैस ओवरचार्ज / कंडेनसर चोक: प्रेशर ${measuredPsi} PSI अत्यधिक उच्च है। कंप्रेसर पर अत्यधिक लोड पड़ेगा और OLP ट्रिप होगा।`,
      leakProbable: false,
      blockedAction: 'कंडेनसर कॉइल की सफाई करें, अतिरिक्त गैस धीरे-धीरे रिकवर करें।'
    };
  }

  return {
    status: 'OPTIMAL',
    deviationPsi,
    confidence: 0.95,
    diagnosisText: `गैस प्रेशर बिल्कुल सही है: ${measuredPsi} PSI (${specs.minSuctionPsi}-${specs.maxSuctionPsi} PSI के आदर्श दायरे में)।`,
    leakProbable: false
  };
}
