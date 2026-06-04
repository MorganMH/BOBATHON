# Demo Data Questionnaire — Stakeholder Command Centre

Send this to the demo / stakeholder team. Every answer maps directly to a field in
the SQLite seeder (`database/seeders/DemoSeeder.php`), so the more they fill in, the
richer and more believable the demo. Anonymise real names if needed — plausible is fine.

**What the app is:** a corporate *stakeholder management* command centre. Kathy is the
user; everything is about her colleagues. It helps her (1) chase people on their
**commitments**, (2) **remember key topics** from chat/email/meetings, (3) keep
**personal info** on stakeholders, and (4) **find the right stakeholder via AI**.

---

## 1. Stakeholders (the people Kathy works with)
For each person we can store: name, role, team, email, location, skills, expertise,
personal notes, comms preference, influence, interest, availability, workload %,
reliability %. Please give us **10–15 people**, and for each:

1. **Name & job title?** (e.g. "Tom Wilson — Senior Backend Developer")
2. **Team / department?** (Platform, Security, Design, Product, QA, Leadership, Vendor…)
3. **What are they the go-to person for?** (1 line — powers the AI "who can help with X")
4. **Top 3–6 skills / specialisms?** (short tags, e.g. OAuth, Kubernetes, Figma, PCI)
5. **Personal/relationship notes** that help Kathy work with them — working hours, quirks,
   "OOO Fridays", "goes quiet when overloaded", "external vendor, chase via account manager".
6. **Preferred way to be contacted?** (Teams DM / Email / Slack / call — and tone)
7. **Influence** on delivery (low/med/high) and **Interest** in this work (low/med/high)?
   *(this is the classic stakeholder-matrix — drives prioritisation)*
8. **How reliable are they at delivering on commitments?** (gut feel %, 0–100 — drives "who to chase")
9. **Current availability / workload?** (available / busy / on-leave, and rough % capacity)
10. **Who are the 2–3 most critical / most-chased people?** (so we make them prominent)

## 2. Roles & org structure
1. **Who is the sponsor / escalation route** when something is stuck?
2. **Who owns sign-off / gates?** (e.g. security go-live sign-off, UAT acceptance)
3. **Any external vendors or partners?** Who's the contact, what do they hold up?
4. **A simple RACI for the launch** — who's Responsible / Accountable / Consulted / Informed?

## 3. The project(s)
We currently model **3 projects**. Please confirm or replace:
1. **Real project name(s) & a one-line description** for each.
2. **Status** (on-track / at-risk / delayed) and **% complete**?
3. **Start and end/launch dates?**
4. **The single hardest deadline** and why it matters (board/regulatory/customer)?
5. **Top 3 risks or blockers right now**, and who owns each?
6. **Any cross-project dependency** (e.g. "Payments blocks the App launch")?

## 4. Timeline & milestones
1. **Key upcoming milestones** in the next ~6 weeks (name + date)?
2. **What's overdue right now**, and how late?
3. **What's the go/no-go decision**, and when is it?
4. **Recurring ceremonies** (stand-up, sprint planning, scope review) and cadence?

## 5. Commitments (the promises Kathy chases)
This is the core. For ~15–25 commitments, each needs: who owns it, which project, a title,
due date, status, priority, and where it came from.
1. **Give us 15–25 real "X owes Y by when" items.** (e.g. "Tom — finish OAuth module — by Fri — high")
2. For each: **owner, due date, priority (high/med/low), status** (pending / in progress / blocked / overdue / done)?
3. **Which were captured from a conversation** vs entered manually? (email / chat / meeting)
4. **A few of Kathy's *own* commitments** she owes others (so we show both directions)?
5. **Which commitments are currently blocked, and by what/whom?**

## 6. Meetings
1. **3–5 recent or upcoming meetings** — title, date, attendees?
2. For each: **a 2–4 sentence summary** and **the actions that came out of it** (who/what/when)?
3. **Any decisions or risks** raised in those meetings worth "remembering"?

## 7. Chats (Teams / Slack)
1. **5–8 short chat snippets** that contain a commitment, a blocker, or a decision?
2. Who sent each, on which project, roughly when?
3. Any that show someone **going quiet / needing a nudge**?

## 8. Emails
1. **5–8 representative emails** — sender, subject, 2–4 sentence body?
2. At least one **"bad news / slipping" email** (great for the at-risk demo) and one **"good news" email**?
3. One **inbound email we can "receive live" during the demo** that AI then processes into
   actions + a blocker + a summary (the wow-moment). Sender, subject, body, and the
   ideal extracted result?

## 9. Topics to "remember" (durable memory)
1. **8–12 recurring topics/themes** across the work (e.g. "OAuth security review", "vendor delays")?
2. For each: a **one-paragraph summary**, who's involved, importance (high/med/low)?
3. **What does Kathy keep forgetting / wish the system remembered for her?**

## 10. Chasing & reminders
1. **Who would Kathy realistically chase this week, and why?** (top 6–8)
2. **Preferred channel + tone** for each nudge (formal email vs casual Teams)?
3. **What does a good nudge message look like** here? (so AI drafts match the house style)
4. **Escalation rule of thumb** — when does a chase become an escalation to the sponsor?

## 11. "Find the right stakeholder" — AI search
1. **5–10 realistic questions Kathy would ask**, e.g. "Who knows our payment gateway?",
   "Who can sign off accessibility?", "Who's free to help with the migration?"
2. **The *right* answer to each** (so we can show the AI nailing it)?

## 12. Voice assistant scenarios (Gemini real-time voice)
1. **3–5 things Kathy would say out loud**, e.g. "What should I chase today?",
   "Catch me up on the Atlas launch", "Tell me about Priya before my meeting"?
2. **The tone of voice** the assistant should have (calm chief-of-staff? brisk PA?)?

---

### Minimum we need to make the demo sing
If the team is short on time, prioritise: **§1 (10–15 people)**, **§5 (15–20 commitments)**,
**§8 #3 (the live email)**, **§9 (8–10 topics)**, and **§11 (search Q&A pairs)**.
Everything else we can fill with believable placeholders and refine later.
