import type { BlogPost } from './types'

// Facts checked 2026-11-11 against each platform's own pages listed in `sources`.
// All five pages were read live on 2026-11-11 (no Internet Archive copies needed); every number and quote was
// re-checked in the raw page text (Toptal in a real browser, since it blocks plain downloads):
// toptal.com/top-3-percent, toptal.com/freelance-jobs/faq, toptal.com/faq, arc.dev/talent, lemon.io/for-developers/.
// No third-party sources were used. Where a platform's page says nothing, the post says so.
const post: BlogPost = {
  slug: 'freelance-developer-vetting-toptal-arc-lemon',
  title: 'How Toptal, Arc.dev and Lemon.io screen freelance developers',
  description:
    'How Toptal, Arc.dev and Lemon.io screen freelance developers, step by step as each platform describes it, with preparation for each step and a checklist.',
  date: '2026-11-14',
  checked: '2026-11-11',
  readingMinutes: 7,
  html: `
<p>Toptal, Arc.dev and Lemon.io all say they only accept vetted developers. For a working freelancer the question is practical: what exactly do they ask you to do, how long does it take, and is it worth the unpaid hours? This post goes through each screen as the platforms describe it on their own pages, and what you can do to prepare.</p>
<p>Where a platform doesn't publish something, such as test content or reapplication rules, this post says so instead of guessing. For what each platform charges, see <a href="/blog/freelance-platform-fees-compared">freelance platform fees compared</a>.</p>

<h2>Toptal</h2>
<p>Toptal's <a href="https://www.toptal.com/top-3-percent" target="_blank" rel="noopener noreferrer">screening page</a> says the full process "takes between 3-8 weeks to complete" and that it may be changed at the company's discretion. It lists five steps and a pass rate for each. Its <a href="https://www.toptal.com/freelance-jobs/faq" target="_blank" rel="noopener noreferrer">talent FAQ</a> says applicants should have 2-3 years or more of experience.</p>
<ol>
<li><strong>Language and personality.</strong> An English language and communication interview, plus an assessment of personality traits. Toptal says 26.4% of applicants pass this step. It doesn't state how long the interview is.</li>
<li><strong>In-depth skill review.</strong> Toptal says it tests technical knowledge and problem-solving "through various assessments". It says 7.4% pass, and that it "typically only" advances candidates with exceptional results. The page doesn't say what the assessments contain or how long they take.</li>
<li><strong>Live screening.</strong> An interview with a screener who is an expert in your field, using "specific live exercises" that look at problem-solving, depth of experience, communication and creativity. Toptal says 3.6% pass.</li>
<li><strong>Test project.</strong> Toptal says test projects "take 1-3 weeks" and give real-world scenarios to show "competence, thoroughness, professionalism, and integrity". It says 3.2% pass.</li>
<li><strong>Continued excellence.</strong> Members are expected to keep a track record of excellence with clients. Toptal says 3% of applicants pass overall, and its <a href="https://www.toptal.com/faq" target="_blank" rel="noopener noreferrer">client FAQ</a> says it accepts "fewer than 3%".</li>
</ol>

<h3>How to prepare for Toptal</h3>
<ul>
<li><strong>Step 1:</strong> practice explaining your work aloud in English, in plain sentences, for example a project you led and why you made the main technical choices. Record yourself once. It's uncomfortable and it works.</li>
<li><strong>Step 2:</strong> the content isn't published, so don't cram for specific questions. Refresh the fundamentals of your main stack and keep a clear idea of what you'd call yourself an expert in. Toptal says every member is an expert in their domain.</li>
<li><strong>Step 3:</strong> expect to think out loud in front of a stranger. Practice solving a problem while explaining your reasoning, with a friend or a screen recording. Pick one specialty and be ready to go deep on it rather than wide.</li>
<li><strong>Step 4:</strong> block time before you start. A test project of 1-3 weeks on top of client work means evenings or paid time off. Plan the hours first, then agree to the step.</li>
</ul>

<h2>Arc.dev</h2>
<p>Arc's <a href="https://arc.dev/talent" target="_blank" rel="noopener noreferrer">page for talent</a> describes vetting in two stages for freelance roles. It says the goal is "to verify your English communication skills and domain expertise skills".</p>
<ol>
<li><strong>Communication test.</strong> Arc says you "introduce yourself and answer questions about your background and experience."</li>
<li><strong>Domain expertise interview.</strong> You're invited "to showcase skills specific to your specialty." Arc says that once you pass both stages you'll be recommended directly to clients hiring for freelance jobs (and full-time roles).</li>
</ol>
<p>Arc says experts with "5+ years of industry experience and excellent English communication do best" in its vetting. It doesn't present that as a formal minimum. The page doesn't state how long either stage takes, an acceptance rate, or any reapplication rule.</p>

<h3>How to prepare for Arc</h3>
<ul>
<li><strong>Communication test:</strong> write a 60-second version of your background: what you build, for whom, with which tools, and one result. Practice it until it sounds like speech, not a CV.</li>
<li><strong>Domain interview:</strong> choose the specialty you want to be hired for (for example Vue and TypeScript front ends) and review the decisions you made on real projects, including a mistake and what you'd do differently. Since Arc doesn't say what the interview covers, prepare by topic, not by question list.</li>
<li>Have your profile and links ready first. Arc's flow starts with a profile of your basic details and past work.</li>
</ul>

<h2>Lemon.io</h2>
<p>Lemon.io's <a href="https://lemon.io/for-developers/" target="_blank" rel="noopener noreferrer">developer page</a> lists five steps.</p>
<ol>
<li><strong>Share your info.</strong> Upload your CV and LinkedIn link, then choose a role such as "full-stack, Python/React" to select your technical assessments.</li>
<li><strong>Schedule a call.</strong> "In 20 minutes or less" an AI assistant called Mark confirms your experience, availability, time zone, rates and the kind of projects you want. It's audio only. Lemon.io says you can complete the same vetting with a human interviewer instead, and that "either path opens the same projects".</li>
<li><strong>Pass a 15-minute quiz.</strong> A role-specific task.</li>
<li><strong>Meet a recruiter.</strong> A 20-minute conversation about your work style and communication.</li>
<li><strong>Technical interview.</strong> You tackle a complex problem live with a senior engineer, talk through your approach, discuss tradeoffs, and "find out if you made the cut a few days later."</li>
</ol>
<p>Lemon.io shows an acceptance rate of 1.2% and a time to first offer of about 13 days. The page doesn't say what the 1.2% measures, who is counted, or what the 13 days is measured from. It doesn't give reapplication rules.</p>

<h3>How to prepare for Lemon.io</h3>
<ul>
<li><strong>The call:</strong> know your availability, time zone and rate before it starts, because those are the topics. Pick a quiet spot, since it's audio only.</li>
<li><strong>The quiz:</strong> it's short and tied to the role you chose, so choose a role you could do tomorrow, not an aspirational one.</li>
<li><strong>The recruiter call:</strong> prepare two or three short stories about how you handle unclear requirements, deadlines and disagreement with a client.</li>
<li><strong>The technical interview:</strong> practice solving an open-ended problem aloud, and say why you chose one trade-off over another. That's what the page says they look for.</li>
</ul>

<h2>The three side by side</h2>
<table>
<thead>
<tr><th></th><th>Toptal</th><th>Arc.dev</th><th>Lemon.io</th></tr>
</thead>
<tbody>
<tr><td>Steps</td><td>5: language and personality, skill review, live screening, test project, continued excellence</td><td>2 for freelance: communication test, domain expertise interview</td><td>5: info, AI or human call, 15-minute quiz, recruiter call, technical interview</td></tr>
<tr><td>Stated time</td><td>3-8 weeks in total; test project 1-3 weeks</td><td>Not stated</td><td>Call 20 minutes or less, quiz 15 minutes, recruiter call 20 minutes; about 13 days to first offer</td></tr>
<tr><td>Stated acceptance</td><td>3% of applicants pass; fewer than 3% accepted</td><td>Not stated</td><td>1.2% (what it measures isn't stated)</td></tr>
<tr><td>Work type</td><td>You set 0 to 50 hours a week; some clients prefer full-time (40 hours), part-time is 20 hours</td><td>Usually 20-40 hours a week, 4 weeks to 1 year</td><td>Looks for developers who can commit 20 hours or more a week</td></tr>
</tbody>
</table>
<p>The Toptal and Lemon.io hours come from the same pages as above. Toptal's talent FAQ also says there is no minimum number of hours to apply.</p>

<h2>What to have ready before you apply</h2>
<ul>
<li><strong>Profile text:</strong> a short summary of what you build, for whom, and with which stack. Keep one version you can paste into any form.</li>
<li><strong>Two or three case studies:</strong> each with the problem, what you did, and a result you can stand behind. <a href="/blog/freelance-developer-case-study">Freelance developer case study: a structure that wins clients</a> covers how to write them.</li>
<li><strong>GitHub and portfolio links:</strong> check they open, show your best work first, and that the code you're proud of is actually public or ready to show.</li>
<li><strong>Availability:</strong> how many hours a week you can really give, and from what date. Lemon.io's call covers it, and Toptal and Arc both describe hours in their own ways.</li>
<li><strong>Rate:</strong> your hourly rate and the lowest one you'd accept. Lemon.io's call asks for rates. Arc says pay is based on your preferred hourly rate.</li>
<li><strong>A clear English introduction:</strong> all three platforms test communication in some form.</li>
</ul>

<h2>If you don't pass</h2>
<p>Only Toptal states a rule. Its talent FAQ says applicants are encouraged to re-attempt the screening if they didn't pass, and "Typically, we require a waiting period between attempts." It doesn't give the length. Arc's and Lemon.io's pages say nothing about reapplying, so ask their support before you assume anything.</p>

<h2>Is it worth it?</h2>
<p>It depends on how you get work now. Vetted networks bring clients to you, and none of the three describes bidding against other developers. Toptal's page lists 3-8 weeks and a test project of 1-3 weeks. Lemon.io's steps are shorter on paper, and Lemon.io says time to first offer is about 13 days. Arc doesn't publish times at all.</p>
<p>The cost is your time, with no pay while you're being screened, and the acceptance numbers the platforms publish are low. A reasonable way to decide:</p>
<ul>
<li><strong>Apply if</strong> you can do the steps in evenings without turning down paid work, and you'd happily take work of the kind they describe: 20 hours a week or more, over weeks or months. That fits Arc's stated contract range and Lemon.io's 20-hour mention.</li>
<li><strong>Skip or delay if</strong> you work on small one-off projects, or can't commit regular weekly hours. Direct outreach, referrals and past clients cost no screening time.</li>
<li><strong>Do both.</strong> Preparing for the screens, a clear profile, two case studies and a spoken introduction, helps with direct outreach too.</li>
</ul>
<p>None of the platforms promises you work after you pass. Treat acceptance as a way to get in front of clients, not a guaranteed income.</p>
<p>If writing profiles is the part you keep putting off, ClientPilot drafts platform profiles for Toptal, Arc.dev and more from your portfolio. You edit and send them yourself. There's a free preview, and Pro is $9 a month.</p>
<p>Pick one platform, prepare properly, and treat the screening like the interview it is.</p>
`,
  sources: [
    { label: 'Toptal: the screening process (top 3%), read live 2026-11-11', url: 'https://www.toptal.com/top-3-percent' },
    { label: 'Toptal: talent FAQ, read live 2026-11-11', url: 'https://www.toptal.com/freelance-jobs/faq' },
    { label: 'Toptal: FAQ for clients, read live 2026-11-11', url: 'https://www.toptal.com/faq' },
    { label: 'Arc.dev: for talent (FAQ), read live 2026-11-11', url: 'https://arc.dev/talent' },
    { label: 'Lemon.io: for developers, read live 2026-11-11', url: 'https://lemon.io/for-developers/' },
  ],
}

export default post
