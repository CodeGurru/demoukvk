/**
 * AI Supervisor - Compressor Winding and Insulation Diagnostics
 * Based on AI_Supervisor_Physics_Chemistry_KB.md (Section A7)
 */

export interface PscWindingResult {
  isValid: boolean;
  isBalancedSum: boolean;
  deviationPercentage: number;
  messageHi: string;
}

export function testPscWinding(c_s: number, c_r: number, s_r: number): PscWindingResult {
  const expectedSR = c_s + c_r;
  const deviation = Math.abs(s_r - expectedSR) / (expectedSR || 1);
  const deviationPct = +(deviation * 100).toFixed(1);

  if (s_r === 0 || c_s === 0 || c_r === 0) {
    return {
      isValid: false,
      isBalancedSum: false,
      deviationPercentage: 100,
      messageHi: 'वाइंडिंग शॉर्ट सर्किट (0 Ohm) पाई गई। कंप्रेसर मोटर ख़राब है।',
    };
  }

  // Winding open check (indicated by > 999 or infinity)
  if (s_r > 500 || c_s > 500 || c_r > 500) {
    return {
      isValid: false,
      isBalancedSum: false,
      deviationPercentage: 100,
      messageHi: 'वाइंडिंग ओपन (अनंत रेजिस्टेंस) है या इंटरनल OLP ट्रिप है। मोटर ठंडी होने पर पुनः मापें।',
    };
  }

  // Tolerance is 5-6%
  const isBalanced = deviation <= 0.06;

  return {
    isValid: isBalanced,
    isBalancedSum: isBalanced,
    deviationPercentage: deviationPct,
    messageHi: isBalanced
      ? `वाइंडिंग स्वस्थ है: R(S-R) = ${s_r}Ω ≈ R(C-S)[${c_s}Ω] + R(C-R)[${c_r}Ω] (विचलन ${deviationPct}%)।`
      : `वाइंडिंग शॉर्ट या गलत टर्मिनल: R(S-R)=${s_r}Ω, योग=${expectedSR}Ω (विचलन ${deviationPct}% > 5%)।`,
  };
}

export interface BldcWindingResult {
  isBalanced: boolean;
  uv: number;
  vw: number;
  wu: number;
  messageHi: string;
}

export function testBldcWinding(uv: number, vw: number, wu: number): BldcWindingResult {
  const avg = (uv + vw + wu) / 3;
  const maxDiff = Math.max(Math.abs(uv - avg), Math.abs(vw - avg), Math.abs(wu - avg));
  const diffPct = +( (maxDiff / (avg || 1)) * 100 ).toFixed(1);

  const isBalanced = diffPct <= 6;

  return {
    isBalanced,
    uv,
    vw,
    wu,
    messageHi: isBalanced
      ? `BLDC तीन-फेज वाइंडिंग संतुलित है (औसत ${avg.toFixed(2)}Ω, विचलन ${diffPct}%)।`
      : `BLDC वाइंडिंग असंतुलित है (UV:${uv}Ω, VW:${vw}Ω, WU:${wu}Ω)। IPM ड्राइवर ट्रिप हो जाएगा।`,
  };
}

export function testInsulationMegger(resistanceMOhm: number): { isSafe: boolean; messageHi: string } {
  if (resistanceMOhm < 1.0) {
    return {
      isSafe: false,
      messageHi: `इंसुलेशन बहुत ख़राब (${resistanceMOhm} MΩ < 1 MΩ)। अर्थ लीकेज / ग्राउंड शॉर्ट है। चालू न करें।`,
    };
  }
  if (resistanceMOhm < 2.0) {
    return {
      isSafe: false,
      messageHi: `इंसुलेशन कमज़ोर है (${resistanceMOhm} MΩ)। नमी या इंसुलेशन घिसने की संभावना।`,
    };
  }
  return {
    isSafe: true,
    messageHi: `इंसुलेशन पूर्णतः सुरक्षित है (${resistanceMOhm} MΩ > 2 MΩ)।`,
  };
}
