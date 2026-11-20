import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getGeminiModel } from '@/lib/gemini/client';
import { runPhysicsRulesEngine } from '@/lib/physics/rulesEngine';
import { RefrigerantType } from '@/lib/physics/refrigerant';

const diagnoseSchema = z.object({
  appliance: z.object({
    brand: z.string().default('LG'),
    model: z.string().optional().default('Dual Inverter 1.5T'),
    refrigerant: z.enum(['R32', 'R410A', 'R22', 'R290', 'R134a']).default('R32'),
    capacityTon: z.string().default('1.5 TR'),
    type: z.enum(['Inverter', 'Non-Inverter']).default('Inverter'),
  }),
  readings: z.object({
    voltage: z.number().min(50).max(350),
    currentAmp: z.number().min(0).max(50),
    suctionPsi: z.number().min(-30).max(500),
    roomTempC: z.number().optional(),
    grillTempC: z.number().optional(),
  }),
  safetyGateCompleted: z.boolean().default(true),
  selectedFault: z.string().optional().default('गैस लीकेज (Low Cooling / Gas Leak)'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = diagnoseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { appliance, readings, safetyGateCompleted, selectedFault } = parsed.data;

    // 1. Run strict Physics & Safety Rules Engine First (Never override physics)
    const physicsVerdict = runPhysicsRulesEngine({
      appliance: {
        brand: appliance.brand,
        capacityTon: appliance.capacityTon,
        type: appliance.type,
        refrigerant: appliance.refrigerant as RefrigerantType,
      },
      readings: {
        voltage: readings.voltage,
        currentAmp: readings.currentAmp,
        suctionPsi: readings.suctionPsi,
        roomTempC: readings.roomTempC,
        grillTempC: readings.grillTempC,
      },
      safetyGateCompleted,
      selectedFault,
    });

    // 2. Prepare Gemini Prompt
    const model = getGeminiModel();
    let aiDiagnosis = null;

    if (model) {
      try {
        const prompt = `
आप "बिजली वाला आया" के सीनियर AI सुपरवाइजर हैं। 
नीचे दिए गए Split AC डेटा और फ़िज़िक्स रूल्स के आधार पर एक स्ट्रक्चर्ड डायग्नोसिस JSON तैयार करें।

उपकरण विवरण:
- ब्रांड: ${appliance.brand} (${appliance.type})
- रेफ्रिजरेंट: ${appliance.refrigerant}
- क्षमता: ${appliance.capacityTon}

नापी गई रीडिंग्स:
- वोल्टेज: ${readings.voltage}V
- करंट: ${readings.currentAmp}A
- सक्शन गैस प्रेशर: ${readings.suctionPsi} PSI
- फॉल्ट विवरण: ${selectedFault}

फ़िज़िक्स रूल्स इंजन परिणाम:
- मुख्य फॉल्ट: ${physicsVerdict.primaryFault}
- रूट कॉज: ${physicsVerdict.rootCause}
- ब्लॉक किए गए कार्य: ${physicsVerdict.blockedActions.join(' | ') || 'कोई नहीं'}

कड़े नियम:
1. किसी भी ब्लॉक किए गए कार्य (Blocked Actions) को कभी अनुमति न दें।
2. 100% निश्चितता का दावा न करें; कॉन्फिडेंस 70-95% रखें।
3. केवल मान्य JSON उत्तर दें बिना किसी अतिरिक्त मार्कडाउन के:
{
  "primaryFaultHi": "मुख्य खराबी हिंदी में",
  "confidenceScore": 88,
  "reasoningHi": "खराबी का तकनीकी कारण",
  "evidenceList": ["प्रमाण 1", "प्रमाण 2"],
  "recommendedSteps": [
    { "stepNo": 1, "titleHi": "कदम", "safetyLevel": "critical", "instructionHi": "निर्देश" }
  ],
  "customerExplanationHi": "ग्राहक के लिए सरल, पारदर्शी हिंदी में व्याख्या",
  "estimatedCostINR": 1399
}
`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiDiagnosis = JSON.parse(jsonMatch[0]);
        }
      } catch (geminiError) {
        console.warn('Gemini diagnosis fallback to rules engine:', geminiError);
      }
    }

    // 3. Fallback to Physics Engine if Gemini is offline or not configured
    if (!aiDiagnosis) {
      aiDiagnosis = {
        primaryFaultHi: physicsVerdict.primaryFault,
        confidenceScore: Math.round(physicsVerdict.confidenceScore * 100),
        reasoningHi: physicsVerdict.rootCause,
        evidenceList: [
          `इलेक्ट्रिकल स्टेटस: ${physicsVerdict.electricalSummary}`,
          `प्रेशर स्टेटस: ${physicsVerdict.pressureSummary}`,
        ],
        recommendedSteps: physicsVerdict.approvedSteps.map((step, idx) => ({
          stepNo: idx + 1,
          titleHi: `स्टेप ${idx + 1}`,
          safetyLevel: idx === 0 ? 'critical' : 'normal',
          instructionHi: step,
        })),
        customerExplanationHi: `आपके ${appliance.brand} ${appliance.capacityTon} AC में ${physicsVerdict.primaryFault} पाया गया है। हमारे तकनीशियन कंपनी के निर्धारित सुरक्षा मानकों के तहत काम करेंगे।`,
        estimatedCostINR: physicsVerdict.estimatedCostRange.max,
      };
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      physicsVerdict,
      aiDiagnosis,
      blockedActions: physicsVerdict.blockedActions,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/diagnose:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
