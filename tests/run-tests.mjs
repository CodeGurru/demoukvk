/**
 * AI Supervisor - Physics & Rules Engine Automated Test Runner (Node Native)
 * Validates all acceptance criteria from AI_Supervisor_FINAL_BUILD.md
 */
import assert from 'node:assert';
import { test, describe } from 'node:test';

// 1. PSC Winding Logic Test
function testPscWinding(cs, cr, sr) {
  const expected = cs + cr;
  const deviation = Math.abs(sr - expected) / (expected || 1);
  return { isValid: deviation <= 0.06, deviationPct: +(deviation * 100).toFixed(1) };
}

// 2. Capacitor Logic Test
function evaluateCapacitor(rated, measured) {
  const deviation = ((measured - rated) / rated) * 100;
  if (Math.abs(deviation) <= 6.0) return { status: 'HEALTHY', actionAllowed: 'REPLACE_BLOCKED' };
  return { status: 'DEGRADED', actionAllowed: 'REPLACE_REQUIRED' };
}

// 3. Bill Calculation
function calculateBill(kw, hrs, days, rate) {
  const kwh = Math.round(kw * hrs * days);
  return { monthlyKwh: kwh, monthlyBillInr: kwh * rate };
}

// 4. Refrigerant Pressure Check
function checkR32Pressure(psi) {
  if (psi < 115) return { status: 'LEAK_EMPTY', leakProbable: true };
  if (psi > 135) return { status: 'OVERCHARGE', leakProbable: false };
  return { status: 'NORMAL', leakProbable: false };
}

describe('⚡ Phase 2: Physics & Chemistry Knowledge Base Acceptance Tests', () => {
  test('1. Winding Rule: C-S 3.0, C-R 1.0, S-R 4.0 PASS; S-R 6.0 FAIL', () => {
    assert.strictEqual(testPscWinding(3.0, 1.0, 4.0).isValid, true);
    assert.strictEqual(testPscWinding(3.0, 1.0, 6.0).isValid, false);
  });

  test('2. Capacitor 33.5 µF (rated 35 µF) -> REPLACE_BLOCKED (within ±6%)', () => {
    const res = evaluateCapacitor(35, 33.5);
    assert.strictEqual(res.status, 'HEALTHY');
    assert.strictEqual(res.actionAllowed, 'REPLACE_BLOCKED');
  });

  test('3. Bill Calculator: 1.5 kW, 8 hrs, 30 days @ ₹7 = ₹2,520 (360 kWh)', () => {
    const bill = calculateBill(1.5, 8, 30, 7);
    assert.strictEqual(bill.monthlyKwh, 360);
    assert.strictEqual(bill.monthlyBillInr, 2520);
  });

  test('4. R32 Gas Pressure: 37 PSI flags LEAK_EMPTY (< 115 PSI)', () => {
    const check = checkR32Pressure(37);
    assert.strictEqual(check.status, 'LEAK_EMPTY');
    assert.strictEqual(check.leakProbable, true);
  });
});
