/**
 * AI Supervisor - Capacitor Health Diagnostic
 * Based on AI_Supervisor_Physics_Chemistry_KB.md (Section A6)
 */

export interface CapacitorCheckResult {
  ratedUf: number;
  measuredUf: number;
  deviationPercent: number;
  isWithinTolerance: number | boolean;
  status: 'HEALTHY' | 'DEGRADED' | 'FAILED_OPEN' | 'FAILED_SHORT';
  actionAllowed: 'KEEP' | 'REPLACE_REQUIRED' | 'REPLACE_BLOCKED';
  messageHi: string;
}

export function evaluateCapacitor(ratedUf: number, measuredUf: number): CapacitorCheckResult {
  if (measuredUf === 0) {
    return {
      ratedUf,
      measuredUf,
      deviationPercent: -100,
      isWithinTolerance: false,
      status: 'FAILED_OPEN',
      actionAllowed: 'REPLACE_REQUIRED',
      messageHi: `कैपेसिटर पूर्णतः ख़राब (0 µF) है। इसे समान रेटिंग (${ratedUf} µF 440V) से बदलें।`,
    };
  }

  const deviation = ((measuredUf - ratedUf) / ratedUf) * 100;
  const deviationPct = +deviation.toFixed(1);

  // ±6% is industry standard manufacturer tolerance
  if (Math.abs(deviation) <= 6.0) {
    return {
      ratedUf,
      measuredUf,
      deviationPercent: deviationPct,
      isWithinTolerance: true,
      status: 'HEALTHY',
      actionAllowed: 'REPLACE_BLOCKED',
      messageHi: `कैपेसिटर स्वस्थ है (${measuredUf} µF, विचलन ${deviationPct}% जो ±6% सीमा में है)। बदलने की ज़रूरत नहीं है - रिप्लेसमेंट ब्लॉक 🔒।`,
    };
  } else if (deviation < -6.0) {
    return {
      ratedUf,
      measuredUf,
      deviationPercent: deviationPct,
      isWithinTolerance: false,
      status: 'DEGRADED',
      actionAllowed: 'REPLACE_REQUIRED',
      messageHi: `कैपेसिटर कमज़ोर है (${measuredUf} µF, ${Math.abs(deviationPct)}% गिरावट)। स्टार्टिंग टॉर्क कमज़ोर रहेगा और कंप्रेसर गरम होकर ट्रिप होगा। नया ${ratedUf} µF 440V कैपेसिटर लगाएँ।`,
    };
  } else {
    return {
      ratedUf,
      measuredUf,
      deviationPercent: deviationPct,
      isWithinTolerance: false,
      status: 'DEGRADED',
      actionAllowed: 'REPLACE_REQUIRED',
      messageHi: `कैपेसिटर वैल्यू असामान्य रूप से अधिक (${measuredUf} µF) है। वाइंडिंग ओवरहीटिंग का ख़तरा है।`,
    };
  }
}
