/**
 * Bijli Wala Aya AI Supervisor - Electrical Physics Engine
 * Reference: AI_Supervisor_Physics_Chemistry_KB.md (Section A1, A4)
 */

export interface ElectricalMeasurement {
  measuredVoltage: number;    // Line voltage (V)
  measuredCurrent: number;    // Running current (A)
  ratedCurrent?: number;      // RLA on nameplate (default: 6.5A for 1.5TR inverter)
  powerFactor?: number;       // ~0.95 for inverter PFC, ~0.85 for non-inverter
}

export interface ElectricalAnalysis {
  status: 'SAFE' | 'WARNING' | 'DANGER';
  voltageStatus: 'LOW' | 'NORMAL' | 'HIGH';
  currentStatus: 'UNDERLOAD' | 'NORMAL' | 'OVERLOAD';
  loadPercentage: number;
  apparentPowerVA: number;
  realPowerWatts: number;
  recommendations: string[];
}

export function evaluateElectrical(data: ElectricalMeasurement): ElectricalAnalysis {
  const { measuredVoltage, measuredCurrent, ratedCurrent = 6.5, powerFactor = 0.95 } = data;
  const loadPercentage = Math.round((measuredCurrent / ratedCurrent) * 100);
  const apparentPowerVA = Math.round(measuredVoltage * measuredCurrent);
  const realPowerWatts = Math.round(apparentPowerVA * powerFactor);

  const recommendations: string[] = [];
  let voltageStatus: 'LOW' | 'NORMAL' | 'HIGH' = 'NORMAL';
  let currentStatus: 'UNDERLOAD' | 'NORMAL' | 'OVERLOAD' = 'NORMAL';
  let status: 'SAFE' | 'WARNING' | 'DANGER' = 'SAFE';

  // Voltage evaluation
  if (measuredVoltage < 190) {
    voltageStatus = 'LOW';
    status = 'DANGER';
    recommendations.push(`अत्यधिक कम वोल्टेज (${measuredVoltage}V): कंप्रेसर ओवरहीट और वाइंडिंग जलने का खतरा। स्टेबलाइजर चेक करें।`);
  } else if (measuredVoltage > 250) {
    voltageStatus = 'HIGH';
    status = 'WARNING';
    recommendations.push(`हाई वोल्टेज (${measuredVoltage}V): PCB सर्ज प्रोटेक्टर पर दबाव।`);
  }

  // Current load evaluation
  if (loadPercentage < 65) {
    currentStatus = 'UNDERLOAD';
    if (status !== 'DANGER') status = 'WARNING';
    recommendations.push(`कंप्रेसर कम लोड (${loadPercentage}% RLA): गैस कम होने या इनवर्टर लो-फ्रीक्वेंसी मोड का संकेत।`);
  } else if (loadPercentage > 120) {
    currentStatus = 'OVERLOAD';
    status = 'DANGER';
    recommendations.push(`कंप्रेसर ओवरलोड (${loadPercentage}% RLA): कंडेनसर जाम, गैस ओवरचार्ज, या कम वोल्टेज का लक्षण। OLP ट्रिप हो सकता है।`);
  }

  return {
    status,
    voltageStatus,
    currentStatus,
    loadPercentage,
    apparentPowerVA,
    realPowerWatts,
    recommendations,
  };
}

/**
 * Electricity Bill calculation
 * Formula: monthly units = kW * dailyHours * days
 * Formula: monthly bill = monthly units * ratePerKwh
 */
export function calculateBill(
  inputPowerKw: number,
  dailyHours: number = 8,
  days: number = 30,
  ratePerKwh: number = 7
): { monthlyKwh: number; monthlyBillInr: number } {
  const monthlyKwh = Math.round(inputPowerKw * dailyHours * days);
  const monthlyBillInr = Math.round(monthlyKwh * ratePerKwh);
  return { monthlyKwh, monthlyBillInr };
}

/**
 * Voltage drop calculation across copper conductor
 * V_drop = 2 * I * L * R_per_meter
 */
export function calculateVoltageDrop(
  currentAmp: number,
  distanceMeters: number,
  wireSqMm: number
): { voltageDrop: number; percentageDrop: number; isAcceptable: boolean } {
  // Copper resistivity ~ 0.0175 ohm*mm^2 / m
  const resistance = (0.0175 * (2 * distanceMeters)) / wireSqMm;
  const voltageDrop = +(currentAmp * resistance).toFixed(2);
  const percentageDrop = +((voltageDrop / 230) * 100).toFixed(1);
  return {
    voltageDrop,
    percentageDrop,
    isAcceptable: percentageDrop <= 3.0,
  };
}
