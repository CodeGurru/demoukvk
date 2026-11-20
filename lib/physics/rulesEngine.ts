/**
 * Bijli Wala Aya AI Supervisor - Integrated Rules Engine
 * Enforces Physics, Chemistry, and Hard Safety Gates
 * Reference: AI_Supervisor_FINAL_BUILD.md & AI_Supervisor_Physics_Chemistry_KB.md
 */

import { evaluateElectrical, ElectricalMeasurement } from './electrical';
import { evaluateRefrigerantPressure, RefrigerantType } from './refrigerant';

export interface DiagnosticInput {
  appliance: {
    brand: string;
    capacityTon: string;
    type: 'Inverter' | 'Non-Inverter';
    refrigerant: RefrigerantType;
  };
  readings: {
    voltage: number;
    currentAmp: number;
    suctionPsi: number;
    roomTempC?: number;
    grillTempC?: number;
  };
  safetyGateCompleted: boolean;
  selectedFault?: string;
}

export interface RuleEngineVerdict {
  verdictId: string;
  primaryFault: string;
  rootCause: string;
  confidenceScore: number;
  safetyPassed: boolean;
  blockedActions: string[];
  approvedSteps: string[];
  electricalSummary: string;
  pressureSummary: string;
  estimatedCostRange: { min: number; max: number; currency: 'INR' };
}

export function runPhysicsRulesEngine(input: DiagnosticInput): RuleEngineVerdict {
  const { appliance, readings, safetyGateCompleted, selectedFault } = input;

  const elecResult = evaluateElectrical({
    measuredVoltage: readings.voltage,
    measuredCurrent: readings.currentAmp,
    ratedCurrent: appliance.capacityTon.includes('2') ? 8.5 : appliance.capacityTon.includes('1.0') ? 4.5 : 6.5
  });

  const pressureResult = evaluateRefrigerantPressure(
    appliance.refrigerant,
    readings.suctionPsi
  );

  const blockedActions: string[] = [];
  const approvedSteps: string[] = [];

  // Safety Gate Evaluation
  if (!safetyGateCompleted) {
    blockedActions.push('ALL_REPAIRS_LOCKED: जब तक MCB बंद, कैपेसिटर डिस्चार्ज और रबर ग्लव्स नहीं होंगे, कोई रिपेयर स्टेप नहीं खुलेगा!');
  }

  // Refrigerant Safety Lockout
  if (pressureResult.leakProbable) {
    blockedActions.push('DIRECT_GAS_CHARGE_LOCKED: बिना साबुन टेस्ट व 500 माइक्रोन वैक्यूम के गैस चार्जिंग सख्त मना है!');
  }

  // Fault determination based on physics data
  let primaryFault = "सामान्य निरीक्षण (All Parameters Nominal)";
  let rootCause = "सिस्टम सामान्य दायरे में काम कर रहा है।";
  let confidenceScore = 0.92;
  let costMin = 199;
  let costMax = 399;

  if (selectedFault?.includes('ब्लोअर') || selectedFault?.includes('blower')) {
    primaryFault = "इंडोर फ़ैन ब्लोअर सर्किट फॉल्ट (3.5µF कैपेसिटर या मोटर वाइंडिंग)";
    rootCause = "ब्लोअर मोटर को स्टार्टिंग टॉर्क नहीं मिल रहा या इंडोर PCB रिले ट्रिप है।";
    approvedSteps.push("इंडोर PCB खोलकर 3.5µF कैपेसिटर की वैल्यू मल्टीमीटर से नापें।");
    approvedSteps.push("CN-FAN कनेक्टर पर लाल और नीले तार पर 230V AC चेक करें।");
    approvedSteps.push("खराब होने पर नया 3.5µF कैपेसिटर लगाएं और रोटर को हाथ से घुमाकर जाम चेक करें।");
    costMin = 450;
    costMax = 850;
  } else if (pressureResult.status === 'LEAK_EMPTY' || pressureResult.status === 'UNDERCHARGE') {
    primaryFault = `आउटडोर फ्लेयर नट से ${appliance.refrigerant} गैस रिसाव (Low Refrigerant Leak)`;
    rootCause = `सक्शन प्रेशर सिर्फ ${readings.suctionPsi} PSI है (नॉर्मल: 125 PSI) और कंप्रेसर लोड ${elecResult.loadPercentage}% है।`;
    confidenceScore = pressureResult.confidence;
    approvedSteps.push("आउटडोर यूनिट के दोनों सर्विस वाल्व और फ्लेयर नट पर साबुन का झाग लगाएं।");
    approvedSteps.push("लीक मिलने पर फ्लेयर को फिर से सही टॉर्क पर टाइट करें।");
    approvedSteps.push("नाइट्रोजन 250 PSI डालकर 15 मिनट प्रेशर होल्ड टेस्ट करें।");
    approvedSteps.push("वैक्यूम पंप लगाकर 500 माइक्रोन तक नमी बाहर निकालें।");
    approvedSteps.push(`तौलकर (Electronic Scale) सटीक मात्रा में असली ${appliance.refrigerant} गैस चार्ज करें।`);
    costMin = 1199;
    costMax = 1499;
  } else if (elecResult.voltageStatus === 'LOW') {
    primaryFault = `कम सप्लाई वोल्टेज फॉल्ट (${readings.voltage}V Input Drop)`;
    rootCause = "सप्लाई 190V से कम है। कंप्रेसर को समान पावर देने के लिए अत्यधिक करंट खींचना पड़ रहा है।";
    approvedSteps.push("स्टेबलाइजर का आउटपुट वोल्टेज मल्टीमीटर से चेक करें।");
    approvedSteps.push("मेन सॉकेट का लूज कनेक्शन व तार का साइज (कम से कम 2.5 sq mm) चेक करें।");
    costMin = 250;
    costMax = 650;
  }

  return {
    verdictId: `VERDICT-${Date.now().toString(36).toUpperCase()}`,
    primaryFault,
    rootCause,
    confidenceScore,
    safetyPassed: safetyGateCompleted,
    blockedActions,
    approvedSteps,
    electricalSummary: `${readings.voltage}V • ${readings.currentAmp}A (${elecResult.loadPercentage}% RLA)`,
    pressureSummary: `${readings.suctionPsi} PSI (${appliance.refrigerant})`,
    estimatedCostRange: { min: costMin, max: costMax, currency: 'INR' }
  };
}
