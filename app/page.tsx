"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Camera,
  Send,
  Volume2,
  VolumeX,
  RotateCw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Flame,
  Zap,
  Gauge
} from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text?: string;
  htmlContent?: React.ReactNode;
  voiceText?: string;
  timestamp: string;
}

export default function AiSupervisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraContext, setCameraContext] = useState<"nameplate" | "safety_proof" | "diagram_sheet" | "general">("general");
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [currentStep, setCurrentStep] = useState(1);

  // Real-time readings state
  const [psi, setPsi] = useState<number>(40);
  const [amp, setAmp] = useState<number>(3.8);
  const [voltage, setVoltage] = useState<number>(220);

  // Appliance state
  const [appliance, setAppliance] = useState({
    brand: "LG",
    ton: "1.5 Ton",
    type: "Inverter" as "Inverter" | "Non-Inverter",
    gas: "R32" as "R32" | "R410A" | "R22",
  });

  // Safety proofs
  const [safetyProofs, setSafetyProofs] = useState({
    mcb: false,
    cap: false,
    gloves: false,
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Speech Synthesis
  const speak = (text: string) => {
    if (!speechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    u.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const hi = voices.find((v) => v.lang.includes("hi") || v.lang.includes("IN"));
    if (hi) u.voice = hi;
    window.speechSynthesis.speak(u);
  };

  // STT
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("माइक के लिए Google Chrome का उपयोग करें।");
      return;
    }
    const rec = new SR();
    rec.lang = "hi-IN";
    setIsListening(true);
    speak("मैं सुन रहा हूँ, बोलिए...");

    rec.onresult = (e: any) => {
      setIsListening(false);
      const transcript = e.results[0][0].transcript;
      handleSendMessage(transcript);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  // Add Messages
  const addAi = (content: React.ReactNode, voiceText: string = "") => {
    const newMsg: Message = {
      id: Math.random().toString(36),
      sender: "ai",
      htmlContent: content,
      voiceText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    if (voiceText) speak(voiceText);
  };

  const addUser = (text: string) => {
    const newMsg: Message = {
      id: Math.random().toString(36),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Initialize Step 1 on Load
  useEffect(() => {
    initChat();
  }, []);

  const initChat = () => {
    setMessages([]);
    setCurrentStep(1);

    addAi(
      <div className="space-y-2">
        <p className="font-extrabold text-sm text-[#FFC42E]">नमस्ते टेक्नीशियन भाई! 🙏</p>
        <p className="leading-relaxed text-slate-200">
          आप ग्राहक (रमेश कुमार, अयोध्या) के घर पहुँच गए हैं। सबसे पहले <strong>AC के इंडोर/आउटडोर और नेमप्लेट की फोटो खींचें</strong>, साथ ही स्टेबलाइजर और सॉकेट भी चेक करें।
        </p>
        <div className="bg-[#111b21] p-3 rounded-xl border border-slate-700 space-y-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#FFC42E]" /> एसी नेमप्लेट फोटो (AC Nameplate)
            </span>
            <span className="text-[10px] text-amber-400 bg-amber-950/70 border border-amber-600/50 px-2 py-0.5 rounded font-bold">
              अनिवार्य
            </span>
          </div>
          <p className="text-[11px] text-slate-400">नेमप्लेट की फोटो से ब्रांड, टन, मॉडल और गैस AI अपने-आप भर देगा।</p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => openCamera("nameplate")}
              className="flex-1 py-2 bg-[#FFC42E] hover:bg-amber-400 text-slate-950 rounded-lg font-black text-xs flex items-center justify-center gap-1 shadow active:scale-95 transition"
            >
              <Camera className="w-4 h-4" /> कैमरा खोलें
            </button>
            <button
              onClick={() => handlePhotoSimulate("nameplate")}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold text-xs border border-slate-600 active:scale-95"
            >
              ⚡ सैंपल फोटो
            </button>
          </div>
        </div>
      </div>,
      "नमस्ते टेक्नीशियन भाई! आप ग्राहक के यहाँ पहुँच गए हैं। सबसे पहले AC की नेमप्लेट और स्टेबलाइजर की फोटो खींचें।"
    );
  };

  // Step 2: Handle Photo Extraction
  const handlePhotoExtracted = (extractedData: any) => {
    addUser("📸 [फोटो अपलोड: AC Nameplate Sticker]");

    setTimeout(() => {
      setCurrentStep(2);
      addAi(
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[#FFC42E] font-bold">
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#FFC42E]" /> AI विज़न ऑटो-डिटेक्ट:
            </span>
            <span className="text-green-400 text-[10px] bg-green-950 px-2 py-0.5 rounded border border-green-700 font-mono font-bold">
              CONFIDENCE 96%
            </span>
          </div>
          <p className="text-slate-300 text-[11px]">
            फोटो से ये डेटा पढ़ा गया है। अगर कोई वैल्यू गलत हो तो ड्रॉपडाउन से अभी बदल लें:
          </p>

          <div className="bg-[#111b21] p-3 rounded-xl border border-slate-700 space-y-2.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">ब्रांड (Brand):</label>
                <select
                  value={appliance.brand}
                  onChange={(e) => setAppliance({ ...appliance, brand: e.target.value })}
                  className="w-full bg-[#202c33] text-white p-1.5 rounded-lg border border-slate-600 font-bold focus:outline-none"
                >
                  <option value="LG">LG</option>
                  <option value="Daikin">Daikin</option>
                  <option value="Voltas">Voltas</option>
                  <option value="Hitachi">Hitachi</option>
                  <option value="Samsung">Samsung</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">क्षमता (Capacity):</label>
                <select
                  value={appliance.ton}
                  onChange={(e) => setAppliance({ ...appliance, ton: e.target.value })}
                  className="w-full bg-[#202c33] text-white p-1.5 rounded-lg border border-slate-600 font-bold focus:outline-none"
                >
                  <option value="1.0 Ton">1.0 Ton (12000 BTU)</option>
                  <option value="1.5 Ton">1.5 Ton (18000 BTU)</option>
                  <option value="2.0 Ton">2.0 Ton (24000 BTU)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">तकनीक (Type):</label>
                <select
                  value={appliance.type}
                  onChange={(e) => setAppliance({ ...appliance, type: e.target.value as any })}
                  className="w-full bg-[#202c33] text-white p-1.5 rounded-lg border border-slate-600 font-bold focus:outline-none"
                >
                  <option value="Inverter">Inverter (Dual)</option>
                  <option value="Non-Inverter">Non-Inverter</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">गैस (Refrigerant):</label>
                <select
                  value={appliance.gas}
                  onChange={(e) => setAppliance({ ...appliance, gas: e.target.value as any })}
                  className="w-full bg-[#202c33] text-white p-1.5 rounded-lg border border-slate-600 font-bold focus:outline-none"
                >
                  <option value="R32">R32 (Eco-Friendly)</option>
                  <option value="R410A">R410A</option>
                  <option value="R22">R22</option>
                </select>
              </div>
            </div>

            <button
              onClick={confirmApplianceDetails}
              className="w-full mt-2 py-2 bg-[#00a884] hover:bg-emerald-600 text-white rounded-lg font-black text-xs flex items-center justify-center gap-1 shadow active:scale-95 transition"
            >
              ✓ जानकारी सही है, सुरक्षा फाटक पर चलें
            </button>
          </div>
        </div>,
        "नेमप्लेट से पहचान लिया है: LG 1.5 टन इनवर्टर, R32 गैस। अगर कुछ गलत हो तो ड्रॉपडाउन से बदलें और पुष्टि करें।"
      );
    }, 500);
  };

  // Step 3: Safety Gate with Real Photo Proof
  const confirmApplianceDetails = () => {
    addUser(`✓ मैंने कन्फर्म कर लिया: ${appliance.brand} ${appliance.ton} ${appliance.type}, गैस ${appliance.gas}`);

    setTimeout(() => {
      setCurrentStep(3);
      addAi(
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="font-extrabold text-[#FFC42E] flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-[#FFC42E]" /> सुरक्षा फाटक (Safety Mandatory Check)
            </p>
            <span className="text-[10px] bg-red-950 text-red-300 border border-red-700 px-2 py-0.5 rounded font-bold">
              🔒 फोटो प्रूफ अनिवार्य
            </span>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            कंपनी नियम: AC का पैनल खोलने या तार छूने से पहले इन 3 सुरक्षा नियमों का <strong>फोटो सबूत (Photo Proof)</strong> देना जरूरी है:
          </p>

          <div className="bg-[#111b21] p-3 rounded-xl border border-red-500/50 space-y-3 text-xs">
            <div className="flex items-center justify-between p-2 bg-[#182229] rounded-lg border border-slate-700">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chkMcb"
                  checked={safetyProofs.mcb}
                  onChange={(e) => setSafetyProofs({ ...safetyProofs, mcb: e.target.checked })}
                  className="w-4 h-4 accent-red-600 cursor-pointer"
                />
                <div>
                  <span className="text-white font-bold block">1. मुख्य MCB बंद की? ⚡</span>
                  <span className="text-[10px] text-slate-400">टेस्टर से 0V चेक करें</span>
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  safetyProofs.mcb ? "text-green-300 bg-green-950 border border-green-700" : "text-slate-500 bg-slate-800"
                }`}
              >
                {safetyProofs.mcb ? "✓ 0V Verified" : "प्रूफ नहीं मिला"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#182229] rounded-lg border border-slate-700">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chkCap"
                  checked={safetyProofs.cap}
                  onChange={(e) => setSafetyProofs({ ...safetyProofs, cap: e.target.checked })}
                  className="w-4 h-4 accent-red-600 cursor-pointer"
                />
                <div>
                  <span className="text-white font-bold block">2. कैपेसिटर डिस्चार्ज किया? 🧯</span>
                  <span className="text-[10px] text-slate-400">पेचकस से पिन शॉर्ट की</span>
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  safetyProofs.cap ? "text-green-300 bg-green-950 border border-green-700" : "text-slate-500 bg-slate-800"
                }`}
              >
                {safetyProofs.cap ? "✓ Discharged" : "प्रूफ नहीं मिला"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#182229] rounded-lg border border-slate-700">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chkGloves"
                  checked={safetyProofs.gloves}
                  onChange={(e) => setSafetyProofs({ ...safetyProofs, gloves: e.target.checked })}
                  className="w-4 h-4 accent-red-600 cursor-pointer"
                />
                <div>
                  <span className="text-white font-bold block">3. रबर के दस्ताने पहने? 🧤</span>
                  <span className="text-[10px] text-slate-400">आग/स्पार्क से बचाव</span>
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  safetyProofs.gloves ? "text-green-300 bg-green-950 border border-green-700" : "text-slate-500 bg-slate-800"
                }`}
              >
                {safetyProofs.gloves ? "✓ Gloves On" : "प्रूफ नहीं मिला"}
              </span>
            </div>

            <div className="p-2.5 bg-red-950/40 rounded-lg border border-red-500/40 flex items-center justify-between">
              <div>
                <span className="text-red-200 font-bold block text-[11px]">सुरक्षा सबूत की फोटो (MCB / दस्ताने):</span>
                <span className="text-[10px] text-slate-400">फोटो खींचते ही AI विज़न से पास होगा</span>
              </div>
              <button
                onClick={() => openCamera("safety_proof")}
                className="px-3 py-1.5 bg-[#FFC42E] hover:bg-amber-400 text-slate-950 rounded-lg font-black text-xs shadow active:scale-95 transition"
              >
                📸 प्रूफ फोटो लें
              </button>
            </div>

            <button
              onClick={submitSafetyPassed}
              disabled={!(safetyProofs.mcb && safetyProofs.cap && safetyProofs.gloves)}
              className={`w-full mt-2 py-2 rounded-lg font-black text-xs shadow transition ${
                safetyProofs.mcb && safetyProofs.cap && safetyProofs.gloves
                  ? "bg-[#00a884] hover:bg-emerald-600 text-white cursor-pointer"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
            >
              {safetyProofs.mcb && safetyProofs.cap && safetyProofs.gloves
                ? "✓ सुरक्षा प्रूफ सत्यापित - रीडिंग मीटर पर चलें"
                : "🔒 सुरक्षा जांच व फोटो प्रूफ के बाद ही खुलेगा"}
            </button>
          </div>
        </div>,
        "तार छूने से पहले मुख्य MCB बंद करें, कैपेसिटर डिस्चार्ज करें और दस्तानों की फोटो प्रूफ अपलोड करें।"
      );
    }, 500);
  };

  const submitSafetyPassed = () => {
    addUser("✓ सुरक्षा के तीनों नियम चेक व फोटो प्रूफ सत्यापित हो चुके हैं।");
    speak("शाबाश टेक्नीशियन भाई! सुरक्षा के तीनों नियम और फोटो प्रूफ सत्यापित हो चुके हैं। अब मीटर रीडिंग लेते हैं।");
    askForReadings();
  };

  // Step 4: Real Physical Meters Dashboard
  const askForReadings = () => {
    setTimeout(() => {
      setCurrentStep(4);
      addAi(
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <p className="font-extrabold text-[#FFC42E] text-sm flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#FFC42E]" /> रियल मीटर डैशबोर्ड (Real Physical Gauges)
            </p>
            <span className="text-[10px] text-green-400 font-bold bg-green-950 px-2 py-0.5 rounded">
              लाइव सिंक ⚡
            </span>
          </div>

          <p className="text-slate-300 text-[11px]">
            नीचे असली मीटर की सुई और डिजिटल डिस्प्ले को देखकर वैल्यू डालें। नंबर बदलते ही सुई रियल-टाइम घूमेगी:
          </p>

          {/* Real Meter 1: Manifold Gauge Dial */}
          <div className="bg-gradient-to-b from-[#182229] to-[#0f171d] p-3 rounded-2xl border-2 border-slate-700 shadow-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-[#00a884] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                1. सक्शन प्रेशर गेज (Suction PSI Gauge - Blue Port)
              </span>
              <span className={`text-[11px] font-black px-2 py-0.5 rounded border ${
                psi < 70 ? "text-red-400 bg-red-950/80 border-red-700" : psi > 140 ? "text-amber-400 bg-amber-950/80 border-amber-700" : "text-green-400 bg-green-950/80 border-green-700"
              }`}>
                {psi} PSI ({psi < 70 ? "गैस बहुत कम!" : psi > 140 ? "ओवरचार्ज!" : "परफेक्ट प्रेशर"})
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[#111b21] p-2.5 rounded-xl border border-slate-700">
              <div className="relative w-28 h-28 flex-shrink-0 mx-auto">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
                  <circle cx="100" cy="100" r="92" fill="#1e293b" stroke="#0284c7" strokeWidth="5" />
                  <circle cx="100" cy="100" r="82" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                  <circle cx="100" cy="100" r="76" fill="#f8fafc" />

                  {/* Arcs */}
                  <path d="M 40 135 A 68 68 0 0 1 50 65" fill="none" stroke="#ef4444" strokeWidth="7" />
                  <path d="M 50 65 A 68 68 0 0 1 100 32" fill="none" stroke="#f59e0b" strokeWidth="7" />
                  <path d="M 100 32 A 68 68 0 0 1 135 48" fill="none" stroke="#10b981" strokeWidth="11" />
                  <path d="M 135 48 A 68 68 0 0 1 160 135" fill="none" stroke="#dc2626" strokeWidth="7" />

                  <text x="100" y="70" textAnchor="middle" fontSize="9" fontWeight="900" fill="#475569">R32 GAUGE</text>
                  <text x="100" y="85" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#10b981">125 PSI OK</text>
                  <text x="45" y="142" fontSize="9" fontWeight="bold" fill="#64748b">0</text>
                  <text x="100" y="24" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#10b981">125</text>
                  <text x="145" y="142" fontSize="9" fontWeight="bold" fill="#64748b">250</text>

                  {/* Rotating needle */}
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="35"
                    stroke="#dc2626"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="gauge-needle"
                    style={{ transform: `rotate(${-120 + (psi / 250) * 240}deg)` }}
                  />
                  <circle cx="100" cy="100" r="7" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="flex-1 space-y-1.5">
                <label className="block text-[10px] text-slate-400">PSI नंबर डालें या सुई घुमाएँ:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={psi}
                    onChange={(e) => handlePsiChange(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#202c33] text-white p-2 text-center font-black text-xl rounded-xl border border-blue-500/50 focus:outline-none font-digital"
                  />
                  <span className="text-xs font-black text-slate-300">PSI</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  value={psi}
                  onChange={(e) => handlePsiChange(parseFloat(e.target.value) || 0)}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Real Meter 2: Clamp Meter */}
          <div className="bg-gradient-to-b from-[#182229] to-[#0f171d] p-3 rounded-2xl border-2 border-slate-700 shadow-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-amber-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> 2. क्लैम्प मीटर करंट (Clamp Multimeter)
              </span>
              <span className="text-amber-400 font-black text-[11px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700">
                {amp}A (लोड {Math.round((amp / 6.5) * 100)}% कम)
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[#111b21] p-2.5 rounded-xl border border-slate-700">
              <div className="w-24 h-16 bg-[#FFC42E] rounded-xl p-1.5 border-2 border-slate-900 flex flex-col justify-between shadow-inner">
                <div className="flex justify-between items-center text-[8px] font-black text-slate-950">
                  <span>CLAMP 400A</span>
                  <span>~AC A</span>
                </div>
                <div className="bg-[#1b3d2f] p-1 rounded border border-slate-900 text-center">
                  <span className="font-digital text-emerald-400 font-black text-sm tracking-widest">{amp} A</span>
                </div>
                <span className="text-[7px] text-slate-900 text-center font-bold">TRUE RMS CAT III</span>
              </div>

              <div className="flex-1 space-y-1">
                <label className="block text-[10px] text-slate-400">एम्पीयर (Current) बदलें:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={amp}
                    onChange={(e) => setAmp(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#202c33] text-white p-2 text-center font-black text-base rounded-xl border border-amber-500/50 focus:outline-none font-digital"
                  />
                  <span className="text-xs font-black text-slate-300">Amp</span>
                </div>
                <span className="text-[9px] text-slate-400 block">💡 क्लिप सिर्फ एक Phase तार पर फंसाएं</span>
              </div>
            </div>
          </div>

          <button
            onClick={submitReadingsFromMeters}
            className="w-full py-2.5 bg-[#FFC42E] hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs shadow-lg active:scale-95 transition"
          >
            ⚡ रीडिंग सबमिट करें और अगला कदम पूछें
          </button>
        </div>,
        "अब रियल मीटर डैशबोर्ड से रीडिंग चेक करें। सुई का नंबर बदलते ही AI तुरंत आवाज में बोलकर बताएगा।"
      );
    }, 500);
  };

  const handlePsiChange = (val: number) => {
    setPsi(val);
    if (val > 300) {
      speak(`आपने डाला ${val} PSI! ये अत्यधिक उच्च या गलत रीडिंग है।`);
    } else if (val < 70) {
      speak(`आपने डाला ${val} PSI। R32 गैस के लिए ये बहुत कम है, लीकेज पक्की है।`);
    } else if (val >= 115 && val <= 135) {
      speak(`आपने डाला ${val} PSI। गैस का प्रेशर बिल्कुल सही है।`);
    }
  };

  const submitReadingsFromMeters = async () => {
    addUser(`रीडिंग्स दर्ज कीं: सक्शन ${psi} PSI, करंट ${amp}A, वोल्टेज ${voltage}V`);

    // Call Real Physics Engine Endpoint
    try {
      const res = await fetch("/api/physics/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appliance: {
            brand: appliance.brand,
            capacityTon: appliance.ton,
            type: appliance.type,
            refrigerant: appliance.gas,
          },
          readings: {
            voltage,
            currentAmp: amp,
            suctionPsi: psi,
          },
          safetyGateCompleted: true,
        }),
      });
      const data = await res.json();
      const verdict = data.verdict;

      setTimeout(() => {
        setCurrentStep(5);
        addAi(
          <div className="space-y-2.5">
            <div className="p-2.5 bg-slate-900 rounded-xl border border-red-500/50">
              <span className="text-[10px] text-red-400 font-bold uppercase block">AI प्राथमिक निष्कर्ष:</span>
              <p className="text-white font-black text-xs">
                सक्शन प्रेशर {psi} PSI (कम है) और कंप्रेसर लोड {Math.round((amp / 6.5) * 100)}% है।
              </p>
            </div>

            <p className="font-bold text-[#FFC42E]">अब बताइए ग्राहक के AC में मुख्य समस्या क्या आ रही है?</p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => selectProblem("ठंडा नहीं कर रहा (कूलिंग बंद)")}
                className="p-2.5 bg-[#111b21] hover:bg-[#202c33] border border-slate-700 text-left rounded-xl text-white font-bold flex items-center gap-2 active:scale-95 transition"
              >
                <span>❄️</span> कूलिंग बंद है
              </button>
              <button
                onClick={() => selectProblem("फ़ैन ब्लोअर काम नहीं कर रहा")}
                className="p-2.5 bg-[#111b21] hover:bg-[#202c33] border border-slate-700 text-left rounded-xl text-white font-bold flex items-center gap-2 active:scale-95 transition"
              >
                <span>🌀</span> फ़ैन ब्लोअर बंद है
              </button>
              <button
                onClick={() => selectProblem("पानी टपक रहा है (Water Leak)")}
                className="p-2.5 bg-[#111b21] hover:bg-[#202c33] border border-slate-700 text-left rounded-xl text-white font-bold flex items-center gap-2 active:scale-95 transition"
              >
                <span>💧</span> पानी टपक रहा
              </button>
              <button
                onClick={() => selectProblem("सिर्फ़ सामान्य सर्विस (General Service)")}
                className="p-2.5 bg-[#111b21] hover:bg-[#202c33] border border-slate-700 text-left rounded-xl text-white font-bold flex items-center gap-2 active:scale-95 transition"
              >
                <span>🧰</span> सामान्य सर्विस
              </button>
            </div>

            <div className="p-2.5 bg-[#182229] rounded-xl border border-indigo-500/40 flex items-center justify-between mt-1">
              <div>
                <span className="text-indigo-300 font-bold block text-[11px]">📄 एरर कोड चार्ट या डायग्राम शीट की फोटो:</span>
                <span className="text-[10px] text-slate-400">AC ढक्कन पर लगा स्टिकर स्कैन करें</span>
              </div>
              <button
                onClick={() => openCamera("diagram_sheet")}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs shadow active:scale-95"
              >
                📸 शीट भेजें
              </button>
            </div>
          </div>,
          "रीडिंग के हिसाब से गैस कम है। अब बताइए ग्राहक की मुख्य समस्या क्या है? क्या कूलिंग बंद है या फ़ैन ब्लोअर में दिक्कत है?"
        );
      }, 500);
    } catch {
      // Fallback
    }
  };

  // Step 6: Problem Specific Location Guides & Colorized Diagrams
  const selectProblem = (problemDesc: string) => {
    addUser(`समस्या: ${problemDesc}`);

    setTimeout(() => {
      setCurrentStep(6);
      if (problemDesc.includes("फ़ैन ब्लोअर")) {
        addAi(
          <div className="space-y-3">
            <p className="font-extrabold text-[#FFC42E] text-sm">
              🌀 फ़ैन ब्लोअर डायग्नोसिस (AI कलराइज़्ड वायरिंग व लोकेशन गाइड)
            </p>

            {/* Location Sample Guide */}
            <div className="bg-[#111b21] p-3 rounded-xl border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between text-amber-300 font-bold text-xs">
                <span>💡 सैंपल गाइड: 3.5µF कैपेसिटर कहाँ मिलेगा?</span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                  LOCATION GUIDE
                </span>
              </div>

              <div className="relative bg-slate-900 rounded-lg p-2.5 border border-slate-700 flex items-center gap-3">
                <div className="w-20 h-16 bg-slate-800 rounded border border-amber-400 flex flex-col items-center justify-center p-1 text-center">
                  <span className="text-xl">🧯</span>
                  <span className="text-[8px] text-amber-300 font-bold">3.5µF ±5%</span>
                  <span className="text-[7px] text-slate-400">450V AC</span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <p>इंडोर यूनिट के दाहिनी तरफ PCB बॉक्स खोलें। काले रंग का चौकोर कैपेसिटर <strong>CN-FAN</strong> जैक के बगल में लगा होता है।</p>
                  <span className="text-[10px] text-green-400 font-bold block">👉 मल्टीमीटर के µF मोड पर 3.2µF से कम आए तो बदलें।</span>
                </div>
              </div>
            </div>

            {/* Gemini Colorized Diagram */}
            <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/60 space-y-2">
              <div className="flex justify-between items-center text-[11px] text-indigo-300 font-bold">
                <span>📐 Gemini जनरेटेड BLDC/AC ब्लोअर वायरिंग डायग्राम</span>
                <span className="text-green-400 text-[10px] font-mono">LG OFFICIAL KB</span>
              </div>

              <svg viewBox="0 0 340 160" className="w-full h-auto text-[10px]">
                <rect x="10" y="20" width="85" height="120" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <text x="52" y="45" fill="#60a5fa" fontWeight="900" textAnchor="middle">INDOOR PCB</text>
                <circle cx="95" cy="70" r="5" fill="#ef4444" />
                <text x="85" y="73" fill="white" fontSize="8" textAnchor="end">L (Phase)</text>
                <circle cx="95" cy="95" r="5" fill="#3b82f6" />
                <text x="85" y="98" fill="white" fontSize="8" textAnchor="end">N (Neutral)</text>
                <circle cx="95" cy="120" r="5" fill="#eab308" />
                <text x="85" y="123" fill="white" fontSize="8" textAnchor="end">FB (Pulse)</text>

                <rect x="140" y="15" width="60" height="42" rx="6" fill="#0f172a" stroke="#eab308" strokeWidth="2" />
                <text x="170" y="35" fill="#facc15" fontWeight="bold" fontSize="9" textAnchor="middle">3.5µF CAP</text>
                <circle cx="145" cy="40" r="3" fill="#ef4444" />
                <circle cx="195" cy="40" r="3" fill="#ef4444" />

                <circle cx="280" cy="80" r="45" fill="#1e293b" stroke="#10b981" strokeWidth="2.5" />
                <text x="280" y="75" fill="#34d399" fontWeight="900" textAnchor="middle">BLOWER</text>
                <text x="280" y="90" fill="#94a3b8" fontSize="8" textAnchor="middle">MOTOR</text>
                <circle cx="238" cy="65" r="4" fill="#ef4444" />
                <circle cx="238" cy="85" r="4" fill="#3b82f6" />
                <circle cx="238" cy="105" r="4" fill="#eab308" />

                <path d="M 95 70 L 145 40" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                <path d="M 195 40 L 238 65" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                <path d="M 95 95 L 238 85" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                <path d="M 95 120 L 238 105" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="3,2" />
              </svg>

              <div className="grid grid-cols-3 gap-1 text-[9px] text-slate-300 pt-1.5 border-t border-slate-800 text-center font-bold">
                <span className="text-red-400">● लाल (230V Phase)</span>
                <span className="text-blue-400">● नीला (Neutral)</span>
                <span className="text-yellow-400">● पीला (Hall Sensor)</span>
              </div>
            </div>

            <button
              onClick={() => proceedToQuotation("capacitor")}
              className="w-full py-2.5 bg-[#00a884] hover:bg-emerald-600 text-white rounded-xl font-black text-xs shadow active:scale-95 transition"
            >
              ✓ कैपेसिटर टेस्ट व रिप्लेस हो गया, कोटेशन बनाएं
            </button>
          </div>,
          "फ़ैन ब्लोअर के लिए सबसे पहले 3.5 माइक्रो फैराड का कैपेसिटर चेक करें। सैंपल फोटो में लोकेशन और रंगीन वायरिंग डायग्राम देख सकते हैं।"
        );
      } else {
        // Cooling Issue with Location Sample: SOAP BUBBLE ON FLARE NUT
        addAi(
          <div className="space-y-3">
            <p className="font-extrabold text-[#FFC42E] text-sm">
              ❄️ गैस लीकेज डायग्नोसिस व लोकेशन सैंपल (Soap Bubble Guide)
            </p>

            <div className="bg-[#111b21] p-3 rounded-xl border border-red-500/50 space-y-2">
              <div className="flex items-center justify-between text-red-300 font-bold text-xs">
                <span>💡 सैंपल फोटो: फ्लेयर नट पर झाग ऐसे चेक करें</span>
                <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded font-mono font-bold">
                  LEAK LOCATION GUIDE
                </span>
              </div>

              <div className="relative bg-slate-900 rounded-lg p-3 border border-slate-700 flex items-center gap-3">
                <div className="w-24 h-20 bg-amber-950/40 rounded-lg border-2 border-amber-500/60 flex flex-col items-center justify-center p-1 relative overflow-hidden">
                  <div className="w-12 h-6 bg-amber-500 rounded-sm"></div>
                  <div className="w-6 h-8 bg-amber-600 rounded-sm"></div>
                  <div className="absolute top-2 right-3 w-4 h-4 rounded-full bg-blue-200/80 border border-white animate-ping"></div>
                  <div className="absolute top-3 right-4 w-5 h-5 rounded-full bg-blue-100/90 border border-white"></div>
                  <span className="text-[7px] text-amber-200 font-black mt-1">FLARE NUT</span>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1">
                  <p className="font-bold text-white">आउटडोर यूनिट का सर्विस वाल्व:</p>
                  <p>साबुन के पानी का झाग फ्लेयर नट के जोड़ पर लगाएं। <strong>अगर झाग में बुलबुला फूले</strong> तो 100% वहीं से गैस लीक हो रही है।</p>
                  <span className="text-[10px] text-red-400 font-bold block">🔒 बिना लीकेज बंद किए गैस डालना मना है!</span>
                </div>
              </div>
            </div>

            <div className="bg-red-950/60 border border-red-500/60 p-2.5 rounded-xl text-xs space-y-1">
              <span className="font-extrabold text-red-200 block">🔒 कंपनी सुरक्षा नियम:</span>
              <p className="text-[11px] text-slate-300">
                1. फ्लेयर नट टाइट करें ➜ 2. नाइट्रोजन प्रेशर टेस्ट ➜ 3. 500 माइक्रोन तक वैक्यूम ➜ 4. तौलकर 650g असली R32 गैस डालें।
              </p>
            </div>

            <button
              onClick={() => proceedToQuotation("gas_leak")}
              className="w-full py-2.5 bg-[#00a884] hover:bg-emerald-600 text-white rounded-xl font-black text-xs shadow active:scale-95 transition"
            >
              ✓ लीकेज ठीक हो गई, ग्राहक बिल व कोटेशन देखें
            </button>
          </div>,
          "सक्शन प्रेशर 40 PSI है। सैंपल फोटो में देखें कि आउटडोर फ्लेयर नट पर साबुन का झाग कैसे लगाकर लीकेज चेक करनी है।"
        );
      }
    }, 500);
  };

  // Step 7: Transparent Quotation & Customer OTP
  const proceedToQuotation = (type: string) => {
    addUser("✓ रिपेयर पूरा हो गया है, पक्का बिल व कोटेशन जनरेट करें।");

    setTimeout(() => {
      setCurrentStep(7);
      addAi(
        <div className="space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 text-xs">
            <span className="font-bold text-[#FFC42E]">💰 पारदर्शी कोटेशन (कंपनी रेट कार्ड)</span>
            <span className="bg-green-950 text-green-300 border border-green-700 px-2 py-0.2 rounded text-[10px] font-bold">
              45 दिन वारंटी
            </span>
          </div>

          <div className="bg-[#111b21] p-3 rounded-xl border border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
              <span>विज़िट व जाँच चार्ज:</span>
              <span className="font-bold text-white">₹199</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
              <span>फ्लेयर नट लीकेज रिपेयर + नाइट्रोजन प्रेशर:</span>
              <span className="font-bold text-white">₹350</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
              <span>वैक्यूम पंपिंग (500 Microns):</span>
              <span className="font-bold text-white">₹250</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
              <span>असली R32 गैस (650g वज़न अनुसार):</span>
              <span className="font-bold text-white">₹600</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-black text-white">
              <span>कुल राशि (Total Amount):</span>
              <span className="text-[#FFC42E] text-base">₹1,399</span>
            </div>
          </div>

          <div className="bg-[#182229] p-3 rounded-xl border border-amber-400/50 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-amber-300 font-bold">काम पूरा होने पर ग्राहक OTP से बंद करें:</span>
              <span className="bg-amber-400 text-slate-950 px-1.5 rounded font-mono font-black text-[10px]">OTP: 4829</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                id="otpInput"
                placeholder="4829"
                maxLength={4}
                className="flex-1 bg-[#2a3942] text-white p-2 text-center font-black rounded-lg text-sm border border-slate-600 focus:outline-none"
              />
              <button
                onClick={verifyJobClose}
                className="px-3.5 py-2 bg-[#00a884] hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow active:scale-95 transition"
              >
                जॉब बंद करें ✅
              </button>
            </div>
          </div>
        </div>,
        "कुल खर्चा ₹1,399 हुआ है। 45 दिन की वारंटी के साथ जॉब बंद करने के लिए ग्राहक का 4 अंकों का OTP डालें।"
      );
    }, 500);
  };

  const verifyJobClose = () => {
    addUser("✓ ग्राहक OTP दर्ज किया: 4829");
    setTimeout(() => {
      addAi(
        <div className="space-y-2.5 text-center p-2">
          <span className="text-4xl block">🎉</span>
          <p className="font-black text-[#FFC42E] text-sm">जॉब सफलतापूर्वक पूर्ण हुई!</p>
          <p className="text-xs text-slate-300">
            डिजिटल बिल और 45 दिन का वारंटी कार्ड ग्राहक के WhatsApp पर भेज दिया गया है।
          </p>
          <div className="bg-green-950/80 border border-green-500/50 p-2.5 rounded-xl text-green-300 text-xs font-bold mt-2">
            🌟 आपका प्रदर्शन उत्कृष्ट रहा! AI एक्यूरेसी स्कोर: 100%
          </div>
          <button
            onClick={initChat}
            className="mt-3 px-4 py-2 bg-[#FFC42E] text-slate-950 font-black rounded-xl text-xs shadow active:scale-95 transition"
          >
            🔄 नई जॉब शुरू करें
          </button>
        </div>,
        "बधाई हो टेक्नीशियन भाई! जॉब सफलतापूर्वक बंद हो गई है और 45 दिन की वारंटी शुरू हो चुकी है।"
      );
    }, 400);
  };

  // Camera Open
  const openCamera = (context: any) => {
    setCameraContext(context);
    setCameraModalOpen(true);
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: cameraFacing }, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {});
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setCameraModalOpen(false);
  };

  const switchCamera = () => {
    setCameraFacing((prev) => (prev === "environment" ? "user" : "environment"));
    closeCamera();
    setTimeout(() => openCamera(cameraContext), 200);
  };

  const handlePhotoSimulate = (ctx: string) => {
    closeCamera();
    if (ctx === "safety_proof") {
      setSafetyProofs({ mcb: true, cap: true, gloves: true });
      addUser("📸 [सुरक्षा प्रूफ फोटो अपलोड की: MCB OFF (0V) व इंसुलेटेड ग्लव्स]");
      submitSafetyPassed();
    } else if (ctx === "diagram_sheet") {
      addUser("📸 [एरर कोड शीट व डायग्राम स्टिकर स्कैन किया]");
      setTimeout(() => {
        addAi(
          <div className="space-y-2">
            <span className="text-[#FFC42E] font-bold text-xs">✨ LG Q18 शीट एनालिसिस सफल (Parsed)</span>
            <p className="text-slate-300 text-[11px]">CH01 = सेंसर/गैस लीकेज, CH05 = कम्युनिकेशन फॉल्ट डिटेक्ट हुआ।</p>
          </div>,
          "शीट स्कैन हो गई है। CH01 का मतलब गैस लीकेज और सेंसर फॉल्ट है।"
        );
      }, 500);
    } else {
      handlePhotoExtracted({ brand: "LG", ton: "1.5 Ton", type: "Inverter", gas: "R32" });
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text) return;
    addUser(text);
    setInputText("");

    // Call Real Gemini Chat API Route
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          currentReading: { psi, voltage, amp },
        }),
      });
      const data = await res.json();
      if (data.reply) {
        addAi(<p className="text-xs text-slate-200">{data.reply}</p>, data.reply);
      }
    } catch {
      addAi(<p className="text-xs text-slate-200">मैंने नोट कर लिया: "{text}"। कृपया अगला स्टेप चुनें।</p>, text);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto shadow-2xl overflow-hidden border-x border-slate-800 bg-[#0b141a]">
      {/* Header */}
      <header className="bg-[#202c33] text-white px-3 py-2.5 flex items-center justify-between z-30 shadow border-b border-[#2a3942]">
        <div className="flex items-center gap-2.5">
          <button onClick={initChat} className="text-slate-300 hover:text-white p-1 text-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#FFC42E] text-slate-950 flex items-center justify-center font-black text-xl shadow">
              ⚡
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#202c33] rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm text-[#e9edef] leading-tight">AI सीनियर सुपरवाइजर</h1>
              <span className="bg-[#FFC42E] text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded font-mono">
                BIJLI WALA
              </span>
            </div>
            <p className="text-[11px] text-[#00a884] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> ऑनलाइन • Next.js + Gemini Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className="p-2 rounded-full hover:bg-slate-700/50 text-[#aebac1] hover:text-[#FFC42E] text-sm"
          >
            {speechEnabled ? <Volume2 className="w-5 h-5 text-[#FFC42E]" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
          <button
            onClick={initChat}
            className="text-xs bg-[#111b21] hover:bg-slate-700 text-[#aebac1] border border-slate-700 px-2 py-1 rounded-lg font-bold flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> रीसेट
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-3.5 space-y-4 wa-bg text-xs">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "gap-2 items-start max-w-[95%]"}`}>
            {msg.sender === "ai" && (
              <div className="w-8 h-8 rounded-full bg-[#FFC42E] text-slate-950 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5 shadow">
                🤖
              </div>
            )}
            <div
              className={`p-3 shadow-md space-y-2.5 border ${
                msg.sender === "user"
                  ? "chat-bubble-out max-w-[85%] border-transparent"
                  : "chat-bubble-in border-[#2a3942] w-full"
              }`}
            >
              {msg.htmlContent || <p className="text-xs text-white leading-relaxed font-medium">{msg.text}</p>}
              <div className="flex items-center justify-between text-[10px] text-[#8696a0] pt-1.5 border-t border-[#2a3942]/60">
                <span className="flex items-center gap-1 font-mono text-[#00a884] font-bold">
                  {msg.sender === "ai" ? "AI Supervisor ⚡" : "Technician ✓✓"}
                </span>
                <div className="flex items-center gap-1.5">
                  <span>{msg.timestamp}</span>
                  {msg.voiceText && (
                    <button onClick={() => speak(msg.voiceText || "")} className="text-xs hover:text-white" title="सुने">
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>

      {/* Quick Chips */}
      <footer className="bg-[#202c33] p-2 border-t border-[#2a3942] z-30">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar text-xs">
          {currentStep === 1 && (
            <>
              <button
                onClick={() => handlePhotoSimulate("nameplate")}
                className="bg-[#2a3942] hover:bg-[#32434e] text-[#e9edef] px-3 py-1.5 rounded-full whitespace-nowrap border border-[#3b4c56] font-medium"
              >
                📸 AC नेमप्लेट फोटो खींची
              </button>
              <button
                onClick={() => handleSendMessage("स्टेबलाइजर चेक किया, 220V आ रहा है")}
                className="bg-[#2a3942] hover:bg-[#32434e] text-[#e9edef] px-3 py-1.5 rounded-full whitespace-nowrap border border-[#3b4c56] font-medium"
              >
                🔌 स्टेबलाइजर ठीक है
              </button>
            </>
          )}
          {currentStep === 4 && (
            <>
              <button
                onClick={() => handlePsiChange(50)}
                className="bg-[#2a3942] hover:bg-[#32434e] text-red-300 px-3 py-1.5 rounded-full whitespace-nowrap border border-red-500/50 font-bold"
              >
                ⚡ 50 PSI (कम गैस टेस्ट)
              </button>
              <button
                onClick={() => handlePsiChange(125)}
                className="bg-[#2a3942] hover:bg-[#32434e] text-green-300 px-3 py-1.5 rounded-full whitespace-nowrap border border-green-500/50 font-bold"
              >
                ⚡ 125 PSI (नॉर्मल टेस्ट)
              </button>
            </>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openCamera("general")}
            className="p-2.5 rounded-full text-[#8696a0] hover:text-white bg-[#111b21] border border-slate-700 flex items-center justify-center text-lg active:scale-95 transition"
          >
            <Camera className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="मैसेज लिखें या बोलें (जैसे: 50 PSI, डायग्राम)..."
            className="flex-1 bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] text-xs py-2.5 px-3.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#00a884]"
          />

          <button
            onClick={toggleSpeechRecognition}
            className={`w-10 h-10 rounded-full bg-[#FFC42E] hover:bg-amber-400 active:scale-95 text-slate-950 flex items-center justify-center font-bold text-lg shadow-lg transition ${
              isListening ? "pulse-mic" : ""
            }`}
          >
            <Mic className="w-5 h-5 text-slate-950" />
          </button>

          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-full text-[#00a884] hover:text-white bg-[#111b21] border border-slate-700 flex items-center justify-center text-base active:scale-95 transition"
          >
            <Send className="w-4 h-4 text-[#00a884]" />
          </button>
        </div>
      </footer>

      {/* Camera Modal */}
      {cameraModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-white">
            <span className="font-bold text-sm">
              {cameraContext === "safety_proof"
                ? "सुरक्षा सबूत: MCB / ग्लव्स की फोटो लें"
                : cameraContext === "diagram_sheet"
                ? "वायरिंग या एरर कोड शीट स्कैन करें"
                : "AC नेमप्लेट या मीटर स्कैन करें"}
            </span>
            <button onClick={closeCamera} className="text-slate-400 hover:text-white text-2xl font-bold">
              ✕
            </button>
          </div>

          <div className="relative flex-1 my-3 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-[#FFC42E]">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-8 border-2 border-[#FFC42E] rounded-xl pointer-events-none flex flex-col justify-between p-3">
              <span className="text-[10px] bg-black/80 text-[#FFC42E] px-2 py-0.5 rounded font-mono font-bold self-start">
                [AI SCANNER ACTIVE]
              </span>
              <span className="text-[11px] text-white text-center bg-black/80 py-1 rounded font-bold">
                ऑब्जेक्ट को बॉक्स के बीच में रखें
              </span>
            </div>
          </div>

          <div className="flex items-center justify-around pb-2">
            <button
              onClick={switchCamera}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5"
            >
              <RotateCw className="w-4 h-4" /> एंगल बदलें
            </button>
            <button
              onClick={() => handlePhotoSimulate(cameraContext)}
              className="w-16 h-16 rounded-full bg-[#FFC42E] border-4 border-white text-slate-950 flex items-center justify-center text-2xl shadow-xl active:scale-95 transition"
            >
              📸
            </button>
            <button
              onClick={() => handlePhotoSimulate(cameraContext)}
              className="px-3 py-2 bg-slate-800 text-amber-300 rounded-xl text-xs font-bold border border-slate-700"
            >
              ⚡ डेमो फोटो
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
