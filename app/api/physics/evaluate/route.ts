import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runPhysicsRulesEngine } from "@/lib/physics/rulesEngine";

const PhysicsEvalSchema = z.object({
  appliance: z.object({
    brand: z.string().default("LG"),
    capacityTon: z.string().default("1.5 Ton"),
    type: z.enum(["Inverter", "Non-Inverter"]).default("Inverter"),
    refrigerant: z.enum(["R32", "R410A", "R22"]).default("R32")
  }),
  readings: z.object({
    voltage: z.number().default(220),
    currentAmp: z.number().default(3.8),
    suctionPsi: z.number().default(40),
    roomTempC: z.number().optional(),
    grillTempC: z.number().optional()
  }),
  safetyGateCompleted: z.boolean().default(true),
  selectedFault: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PhysicsEvalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload for physics rules", details: parsed.error.issues }, { status: 400 });
    }

    const verdict = runPhysicsRulesEngine(parsed.data);
    return NextResponse.json({
      success: true,
      verdict
    });
  } catch (error: any) {
    console.error("Physics eval error:", error);
    return NextResponse.json({
      error: "Error running physics rules engine",
      message: error?.message || "Unknown error"
    }, { status: 500 });
  }
}
