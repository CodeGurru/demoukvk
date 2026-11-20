/**
 * AI Supervisor - Wire and MCB Sizing Logic
 * Based on AI_Supervisor_Physics_Chemistry_KB.md (Section A5)
 */

export interface WiringRecommendation {
  recommendedWireSqMm: number;
  safeCurrentAmpMax: number;
  recommendedMcbRatingAmp: number;
  mcbCurve: 'C';
  mcbPoles: 'Double Pole (DP)';
  earthingRequired: boolean;
  notesHi: string;
}

export function recommendWiring(tonnage: number, distanceMeters: number = 5): WiringRecommendation {
  if (tonnage <= 1.0) {
    return {
      recommendedWireSqMm: 2.5,
      safeCurrentAmpMax: 18,
      recommendedMcbRatingAmp: 16,
      mcbCurve: 'C',
      mcbPoles: 'Double Pole (DP)',
      earthingRequired: true,
      notesHi: '1.0 TR के लिए 2.5 mm² तांबे का तार और 16A C-curve DP MCB अनिवार्य है।',
    };
  } else if (tonnage <= 1.5) {
    const wireSize = distanceMeters > 15 ? 4.0 : 2.5;
    return {
      recommendedWireSqMm: wireSize,
      safeCurrentAmpMax: wireSize === 4.0 ? 26 : 18,
      recommendedMcbRatingAmp: 16,
      mcbCurve: 'C',
      mcbPoles: 'Double Pole (DP)',
      earthingRequired: true,
      notesHi: distanceMeters > 15 
        ? 'लंबी दूरी (>15m) पर वोल्टेज ड्रॉप रोकने के लिए 4.0 mm² तार और 16-20A C-curve MCB लगाएँ।'
        : '1.5 TR के लिए 2.5 mm² कॉपर वायर और 16A C-curve DP MCB सही है।',
    };
  } else {
    return {
      recommendedWireSqMm: 4.0,
      safeCurrentAmpMax: 26,
      recommendedMcbRatingAmp: 25,
      mcbCurve: 'C',
      mcbPoles: 'Double Pole (DP)',
      earthingRequired: true,
      notesHi: '2.0 TR या बड़े AC के लिए कम से कम 4.0 mm² तांबे का तार और 20-25A C-curve DP MCB लगाएँ।',
    };
  }
}

export function verifyEarthing(neutralEarthVoltage: number): { isSafe: boolean; messageHi: string } {
  if (neutralEarthVoltage > 5.0) {
    return {
      isSafe: false,
      messageHi: `अर्थ-न्यूट्रल वोल्टेज ${neutralEarthVoltage}V अधिक है (मानक < 2-5V)। बॉडी लीकेज और शॉक का गंभीर ख़तरा है।`,
    };
  }
  return {
    isSafe: true,
    messageHi: `अर्थिंग सुरक्षित है (${neutralEarthVoltage}V)।`,
  };
}
