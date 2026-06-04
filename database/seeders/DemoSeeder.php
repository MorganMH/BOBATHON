<?php

namespace Database\Seeders;

use App\Models\Commitment;
use App\Models\Communication;
use App\Models\Meeting;
use App\Models\Project;
use App\Models\Reminder;
use App\Models\Stakeholder;
use App\Models\Topic;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // -------------------------------------------------------------------
        // Projects — the delivery context Kathy coordinates across.
        // -------------------------------------------------------------------
        $projects = collect([
            'app' => [
                'name' => 'Atlas — Business-Critical App Launch',
                'code' => 'APP-LAUNCH',
                'description' => 'Customer-facing mobile app. Board-visible launch, hard deadline of 15 July.',
                'status' => 'at-risk', 'health' => 'yellow', 'progress' => 65,
                'start_date' => '2026-04-01', 'end_date' => '2026-07-15',
            ],
            'portal' => [
                'name' => 'Customer Portal Redesign',
                'code' => 'PORTAL',
                'description' => 'Accessibility-first redesign of the self-service portal on IBM Carbon.',
                'status' => 'on-track', 'health' => 'green', 'progress' => 80,
                'start_date' => '2026-03-01', 'end_date' => '2026-08-30',
            ],
            'pay' => [
                'name' => 'Payments API Integration',
                'code' => 'PAY-API',
                'description' => 'Integrate Acme Pay gateway. Blocked on vendor webhook spec and security sign-off.',
                'status' => 'delayed', 'health' => 'red', 'progress' => 40,
                'start_date' => '2026-02-15', 'end_date' => '2026-09-12',
            ],
        ])->map(fn ($attrs) => Project::create($attrs));

        // -------------------------------------------------------------------
        // Stakeholders — Kathy's colleagues, vendors and sponsors.
        // -------------------------------------------------------------------
        $people = collect([
            'tom' => [
                'name' => 'Tom Wilson', 'role' => 'Senior Backend Developer', 'team' => 'Platform',
                'email' => 'tom.wilson@northwind.example', 'location' => 'Manchester, UK', 'timezone' => 'Europe/London',
                'skills' => ['PHP', 'Laravel', 'OAuth 2.0', 'REST APIs', 'Payments'],
                'expertise' => 'Owns authentication + payments back end. Best person for anything OAuth or gateway related.',
                'personal_notes' => 'Two young kids — avoids meetings before 09:30. Reliable once engaged but goes quiet when overloaded.',
                'comms_preference' => 'Teams DM, keep it short',
                'influence' => 'medium', 'interest' => 'high', 'availability' => 'busy',
                'workload' => 85, 'reliability' => 72, 'avatar_color' => '#0f62fe',
            ],
            'sarah' => [
                'name' => 'Sarah Chen', 'role' => 'Lead Developer', 'team' => 'Platform',
                'email' => 'sarah.chen@northwind.example', 'location' => 'London, UK', 'timezone' => 'Europe/London',
                'skills' => ['React', 'TypeScript', 'System Architecture', 'Node.js', 'Mentoring'],
                'expertise' => 'Technical lead across Atlas. Go-to for architecture decisions and unblocking the dev team.',
                'personal_notes' => 'Calm under pressure, great escalation partner. Prefers a heads-up before being volunteered.',
                'comms_preference' => 'Teams call for anything complex',
                'influence' => 'high', 'interest' => 'high', 'availability' => 'available',
                'workload' => 70, 'reliability' => 91, 'avatar_color' => '#8a3ffc',
            ],
            'priya' => [
                'name' => 'Priya Patel', 'role' => 'Security Engineer', 'team' => 'Security',
                'email' => 'priya.patel@northwind.example', 'location' => 'Leeds, UK', 'timezone' => 'Europe/London',
                'skills' => ['Application Security', 'OAuth 2.0', 'Threat Modelling', 'Penetration Testing', 'PCI DSS'],
                'expertise' => 'Holds the security go-live sign-off. Nothing ships to production without her review.',
                'personal_notes' => 'Calendar books up a week ahead — give her lead time. Very thorough; values context up front.',
                'comms_preference' => 'Email, formal, with a clear ask',
                'influence' => 'high', 'interest' => 'medium', 'availability' => 'busy',
                'workload' => 80, 'reliability' => 84, 'avatar_color' => '#007d79',
            ],
            'marcus' => [
                'name' => 'Marcus Lee', 'role' => 'UX Designer', 'team' => 'Design',
                'email' => 'marcus.lee@northwind.example', 'location' => 'Bristol, UK', 'timezone' => 'Europe/London',
                'skills' => ['Figma', 'Design Systems', 'Accessibility', 'IBM Carbon', 'Prototyping'],
                'expertise' => 'Owns the Carbon design system adoption and accessibility across both web products.',
                'personal_notes' => 'Detail-oriented, will flag a11y issues early. Happy to pair on tricky flows.',
                'comms_preference' => 'Slack, async with screenshots',
                'influence' => 'medium', 'interest' => 'high', 'availability' => 'available',
                'workload' => 55, 'reliability' => 78, 'avatar_color' => '#ee5396',
            ],
            'elena' => [
                'name' => 'Elena Rossi', 'role' => 'QA Lead', 'team' => 'Quality',
                'email' => 'elena.rossi@northwind.example', 'location' => 'Edinburgh, UK', 'timezone' => 'Europe/London',
                'skills' => ['Test Automation', 'Cypress', 'Regression', 'Release Testing'],
                'expertise' => 'Runs the regression + release gates. Knows exactly what state every build is in.',
                'personal_notes' => 'Brilliant at spotting risk. Will tell you the truth about whether a date is real.',
                'comms_preference' => 'Teams DM',
                'influence' => 'medium', 'interest' => 'high', 'availability' => 'available',
                'workload' => 65, 'reliability' => 88, 'avatar_color' => '#fa4d56',
            ],
            'david' => [
                'name' => 'David Okafor', 'role' => 'DevOps Engineer', 'team' => 'Platform',
                'email' => 'david.okafor@northwind.example', 'location' => 'Remote, UK', 'timezone' => 'Europe/London',
                'skills' => ['Kubernetes', 'CI/CD', 'AWS', 'Terraform', 'Observability'],
                'expertise' => 'Owns infrastructure, pipelines and the go-live runbook. Find him for anything deploy or environment.',
                'personal_notes' => 'Fully remote, very responsive on Slack. Prefers tickets over verbal asks so nothing is lost.',
                'comms_preference' => 'Slack, with a ticket link',
                'influence' => 'medium', 'interest' => 'medium', 'availability' => 'available',
                'workload' => 60, 'reliability' => 81, 'avatar_color' => '#ff832b',
            ],
            'hannah' => [
                'name' => 'Hannah Schmidt', 'role' => 'Product Owner', 'team' => 'Product',
                'email' => 'hannah.schmidt@northwind.example', 'location' => 'London, UK', 'timezone' => 'Europe/London',
                'skills' => ['Roadmap', 'Prioritisation', 'Stakeholder Management', 'User Research'],
                'expertise' => 'Owns scope and priorities for Atlas. Your partner for any trade-off or descope decision.',
                'personal_notes' => 'Decisive once she has data. Loops in the sponsor quickly when something is at risk.',
                'comms_preference' => 'Short Teams call beats a long thread',
                'influence' => 'high', 'interest' => 'high', 'availability' => 'busy',
                'workload' => 75, 'reliability' => 86, 'avatar_color' => '#4589ff',
            ],
            'raj' => [
                'name' => 'Raj Gupta', 'role' => 'Database Engineer', 'team' => 'Platform',
                'email' => 'raj.gupta@northwind.example', 'location' => 'Birmingham, UK', 'timezone' => 'Europe/London',
                'skills' => ['PostgreSQL', 'Query Performance', 'Data Migrations', 'Backups'],
                'expertise' => 'The person for database performance and the risky production data migration.',
                'personal_notes' => 'Heads-down type — async works best. Flag migrations early, he hates surprises.',
                'comms_preference' => 'Email',
                'influence' => 'low', 'interest' => 'medium', 'availability' => 'available',
                'workload' => 58, 'reliability' => 75, 'avatar_color' => '#6fdc8c',
            ],
            'olivia' => [
                'name' => 'Olivia Brown', 'role' => 'Frontend Developer', 'team' => 'Platform',
                'email' => 'olivia.brown@northwind.example', 'location' => 'Cardiff, UK', 'timezone' => 'Europe/London',
                'skills' => ['React', 'IBM Carbon', 'CSS', 'Accessibility', 'Storybook'],
                'expertise' => 'Builds the Carbon front end for the portal. Pairs well with Marcus on design hand-off.',
                'personal_notes' => 'New-ish to the team, keen and quick. Benefits from clear acceptance criteria.',
                'comms_preference' => 'Slack',
                'influence' => 'low', 'interest' => 'high', 'availability' => 'available',
                'workload' => 62, 'reliability' => 83, 'avatar_color' => '#d12771',
            ],
            'james' => [
                'name' => 'James Carter', 'role' => 'Integration Partner', 'team' => 'Acme Pay (Vendor)',
                'email' => 'james.carter@acmepay.example', 'location' => 'Dublin, IE', 'timezone' => 'Europe/Dublin',
                'skills' => ['Payments', 'PCI DSS', 'Webhooks', 'API Integration'],
                'expertise' => 'External contact at Acme Pay. Holds the webhook spec the payments work is blocked on.',
                'personal_notes' => 'External vendor — slow to respond. Chase by email and cc the account manager to get traction.',
                'comms_preference' => 'Email only (cc account manager to escalate)',
                'influence' => 'medium', 'interest' => 'low', 'availability' => 'busy',
                'workload' => 70, 'reliability' => 58, 'avatar_color' => '#570408',
            ],
            'fiona' => [
                'name' => 'Fiona Walsh', 'role' => 'Engineering Manager / Sponsor', 'team' => 'Leadership',
                'email' => 'fiona.walsh@northwind.example', 'location' => 'London, UK', 'timezone' => 'Europe/London',
                'skills' => ['Delivery', 'Escalation', 'Budget', 'Vendor Management'],
                'expertise' => 'Executive sponsor for Atlas. Your route to escalate vendor or resourcing blockers.',
                'personal_notes' => 'Wants headlines, not detail. Bring her a clear ask and a recommendation.',
                'comms_preference' => 'One-line email or a 5-min catch-up',
                'influence' => 'high', 'interest' => 'medium', 'availability' => 'busy',
                'workload' => 78, 'reliability' => 92, 'avatar_color' => '#393939',
            ],
            'noah' => [
                'name' => 'Noah Kim', 'role' => 'Business Analyst', 'team' => 'Product',
                'email' => 'noah.kim@northwind.example', 'location' => 'Glasgow, UK', 'timezone' => 'Europe/London',
                'skills' => ['Requirements', 'BPMN', 'SQL', 'Acceptance Criteria'],
                'expertise' => 'Translates business needs into clear requirements. Good for unpicking ambiguous scope.',
                'personal_notes' => 'Thorough documenter. If something is unclear, he has probably already written it down.',
                'comms_preference' => 'Teams',
                'influence' => 'low', 'interest' => 'medium', 'availability' => 'available',
                'workload' => 50, 'reliability' => 80, 'avatar_color' => '#009d9a',
            ],
            'aisha' => [
                'name' => 'Aisha Khan', 'role' => 'Scrum Master', 'team' => 'Delivery',
                'email' => 'aisha.khan@northwind.example', 'location' => 'Manchester, UK', 'timezone' => 'Europe/London',
                'skills' => ['Agile Facilitation', 'Risk Management', 'Ceremonies', 'Coaching'],
                'expertise' => 'Keeps the team cadence healthy. Partner for surfacing blockers in stand-up and retro.',
                'personal_notes' => 'Protective of the team’s focus. Great at making impediments visible.',
                'comms_preference' => 'Teams DM',
                'influence' => 'medium', 'interest' => 'high', 'availability' => 'available',
                'workload' => 64, 'reliability' => 89, 'avatar_color' => '#a56eff',
            ],
        ])->map(fn ($attrs) => Stakeholder::create($attrs));

        // -------------------------------------------------------------------
        // Project membership (with role on the project).
        // -------------------------------------------------------------------
        $projects['app']->stakeholders()->attach([
            $people['sarah']->id => ['role_on_project' => 'Tech Lead'],
            $people['tom']->id => ['role_on_project' => 'Backend Lead'],
            $people['priya']->id => ['role_on_project' => 'Security Reviewer'],
            $people['marcus']->id => ['role_on_project' => 'UX Designer'],
            $people['elena']->id => ['role_on_project' => 'QA Lead'],
            $people['david']->id => ['role_on_project' => 'DevOps'],
            $people['hannah']->id => ['role_on_project' => 'Product Owner'],
            $people['fiona']->id => ['role_on_project' => 'Sponsor'],
            $people['aisha']->id => ['role_on_project' => 'Scrum Master'],
        ]);
        $projects['portal']->stakeholders()->attach([
            $people['olivia']->id => ['role_on_project' => 'Frontend Dev'],
            $people['marcus']->id => ['role_on_project' => 'UX Designer'],
            $people['elena']->id => ['role_on_project' => 'QA'],
            $people['noah']->id => ['role_on_project' => 'Business Analyst'],
            $people['hannah']->id => ['role_on_project' => 'Product Owner'],
        ]);
        $projects['pay']->stakeholders()->attach([
            $people['tom']->id => ['role_on_project' => 'Backend Lead'],
            $people['james']->id => ['role_on_project' => 'Vendor Contact'],
            $people['priya']->id => ['role_on_project' => 'Security Reviewer'],
            $people['raj']->id => ['role_on_project' => 'Database'],
            $people['fiona']->id => ['role_on_project' => 'Sponsor'],
        ]);

        // -------------------------------------------------------------------
        // Commitments — promises to chase (theirs) and Kathy's own (mine).
        // -------------------------------------------------------------------
        $commitments = [
            ['tom', 'app', 'Finish OAuth 2.0 authentication module', 'Wire up token refresh + revoke and hand to QA.', 3, 'in_progress', 'high', 'theirs', 'meeting', 'Sprint Planning — 3 Jun', true],
            ['tom', 'pay', 'Complete API documentation for auth endpoints', 'Needed before Priya can start the security review.', 2, 'pending', 'high', 'theirs', 'email', 'Re: API Integration Update', true],
            ['priya', 'app', 'Security review of OAuth implementation', 'Final go-live security sign-off. Needs a 2-hour slot.', 6, 'pending', 'high', 'theirs', 'email', 'Re: Security review scheduling', true],
            ['james', 'pay', 'Send finalised webhook spec', 'Blocking all payment callback work. Already 4 days late.', -4, 'overdue', 'high', 'theirs', 'email', 'Acme Pay — webhook spec', false],
            ['marcus', 'app', 'Deliver final onboarding screens', 'High-fidelity Figma for the new user onboarding flow.', 1, 'in_progress', 'medium', 'theirs', 'chat', 'Design sync thread', false],
            ['elena', 'app', 'Run full regression on release candidate', 'RC2 regression pass before the go/no-go.', 5, 'pending', 'high', 'theirs', 'meeting', 'Go/No-Go prep', false],
            ['david', 'app', 'Finalise go-live runbook + rollback plan', 'Step-by-step deploy and rollback for launch night.', 7, 'pending', 'medium', 'theirs', 'manual', null, false],
            ['raj', 'pay', 'Dry-run the production data migration', 'Rehearse the migration against a prod-sized dataset.', -1, 'overdue', 'high', 'theirs', 'meeting', 'Risk review', false],
            ['olivia', 'portal', 'Build account settings page in Carbon', 'Implement against Marcus’s latest designs.', 4, 'in_progress', 'medium', 'theirs', 'chat', 'Portal stand-up', false],
            ['hannah', 'app', 'Confirm launch scope cut-line', 'Decide what is in/out for 15 July with the sponsor.', 2, 'pending', 'high', 'theirs', 'meeting', 'Scope review', false],
            ['noah', 'portal', 'Sign off acceptance criteria for settings', 'Finalise AC so Olivia is unblocked.', 0, 'pending', 'medium', 'theirs', 'chat', 'Portal stand-up', false],
            ['sarah', 'app', 'Review Tom’s auth PR', 'Architectural review before it merges to main.', 1, 'in_progress', 'medium', 'theirs', 'chat', 'PR #418', false],
            ['priya', 'pay', 'Threat model the payment callback flow', 'Assess the webhook handling once the spec lands.', 9, 'pending', 'medium', 'theirs', 'manual', null, false],
            ['david', 'portal', 'Provision the new staging environment', 'For portal UAT next sprint.', 6, 'pending', 'low', 'theirs', 'manual', null, false],
            ['tom', 'app', 'Spike on rate-limiting strategy', 'Decide library + approach for API rate limits.', -2, 'blocked', 'medium', 'theirs', 'meeting', 'Tech sync', false],
            ['elena', 'portal', 'Automate portal smoke tests', 'Cypress smoke suite for the portal happy path.', 8, 'pending', 'low', 'theirs', 'manual', null, false],

            // Kathy's own commitments (direction = mine)
            ['fiona', 'app', 'Send sponsor a launch risk summary', 'One-pager on the security + vendor risks before Friday.', 1, 'pending', 'high', 'mine', 'email', 'Re: Launch status', false],
            ['priya', 'app', 'Book the security review slot', 'Get a 2-hour review in Priya’s calendar this week.', 0, 'pending', 'high', 'mine', 'email', 'Re: Security review scheduling', true],
            ['james', 'pay', 'Escalate vendor delay to account manager', 'cc Acme account manager if no spec by tomorrow.', 1, 'pending', 'medium', 'mine', 'manual', null, false],
            ['marcus', 'portal', 'Share updated brand colours', 'Send Marcus the new palette from marketing.', -1, 'overdue', 'low', 'mine', 'chat', 'Design sync thread', false],
            ['hannah', 'app', 'Prep the go/no-go deck', 'Pull stats together for next Tuesday’s decision.', 4, 'pending', 'medium', 'mine', 'manual', null, false],
        ];

        foreach ($commitments as [$person, $proj, $title, $desc, $dueOffset, $status, $priority, $direction, $src, $ref, $ai]) {
            Commitment::create([
                'stakeholder_id' => $people[$person]->id,
                'project_id' => $projects[$proj]->id,
                'title' => $title,
                'description' => $desc,
                'due_date' => Carbon::now()->addDays($dueOffset)->toDateString(),
                'status' => $status,
                'priority' => $priority,
                'direction' => $direction,
                'source_type' => $src,
                'source_ref' => $ref,
                'captured_by_ai' => $ai,
                'last_nudged_at' => in_array($status, ['overdue', 'blocked']) ? Carbon::now()->subDays(3) : null,
            ]);
        }

        // -------------------------------------------------------------------
        // Communications — email / chat / meeting, with AI summaries.
        // -------------------------------------------------------------------
        $comms = [
            ['email', 'pay', 'james', 'Acme Pay — webhook spec slipping', "Hi Kathy,\n\nApologies, the finalised webhook spec is taking longer than expected on our side. I'm pushing internally but realistically it'll be early next week.\n\nJames", -4, 'James (Acme Pay) has slipped the webhook spec to next week, extending the payments block. Suggest escalating via the account manager.', 'negative', true, true, true],
            ['email', 'app', 'tom', 'API Integration Update — Security Review Needed', "Hi Kathy,\n\nAuth module is basically done and ready for testing. Blocker: security need to review the OAuth flow before we touch the payment gateway. I'll finish the API docs by Thursday.\n\nThanks, Tom", -1, 'Tom finished the auth module but needs a security review before payments work. He will deliver API docs by Thursday. Two actions for Kathy: chase the review, track the docs.', 'neutral', true, true, false],
            ['email', 'app', 'priya', 'Re: Security review scheduling', "Hi Kathy,\n\nHappy to review the OAuth implementation. I'll need a clear 2-hour block and the API docs beforehand. My next free slots are late this week — please book early.\n\nPriya", -1, 'Priya can do the security review but needs a 2-hour slot and the API docs first. Slots fill fast — book early this week.', 'positive', true, false, true],
            ['meeting', 'app', 'aisha', 'Sprint Planning — 3 Jun', "Team committed to: auth module (Tom) by ~6 Jun, onboarding screens (Marcus), regression on RC2 (Elena). Risks raised: security review not booked, vendor spec late.", -1, 'Sprint plan locked. Commitments captured for Tom, Marcus and Elena. Two risks flagged: unbooked security review and the late vendor spec.', 'neutral', true, true, false],
            ['chat', 'app', 'sarah', 'PR #418 — auth review', "Sarah: I'll review Tom's auth PR today, looks close. One question on token storage I'll raise inline.", 0, 'Sarah is reviewing Tom’s auth PR today and has a token-storage question.', 'positive', true, false, false],
            ['email', 'app', 'fiona', 'Re: Launch status', "Kathy — board wants confidence on the 15 July date. Can you send me a short risk summary before Friday? Headlines only.\n\nFiona", -2, 'Sponsor (Fiona) wants a headlines-only launch risk summary before Friday for the board.', 'neutral', true, false, false],
            ['meeting', 'pay', 'raj', 'Payments risk review', "Raj walked through the production data migration risk. Needs a full dry-run against prod-sized data; currently overdue. David to help with environment.", -2, 'Migration dry-run for payments is overdue and is the top technical risk. Raj needs a prod-sized environment from David.', 'negative', true, true, false],
            ['chat', 'portal', 'marcus', 'Design sync thread', "Marcus: portal settings designs are ready. Olivia — acceptance criteria still pending from Noah before you start.", 0, 'Portal settings designs are ready; Olivia is blocked until Noah signs off acceptance criteria.', 'neutral', true, false, false],
            ['email', 'portal', 'hannah', 'Portal UAT planning', "Hi Kathy, portal is tracking well at ~80%. Let's line up UAT for next sprint — we'll need the staging env from David.", -3, 'Portal at ~80% and on track. UAT being lined up for next sprint; needs staging environment from David.', 'positive', true, false, false],
            ['chat', 'app', 'elena', 'RC2 status', "Elena: RC2 is stable enough for regression. I can run the full pass once Tom's auth changes land.", -1, 'Elena says RC2 is stable; full regression can run once Tom’s auth changes merge.', 'positive', true, false, false],
            ['email', 'app', 'david', 'Go-live runbook draft', "Kathy — first draft of the launch runbook attached. Still need the rollback steps confirmed with Raj.", -2, 'David shared a draft go-live runbook; rollback steps still need confirming with Raj.', 'neutral', true, false, false],
            ['chat', 'app', 'hannah', 'Scope cut-line', "Hannah: we may need to cut the social-login nice-to-have to protect 15 July. Let's confirm at scope review.", 0, 'Hannah proposes cutting social-login to protect the launch date; to be confirmed at scope review.', 'neutral', true, false, false],
        ];

        foreach ($comms as [$type, $proj, $from, $subject, $body, $offset, $summary, $sentiment, $action, $blocker, $unread]) {
            Communication::create([
                'type' => $type,
                'project_id' => $projects[$proj]->id,
                'stakeholder_id' => $people[$from]->id,
                'subject' => $subject,
                'body' => $body,
                'participants' => $type === 'meeting' ? ['Kathy Bryant', $people[$from]->name, 'Team'] : null,
                'occurred_at' => Carbon::now()->addDays($offset)->setTime(9 + abs($offset) % 8, 15),
                'ai_summary' => $summary,
                'sentiment' => $sentiment,
                'has_action' => $action,
                'has_blocker' => $blocker,
                'is_unread' => $unread,
            ]);
        }

        // -------------------------------------------------------------------
        // Topics — durable memory of what matters, across conversations.
        // -------------------------------------------------------------------
        $topics = [
            ['OAuth security review (go-live gate)', 'The OAuth 2.0 flow must pass Priya’s security review before launch. It is the critical path to the 15 July date and is not yet booked.', 'app', 'priya', 'high', 'mixed', 7, -1, ['Priya Patel', 'Tom Wilson', 'Kathy Bryant']],
            ['Acme Pay vendor delays', 'Acme Pay keep slipping the webhook spec, blocking all payment callback work. Pattern of slow responses — escalate via account manager.', 'pay', 'james', 'high', 'email', 5, -4, ['James Carter', 'Kathy Bryant', 'Fiona Walsh']],
            ['15 July launch milestone', 'Hard, board-visible deadline for Atlas. Confidence depends on security sign-off and Tom’s auth work landing on time.', 'app', 'fiona', 'high', 'mixed', 9, -2, ['Fiona Walsh', 'Hannah Schmidt', 'Sarah Chen']],
            ['Production data migration risk', 'The payments migration needs a prod-sized dry-run; currently overdue and the top technical risk. Raj owns it, David supports the environment.', 'pay', 'raj', 'high', 'meeting', 3, -2, ['Raj Gupta', 'David Okafor']],
            ['Accessibility / WCAG sign-off', 'Portal redesign is accessibility-first on Carbon. Marcus and Olivia tracking WCAG 2.1 AA; on track.', 'portal', 'marcus', 'medium', 'chat', 4, -3, ['Marcus Lee', 'Olivia Brown']],
            ['Launch scope cut-line', 'Possible descope of social-login to protect 15 July. Decision pending at scope review with Hannah and the sponsor.', 'app', 'hannah', 'medium', 'mixed', 4, 0, ['Hannah Schmidt', 'Kathy Bryant']],
            ['Go-live runbook & rollback', 'Launch-night runbook drafted by David; rollback steps still to be confirmed with Raj.', 'app', 'david', 'medium', 'email', 2, -2, ['David Okafor', 'Raj Gupta']],
            ['RC2 regression readiness', 'Release candidate 2 is stable; full regression can run once Tom’s auth changes merge. Elena ready to go.', 'app', 'elena', 'medium', 'chat', 3, -1, ['Elena Rossi', 'Tom Wilson']],
            ['Portal UAT planning', 'Customer portal at ~80%; UAT being lined up for next sprint, needs staging from David.', 'portal', 'hannah', 'low', 'email', 2, -3, ['Hannah Schmidt', 'David Okafor']],
            ['Auth PR #418', 'Tom’s authentication PR is in review with Sarah; one open question on token storage.', 'app', 'sarah', 'low', 'chat', 2, 0, ['Sarah Chen', 'Tom Wilson']],
        ];

        foreach ($topics as [$title, $summary, $proj, $person, $importance, $src, $mentions, $offset, $participants]) {
            Topic::create([
                'title' => $title,
                'summary' => $summary,
                'project_id' => $projects[$proj]->id,
                'stakeholder_id' => $people[$person]->id,
                'participants' => $participants,
                'importance' => $importance,
                'source_type' => $src,
                'mentions' => $mentions,
                'last_mentioned_at' => Carbon::now()->addDays($offset)->setTime(14, 0),
            ]);
        }

        // -------------------------------------------------------------------
        // Reminders — the "who to chase, and when" queue, with draft messages.
        // -------------------------------------------------------------------
        $reminders = [
            ['james', 'pay', 'Webhook spec is 4 days overdue and blocking all payments work.', "Hi James, following up on the finalised webhook spec — it's now blocking our integration work. Can you confirm a firm date today? Happy to jump on a quick call. Thanks, Kathy", 'email', 'high', 0],
            ['priya', 'app', 'Security review still unbooked — it is on the critical path to 15 July.', "Hi Priya, could we lock in a 2-hour slot for the OAuth review this week? Tom will have the API docs to you by Thursday. Let me know what works and I'll send the invite. Thanks, Kathy", 'email', 'high', 0],
            ['tom', 'app', 'API docs due Thursday — gentle nudge so Priya isn’t held up.', "Hey Tom — no rush today, just flagging the API docs for Thursday so Priya can start the review. Shout if anything’s in the way. 🙏", 'teams', 'medium', 1],
            ['raj', 'pay', 'Migration dry-run is overdue and is the top technical risk.', "Hi Raj, can we get the production-sized migration dry-run done this week? David can sort the environment. Want to make sure we’re not carrying this risk into launch.", 'teams', 'high', 0],
            ['marcus', 'app', 'Final onboarding screens due tomorrow.', "Hi Marcus, how are the onboarding screens looking for tomorrow? Anything you need from me or Hannah to land them?", 'slack', 'medium', 1],
            ['noah', 'portal', 'Olivia is blocked until acceptance criteria are signed off.', "Hi Noah — Olivia’s ready to start the settings page but needs the acceptance criteria signed off. Could you finalise today? Thanks!", 'teams', 'medium', 0],
            ['hannah', 'app', 'Scope cut-line decision needed before the go/no-go.', "Hi Hannah, can we confirm the cut-line (incl. social-login) at scope review so the team has certainty? I’ll prep the options.", 'teams', 'medium', 2],
            ['fiona', 'app', 'Sponsor expects the launch risk summary before Friday.', "Hi Fiona, I’ll have the one-page launch risk summary to you by Thursday EOD — headlines on security sign-off and the vendor delay, with my recommendation.", 'email', 'high', 1],
        ];

        foreach ($reminders as [$person, $proj, $reason, $draft, $channel, $priority, $offset]) {
            Reminder::create([
                'stakeholder_id' => $people[$person]->id,
                'project_id' => $projects[$proj]->id,
                'reason' => $reason,
                'draft_message' => $draft,
                'channel' => $channel,
                'priority' => $priority,
                'status' => 'suggested',
                'suggested_for' => Carbon::now()->addDays($offset)->setTime(9, 0),
            ]);
        }

        // -------------------------------------------------------------------
        // Meetings — Kathy's upcoming agenda, each preppable by Atlas.
        // [title, type, project, dayOffset, hour, min, durationMin, objective, agenda, recap, recurring, attendees]
        // -------------------------------------------------------------------
        $meetings = [
            ['Daily Stand-up', 'standup', 'app', 0, 9, 30, 15, 'Unblock the team for the day',
                "Yesterday's progress\nToday's focus\nBlockers & risks",
                "RC2 confirmed stable by Elena; Tom's auth PR is in review with Sarah. Security review still unbooked.",
                true, ['sarah' => 'Facilitator', 'tom' => 'Attendee', 'elena' => 'Attendee', 'david' => 'Attendee', 'aisha' => 'Scrum Master']],

            ['1:1 with Priya — Security review', 'one_to_one', 'app', 0, 14, 0, 30, 'Lock in the OAuth security review slot',
                "OAuth review scope\nFind a 2-hour slot this week\nAPI docs dependency (Tom, Thu)",
                "Priya confirmed she can review but needs the API docs and a clear 2-hour block; her calendar fills a week out.",
                false, ['priya' => 'Attendee']],

            ['Acme Pay vendor sync', 'vendor', 'pay', 1, 11, 0, 30, 'Get a firm date for the webhook spec',
                "Webhook spec status\nFirm delivery date\nEscalation path (cc account manager)",
                "Spec slipped to 'early next week' with no firm date — this is blocking all payment callback work.",
                false, ['james' => 'Vendor', 'tom' => 'Attendee']],

            ['Sponsor catch-up — Fiona', 'board', 'app', 1, 16, 0, 20, 'Brief the sponsor on launch confidence',
                "Security sign-off risk\nVendor (Acme Pay) delay\nMy recommendation",
                "Fiona asked for a headlines-only launch risk summary before Friday; she wants a clear recommendation.",
                false, ['fiona' => 'Sponsor']],

            ['Go / No-Go prep', 'steering', 'app', 2, 10, 0, 60, 'Decide what is in scope for 15 July',
                "Scope cut-line (social-login?)\nSecurity sign-off status\nTest & release readiness",
                "Hannah proposed cutting social-login to protect the date; decision deferred to this session.",
                false, ['hannah' => 'Product Owner', 'sarah' => 'Tech Lead', 'elena' => 'QA Lead', 'priya' => 'Security', 'david' => 'DevOps']],

            ['Sprint Review', 'review', 'app', 3, 15, 0, 45, 'Demo the increment and gather feedback',
                "Demo auth + onboarding\nReview increment\nStakeholder feedback",
                "Last sprint delivered the auth module and onboarding designs; carry-over on rate-limiting spike.",
                true, ['sarah' => 'Presenter', 'tom' => 'Attendee', 'marcus' => 'Attendee', 'elena' => 'Attendee', 'olivia' => 'Attendee', 'hannah' => 'Attendee', 'aisha' => 'Facilitator']],

            ['Portal UAT planning', 'workshop', 'portal', 4, 13, 0, 45, 'Line up UAT for the portal redesign',
                "UAT scope & scripts\nStaging environment (David)\nDates & participants",
                "Portal is ~80% and on track; needs the staging environment from David before UAT can start.",
                false, ['olivia' => 'Attendee', 'marcus' => 'Attendee', 'elena' => 'QA', 'noah' => 'Business Analyst', 'hannah' => 'Product Owner']],
        ];

        foreach ($meetings as [$title, $type, $proj, $d, $h, $min, $dur, $objective, $agenda, $recap, $recurring, $attendees]) {
            $meeting = Meeting::create([
                'title' => $title,
                'type' => $type,
                'project_id' => $projects[$proj]->id,
                'scheduled_at' => Carbon::now()->addDays($d)->setTime($h, $min),
                'duration_min' => $dur,
                'location' => 'Microsoft Teams',
                'objective' => $objective,
                'agenda' => $agenda,
                'recap' => $recap,
                'is_recurring' => $recurring,
            ]);

            $attach = [];
            foreach ($attendees as $key => $role) {
                $attach[$people[$key]->id] = ['role_in_meeting' => $role];
            }
            $meeting->attendees()->attach($attach);
        }
    }
}
