/**
 * AI Supervisor - Capacity Physics Calculations
 * Based on AI_Supervisor_Physics_Chemistry_KB.md (Section A2)
 */

export interface CapacityDetails {
  tonnage: number;
  coolingBtuPerHour: number;
  coolingKw: number;
  estimatedInputPowerWatts: number;
  modelIdentifier: string;
}

export function calculateCapacity(tonnage: number, isEer: number = 3.8): CapacityDetails {
  const btu = Math.round(tonnage * 12000);
  const kw = +(tonnage * 3.517).toFixed(2);
  const inputPower = Math.round((kw * 1000) / isEer);
  const modelId = tonnage === 1.0 ? '12' : tonnage === 1.5 ? '18' : tonnage === 2.0 ? '24' : `${Math.round(tonnage * 12)}`;

  return {
    tonnage,
    coolingBtuPerHour: btu,
    coolingKw: kw,
    estimatedInputPowerWatts: inputPower,
    modelIdentifier: modelId,
  };
}

/**
 * Air enthalpy cooling estimation: Q(W) ≈ 1.2 * airflow(m3/s) * 1005 * ΔT(°C)
 */
export function estimateFieldCoolingWatts(
  airflowM3PerSec: number,
  deltaTempC: number
): number {
  return Math.round(1.2 * airflowM3PerSec * 1005 * deltaTempC);
}
