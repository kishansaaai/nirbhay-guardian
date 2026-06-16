import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SBI Nirbhay — Agentic Fraud-Fear Removal Companion" },
      {
        name: "description",
        content:
          "Interactive demo: YONO emulator + judge control panel for SBI Nirbhay, a multilingual in-app agent that removes fraud fear.",
      },
    ],
  }),
  component: NirbhayDemo,
});

/* ---------------------- i18n ---------------------- */

type Lang = "en" | "hi" | "kn" | "ta" | "te" | "mr";

const LANGS: { code: Lang; native: string; label: string; voice: string }[] = [
  { code: "en", native: "English", label: "English", voice: "en-IN" },
  { code: "hi", native: "हिन्दी", label: "Hindi", voice: "hi-IN" },
  { code: "kn", native: "ಕನ್ನಡ", label: "Kannada", voice: "kn-IN" },
  { code: "ta", native: "தமிழ்", label: "Tamil", voice: "ta-IN" },
  { code: "te", native: "తెలుగు", label: "Telugu", voice: "te-IN" },
  { code: "mr", native: "मराठी", label: "Marathi", voice: "mr-IN" },
];

const T = {
  greeting: {
    en: "Namaste, I am Nirbhay — your safe-banking companion. I'll walk beside you, never ahead.",
    hi: "नमस्ते, मैं हूँ निर्भय — आपका सुरक्षित बैंकिंग साथी। मैं आपके साथ चलूँगा, आगे नहीं।",
    kn: "ನಮಸ್ತೆ, ನಾನು ನಿರ್ಭಯ — ನಿಮ್ಮ ಸುರಕ್ಷಿತ ಬ್ಯಾಂಕಿಂಗ್ ಸಂಗಾತಿ.",
    ta: "வணக்கம், நான் நிர்பய் — உங்கள் பாதுகாப்பான வங்கி துணை.",
    te: "నమస్తే, నేను నిర్భయ్ — మీ సురక్షిత బ్యాంకింగ్ తోడు.",
    mr: "नमस्कार, मी निर्भय — तुमचा सुरक्षित बँकिंग सोबती.",
  },
  scamWarn: {
    en: "Fraudsters often use lottery offers to steal money. You should never pay to receive a prize.",
    hi: "धोखेबाज़ अक्सर लॉटरी का लालच देकर पैसा चुराते हैं। इनाम पाने के लिए कभी पैसे न दें।",
    kn: "ಲಾಟರಿ ಎಂದು ಹೇಳಿ ಮೋಸಗಾರರು ಹಣ ಕದಿಯುತ್ತಾರೆ. ಬಹುಮಾನಕ್ಕಾಗಿ ಎಂದಿಗೂ ಹಣ ಕಳುಹಿಸಬೇಡಿ.",
    ta: "லாட்டரி என்று கூறி மோசடி பேர்வழிகள் பணம் திருடுகிறார்கள்.",
    te: "లాటరీ పేరుతో మోసగాళ్లు డబ్బు దొంగిలిస్తారు. బహుమతి కోసం ఎప్పుడూ చెల్లించవద్దు.",
    mr: "लॉटरीच्या आमिषाने फसवणूक करणारे पैसे चोरतात. बक्षीससाठी कधीही पैसे देऊ नका.",
  },
  fdSafe: {
    en: "This is a safe in-bank action. Your money stays inside SBI. Your trust score will go up.",
    hi: "यह सुरक्षित बैंक के अंदर का काम है। पैसा SBI में ही रहेगा। आपका ट्रस्ट स्कोर बढ़ेगा।",
    kn: "ಇದು ಸುರಕ್ಷಿತ ಬ್ಯಾಂಕಿನ ಒಳಗಿನ ಕ್ರಿಯೆ.",
    ta: "இது பாதுகாப்பான வங்கி உள் செயல்.",
    te: "ఇది సురక్షితమైన బ్యాంకు లోపలి చర్య.",
    mr: "ही बँकेच्या आत सुरक्षित कृती आहे.",
  },
  collectWarn: {
    en: "A stranger is asking you for money. Verify the source before approving any collect request.",
    hi: "कोई अजनबी आपसे पैसे माँग रहा है। मंज़ूरी देने से पहले स्रोत की पुष्टि करें।",
    kn: "ಒಬ್ಬ ಅಪರಿಚಿತ ಹಣ ಕೇಳುತ್ತಿದ್ದಾರೆ. ಒಪ್ಪುವ ಮೊದಲು ಪರಿಶೀಲಿಸಿ.",
    ta: "ஒரு அந்நியர் பணம் கேட்கிறார். ஒப்புக்கொள்ளும் முன் சரிபார்க்கவும்.",
    te: "ఒక అపరిచితుడు డబ్బు అడుగుతున్నాడు. ఆమోదించే ముందు ధృవీకరించండి.",
    mr: "अनोळखी व्यक्ती पैसे मागत आहे. मंजूर करण्यापूर्वी पडताळणी करा.",
  },
  mfUnlock: {
    en: "You've completed safe transactions. Mutual Funds are now unlocked. Let's invest mindfully.",
    hi: "आपने सुरक्षित लेन-देन पूरे किए। म्यूचुअल फंड अब अनलॉक हो गए हैं।",
    kn: "ನೀವು ಸುರಕ್ಷಿತ ವಹಿವಾಟುಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ. ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ ಅನ್ಲಾಕ್.",
    ta: "பாதுகாப்பான பரிவர்த்தனைகள் முடிந்தன. மியூச்சுவல் ஃபண்ட் திறக்கப்பட்டது.",
    te: "మ్యూచువల్ ఫండ్స్ ఇప్పుడు అన్‌లాక్ అయ్యాయి.",
    mr: "म्युच्युअल फंड आता अनलॉक झाले आहेत.",
  },
};

const tr = <K extends keyof typeof T>(key: K, lang: Lang) =>
  (T[key] as Record<Lang, string>)[lang] ?? (T[key] as Record<Lang, string>).en;

/* ---------------------- Risk Engine ---------------------- */

type Risk = "LOW" | "MEDIUM" | "HIGH";
type RiskFactor = { label: string; weight: number; hit: boolean };
type RiskResult = { score: number; level: Risk; factors: RiskFactor[]; reason: string };

const SCAM_RX = /lottery|prize|win|reward|gift|kbc|free|jackpot|bonus|crypto|otp|refund/i;
const KNOWN_BENEFICIARIES = ["asha@oksbi", "ramesh@okhdfcbank", "mom@okicici"];

function evaluateRisk(input: {
  amount: number;
  payeeVpa: string;
  isInternalSBI?: boolean;
  isCollect?: boolean;
}): RiskResult {
  const known = KNOWN_BENEFICIARIES.includes(input.payeeVpa.trim().toLowerCase());
  const f: RiskFactor[] = [
    { label: "Scam keyword in payee ID", weight: 45, hit: SCAM_RX.test(input.payeeVpa) },
    { label: "Unknown / unverified payee", weight: 25, hit: !known && !input.isInternalSBI },
    { label: "High amount on unverified payee", weight: 20, hit: !known && !input.isInternalSBI && input.amount > 3000 },
    { label: "Collect (pull) request", weight: 25, hit: !!input.isCollect },
    { label: "Internal SBI transaction", weight: -50, hit: !!input.isInternalSBI },
    { label: "Saved beneficiary", weight: -20, hit: known },
  ];
  const score = Math.max(0, Math.min(100, f.reduce((s, x) => s + (x.hit ? x.weight : 0), 0)));
  const level: Risk = score >= 60 ? "HIGH" : score >= 30 ? "MEDIUM" : "LOW";
  const reason =
    level === "HIGH"
      ? "Multiple high-risk indicators — strong scam pattern detected."
      : level === "MEDIUM"
        ? "Some uncertainty — verify the source before proceeding."
        : "Pattern matches safe in-bank behaviour.";
  return { score, level, factors: f, reason };
}

/* ---------------------- Tiers ---------------------- */

type ScreenId = "onboarding" | "home" | "upi" | "fd" | "mf" | "grad";
type Tier = 1 | 2 | 3 | 4;
const tierFor = (score: number): Tier => (score >= 80 ? 4 : score >= 50 ? 3 : score >= 20 ? 2 : 1);
const GRADUATION_TXNS = 5;

/* ---------------------- Speech ---------------------- */

function useSpeak(lang: Lang, enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  const speakLocal = useCallback((text: string, fallbackText?: string, langOverride?: Lang) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      const activeLang = langOverride ?? lang;
      const voices = window.speechSynthesis.getVoices();
      const voiceConfig = LANGS.find((l) => l.code === activeLang);
      const targetVoiceCode = voiceConfig?.voice ?? "en-IN";
      const targetLabel = (voiceConfig?.label ?? "").toLowerCase();
      const matchedVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes(targetVoiceCode.toLowerCase()) ||
          v.lang.toLowerCase().startsWith(activeLang.toLowerCase()) ||
          v.name.toLowerCase().includes(targetLabel)
      );

      console.log(`[TTS] Local synthesis: lang=${activeLang}, targetVoice=${targetVoiceCode}, matchedVoice=${matchedVoice?.name}`);

      // Always speak the original regional text in the target language code
      const u = new SpeechSynthesisUtterance(text);
      u.lang = targetVoiceCode;
      u.rate = 0.98;
      u.pitch = 1.02;

      if (matchedVoice) {
        u.voice = matchedVoice;
      }

      console.log(`[TTS] Speaking local: "${text.substring(0, 30)}..." in ${targetVoiceCode}`);
      window.speechSynthesis.speak(u);
    } catch (err) {
      console.error("[TTS] Local speech error:", err);
    }
  }, [lang]);

  return useCallback(
    (text: string, fallbackText?: string, langOverride?: Lang) => {
      const activeLang = langOverride ?? lang;
      console.log(`[TTS] speak called with text="${text.substring(0, 30)}...", fallback="${fallbackText?.substring(0, 30)}...", lang=${activeLang}, enabled=${enabled}`);
      if (!enabled || typeof window === "undefined") return;

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      try {
        if (activeLang !== "en") {
          // Use translate.googleapis.com with client=tw-ob which has no CORS or referrer restrictions
          const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=${activeLang}&client=tw-ob&q=${encodeURIComponent(text)}`;
          console.log(`[TTS] Attempting Google APIs TTS for lang=${activeLang}: ${url}`);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.play()
            .then(() => {
              console.log("[TTS] Google APIs TTS playing successfully.");
            })
            .catch((err) => {
              console.warn("[TTS] Google APIs TTS play failed, falling back to local:", err);
              speakLocal(text, fallbackText, activeLang);
            });
        } else {
          speakLocal(text, fallbackText, activeLang);
        }
      } catch (err) {
        console.error("[TTS] Google APIs TTS execution error, falling back to local:", err);
        speakLocal(text, fallbackText, activeLang);
      }
    },
    [lang, enabled, speakLocal],
  );
}

/* ---------------------- Agent action types ---------------------- */

type AgentTone = "info" | "warn" | "danger" | "safe";
type AgentAction = { label: string; tone: "safe" | "danger" | "neutral"; onClick: () => void };
type AgentState = {
  msg: string;
  msgEn: string;
  tone: AgentTone;
  actions: AgentAction[];
} | null;

/* ---------------------- Component ---------------------- */

function NirbhayDemo() {
  const [lang, setLang] = useState<Lang>("en");
  const [voice, setVoice] = useState(false);
  const [screen, setScreen] = useState<ScreenId>("onboarding");
  const [trust, setTrust] = useState(0);
  const [agent, setAgent] = useState<AgentState>(null);
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [txnCount, setTxnCount] = useState(0);
  const [log, setLog] = useState<{ t: string; line: string; tone: string }[]>([]);
  const [trustTimeline, setTrustTimeline] = useState<{ t: string; value: number; reason: string }[]>([
    { t: nowTime(), value: 0, reason: "Session start" },
  ]);
  const [scenariosRun, setScenariosRun] = useState<
    { id: string; label: string; outcome: string; explanation: string; at: string }[]
  >([]);
  const speak = useSpeak(lang, voice);
  const tier = tierFor(trust);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        console.log(`[TTS] Voices loaded onvoiceschanged: ${window.speechSynthesis.getVoices().length} available.`);
      };
      window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      };
    }
  }, []);

  const pushLog = useCallback((line: string, tone = "info") => {
    setLog((l) => [...l, { t: nowTime(), line, tone }]);
  }, []);

  const trackTrust = useCallback((value: number, reason: string) => {
    setTrustTimeline((tl) => [...tl, { t: nowTime(), value, reason }]);
  }, []);

  const recordScenario = useCallback(
    (id: string, label: string, outcome: string, explanation: string) => {
      setScenariosRun((s) => [...s.filter((x) => x.id !== id), { id, label, outcome, explanation, at: nowTime() }]);
    },
    [],
  );

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  const sayAgent = useCallback(
    (msg: string, msgEn: string, tone: AgentTone, actions: AgentAction[] = []) => {
      setAgent({ msg, msgEn, tone, actions });
      speak(msg, msgEn);
      pushLog(`agent: ${msgEn}`, tone);
    },
    [speak, pushLog],
  );

  const clearAgent = useCallback(() => setAgent(null), []);

  const adjustTrust = useCallback(
    (delta: number, reason: string) => {
      setTrust((s) => {
        const nv = Math.max(0, Math.min(100, s + delta));
        trackTrust(nv, reason);
        return nv;
      });
    },
    [trackTrust],
  );

  const incrementTxn = useCallback(() => {
    setTxnCount((c) => {
      const n = c + 1;
      if (n >= GRADUATION_TXNS) {
        setTimeout(() => setScreen("grad"), 600);
      }
      return n;
    });
  }, []);

  /* ---- Onboarding ---- */

  const startOnboarding = (l: Lang) => {
    setLang(l);
    pushLog(`lang set → ${l}`, "info");
    const greet = tr("greeting", l);
    setAgent({ msg: greet, msgEn: tr("greeting", "en"), tone: "info", actions: [] });
    if (voice) speak(greet, tr("greeting", "en"));
  };

  const completeOnboarding = () => {
    setScreen("home");
    adjustTrust(15, "Onboarding complete (+15)");
    pushLog("✓ Onboarding complete (+15 XP)", "safe");
    sayAgent(
      tr("greeting", lang),
      "Welcome. I'll walk beside you, never ahead. Your starting Trust Score is 15.",
      "safe",
    );
  };

  /* ---- UPI submit (form) ---- */

  const submitUpi = (payeeVpa: string, amount: number, remarks: string) => {
    const r = evaluateRisk({ amount, payeeVpa });
    setRisk(r);
    pushLog(`UPI submit → ${payeeVpa} · ₹${amount} · risk ${r.level} (${r.score})`, r.level === "HIGH" ? "danger" : r.level === "MEDIUM" ? "warn" : "safe");

    if (r.level === "HIGH") {
      sayAgent(
        tr("scamWarn", lang),
        `High risk: "${payeeVpa}" looks like a scam pattern. Cancel to keep your money safe.`,
        "danger",
        [
          {
            label: "Cancel — keep safe",
            tone: "safe",
            onClick: () => {
              adjustTrust(20, "Cancelled HIGH-risk UPI (+20)");
              pushLog("✓ User cancelled scam payment (+20 trust)", "safe");
              recordScenario("upi-scam", `UPI scam attempt — ${payeeVpa}`, "Blocked by user", "Nirbhay flagged scam keywords; user cancelled.");
              incrementTxn();
              clearAgent();
              setScreen("home");
            },
          },
          {
            label: "Pay anyway (risky)",
            tone: "danger",
            onClick: () => {
              adjustTrust(-15, "Proceeded on HIGH-risk UPI (−15)");
              pushLog("✗ User paid anyway (−15 trust)", "danger");
              recordScenario("upi-scam", `UPI scam attempt — ${payeeVpa}`, "User overrode warning", "User ignored Nirbhay's warning.");
              incrementTxn();
              clearAgent();
              setScreen("home");
            },
          },
        ],
      );
      return;
    }

    if (r.level === "MEDIUM") {
      sayAgent(
        tr("collectWarn", lang),
        `Medium risk: verify "${payeeVpa}" before sending ₹${amount}.`,
        "warn",
        [
          {
            label: "Verify & proceed",
            tone: "safe",
            onClick: () => {
              adjustTrust(10, "Verified medium-risk payment (+10)");
              pushLog(`✓ Verified & paid ₹${amount} to ${payeeVpa}`, "safe");
              recordScenario("upi-med", `UPI to ${payeeVpa}`, "Verified & paid", "User verified before paying.");
              incrementTxn();
              clearAgent();
              setScreen("home");
            },
          },
          {
            label: "Cancel",
            tone: "danger",
            onClick: () => {
              adjustTrust(5, "Cancelled medium-risk payment (+5)");
              pushLog("✓ User cancelled medium-risk payment (+5)", "safe");
              clearAgent();
              setScreen("home");
            },
          },
        ],
      );
      return;
    }

    sayAgent(
      tr("fdSafe", lang),
      `Low risk: paying ₹${amount} to a saved beneficiary. Safe to proceed.`,
      "safe",
      [
        {
          label: "Pay ₹" + amount,
          tone: "safe",
          onClick: () => {
            adjustTrust(15, "Safe UPI payment (+15)");
            pushLog(`✓ Paid ₹${amount} to ${payeeVpa}`, "safe");
            recordScenario("upi-safe", `UPI to ${payeeVpa}`, "Paid (low risk)", "Saved beneficiary — Nirbhay approved.");
            incrementTxn();
            clearAgent();
            setScreen("home");
          },
        },
        { label: "Cancel", tone: "danger", onClick: () => { clearAgent(); setScreen("home"); } },
      ],
    );
  };

  /* ---- FD submit ---- */

  const submitFd = (amount: number, tenureMonths: number) => {
    const r = evaluateRisk({ amount, payeeVpa: "SBI-FD-Internal", isInternalSBI: true });
    setRisk(r);
    pushLog(`FD submit → ₹${amount} · ${tenureMonths}m · risk ${r.level} (${r.score})`, "safe");
    sayAgent(
      tr("fdSafe", lang),
      `Safe in-bank action. Your ₹${amount} stays inside SBI for ${tenureMonths} months. Trust score will rise.`,
      "safe",
      [
        {
          label: "Book FD",
          tone: "safe",
          onClick: () => {
            adjustTrust(20, "Opened FD (+20)");
            pushLog(`✓ FD booked · ₹${amount} for ${tenureMonths}m (+20 trust)`, "safe");
            recordScenario("fd", `Fixed Deposit ₹${amount} · ${tenureMonths}m`, "Booked", "Safe internal SBI transaction.");
            incrementTxn();
            clearAgent();
            setScreen("home");
          },
        },
        { label: "Back", tone: "neutral", onClick: () => { clearAgent(); setScreen("home"); } },
      ],
    );
  };

  /* ---- MF submit ---- */

  const submitMf = (fundName: string, amount: number) => {
    const r = evaluateRisk({ amount, payeeVpa: "SBI-AMC-Internal", isInternalSBI: true });
    setRisk(r);
    pushLog(`MF submit → ${fundName} · ₹${amount} · risk ${r.level}`, "safe");
    sayAgent(
      tr("mfUnlock", lang),
      `${fundName} — investing ₹${amount} via SIP. SBI AMC is a regulated, trusted route.`,
      "safe",
      [
        {
          label: "Start SIP",
          tone: "safe",
          onClick: () => {
            adjustTrust(25, "Started SIP (+25)");
            pushLog(`✓ SIP started · ${fundName} · ₹${amount} (+25 trust)`, "safe");
            recordScenario("mf", `SIP · ${fundName} · ₹${amount}`, "Started", "Coached investment in regulated SBI AMC fund.");
            incrementTxn();
            clearAgent();
            setScreen("home");
          },
        },
        { label: "Back", tone: "neutral", onClick: () => { clearAgent(); setScreen("home"); } },
      ],
    );
  };

  /* ---- Tile clicks (with gating) ---- */

  const openUpi = () => { clearAgent(); setScreen("upi"); };
  const openFd = () => {
    if (trust < 20) {
      sayAgent("Complete one safe action to unlock Fixed Deposits.", "Complete one safe action to unlock Fixed Deposits.", "info");
      return;
    }
    clearAgent(); setScreen("fd");
  };
  const openMf = () => {
    if (trust < 50) {
      sayAgent("Mutual Funds unlock at Trust Score 50. Keep going!", "Mutual Funds unlock at Trust Score 50.", "info");
      return;
    }
    clearAgent(); setScreen("mf");
  };
  const openLoans = () => {
    if (trust < 80) {
      sayAgent("Pre-approved loans unlock at Trust Score 80.", "Pre-approved loans unlock at Trust Score 80.", "info");
      return;
    }
    sayAgent("You qualify for a pre-approved loan. We'll guide you in your language.", "Pre-approved loan unlocked.", "safe");
  };

  /* ---- Reset ---- */

  const resetDemo = () => {
    setScreen("onboarding");
    setTrust(0);
    setTxnCount(0);
    setAgent(null);
    setRisk(null);
    setLog([]);
    setScenariosRun([]);
    setTrustTimeline([{ t: nowTime(), value: 0, reason: "Session reset" }]);
  };

  const downloadReport = () => {
    const html = buildReportHtml({ trust, tier, lang, scenariosRun, trustTimeline, log });
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  };

  /* ---------------------- Render ---------------------- */

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 glass">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl brand-gradient text-white shadow-md">
              <span className="font-display text-lg font-bold">न</span>
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">SBI Nirbhay</h1>
              <p className="truncate text-xs text-muted-foreground">
                Agentic Fraud-Fear Removal Companion · GFF 2026
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setVoice((v) => !v)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                voice ? "border-teal bg-teal/10 text-teal-deep" : "border-border bg-card hover:bg-muted"
              }`}
            >
              {voice ? "🔊 Voice on" : "🔇 Voice off"}
            </button>
            <button
              onClick={downloadReport}
              className="rounded-full gold-gradient px-3 py-1.5 text-xs font-bold text-ink shadow-sm hover:opacity-90"
            >
              ⬇ Download PDF
            </button>
            <button
              onClick={resetDemo}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              ↻ Reset demo
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <section className="flex justify-center lg:sticky lg:top-[88px] lg:self-start">
          <PhoneFrame>
            <PhoneInner
              screen={screen}
              lang={lang}
              trust={trust}
              tier={tier}
              txnCount={txnCount}
              agent={agent}
              voice={voice}
              onToggleVoice={() => setVoice((v) => !v)}
              onLang={startOnboarding}
              onStartOnboarding={completeOnboarding}
              onTile={{ upi: openUpi, fd: openFd, mf: openMf, loans: openLoans }}
              onReset={resetDemo}
              onSubmitUpi={submitUpi}
              onSubmitFd={submitFd}
              onSubmitMf={submitMf}
              onHome={() => { clearAgent(); setScreen("home"); }}
              onCloseAgent={clearAgent}
            />
          </PhoneFrame>
        </section>

        <section className="space-y-6">
          <PanelHeader trust={trust} tier={tier} screen={screen} lang={lang} txnCount={txnCount} />
          <div className="grid gap-6 md:grid-cols-2">
            <RiskCard risk={risk} />
            <TrustCard trust={trust} tier={tier} txnCount={txnCount} />
          </div>
          <FeatureUnlocks trust={trust} />
          <ScenarioRunner
            disabled={screen === "onboarding"}
            onRun={(id) => {
              if (id === "upi-scam") { setScreen("upi"); setTimeout(() => submitUpi("win-lottery-777@ybl", 5000, "claim prize"), 300); }
              if (id === "upi-collect") { setScreen("upi"); setTimeout(() => submitUpi("utility-bharat-merchant@upi", 1200, "bill"), 300); }
              if (id === "fd") { openFd(); }
              if (id === "mf") { openMf(); }
            }}
          />
          <LogCard log={log} logRef={logRef} />
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        Proof of concept · Not affiliated with SBI · Built for demonstration only
      </footer>
    </div>
  );
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/* ---------------------- Phone ---------------------- */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-grid opacity-60" />
      <div className="relative h-[760px] w-[380px] rounded-[3rem] border border-border bg-ink/95 p-3 phone-shadow">
        <div className="absolute left-1/2 top-3 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-ink" />
        <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] bg-surface">
          {children}
        </div>
      </div>
    </div>
  );
}

function PhoneInner(props: {
  screen: ScreenId;
  lang: Lang;
  trust: number;
  tier: Tier;
  txnCount: number;
  agent: AgentState;
  voice: boolean;
  onToggleVoice: () => void;
  onLang: (l: Lang) => void;
  onStartOnboarding: () => void;
  onTile: { upi: () => void; fd: () => void; mf: () => void; loans: () => void };
  onReset: () => void;
  onSubmitUpi: (payee: string, amount: number, remarks: string) => void;
  onSubmitFd: (amount: number, tenure: number) => void;
  onSubmitMf: (fund: string, amount: number) => void;
  onHome: () => void;
  onCloseAgent: () => void;
}) {
  const { screen, lang, trust, tier, txnCount, agent } = props;
  return (
    <div className="relative flex h-full flex-col">
      {screen !== "onboarding" && (
        <div className="brand-gradient px-5 pb-4 pt-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/70">YONO SBI</p>
              <p className="font-display text-lg font-bold">Good morning, Asha</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-sm font-bold">A</div>
          </div>
          <div className="mt-4 rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/70">Savings · ****4821</p>
                <p className="font-display text-2xl font-bold tracking-tight">₹ 48,210.55</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-wider text-white/70">Trust Shield</p>
                <p className="font-display text-lg font-bold">{trust}/100</p>
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full gold-gradient transition-all duration-500" style={{ width: `${trust}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-[9px] text-white/70">
              <span>T1 · UPI</span><span>T2 · FD (20)</span><span>T3 · MF (50)</span><span>T4 · Loans (80)</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {screen === "onboarding" && (
          <OnboardingScreen lang={lang} onLang={props.onLang} onStart={props.onStartOnboarding} />
        )}
        {screen === "home" && (
          <HomeScreen trust={trust} tier={tier} txnCount={txnCount} onTile={props.onTile} onReset={props.onReset} />
        )}
        {screen === "upi" && <UpiForm onSubmit={props.onSubmitUpi} onBack={props.onHome} />}
        {screen === "fd" && <FdForm onSubmit={props.onSubmitFd} onBack={props.onHome} />}
        {screen === "mf" && <MfForm onSubmit={props.onSubmitMf} onBack={props.onHome} />}
        {screen === "grad" && <GraduationScreen trust={trust} onHome={props.onHome} />}
      </div>

      {screen !== "onboarding" && agent && (
        <NirbhayAgent
          agent={agent}
          lang={lang}
          voice={props.voice}
          onToggleVoice={props.onToggleVoice}
          onClose={props.onCloseAgent}
        />
      )}
    </div>
  );
}

/* ---------------------- Nirbhay Overlay ---------------------- */

function NirbhayAgent({
  agent, lang, voice, onToggleVoice, onClose,
}: {
  agent: NonNullable<AgentState>;
  lang: Lang;
  voice: boolean;
  onToggleVoice: () => void;
  onClose: () => void;
}) {
  const { msg, msgEn, tone, actions } = agent;
  const toneStyles = {
    info: "border-teal/30 bg-white text-ink",
    safe: "border-safe/40 bg-emerald-50 text-ink shadow-lg shadow-emerald-500/5",
    warn: "border-warn/50 bg-amber-50 text-ink shadow-lg shadow-amber-500/5",
    danger: "border-danger/50 bg-red-50 text-ink shadow-lg shadow-red-500/5",
  }[tone];
  const orbStyles = {
    info: "brand-gradient",
    safe: "bg-safe",
    warn: "bg-warn",
    danger: "bg-danger",
  }[tone];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 fade-up" key={msg}>
      <div className={`m-3 rounded-2xl border p-3 shadow-2xl ${toneStyles}`}>
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <span className={`absolute inset-0 -z-0 rounded-full opacity-50 orb-ring ${orbStyles}`} />
            <div className={`relative grid h-11 w-11 place-items-center rounded-full text-white shadow-lg nirbhay-orb ${orbStyles}`}>
              <span className="font-display text-base font-bold">न</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Nirbhay · {LANGS.find((l) => l.code === lang)?.label}
              </p>
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                tone === "danger" ? "bg-danger text-white" :
                tone === "warn" ? "bg-warn text-ink" :
                tone === "safe" ? "bg-safe text-white" : "bg-teal/15 text-teal-deep"
              }`}>{tone}</span>
              <button
                onClick={onToggleVoice}
                className="ml-auto rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-semibold text-ink hover:bg-muted"
                aria-label="Toggle voice"
              >
                {voice ? "🔊" : "🔇"}
              </button>
              <button onClick={onClose} className="rounded-full px-1.5 py-0.5 text-xs text-muted-foreground hover:text-ink" aria-label="Close">×</button>
            </div>
            <p className="mt-0.5 text-[13px] font-medium leading-snug text-ink">{msg}</p>
            {lang !== "en" && (
              <p className="mt-0.5 text-[11px] italic leading-snug text-muted-foreground">{msgEn}</p>
            )}
            {voice && <VoiceWave tone={tone} />}
          </div>
        </div>

        {actions.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={a.onClick}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  a.tone === "safe"
                    ? "border-2 border-safe bg-safe/10 text-ink hover:bg-safe/20"
                    : a.tone === "danger"
                      ? "border border-danger/40 bg-white text-danger hover:bg-danger/10"
                      : "border border-border bg-white text-ink hover:bg-muted"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VoiceWave({ tone }: { tone: AgentTone }) {
  const color =
    tone === "danger" ? "bg-danger" : tone === "warn" ? "bg-warn" : tone === "safe" ? "bg-safe" : "bg-teal";
  return (
    <div className="mt-2 flex items-end gap-0.5 h-4" aria-hidden>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <span
          key={i}
          className={`w-1 rounded-full ${color} voice-bar`}
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}

/* ---------------------- Screens ---------------------- */

function OnboardingScreen({
  lang, onLang, onStart,
}: { lang: Lang; onLang: (l: Lang) => void; onStart: () => void }) {
  const [picked, setPicked] = useState<Lang | null>(null);
  return (
    <div className="flex h-full flex-col items-center justify-center px-2 py-6 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-3xl brand-gradient text-white shadow-2xl nirbhay-orb">
        <span className="font-display text-3xl font-bold">न</span>
      </div>
      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight">Welcome to YONO</h2>
      <p className="mt-1 text-sm text-muted-foreground">Choose the language you think in</p>
      <div className="mt-5 grid w-full grid-cols-2 gap-2">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => { setPicked(l.code); onLang(l.code); }}
            className={`rounded-2xl border p-3 text-left transition ${
              picked === l.code || (picked === null && lang === l.code)
                ? "border-teal bg-teal/10 shadow-md"
                : "border-border bg-white hover:border-teal"
            }`}
          >
            <p className="font-display text-lg font-bold leading-none">{l.native}</p>
            <p className="text-[11px] text-muted-foreground">{l.label}</p>
          </button>
        ))}
      </div>
      <button
        onClick={onStart}
        disabled={!picked}
        className="mt-5 w-full rounded-2xl gold-gradient px-4 py-3 text-sm font-bold text-ink shadow-md hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Start Onboarding (+15 XP)
      </button>
    </div>
  );
}

function HomeScreen({
  trust, tier, txnCount, onTile, onReset,
}: {
  trust: number;
  tier: Tier;
  txnCount: number;
  onTile: { upi: () => void; fd: () => void; mf: () => void; loans: () => void };
  onReset: () => void;
}) {
  const tiles = [
    { id: "upi", label: "YONO Pay", sub: "UPI · IMPS", icon: "↗", unlockAt: 0, onClick: onTile.upi },
    { id: "fd", label: "Book FD", sub: "Earn 7.1% p.a.", icon: "◉", unlockAt: 20, onClick: onTile.fd },
    { id: "mf", label: "Mutual Funds", sub: "SIPs from ₹500", icon: "△", unlockAt: 50, onClick: onTile.mf },
    { id: "loans", label: "Loans", sub: "Pre-approved", icon: "₹", unlockAt: 80, onClick: onTile.loans },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-teal/20 bg-teal/5 p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-teal-deep">Coaching progress</p>
        <p className="mt-1 text-xs text-ink">
          {txnCount} / {GRADUATION_TXNS} safe actions completed · Tier {tier}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white">
          <div className="h-full brand-gradient transition-all" style={{ width: `${(txnCount / GRADUATION_TXNS) * 100}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t) => {
          const locked = trust < t.unlockAt;
          return (
            <button
              key={t.id}
              onClick={t.onClick}
              className={`relative overflow-hidden rounded-2xl border p-3 text-left transition ${
                locked
                  ? "border-dashed border-border bg-muted/50 text-muted-foreground"
                  : "border-border bg-card hover:-translate-y-0.5 hover:border-teal hover:shadow-lg"
              }`}
            >
              <div className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-bold ${locked ? "bg-muted text-muted-foreground" : "brand-gradient text-white"}`}>
                {t.icon}
              </div>
              <p className="mt-3 text-sm font-semibold">{t.label}</p>
              <p className="text-[11px] text-muted-foreground">{t.sub}</p>
              {locked && (
                <span className="absolute right-2 top-2 rounded-full bg-card px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  🔒 {t.unlockAt}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-white p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent</p>
        <ul className="mt-2 divide-y divide-border text-sm">
          <li className="flex items-center justify-between py-2"><span>Electricity · BESCOM</span><span className="text-danger">− ₹1,840</span></li>
          <li className="flex items-center justify-between py-2"><span>Salary · Acme Pvt Ltd</span><span className="text-safe">+ ₹52,000</span></li>
          <li className="flex items-center justify-between py-2"><span>Grocery · DMart</span><span className="text-danger">− ₹2,210</span></li>
        </ul>
      </div>

      <button
        onClick={onReset}
        className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >
        ↻ Reset Demo
      </button>
    </div>
  );
}

function UpiForm({ onSubmit, onBack }: { onSubmit: (p: string, a: number, r: string) => void; onBack: () => void }) {
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const presets = [
    { label: "Saved · mom@okicici", payee: "mom@okicici", amount: "1500" },
    { label: "Scam · lottery", payee: "win-lottery-777@ybl", amount: "5000" },
    { label: "Unknown utility", payee: "utility-bharat-merchant@upi", amount: "1200" },
  ];
  const valid = payee.trim().length > 3 && Number(amount) > 0;
  return (
    <div className="space-y-3">
      <button onClick={onBack} className="text-xs text-teal-deep">← Back</button>
      <h3 className="font-display text-lg font-bold">YONO Pay · UPI</h3>
      <div className="grid gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => { setPayee(p.payee); setAmount(p.amount); setRemarks(""); }}
            className="rounded-xl border border-border bg-white px-3 py-2 text-left text-xs hover:border-teal"
          >
            <p className="font-semibold text-ink">{p.label}</p>
            <p className="text-muted-foreground">{p.payee} · ₹{p.amount}</p>
          </button>
        ))}
      </div>
      <label className="block">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Payee UPI / phone</span>
        <input
          value={payee}
          onChange={(e) => setPayee(e.target.value)}
          placeholder="someone@bank"
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal"
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount (₹)</span>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
          inputMode="numeric"
          placeholder="0"
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-lg font-bold outline-none focus:border-teal"
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Remarks</span>
        <input
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="optional"
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-teal"
        />
      </label>
      <button
        disabled={!valid}
        onClick={() => onSubmit(payee.trim(), Number(amount), remarks)}
        className="w-full rounded-xl gold-gradient px-4 py-3 text-sm font-bold text-ink shadow-md disabled:opacity-50"
      >
        Proceed to Pay
      </button>
    </div>
  );
}

function FdForm({ onSubmit, onBack }: { onSubmit: (a: number, t: number) => void; onBack: () => void }) {
  const [amount, setAmount] = useState("25000");
  const [tenure, setTenure] = useState("12");
  const valid = Number(amount) >= 1000 && Number(tenure) >= 6;
  return (
    <div className="space-y-3">
      <button onClick={onBack} className="text-xs text-teal-deep">← Back</button>
      <h3 className="font-display text-lg font-bold">Book Fixed Deposit</h3>
      <div className="rounded-2xl border border-safe/30 bg-safe/5 p-3 text-xs text-ink">
        Internal SBI transaction · Money stays inside your bank · Low risk.
      </div>
      <label className="block">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deposit amount (₹)</span>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
          inputMode="numeric"
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-lg font-bold outline-none focus:border-teal"
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tenure (months)</span>
        <select
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal"
        >
          {[6, 12, 24, 36, 60].map((m) => (
            <option key={m} value={m}>{m} months · {m >= 12 ? "7.1%" : "6.5%"} p.a.</option>
          ))}
        </select>
      </label>
      <div className="rounded-xl bg-muted/60 p-3 text-xs">
        Maturity estimate: <b>₹{Math.round(Number(amount || 0) * (1 + (Number(tenure) / 12) * 0.071)).toLocaleString("en-IN")}</b>
      </div>
      <button
        disabled={!valid}
        onClick={() => onSubmit(Number(amount), Number(tenure))}
        className="w-full rounded-xl gold-gradient px-4 py-3 text-sm font-bold text-ink shadow-md disabled:opacity-50"
      >
        Book FD
      </button>
    </div>
  );
}

function MfForm({ onSubmit, onBack }: { onSubmit: (fund: string, amount: number) => void; onBack: () => void }) {
  const funds = [
    { name: "SBI Bluechip Fund", risk: "Moderate", ret: "14.2%" },
    { name: "SBI Small Cap Fund", risk: "High", ret: "21.8%" },
    { name: "SBI Magnum Gilt Fund", risk: "Low", ret: "7.4%" },
  ];
  const [fund, setFund] = useState(funds[0].name);
  const [amount, setAmount] = useState("500");
  const valid = Number(amount) >= 500;
  return (
    <div className="space-y-3">
      <button onClick={onBack} className="text-xs text-teal-deep">← Back</button>
      <h3 className="font-display text-lg font-bold">SBI Mutual Funds</h3>
      <div className="rounded-2xl gold-gradient p-3 text-xs text-ink">
        Unlocked at Trust ≥ 50 · SBI AMC is regulated by SEBI.
      </div>
      <div className="space-y-2">
        {funds.map((f) => (
          <button
            key={f.name}
            onClick={() => setFund(f.name)}
            className={`w-full rounded-xl border p-3 text-left transition ${
              fund === f.name ? "border-teal bg-teal/10" : "border-border bg-white hover:border-teal"
            }`}
          >
            <p className="text-sm font-semibold">{f.name}</p>
            <p className="text-[11px] text-muted-foreground">3Y return · {f.ret} · {f.risk} risk</p>
          </button>
        ))}
      </div>
      <label className="block">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">SIP amount (₹/month)</span>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
          inputMode="numeric"
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-lg font-bold outline-none focus:border-teal"
        />
      </label>
      <button
        disabled={!valid}
        onClick={() => onSubmit(fund, Number(amount))}
        className="w-full rounded-xl gold-gradient px-4 py-3 text-sm font-bold text-ink shadow-md disabled:opacity-50"
      >
        Start SIP
      </button>
    </div>
  );
}

function GraduationScreen({ trust, onHome }: { trust: number; onHome: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-2 text-center">
      <div className="relative">
        <div className="absolute -inset-6 rounded-full bg-gold/20 blur-2xl" />
        <div className="relative grid h-24 w-24 place-items-center rounded-full gold-gradient text-ink shadow-2xl">
          <span className="font-display text-4xl font-bold">★</span>
        </div>
      </div>
      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight">Coaching Graduated</h2>
      <p className="mt-1 max-w-[260px] text-sm text-muted-foreground">
        You completed all 5 coached transactions. You now bank fearlessly.
      </p>
      <div className="mt-5 w-full rounded-2xl border-2 border-teal/30 bg-white p-4 text-left shadow-md">
        <p className="text-[10px] font-bold uppercase tracking-widest text-teal-deep">Digital Trust Certificate</p>
        <p className="mt-1 font-display text-lg font-bold">Asha Kumari</p>
        <p className="text-xs text-muted-foreground">SBI Nirbhay · Verified safe banker</p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Final Trust Score</p>
            <p className="font-display text-2xl font-bold text-teal-deep">{trust}/100</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-muted-foreground">Issued</p>
            <p className="text-xs font-semibold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      <button onClick={onHome} className="mt-5 rounded-full gold-gradient px-5 py-2 text-sm font-bold text-ink">
        Back to home
      </button>
    </div>
  );
}

/* ---------------------- Right Panel ---------------------- */

function PanelHeader({ trust, tier, screen, lang, txnCount }: { trust: number; tier: Tier; screen: ScreenId; lang: Lang; txnCount: number }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Judge / Developer Panel</p>
        <h2 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">Agent state · live</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Trust score, fraud risk engine, and language switch update in real time as you tap the phone on the left.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Pill label="Screen" value={screen} />
        <Pill label="Lang" value={lang.toUpperCase()} />
        <Pill label="Txns" value={`${txnCount}/${GRADUATION_TXNS}`} />
        <Pill label="Tier" value={`T${tier}`} accent />
        <Pill label="Trust" value={String(trust)} accent />
      </div>
    </div>
  );
}

function Pill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border px-2.5 py-1 ${accent ? "border-teal/40 bg-teal/10" : "border-border bg-card"}`}>
      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-display text-sm font-bold leading-none">{value}</p>
    </div>
  );
}

function RiskCard({ risk }: { risk: RiskResult | null }) {
  const level = risk?.level ?? "—";
  const score = risk?.score ?? 0;
  const badgeClass =
    level === "HIGH" ? "bg-danger/15 text-danger" :
    level === "MEDIUM" ? "bg-warn/20 text-ink" :
    level === "LOW" ? "bg-safe/15 text-safe" : "bg-muted text-muted-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fraud Risk Engine</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>{level}</span>
      </div>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight">{score}<span className="text-base text-muted-foreground">/100</span></p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all duration-500 ${
            level === "HIGH" ? "bg-danger" : level === "MEDIUM" ? "bg-warn" : "bg-safe"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{risk?.reason ?? "Submit a transaction on the phone to evaluate."}</p>
      {risk && (
        <ul className="mt-3 space-y-1 text-xs">
          {risk.factors.filter((f) => f.hit).map((f) => (
            <li key={f.label} className="flex items-center justify-between gap-2 rounded-lg bg-muted/60 px-2 py-1">
              <span className="truncate">{f.label}</span>
              <span className={`shrink-0 font-mono ${f.weight > 0 ? "text-danger" : "text-safe"}`}>
                {f.weight > 0 ? `+${f.weight}` : f.weight}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TrustCard({ trust, tier, txnCount }: { trust: number; tier: Tier; txnCount: number }) {
  const next = tier === 1 ? 20 : tier === 2 ? 50 : tier === 3 ? 80 : 100;
  const pct = Math.min(100, (trust / next) * 100);
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trust score</p>
        <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-deep">
          Tier {tier}
        </span>
      </div>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight">
        {trust}<span className="text-base text-muted-foreground"> pts</span>
      </p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full gold-gradient transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {tier < 4 ? `${next - trust} pts to Tier ${tier + 1}` : "Maximum tier reached — full access."}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Coaching: {txnCount}/{GRADUATION_TXNS} safe transactions.
      </p>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px]">
        {[1, 2, 3, 4].map((t) => (
          <div key={t} className={`rounded-lg border p-2 ${tier >= t ? "border-teal/40 bg-teal/10" : "border-border bg-muted/50"}`}>
            <p className="font-display text-sm font-bold">T{t}</p>
            <p className="text-muted-foreground">{t === 1 ? "UPI" : t === 2 ? "FD" : t === 3 ? "MF" : "Loans"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureUnlocks({ trust }: { trust: number }) {
  const items = [
    { at: 0, name: "UPI send & collect", desc: "Coached on every transaction." },
    { at: 20, name: "Fixed Deposits", desc: "Unlock by completing one safe action." },
    { at: 50, name: "Mutual Funds & SIPs", desc: "Unlocks at trust 50." },
    { at: 80, name: "Pre-approved loans", desc: "Unlocks at trust 80." },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Feature unlocks</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((it) => {
          const locked = trust < it.at;
          return (
            <li key={it.name} className={`flex items-start gap-3 rounded-xl border p-3 ${locked ? "border-dashed border-border bg-muted/40 opacity-70" : "border-teal/30 bg-teal/5"}`}>
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${locked ? "bg-muted text-muted-foreground" : "brand-gradient text-white"}`}>
                {locked ? "🔒" : "✓"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{it.name}</p>
                <p className="text-[11px] text-muted-foreground">{it.desc} · {locked ? `needs ${it.at}` : "unlocked"}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ScenarioRunner({
  onRun, disabled,
}: { onRun: (id: "upi-scam" | "upi-collect" | "fd" | "mf") => void; disabled: boolean }) {
  const scenarios = [
    { id: "upi-scam" as const, name: "1 · Lottery scam UPI", tone: "danger", desc: "₹5,000 to win-lottery-777@ybl" },
    { id: "upi-collect" as const, name: "2 · Unknown collect", tone: "warn", desc: "₹1,200 to utility-bharat-merchant" },
    { id: "fd" as const, name: "3 · Open FD", tone: "safe", desc: "₹25,000 · in-bank · safe" },
    { id: "mf" as const, name: "4 · Start SIP", tone: "safe", desc: "Requires trust ≥ 50" },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Scenario runner</p>
      <p className="mt-1 text-xs text-muted-foreground">Fire any scenario into the phone on the left.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            disabled={disabled}
            onClick={() => onRun(s.id)}
            className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-teal hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-border disabled:hover:shadow-none"
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${s.tone === "danger" ? "bg-danger" : s.tone === "warn" ? "bg-warn" : "bg-safe"}`} />
            <span className="min-w-0">
              <p className="truncate text-sm font-semibold">{s.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{s.desc}</p>
            </span>
            <span className="shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-teal-deep">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function LogCard({
  log, logRef,
}: { log: { t: string; line: string; tone: string }[]; logRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-ink text-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Event log</p>
        <span className="text-[10px] text-white/40">{log.length} events</span>
      </div>
      <div ref={logRef} className="max-h-64 overflow-y-auto px-5 py-3 font-mono text-[11px] leading-relaxed">
        {log.length === 0 && <p className="text-white/40">// waiting for first event…</p>}
        {log.map((l, i) => (
          <p key={i} className="flex gap-3">
            <span className="text-white/40">{l.t}</span>
            <span className={
              l.tone === "danger" ? "text-danger" :
              l.tone === "warn" ? "text-warn" :
              l.tone === "safe" ? "text-safe" : "text-white/80"
            }>{l.line}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

/* ---------------------- PDF / Print Report ---------------------- */

function buildReportHtml(args: {
  trust: number;
  tier: Tier;
  lang: Lang;
  scenariosRun: { id: string; label: string; outcome: string; explanation: string; at: string }[];
  trustTimeline: { t: string; value: number; reason: string }[];
  log: { t: string; line: string; tone: string }[];
}) {
  const { trust, tier, lang, scenariosRun, trustTimeline, log } = args;
  const now = new Date().toLocaleString();
  const W = 760;
  const H = 200;
  const maxV = 100;
  const points = trustTimeline.length
    ? trustTimeline
        .map((p, i) => {
          const x = trustTimeline.length === 1 ? 0 : (i / (trustTimeline.length - 1)) * W;
          const y = H - (p.value / maxV) * H;
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ")
    : "";
  const agentExplanations = log.filter((l) => l.line.startsWith("agent:"));
  const esc = (s: string) =>
    s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

  return `<!doctype html><html><head><meta charset="utf-8"/>
<title>SBI Nirbhay — Session Report</title>
<style>
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f1f2e; margin: 0; font-size: 10.5px; line-height: 1.4; }
  .hdr { display:flex; align-items:center; justify-content:space-between; border-bottom: 2px solid #0b6b5a; padding-bottom: 8px; margin-bottom: 10px; }
  .brand { display:flex; align-items:center; gap:10px; }
  .logo { width:34px; height:34px; border-radius:8px; background: linear-gradient(135deg, #0b3d5c, #0b6b5a); color:white; display:grid; place-items:center; font-weight:800; font-size:18px; }
  h1 { font-size: 16px; margin:0; color:#0b3d5c; }
  h2 { font-size: 11px; margin: 10px 0 5px; color:#0b3d5c; text-transform: uppercase; letter-spacing:.06em; border-bottom:1px solid #d8dee5; padding-bottom:3px; }
  .meta { color:#5b6b7a; font-size:9.5px; }
  .grid { display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px; }
  .stat { border:1px solid #d8dee5; border-radius:8px; padding:8px; }
  .stat .v { font-size: 17px; font-weight: 800; color:#0b6b5a; }
  .stat .l { font-size:9px; text-transform:uppercase; letter-spacing:.06em; color:#5b6b7a; }
  table { width:100%; border-collapse:collapse; font-size:9.5px; }
  th, td { text-align:left; padding:4px 6px; border-bottom:1px solid #e6eaee; vertical-align:top; }
  th { background:#f4f7fa; color:#0b3d5c; font-size:9px; text-transform:uppercase; letter-spacing:.05em; }
  .chart { border:1px solid #d8dee5; border-radius:8px; padding:8px; background:#fafcfd; }
  .pill { display:inline-block; padding:2px 7px; border-radius:999px; font-size:9px; font-weight:700; }
  .pill.safe { background:#e6f5ef; color:#0b6b5a; }
  .pill.warn { background:#fff4dc; color:#8a5a00; }
  .pill.danger { background:#fde7e7; color:#a01818; }
  .footer { margin-top: 12px; padding-top:6px; border-top:1px solid #d8dee5; color:#5b6b7a; font-size:9px; display:flex; justify-content:space-between; }
  .btn { position:fixed; top:10px; right:10px; padding:8px 14px; background:#0b6b5a; color:white; border:0; border-radius:6px; font-weight:700; cursor:pointer; }
  @media print { .btn { display:none; } }
</style></head><body>
  <button class="btn" onclick="window.print()">Save as PDF</button>
  <div class="hdr">
    <div class="brand">
      <div class="logo">न</div>
      <div>
        <h1>SBI Nirbhay — Session Report</h1>
        <div class="meta">Agentic Fraud-Fear Removal Companion · GFF 2026</div>
      </div>
    </div>
    <div class="meta" style="text-align:right;">
      <div><b>${esc(now)}</b></div>
      <div>Language: ${esc(lang.toUpperCase())}</div>
    </div>
  </div>

  <div class="grid">
    <div class="stat"><div class="l">Final Trust Score</div><div class="v">${trust} / 100</div></div>
    <div class="stat"><div class="l">Tier Reached</div><div class="v">Tier ${tier}</div></div>
    <div class="stat"><div class="l">Scenarios Run</div><div class="v">${scenariosRun.length}</div></div>
  </div>

  <h2>Scenarios</h2>
  <table>
    <thead><tr><th style="width:50px;">Time</th><th>Scenario</th><th style="width:120px;">Outcome</th><th>Agent Explanation</th></tr></thead>
    <tbody>
      ${
        scenariosRun.length === 0
          ? `<tr><td colspan="4" style="color:#5b6b7a;">No scenarios run in this session.</td></tr>`
          : scenariosRun
              .map(
                (s) => `<tr>
                  <td>${esc(s.at)}</td>
                  <td><b>${esc(s.label)}</b></td>
                  <td><span class="pill ${s.outcome.toLowerCase().includes("block") ? "danger" : s.outcome.toLowerCase().includes("verif") ? "warn" : "safe"}">${esc(s.outcome)}</span></td>
                  <td>${esc(s.explanation)}</td>
                </tr>`,
              )
              .join("")
      }
    </tbody>
  </table>

  <h2>Trust Score Timeline</h2>
  <div class="chart">
    <svg viewBox="0 0 ${W} ${H + 10}" width="100%" height="130" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#0b6b5a" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#0b6b5a" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${[0, 20, 50, 80, 100]
        .map(
          (v) =>
            `<line x1="0" x2="${W}" y1="${H - (v / maxV) * H}" y2="${H - (v / maxV) * H}" stroke="#e0e6ec" stroke-dasharray="3 3"/>
             <text x="4" y="${H - (v / maxV) * H - 2}" font-size="9" fill="#8a98a8">${v}</text>`,
        )
        .join("")}
      ${
        points
          ? `<polygon points="0,${H} ${points} ${W},${H}" fill="url(#g)"/>
             <polyline points="${points}" fill="none" stroke="#0b6b5a" stroke-width="2.5"/>`
          : ""
      }
      ${trustTimeline
        .map((p, i) => {
          const x = trustTimeline.length === 1 ? 0 : (i / (trustTimeline.length - 1)) * W;
          const y = H - (p.value / maxV) * H;
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="#d97706"/>`;
        })
        .join("")}
    </svg>
    <table style="margin-top:4px;">
      <thead><tr><th style="width:50px;">Time</th><th style="width:50px;">Score</th><th>Reason</th></tr></thead>
      <tbody>
        ${trustTimeline
          .map(
            (p) => `<tr><td>${esc(p.t)}</td><td><b>${p.value}</b></td><td>${esc(p.reason)}</td></tr>`,
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <h2>Agent Explanations</h2>
  <table>
    <thead><tr><th style="width:50px;">Time</th><th>Message</th></tr></thead>
    <tbody>
      ${
        agentExplanations.length === 0
          ? `<tr><td colspan="2" style="color:#5b6b7a;">No agent messages yet.</td></tr>`
          : agentExplanations
              .map(
                (l) =>
                  `<tr><td>${esc(l.t)}</td><td>${esc(l.line.replace(/^agent:\s*/, ""))}</td></tr>`,
              )
              .join("")
      }
    </tbody>
  </table>

  <div class="footer">
    <span>Proof of concept · Not affiliated with SBI · Built for demonstration only</span>
    <span>Generated by SBI Nirbhay demo</span>
  </div>
</body></html>`;
}
