import type { BlogPost } from './types'

// Facts checked 2026-11-11 against each platform's own pages listed in `sources`.
// Upwork, Fiverr, Malt and Braintrust block automated readers on their help centers,
// so those pages were read as Internet Archive copies (dates in the source labels).
const post: BlogPost = {
  slug: 'freelance-platform-fees-compared',
  title: 'Freelance platform fees for developers compared (2026)',
  description:
    'What Upwork, Fiverr, Contra, Malt, Toptal, Arc, Freelancer.com, PeoplePerHour, Braintrust and Lemon.io charge developers, plus free channels and a 30-day plan.',
  date: '2026-11-11',
  checked: '2026-11-11',
  readingMinutes: 9,
  html: `
<p>Freelance platforms make money in different ways: a cut of what you earn, a fee to apply, a subscription, or a margin on what the client pays. Some cost you nothing in money but weeks in screening. Here is what ten platforms ask of a freelance web developer, the catch with each, the channels that charge nothing, and a simple 30-day plan.</p>

<h2>The short version</h2>
<p><strong>Checked November 2026</strong> on each platform's own pages. Fees change often, so check the live page before you sign up.</p>
<table>
<thead>
<tr><th>Platform</th><th>Fee to you</th><th>Paid bidding?</th><th>Vetting</th><th>Best for</th></tr>
</thead>
<tbody>
<tr><td>Upwork</td><td>0% to 15% per contract</td><td>Yes: Connects, $0.15 each</td><td>ID and location check</td><td>Developers ready to write many proposals</td></tr>
<tr><td>Fiverr</td><td>20% of each order</td><td>No: clients order your Gig</td><td>None to start; Fiverr Pro is hand-vetted</td><td>Small, clearly scoped fixed-price jobs</td></tr>
<tr><td>Contra</td><td>0%</td><td>No credits; full job access needs Pro ($29/month)</td><td>Open sign-up</td><td>Getting paid by clients you bring yourself</td></tr>
<tr><td>Malt</td><td>5% (10% then 5% on some French, Spanish and Belgian projects)</td><td>None found</td><td>Not described on its fee pages</td><td>Developers with European clients</td></tr>
<tr><td>Toptal</td><td>0%</td><td>No</td><td>5 steps over 3 to 8 weeks, incl. a test project</td><td>Senior developers who can pass a long screen</td></tr>
<tr><td>Arc.dev</td><td>Free</td><td>No</td><td>Communication test and expertise interview</td><td>Longer remote contracts, 20 to 40 hours a week</td></tr>
<tr><td>Freelancer.com</td><td>10% or $5, whichever is more (fixed price); 10% (hourly)</td><td>Yes: 6 free bids a month, then plans from $4.99/month</td><td>Open sign-up</td><td>Developers who want to bid on many projects</td></tr>
<tr><td>PeoplePerHour</td><td>20%, 7.5% or 3.5% per client, by lifetime billing</td><td>Yes: paid annual subscription with 15 proposal credits a month</td><td>Every application reviewed</td><td>Small fixed-price jobs and packaged Offers</td></tr>
<tr><td>Braintrust</td><td>0%</td><td>No; optional paid Application Boost</td><td>AI skills interview and ID check</td><td>Contract and full-time roles</td></tr>
<tr><td>Lemon.io</td><td>None listed</td><td>No</td><td>AI call, quiz, recruiter call, live technical interview</td><td>Startup projects of 20+ hours a week</td></tr>
</tbody>
</table>
<p>Upwork, Fiverr, Malt and Braintrust block automated readers on their help centers, so for those we read the latest Internet Archive copies of their own pages (dates in the sources below).</p>

<h2>Platform by platform</h2>

<h3>Upwork</h3>
<p><strong>Fee to you:</strong> 0% to 15% per contract. Upwork shows the exact percentage when you send a proposal or get an offer, and it is locked for that contract. <strong>Client fee:</strong> Upwork's client pricing page lists a 5% marketplace fee on the Basic plan, plus a one-time contract initiation fee of $0.99 to $14.99.</p>
<p><strong>Bidding:</strong> proposals cost Connects at $0.15 each. The number per job varies and is shown on the job post. Freelancer Plus costs $19.99 a month and includes 100 Connects. Upwork says some freelancers may get 10 free Connects a month, but it isn't guaranteed. <strong>Vetting:</strong> Upwork verifies every freelancer's identity and location.</p>
<p><strong>The catch:</strong> Connects are not returned when the client hires someone else, rejects you, or lets the job expire. If you bring your own client through Direct Contracts, you pay a reduced fee.</p>

<h3>Fiverr</h3>
<p><strong>Fee to you:</strong> 20%. Fiverr's help center says you receive 80% of the order value, so a $1,000 Gig pays you $800. <strong>Client fee:</strong> a 5.5% service fee on top, plus a small-order fee. Fiverr's own help pages disagree on that one: one says $3.00 on orders under $100, another $3.50 on orders under $200.</p>
<p><strong>Bidding:</strong> none. Clients order a Gig package or ask you for a custom offer. <strong>Vetting:</strong> none to start selling. Fiverr Pro is a separate tier of hand-vetted freelancers.</p>
<p><strong>The catch:</strong> both sides pay. On a $1,000 order the client pays $1,055 and you receive $800, so about 24% of what the client pays stays with Fiverr.</p>

<h3>Contra</h3>
<p><strong>Fee to you:</strong> 0%. Contra says it is "always commission-free". <strong>Client fee:</strong> on the free plan your client pays $15 per payment from $1 to $499, or $29 from $500 up. Contra Pro ($29 a month or $199 a year) waives that fee. Card processing (2.9% + 30¢ for domestic cards) comes on top.</p>
<p><strong>Bidding:</strong> no credits, but the free plan lists job opportunities as "limited" and Pro as "unlimited". <strong>Vetting:</strong> open sign-up.</p>
<p><strong>The catch:</strong> the commission is free, but full job access and a fee-free checkout for your clients cost $29 a month.</p>

<h3>Malt</h3>
<p><strong>Fee to you:</strong> 5% excl. VAT. For some projects in France, Spain and Belgium it starts at 10% and drops to 5% after six months on the assignment. Malt shows the exact fee when you create a quote. <strong>Client fee:</strong> Malt says clients may also pay a service fee, depending on their contract with Malt.</p>
<p><strong>Bidding:</strong> no bidding credits on the pages we read. <strong>Vetting:</strong> not described on its fee pages.</p>
<p><strong>The catch:</strong> Malt adds VAT to its own fee. Its French help article gives the example of a micro-entrepreneur who doesn't charge VAT: the 10% becomes 12%, and later 6%.</p>

<h3>Toptal</h3>
<p><strong>Fee to you:</strong> none. Toptal's talent FAQ says members set their own rates and "Toptal does not take a cut from that." <strong>Client side:</strong> the client pays Toptal, and Toptal's FAQ mentions a flat $79 monthly subscription for clients who use its talent matching.</p>
<p><strong>Vetting:</strong> a language and personality interview, a skill review, a live screening, a test project of 1 to 3 weeks, then keeping a strong record with clients. Toptal says this takes 3 to 8 weeks and accepts fewer than 3% of applicants.</p>
<p><strong>The catch:</strong> weeks of unpaid screening before you meet a client, and Toptal says many clients prefer full-time (40 hours a week), though part-time work exists.</p>

<h3>Arc.dev</h3>
<p><strong>Fee to you:</strong> none. Arc's FAQ: "No, Arc is completely free. There is no cost to use the platform nor when you land a job through Arc." <strong>Bidding:</strong> none. Arc recommends vetted people to clients.</p>
<p><strong>Vetting:</strong> a communication test, then a domain expertise interview for freelance work. Arc says the people who do best usually have 5+ years of industry experience.</p>
<p><strong>The catch:</strong> Arc's freelance jobs usually run 20 to 40 hours a week for 4 weeks to a year. That is closer to a contract role than a small project.</p>

<h3>Freelancer.com</h3>
<p><strong>Fee to you:</strong> 10% or $5, whichever is more, on fixed-price projects; 10% on hourly projects; 15% on Recruiter projects. <strong>Client fee:</strong> 3% or $3 on fixed-price projects, and 3% of each hourly payment.</p>
<p><strong>Bidding:</strong> free members start with 6 bids a month and must keep a $20 minimum account balance to bid. Monthly plans run from $4.99 (50 bids) to $99 (1,500 bids). Sponsored, highlighted and sealed bids cost extra. <strong>Vetting:</strong> open sign-up.</p>
<p><strong>The catch:</strong> on fixed-price work, the fee is charged when you accept the award, based on your bid. Withdrawals cost $1 (PayPal, Payoneer and others) up to $25 (international wire).</p>

<h3>PeoplePerHour</h3>
<p><strong>Fee to you:</strong> 20% while your lifetime billing with a client is below £250, 7.5% from £250 to £5,000, and 3.5% above £5,000 (excl. VAT). <strong>Client fee:</strong> the terms list £0.60 + 10% for card and PayPal payments.</p>
<p><strong>Bidding:</strong> the PPH manual (last reviewed 10 October 2026) says new freelancers must choose a subscription plan and be approved before they can sell. PPH Basic includes 15 proposal credits a month, TopAccess 25, and you can buy more. The terms call PPH Basic a non-refundable annual subscription, priced only at sign-up. <strong>Vetting:</strong> moderators review every application, and paying does not guarantee approval.</p>
<p><strong>The catch:</strong> you commit to a year of subscription before you know whether you are approved, and small first jobs carry the 20% rate. Work with existing clients you invite yourself can be free of the service fee under its Zero Service Fee scheme, if you meet its conditions.</p>

<h3>Braintrust</h3>
<p><strong>Fee to you:</strong> none. Braintrust says it never charges talent: no fees and no markups. <strong>Client fee:</strong> its help center says it charges the client a flat 15% success fee. That article dates from 2023, and the current pricing page lists no client percentage.</p>
<p><strong>Bidding:</strong> applying is free. The optional Application Boost puts your application at the top of the client's dashboard: 3 Boost credits cost 39 BTRST, Braintrust's crypto token. <strong>Vetting:</strong> a profile, a short AI skills interview, and ID verification for the Certified badge.</p>
<p><strong>The catch:</strong> the Boost is priced in a token, so its cost in dollars moves with the token price.</p>

<h3>Lemon.io</h3>
<p><strong>Fee to you:</strong> its developer page lists none. Lemon.io handles contracts and invoicing and pays you to your bank, Payoneer or Wise. <strong>Bidding:</strong> none; the page says "No bidding, no negotiating".</p>
<p><strong>Vetting:</strong> your CV and LinkedIn, a 20-minute call with an AI assistant (or a human), a 15-minute quiz, a recruiter call, then a live technical interview with a senior engineer. Lemon.io states an acceptance rate of 1.2%.</p>
<p><strong>The catch:</strong> you need to commit 20+ hours a week, and its homepage offers clients developers "from Europe, LatAm, the US, and Canada". Check that your country qualifies before you start the steps.</p>

<h2>Channels with no platform fee</h2>
<p><strong>Referrals and past clients.</strong> Nobody takes a cut, and they already trust you. Email past clients when a project ends and again a few months later, and ask the happy ones who else could use your help.</p>
<p><strong>LinkedIn.</strong> An account and posts are free. Write about work you shipped: the problem, what you built, what changed for the client. Then message people who react, one by one.</p>
<p><strong>Hacker News.</strong> At the start of each month the whoishiring account posts <a href="https://news.ycombinator.com/item?id=50338728" target="_blank" rel="noopener noreferrer">"Who is hiring?"</a> and <a href="https://news.ycombinator.com/item?id=50338726" target="_blank" rel="noopener noreferrer">"Who wants to be hired?"</a>. Job posts are asked to say REMOTE or ONSITE and to come from the hiring company itself, not recruiters. In the second thread you post your location, remote preference, technologies, CV and email. The <a href="https://news.ycombinator.com/item?id=50338744" target="_blank" rel="noopener noreferrer">"Freelancer? Seeking freelancer?"</a> thread still runs monthly, but since late 2025 regular users have started it, so search for it by name. Lead with SEEKING WORK, your location and whether you work remotely.</p>
<p><strong>Local and language-specific boards.</strong> These reach clients who want someone local or who speaks their language. For example, on <a href="https://www.freelance.nl/voor-freelancers/freelance-pro" target="_blank" rel="noopener noreferrer">Freelance.nl</a> in the Netherlands a free account can reply to a limited number of jobs per week; PRO costs €159 a year.</p>

<h2>Pick 2 channels and run them for 30 days</h2>
<p>Six half-finished profiles rarely beat two good ones. Pick two channels and give them a fair month.</p>
<ol>
<li><strong>Choose one marketplace and one free channel.</strong> For example: Upwork plus past clients, Malt plus LinkedIn, or Arc while you go through screening plus the Hacker News threads.</li>
<li><strong>Week 1: set up properly.</strong> Write the profile for one type of client and job. Add two or three portfolio pieces with live links. Write down your spending limit for the month on Connects, bids or subscriptions.</li>
<li><strong>Weeks 1 to 4: keep a rhythm.</strong> For example, five tailored proposals a week on jobs that really fit, two LinkedIn posts a week, and ten personal messages to past clients and contacts in week one.</li>
<li><strong>Track everything in one sheet:</strong> date, channel, what you sent, reply, call, won, money spent, hours spent.</li>
<li><strong>Day 30: decide.</strong> Keep the channel that produced real conversations for the time and money you put in. Change or drop the other. If neither worked, change your message before you change channels.</li>
</ol>
<p>If writing those proposals, posts and profiles is the part you keep putting off, ClientPilot writes LinkedIn posts, outreach emails, platform profiles and pitches from your profile. There's a free preview, and Pro is $9 a month.</p>
`,
  sources: [
    {
      label: 'Upwork Help: Learn about the Freelancer Service Fee (read via Internet Archive copy, 2 Nov 2026)',
      url: 'https://support.upwork.com/hc/en-us/articles/211062538-Learn-about-the-Freelancer-Service-Fee',
    },
    {
      label: 'Upwork Help: Understanding and using Connects (read via Internet Archive copy, 10 Oct 2026)',
      url: 'https://support.upwork.com/hc/en-us/articles/211062898-Understanding-and-using-Connects',
    },
    {
      label: 'Upwork: pricing for freelancers (read via Internet Archive copy, 21 Oct 2026)',
      url: 'https://www.upwork.com/pricing/freelancer',
    },
    {
      label: 'Upwork: pricing for clients (read via Internet Archive copy, 31 Aug 2026)',
      url: 'https://www.upwork.com/pricing/client',
    },
    {
      label: 'Fiverr Help: Fiverr Pro freelancer, badge and benefits (read via Internet Archive copy, 2 Nov 2026)',
      url: 'https://help.fiverr.com/hc/en-us/articles/29453184449169-Fiverr-Pro-freelancer-Badge-and-benefits',
    },
    {
      label: 'Fiverr Help: How Fiverr works for clients (read via Internet Archive copy, 2 Nov 2026)',
      url: 'https://help.fiverr.com/hc/en-us/articles/360010558038-How-Fiverr-works-for-clients',
    },
    {
      label: 'Fiverr Help: Paying for orders, extras, or custom offers (read via Internet Archive copy, 2 Nov 2026)',
      url: 'https://help.fiverr.com/hc/en-us/articles/360050216133-Paying-for-orders-extras-or-custom-offers',
    },
    { label: 'Contra: pricing', url: 'https://contra.com/pricing' },
    {
      label: "Contra Help: Understanding Contra's fees as a client",
      url: 'https://client-help.contra.com/en/articles/9708235-understanding-contra-s-fees-as-a-client',
    },
    {
      label: 'Malt Help (French): how Malt service fees work for freelancers, updated 6 Aug 2026 (read via Internet Archive copy, 14 Oct 2026)',
      url: 'https://help.malt.com/hc/fr/articles/29539691425938-Comment-fonctionnent-les-frais-de-service-Malt-pour-freelances',
    },
    { label: 'Toptal: the screening process (top 3%)', url: 'https://www.toptal.com/top-3-percent' },
    { label: 'Toptal: talent FAQ', url: 'https://www.toptal.com/freelance-jobs/faq' },
    { label: 'Toptal: FAQ for clients', url: 'https://www.toptal.com/faq' },
    { label: 'Arc.dev: for talent (FAQ)', url: 'https://arc.dev/talent' },
    { label: 'Freelancer.com: fees and charges', url: 'https://www.freelancer.com/feesandcharges' },
    { label: 'Freelancer.com: membership plans', url: 'https://www.freelancer.com/membership' },
    { label: 'PeoplePerHour: terms and conditions', url: 'https://www.peopleperhour.com/static/terms' },
    { label: 'PeoplePerHour: manual (last reviewed 10 Oct 2026)', url: 'https://www.peopleperhour.com/static/manual' },
    { label: 'Braintrust: how it works for talent', url: 'https://usebraintrust.com/how-it-works-for-talent' },
    { label: 'Braintrust: pricing', url: 'https://www.usebraintrust.com/pricing' },
    {
      label: 'Braintrust Help: How does Braintrust make money? (updated 2023, read via Internet Archive copy, 27 Apr 2025)',
      url: 'https://support.usebraintrust.com/hc/en-us/articles/14303198993687-How-does-Braintrust-make-money',
    },
    {
      label: 'Braintrust Help: How does Application Boost work? (updated 2024, read via Internet Archive copy, 7 Feb 2026)',
      url: 'https://support.usebraintrust.com/hc/en-us/articles/23434856311319-How-does-Application-Boost-work',
    },
    { label: 'Lemon.io: for developers', url: 'https://lemon.io/for-developers/' },
    { label: 'Lemon.io: home page', url: 'https://lemon.io/' },
    { label: 'Hacker News: Ask HN: Who is hiring? (November 2026)', url: 'https://news.ycombinator.com/item?id=50338728' },
    { label: 'Hacker News: Ask HN: Who wants to be hired? (November 2026)', url: 'https://news.ycombinator.com/item?id=50338726' },
    {
      label: 'Hacker News: Ask HN: Freelancer? Seeking freelancer? (November 2026)',
      url: 'https://news.ycombinator.com/item?id=50338744',
    },
    { label: 'Freelance.nl: free account vs PRO', url: 'https://www.freelance.nl/voor-freelancers/freelance-pro' },
  ],
}
export default post
