/**
 * AI Supervisor - Physics & Rules Engine Automated Test Suite
 * Acceptance Tests from AI_Supervisor_FINAL_BUILD.md (Phase 2)
 */
import assert from 'node:assert';
import { test, describe } from 'node:test';
import { testPscWinding } from '../lib/physics/compressor';
import { evaluateCapacitor } from '../lib/physics/capacitor';
import { calculateBill } from '../lib/physics/electrical';
import { evaluateRefrigerantPressure } from '../lib/physics/refrigerant';
import { runPhysicsRulesEngine } from '../lib/physics/rulesEngine';

describe('⚡ Phase 2: Physics & Chemistry Knowledge Base Tests', () => {
  test('1. PSC Winding Sum Rule: R(S-R) = R(C-S) + R(C-R) ±5%', () => {
    // Valid case: 3.0 + 1.0 = 4.0
    const passResult = testPscWinding(3.0, 1.0, 4.0);
    assert.strictEqual(passResult.isValid, true, 'Winding with C-S 3.0 + C-R 1.0 = S-R 4.0 must pass');
    assert.strictEqual(passResult.isBalancedSum, true);

    // Fail case: 3.0 + 1.0 = 4.0, but measured S-R is 6.0
    const failResult = testPscWinding(3.0, 1.0, 6.0);
    assert.strictEqual(failResult.isValid, false, 'Winding with S-R 6.0 must fail');
  });

  test('2. Capacitor ±6% Tolerance and Replacement Lock', () => {
    // Rated 35 µF, measured 33.5 µF (-4.3% deviation, within ±6%)
    const healthyCap = evaluateCapacitor(35, 33.5);
    assert.strictEqual(healthyCap.status, 'HEALTHY');
    assert.strictEqual(healthyCap.actionAllowed, 'REPLACE_BLOCKED', 'Healthy capacitor replacement must be BLOCKED');

    // Severely degraded capacitor: rated 35 µF, measured 28 µF (-20% deviation)
    const badCap = evaluateCapacitor(35, 28);
    assert.strictEqual(badCap.status, 'DEGRADED');
    assert.strictEqual(badCap.actionAllowed, 'REPLACE_REQUIRED');
  });

  test('3. Electricity Bill Calculation (Single & Inverter)', () => {
    // 1.5 kW, 8 hrs/day, 30 days = 360 kWh * ₹7 = ₹2,520
    const bill = calculateBill(1.5, 8, 30, 7);
    assert.strictEqual(bill.monthlyKwh, 360);
    assert.strictEqual(bill.monthlyBillInr, 2520);
  });

  test('4. Refrigerant Pressure & Leak Diagnosis (R32)', () => {
    // Normal R32 is 115-135 PSI. 37 PSI should flag severe leak/empty
    const leakCheck = evaluateRefrigerantPressure('R32', 37);
    assert.strictEqual(leakCheck.leakProbable, true);
    assert.strictEqual(leakCheck.status, 'LEAK_EMPTY');

    // Normal R32 operating at 125 PSI
    const normalCheck = evaluateRefrigerantPressure('R32', 125);
    assert.strictEqual(normalCheck.status, 'NORMAL');
    assert.strictEqual(normalCheck.leakProbable, false);
  });

  test('5. Hard Safety Gates & Gas Charge Lockout', () => {
    // When safety checks are NOT done, all repairs must be locked
    const verdictUnsafe = runPhysicsRulesEngine({
      appliance: {
        brand: 'LG',
        capacityTon: '1.5 TR',
        type: 'Inverter',
        refrigerant: 'R32',
      },
      readings: {
        voltage: 220,
        currentAmp: 3.8,
        suctionPsi: 40,
      },
      safetyGateCompleted: false,
    });

    assert.strictEqual(verdictUnsafe.safetyPassed, false);
    assert.ok(
      verdictUnsafe.blockedActions.some(action => action.includes('ALL_REPAIRS_LOCKED')),
      'Repairs must be locked when safety gate is incomplete'
    );
  });
});
