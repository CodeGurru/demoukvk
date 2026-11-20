import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini/client';

export async function GET() {
  const model = getGeminiModel();
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;

  return NextResponse.json({
    status: 'online',
    appName: 'Bijli Wala Aya AI Supervisor',
    company: 'UKVK Services Technologies Pvt. Ltd.',
    event: 'Startup Buildathon India 2026 (Delhi)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiEngine: {
      provider: 'Google DeepMind / Gemini',
      geminiKeyConfigured: hasGeminiKey,
      clientInitialized: !!model,
      activeModels: {
        text: process.env.MODEL_TEXT || 'gemini-1.5-flash',
        vision: process.env.MODEL_VISION || 'gemini-1.5-flash',
        live: process.env.MODEL_LIVE || 'gemini-2.0-flash-exp',
      },
      status: hasGeminiKey ? 'AI OK' : 'PHYSICS_RULES_FALLBACK_READY',
    },
    physicsRulesEngine: {
      status: 'active',
      supportedGases: ['R32', 'R410A', 'R22', 'R290', 'R134a'],
      safetyGateHardLocks: true,
      vacuumMicronsThreshold: 500,
    },
  });
}
