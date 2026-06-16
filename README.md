# SBI Nirbhay — Agentic Fraud-Fear Removal Companion 🛡️

**Live Demo (Version 1):** [https://nirbhay-guardian.vercel.app](https://nirbhay-guardian.vercel.app)

> **Note:** This repository currently contains **Version 1 (Hackathon Prototype)** of the application. The full product roadmap (V1 → V3) outlined below details how the platform will mature with proactive outreach, integrations with SBI's backend, and deeper credit workflows.

---

## 1. Product Overview

- **Product Name:** SBI Nirbhay — Agentic Fraud-Fear Removal Companion
- **Team:** Sai Kishan A, Sanjith K S, K M Pradhyut — PES University, Bengaluru
- **Hackathon:** SBI Hackathon @ GFF 2026
- **Theme:** Agentic AI & Emerging Tech
- **Problem Statement Track:** Digital Adoption
- **One-line pitch:** An agentic AI companion that walks first-time digital banking users through their first five transactions, turning fraud fear into informed confidence, and rewarding safe behaviour with a Trust Score that unlocks deeper banking features.

## 2. Problem Statement

Over 300 million SBI account holders have never used YONO or UPI. This isn't an access problem — smartphone and data penetration in semi-urban/rural India have already crossed critical mass. It's a trust problem. Constant news coverage of UPI scams has made first-time users, especially those above 35 in Tier 2/3 towns, treat digital banking as a minefield rather than a convenience.

Today's onboarding is feature-first: it shows users what they can do, not what to watch out for while doing it. Fraud education is passive — SMS alerts, FAQ pages, static disclaimers — none of it contextual to the exact action a user is about to take. There's no feedback loop that rewards a user for behaving safely, so trust never compounds.

**The result:** SBI's digital adoption KPIs stall not at the access layer, but at the trust layer.

## 3. Goals

### Business goals
- Increase the percentage of dormant/non-digital SBI account holders who become active YONO/UPI users.
- Reduce digital-adoption customer acquisition cost (currently spent on broad awareness campaigns with low conversion).
- Create a new fraud-related data asset (Trust Score) that can later seed cross-sell (insurance, credit).

### User goals
- Feel safe completing a digital banking action for the first time.
- Understand why something is risky, not just be told "don't do this."
- Build confidence progressively rather than being thrown into the full app at once.

### Non-goals (explicitly out of scope for the product, all versions)
- Replacing SBI's core fraud detection/transaction monitoring backend.
- Blocking or holding transactions — Nirbhay is advisory, never a gatekeeper.
- Serving as a customer support or grievance redressal channel.

## 4. Users & Personas

| Persona | Description | Primary need |
|---------|-------------|--------------|
| **Rural/semi-urban first-timer** | 35–65 yrs, has an SBI account, smartphone, never used UPI/YONO | Step-by-step reassurance in native language |
| **Tier-2/3 new YONO installer** | Recently installed YONO, abandoned after first failed/scary attempt | A reason to retry with confidence |
| **Cautious senior citizen** | 55+, has heard scam stories from family/news | Explicit, slow, voice-first guidance |
| **Existing active user** *(out of scope v1, in scope v2)* | Already transacts digitally | Light-touch fraud awareness, not hand-holding |

---

## 5. Versioned Scope & Roadmap

### V1 — Hackathon Prototype (30 days) - *[Current Status: Live]*
Rule-based fraud risk engine, agent overlay for first 5 transactions, Hindi + Kannada support, Trust Score v1 (transaction count + safe-behaviour points), advisory-only, no PII storage.

### V2 — Post-Pilot Production - *[Upcoming]*
Proactive outreach (the agent reaches dormant users, not just reacts), behavioural learning per user over time, integration with SBI's real fraud detection backend (not just static rules), merchant/payee verification API, cross-device session continuity, expansion to 5+ languages with voice-first flows.

### V3 — Platform Maturity - *[Future]*
Trust Score becomes a credit signal feeding pre-approved loan/FD offers, white-labelled SDK licensed to other PSBs, cyber-fraud insurance upsell via SBI General triggered at high Trust Score, offline/edge model for low-connectivity geographies, YONO Business variant for small merchants accepting UPI for the first time.

---

## 6. Core Features (Full Product)

### 6.1 Nirbhay Agent Overlay
Activates automatically on a detected first-time critical action (first login, first UPI send, first FD booking). Non-blocking — dismissible with a single tap, but a soft "are you sure?" nudge appears on dismissal. Tone is conversational, not legal/technical. In V2, the overlay becomes proactive: it can initiate a check-in via WhatsApp/SMS for users who installed YONO but never completed onboarding.

### 6.2 Fraud Risk Engine
V1 is a rule-based classifier scoring each transaction Low/Medium/High using payee type (registered merchant vs unknown UPI ID), amount relative to account history, time-of-day/device anomaly, and known scam templates (fake KYC update, lottery, OTP-sharing requests). V2 replaces/augments this with SBI's actual fraud ML backend and adds merchant verification lookups. V3 adds a behavioural model that adapts thresholds per user based on their accumulated Trust Score and history.

### 6.3 Multilingual, Voice-First Support
V1: Hindi and Kannada, text-based, via Bhashini API/IndicTrans2. V2: adds Tamil, Telugu, Marathi, plus voice input/output for users with low literacy. V3: expands to all 11+ scheduled languages with an offline-capable lightweight model for poor-connectivity regions.

### 6.4 Digital Trust Score
A gamified 0–100 score built from safe completion of guided transactions. Milestones unlock features progressively (e.g., score 20 → FD booking, score 50 → mutual funds, score 80 → pre-approved loan offers). In V3, the score becomes an input (not the sole input) into actual credit and insurance pre-approval workflows, governed by SBI's existing credit policy — Nirbhay only supplies the signal, never makes the lending decision.

### 6.5 Scam Pattern Explainer
Before each guided action, a one-line, plain-language scam alert relevant specifically to that action type (e.g., UPI collect-request fraud before approving a UPI request). Content is template-based and pre-approved by SBI's risk/compliance team — the LLM personalises delivery and language but never generates fraud-advice content from scratch, to avoid hallucination risk.

### 6.6 Graduation & Feature Unlock Flow
After completing five guided transactions safely, the user "graduates" — the overlay steps back, and the user transitions to light-touch awareness nudges rather than full hand-holding, mirroring how a driving instructor reduces involvement as a learner improves.

---

## 7. User Journey (End-to-End)
The user installs or opens YONO for the first time, or a dormant/never-active user is proactively reached (V2). Nirbhay detects the first critical action and activates the overlay. It pulls transaction context (amount, payee type, action type) without touching raw PII, scores it via the Fraud Risk Engine, and explains the relevant risk in the user's chosen language — text in V1, voice option added in V2. The user confirms intent and the transaction proceeds through SBI's normal transaction pipeline, untouched by Nirbhay. The Trust Score updates, the user sees visible progress, and after five safe transactions, Nirbhay reduces its involvement and the user unlocks the next feature tier.

## 8. Technical Architecture (Full System)
- **Agent layer:** LLM-based conversational agent with tool-use, session memory scoped to the onboarding window (first 5 transactions), inputs being transaction metadata + language preference + risk score, output being contextual guidance text and a risk badge.
- **Risk engine:** V1 is a rule-based classifier requiring no PII (transaction type, payee category, amount bucket → Low/Medium/High + reason code). V2/V3 calls into SBI's existing fraud detection systems via an internal API rather than duplicating logic.
- **Frontend:** A React Native overlay SDK embedded into YONO, triggered via YONO's pre-transaction lifecycle event hooks, dismissible with one tap. V2 adds a WhatsApp/SMS channel for proactive outreach, requiring a separate lightweight messaging service.
- **Backend:** FastAPI + PostgreSQL for Trust Score persistence, keyed by a hashed user ID — Nirbhay stores score metadata only, never raw transaction data. V2 introduces an event bus (e.g., Kafka) to handle proactive triggers at scale across millions of dormant accounts.
- **Language layer:** Bhashini API for real-time translation in V1–V2; V3 explores a distilled on-device model for offline/low-connectivity translation.
- **Compliance layer:** DPDP Act 2023-aligned data handling throughout — no PII stored by Nirbhay at any version. RBI Digital Banking Safety guideline alignment is reviewed at each version gate before production rollout.

## 9. Sample API Contract (illustrative, for prototype)

**POST /v1/nirbhay/assess**
```json
// Request
{
  "session_id": "string",
  "action_type": "upi_send | upi_collect | fd_book | login",
  "amount_bucket": "low | medium | high",
  "payee_category": "verified_merchant | unknown_upi_id | known_contact",
  "language": "hi | kn | ta | te | mr | en"
}

// Response
{
  "risk_level": "low | medium | high",
  "reason_code": "string",
  "guidance_text": "string (localized)",
  "trust_score_delta": "integer"
}
```

**GET /v1/nirbhay/trust-score/{hashed_user_id}**
```json
// Response
{
  "current_score": "integer (0-100)",
  "milestones_unlocked": ["fd_booking", "mutual_funds"],
  "transactions_completed": "integer"
}
```

## 10. Data Model (high level)

| Entity | Key fields | Notes |
|--------|------------|-------|
| **User Session** | `hashed_user_id`, `language_pref`, `onboarding_stage` | No name/phone/account number stored |
| **Risk Assessment** | `session_id`, `action_type`, `risk_level`, `reason_code`, `timestamp` | Ephemeral; not linked to raw transaction details |
| **Trust Score** | `hashed_user_id`, `score`, `milestones_unlocked`, `last_updated` | Persisted; basis for feature unlocks |

## 11. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Agent response latency | < 1.5 seconds |
| System availability | 99.9% uptime |
| Language detection/translation accuracy | > 90% for supported languages |
| False positive rate on fraud flags | < 5% on low-risk transactions |
| Data storage footprint | Trust Score metadata only — zero raw transaction data |

## 12. Compliance & Security
All data handling is DPDP Act 2023-aligned: no personally identifiable transaction data is stored by Nirbhay at any version, only hashed identifiers and aggregate score metadata. The product is designed to operate alongside, not inside, SBI's core banking and fraud systems, so it never gains write-access to actual transaction processing. Fraud-pattern content shown to users is sourced from public RBI/MHA reports and pre-approved by SBI's risk and compliance teams before being templated for the agent — the LLM personalises delivery and language but does not author fraud-safety claims itself, which avoids a major hallucination risk that other agentic banking tools have run into.

## 13. Edge Cases & Error Handling
If regional language confidence drops below 80%, the system falls back to Hindi rather than risking a mistranslated fraud warning. If the LLM service is unavailable, the overlay falls back to static, pre-approved template text rather than failing silently. If a user repeatedly dismisses the overlay across multiple sessions, V2's behavioural layer reduces overlay frequency rather than treating every dismissal as ignorable — repeated dismissal is itself a signal worth a lighter-touch but persistent reminder, not silence. If the risk engine flags a legitimate transaction (false positive), the user can proceed after confirmation, and the flagged case is logged for periodic rule-tuning rather than auto-blocking.

## 14. Accessibility
Low-literacy and visually impaired users are supported via voice-first interaction (introduced in V2), since text-only guidance excludes a meaningful share of the target rural/semi-urban segment. Font sizes and contrast in the overlay UI follow WCAG-equivalent guidelines adapted for low-end Android devices common in Tier 2/3 markets, and all critical guidance is available as audio, not just text, by V2.

## 15. Competitive Reference Points
Bank of America's Erica assistant succeeded by integrating deeply with structured, customer-specific data — transaction history, current products, prior complaints, live account status — rather than operating as a generic chatbot layered on top. Nirbhay's architecture follows the same principle: it pulls real transaction context rather than guessing, which is what separates a genuinely useful agent from a cosmetic chat widget. Most India-specific banking hackathon entries (including SEBI/GFF 2025 winners) have focused on multilingual financial education; Nirbhay deliberately targets the adjacent, less-addressed gap of fraud-fear as a UX and trust problem rather than purely an education problem.

## 16. Analytics & Instrumentation
Key events tracked include overlay activation, dismissal vs completion rate per action type, time-to-confirm per guided transaction, Trust Score progression curves, and language-fallback frequency (a proxy for translation quality gaps). These feed both product iteration and the success metrics below.

## 17. A/B Testing Plan (V2 onward)
Once past the hackathon prototype, the rollout tests overlay tone (directive vs conversational), milestone thresholds (is 5 transactions the right graduation point, or should it be 3 or 7), and proactive outreach channel (WhatsApp vs SMS vs in-app only) against completion-rate and drop-off metrics before wider release.

## 18. Rollout Strategy
V1 stays a contained hackathon prototype with mocked data. V2 pilots in 2–3 states with high UPI fraud incidence and low digital adoption simultaneously (to maximize signal), phased by language readiness — Hindi/Kannada first, then expanding. V3 rollout to other PSBs is licensing-led rather than direct deployment, since white-labelling depends on partner banks' own core banking integration timelines.

## 19. Data Retention & Deletion
Trust Score and session metadata are retained only as long as the associated account remains active; on account closure or a DPDP-compliant deletion request, all Nirbhay-held metadata is purged within the regulatory window, since none of it is core banking record data subject to longer statutory retention.

## 20. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Users dismiss the agent immediately | Low-friction first touch: a single "Are you new to UPI?" tap, not a wall of text |
| Translation inaccuracy on safety-critical content | Fallback to Hindi below 80% confidence; all safety content is pre-templated, not LLM-generated from scratch |
| Risk engine too aggressive, hurting UX | V1–V2 are advisory only — they inform, never block |
| LLM hallucination on fraud advice | Fraud content is template-based and compliance-approved; LLM only personalises tone/language |
| Proactive outreach (V2) perceived as spam/scam itself | Outreach always originates from verified SBI channels with clear, consistent branding — ironic but real risk if mishandled |

## 21. Success Metrics by Version

| Metric | V1 Pilot Target | V2/V3 Target |
|--------|-----------------|--------------|
| First-time users completing 5 guided transactions | > 60% (vs ~20% baseline) | > 75% |
| Drop-off at first UPI send | Reduced by 40% | Reduced by 60% |
| Fraud incident rate among Nirbhay users | < 2% (vs ~6% national avg) | < 1.5% |
| Trust Score reaching 50+ | > 45% of onboarded users | > 60% |
| CSAT | > 4.2 / 5 | > 4.5 / 5 |
| Dormant-to-active conversion | N/A | New metric, target TBD post-pilot |
