import type { BlogPost } from './types'

// Facts checked 2026-11-11 against the pages listed in `sources`.
// Upwork, Fiverr and Malt block automated readers, so those pages were read as
// Internet Archive copies of the official pages (dates in the source labels).
const post: BlogPost = {
  slug: 'freelance-developer-rates',
  title: 'How to set your freelance developer rate (with 2026 data)',
  description:
    'What Arc, Upwork, Malt and US labor data say about developer rates, when to bill hourly, daily or fixed, how to work out your floor rate and how to raise it.',
  date: '2026-11-11',
  checked: '2026-11-11',
  readingMinutes: 8,
  html: `
<p>Your rate decides how many hours you need to sell and how much room you have in a slow month. Below is what Arc, Upwork, Malt and US labor statistics publish about developer pay, when to bill hourly, daily or fixed, how to work out your floor rate, and how to raise it.</p>

<h2>What published data says about developer rates</h2>
<p><em>Checked November 2026. Upwork and Malt block automated readers, so their pages were read as Internet Archive copies of the official pages (dates in the sources below).</em></p>
<table>
<thead>
<tr><th>Source</th><th>What it measures</th><th>Figure</th><th>Date</th></tr>
</thead>
<tbody>
<tr><td>Arc rate explorer</td><td>Hourly rates of 20,000+ vetted freelance developers on Codementor</td><td>Web development: average and median both $61 to $80 an hour</td><td>No data date given</td></tr>
<tr><td>Arc 2026 cost guide</td><td>Survey of 5,302 freelance developers, blended with other market data</td><td>Senior full-stack: $60 to $130 an hour</td><td>26 May 2026</td></tr>
<tr><td>Upwork, hire web developers</td><td>What web developers on Upwork generally cost clients</td><td>$15 to $50 an hour</td><td>No date given (archive copy, 21 Oct 2026)</td></tr>
<tr><td>Malt rate barometer (malt.fr)</td><td>Average day rate of experienced developers active on Malt in the last 3 months</td><td>€576 a day</td><td>Titled 2026 (archive copy, 7 Oct 2026)</td></tr>
<tr><td>US Bureau of Labor Statistics</td><td>Median annual wage of employed US web developers, self-employed excluded</td><td>$92,650 a year</td><td>May 2025</td></tr>
</tbody>
</table>

<h3>Arc: the rate explorer</h3>
<p>Arc's <a href="https://arc.dev/freelance-developer-rates" target="_blank" rel="noopener noreferrer">freelance developer rate explorer</a> says its data "is based on the hourly rates of over 20,000 vetted freelance developers on the Codementor platform", one of Arc's brands. For <a href="https://arc.dev/freelance-developer-rates/web-development" target="_blank" rel="noopener noreferrer">web development</a>, for all regions and experience levels, it shows an average and a median in the same band: $61 to $80 an hour. <a href="https://arc.dev/freelance-developer-rates/front-end" target="_blank" rel="noopener noreferrer">Front-end</a>, <a href="https://arc.dev/freelance-developer-rates/back-end" target="_blank" rel="noopener noreferrer">back-end</a>, <a href="https://arc.dev/freelance-developer-rates/full-stack" target="_blank" rel="noopener noreferrer">full-stack</a>, <a href="https://arc.dev/freelance-developer-rates/javascript" target="_blank" rel="noopener noreferrer">JavaScript</a>, <a href="https://arc.dev/freelance-developer-rates/php" target="_blank" rel="noopener noreferrer">PHP</a>, <a href="https://arc.dev/freelance-developer-rates/wordpress" target="_blank" rel="noopener noreferrer">WordPress</a> and <a href="https://arc.dev/freelance-developer-rates/vue" target="_blank" rel="noopener noreferrer">Vue</a> show the same band. <a href="https://arc.dev/freelance-developer-rates/reactjs" target="_blank" rel="noopener noreferrer">React</a> and <a href="https://arc.dev/freelance-developer-rates/nodejs" target="_blank" rel="noopener noreferrer">Node.js</a> show an average of $81 to $100 but a median of $61 to $80: a smaller group of high rates pulls the average up, so the median is the better reference.</p>
<p><strong>Limits:</strong> no date for when the data was collected, $20-wide bands, and one platform's developers. These are rates developers charge; Arc doesn't say whether Codementor's fees are included.</p>

<h3>Arc: the 2026 cost guide</h3>
<p>Arc's <a href="https://arc.dev/employer-blog/freelance-developers-cost/" target="_blank" rel="noopener noreferrer">2026 cost guide</a>, dated 26 May 2026, says Arc "surveyed 5,302 freelance developers worldwide". It also says the ranges "reflect broad market observations across freelance marketplaces, recruiter benchmarks, startup hiring data, and Arc's historical survey data", so they are not survey results alone.</p>
<ul>
<li><strong>By region,</strong> average hourly rates: United States and Canada $82 to $130, Western Europe $70 to $120, Eastern Europe $40 to $85, Latin America $35 to $75, South Asia $22 to $55.</li>
<li><strong>By experience,</strong> globally: junior (1 to 3 years) $20 to $50, mid-level (3 to 6 years) $40 to $90, senior (7 to 10 years) $75 to $150.</li>
<li><strong>Senior rates by type of work:</strong> front-end $55 to $120, WordPress and CMS $35 to $90, general full-stack $60 to $130.</li>
</ul>
<p><strong>Limits:</strong> wide ranges, no sample size per row, a mixed method, written for hiring companies. Arc calls the numbers "directional market benchmarks".</p>

<h3>Upwork</h3>
<p>Upwork's <a href="https://www.upwork.com/hire/web-developers/" target="_blank" rel="noopener noreferrer">page for hiring web developers</a> says web developers on Upwork generally cost $15 to $50 per hour, "although experienced specialists can charge considerably more". It also lists planning budgets per project, from $500 to $2,000 for a landing page up to $10,000 to $50,000 for a custom web application.</p>
<p><strong>Limits:</strong> no date, sample or method beyond "current data and industry sources available at the time of publication", and it doesn't say whether client fees are included. Upwork's <a href="https://support.upwork.com/hc/en-us/articles/211062538-Learn-about-the-Freelancer-Service-Fee" target="_blank" rel="noopener noreferrer">fee page</a> says it charges the client the rate you enter and takes your service fee from it, so you receive less than the client pays.</p>

<h3>Malt</h3>
<p>Malt's French <a href="https://www.malt.fr/t/barometre-tarifs/tech" target="_blank" rel="noopener noreferrer">rate barometer for developers</a>, titled "Grille des tarifs 2026", gives an average day rate of €576 for experienced developers active on Malt in the last three months. By experience: €317 a day for 0 to 2 years, €436 for 3 to 7 years, €576 for 8 to 15 years and €672 for 15 years or more. Experienced front-end developers average €535 a day, back-end developers €562.</p>
<p><strong>Limits:</strong> the page doesn't say which countries it covers (it's on malt.fr and its city breakdown lists only French cities), how many hours a day means, or whether Malt's fees are included.</p>

<h3>Toptal</h3>
<p>Toptal's <a href="https://www.toptal.com/pricing" target="_blank" rel="noopener noreferrer">pricing page</a> publishes no hourly rates. Its <a href="https://www.toptal.com/freelance-jobs/faq" target="_blank" rel="noopener noreferrer">talent FAQ</a> says members "set their own hourly rate" and that "Toptal does not take a cut from that."</p>

<h3>Government data</h3>
<p>The <a href="https://www.bls.gov/ooh/computer-and-information-technology/web-developers.htm" target="_blank" rel="noopener noreferrer">US Bureau of Labor Statistics</a> gives a median annual wage for web developers of $92,650 in May 2025. That's employees only: BLS says its wage data don't include self-employed workers, who make up 18% of the roughly 87,400 web developer jobs in its 2025 employer table. Use it as a check on what employers pay, not as a freelance rate.</p>

<p>These figures disagree because they measure different things: list rates, blended survey data, a client estimate, a French day rate and employee wages. Use them to see roughly where your market sits, then set your floor from your own numbers.</p>

<h2>Hourly, day rate or fixed price</h2>
<p>The examples below use one made-up developer who wants €4,000 a month before income tax and can bill 60 hours a month. The next section shows how that becomes a floor of €88 an hour once costs are added. These are examples, not recommendations.</p>

<h3>Hourly: bug fixes and unclear work</h3>
<p>Hourly fits when nobody can know the size of the job upfront: a bug in someone else's code, a slow query, small change requests. Surprises don't cost you. <a href="https://www.upwork.com/hire/web-developers/" target="_blank" rel="noopener noreferrer">Upwork's hiring page</a> gives clients the same advice: fixed price for defined work, hourly for evolving requirements.</p>
<p><strong>Example:</strong> a checkout bug takes 3 hours: 3 × €88 = €264. A minimum charge, say 2 hours, keeps tiny jobs worth the switch.</p>

<h3>Day rate: contracts inside a team</h3>
<p>A day rate fits when a client books whole days: you join their team, standups and tools.</p>
<p><strong>Example:</strong> an 8-hour day at €88 is 8 × €88 = €704, above <a href="https://www.malt.fr/t/barometre-tarifs/tech" target="_blank" rel="noopener noreferrer">Malt's</a> €576 average for experienced developers. But a day-rate contract can fill more of your month. If a client books you 16 days a month, you bill 128 hours instead of 60. Over 11 working months, €57,600 ÷ (128 × 11) = €40.91, so about €41 an hour or 8 × €41 = €328 a day. A long contract can be cheaper per hour and still hit the same yearly target.</p>

<h3>Fixed price: MVPs and clear scopes</h3>
<p>Fixed price fits when the scope can be written down: a landing page, an MVP with a feature list. The client gets a known cost; you carry the risk of your estimate and keep the gain if you work faster.</p>
<p><strong>Example:</strong> you estimate an MVP at 60 hours and add 25% for unknowns: 60 × 1.25 = 75 hours, and 75 × €88 = €6,600. Write down what's included, what isn't, how many revision rounds, and that changes are billed hourly.</p>

<h3>Retainer: ongoing maintenance</h3>
<p>A retainer fits work that keeps coming: updates, security patches, small fixes. The client reserves hours each month and gets a response time; you get predictable income and spend less time selling.</p>
<p><strong>Example:</strong> 10 hours a month at €88 is €880 a month. Decide upfront whether unused hours roll over (simplest: they don't) and what extra hours cost.</p>

<h2>How to work out your floor rate</h2>
<p>Your floor is the lowest rate at which freelancing still covers your costs and target income. Step by step, for the example developer:</p>
<ol>
<li><strong>Target income.</strong> €4,000 a month before income tax: €48,000 a year.</li>
<li><strong>Taxes and social costs.</strong> Employers pay part of these for employees. As a freelancer you pay pension, health and disability insurance and social contributions yourself. The rules differ by country, so check with your tax office or an accountant. The example adds €600 a month: €7,200 a year.</li>
<li><strong>Business costs.</strong> Laptop, software, hosting, accounting, insurance. The example uses €200 a month: €2,400 a year. Total to earn: €48,000 + €7,200 + €2,400 = €57,600.</li>
<li><strong>Billable hours.</strong> Finding clients, proposals, invoicing and learning take time nobody pays for, and so do holidays and sick days. The example bills 60 hours a month for 11 months: 660 hours a year. Track a month of your own hours to find your figure.</li>
<li><strong>Divide.</strong> €57,600 ÷ 660 = €87.27, rounded up to €88 an hour. That's the floor.</li>
<li><strong>Add platform fees.</strong> A platform fee comes out of what the client pays, so divide by the share you keep instead of adding the percentage. <a href="https://support.upwork.com/hc/en-us/articles/211062538-Learn-about-the-Freelancer-Service-Fee" target="_blank" rel="noopener noreferrer">Upwork's</a> freelancer fee is 0% to 15% per contract, shown when you send a proposal or get an offer. At 10%: €88 ÷ 0.90 = €97.78, so about €98 an hour. Upwork's help page uses the same method: to take home $20 an hour at a 10% fee, charge $22.22. On Fiverr, freelancers <a href="https://help.fiverr.com/hc/en-us/articles/34069565843985-How-Fiverr-works-for-freelancers" target="_blank" rel="noopener noreferrer">receive 80%</a> of each completed order, so Fiverr keeps 20%: €88 ÷ 0.80 = €110 an hour to build into your Gig prices. Fiverr's <a href="https://help.fiverr.com/hc/en-us/articles/360010558038-How-Fiverr-works-for-clients" target="_blank" rel="noopener noreferrer">client page</a> adds a 5.5% service fee on top for the client, so they pay more than your Gig price.</li>
</ol>
<p>Then compare your floor with the data above. If it sits far above what your market pays, change the inputs: more billable hours, lower costs, or a different market. If it sits well below, charge more than your floor.</p>

<h2>Raising your rate</h2>
<h3>New clients first</h3>
<p>Quote the new rate to every new lead and update your profiles. New clients have no old price to compare with, so this is the safest place to test it. If they say yes, you have your answer for existing clients.</p>

<h3>Existing clients: give notice</h3>
<p>Check your contract first: it may set a notice period for price changes. If not, give a date that leaves the client time to budget, for example two or three months ahead. Agreed fixed-price work keeps the old price. Tell clients in writing, keep it short, and don't apologise.</p>

<h3>Example message</h3>
<p>Names, dates and amounts are placeholders.</p>
<blockquote>
<p><strong>Subject:</strong> My rates from 1 February</p>
<p>Hi Anna,</p>
<p>A quick note on rates: from 1 February 2027, my hourly rate goes from €75 to €88. Everything we agree before then, including the current checkout project, stays at €75.</p>
<p>Nothing else changes: same response times, same monthly report. Happy to plan next quarter's work with you before then.</p>
<p>Thanks for the work together this year,</p>
<p>Sam</p>
</blockquote>

<h2>Checklist</h2>
<ul>
<li>I compared at least two sources and noted what each measures: client cost, list rate, day rate or employee wage.</li>
<li>I used medians where given, not averages.</li>
<li>My floor includes target income, my country's taxes and social costs, business costs and tracked billable hours.</li>
<li>Platform fees are divided out (floor ÷ 0.90 at a 10% fee), not added on.</li>
<li>Hourly for unclear work, a day rate for team contracts, fixed price only with a written scope, a retainer for maintenance.</li>
<li>Fixed-price quotes include a buffer and say how changes are billed.</li>
<li>New leads get the new rate first.</li>
<li>Existing clients get written notice with a date; agreed work keeps the old price.</li>
<li>I recheck my floor once a year, or when my costs change.</li>
</ul>

<p>If rewriting your profiles and pitches around a new rate is the part you keep putting off, ClientPilot writes platform profiles and pitches from your profile. There's a free preview, and Pro is $9 a month.</p>
`,
  sources: [
    {
      label: 'Arc: Freelance developer rate explorer (method: 20,000+ vetted developers on Codementor)',
      url: 'https://arc.dev/freelance-developer-rates',
    },
    { label: 'Arc: Web development developer hourly rate', url: 'https://arc.dev/freelance-developer-rates/web-development' },
    { label: 'Arc: Front-end developer hourly rate', url: 'https://arc.dev/freelance-developer-rates/front-end' },
    { label: 'Arc: Back-end developer hourly rate', url: 'https://arc.dev/freelance-developer-rates/back-end' },
    { label: 'Arc: Full-stack developer hourly rate', url: 'https://arc.dev/freelance-developer-rates/full-stack' },
    { label: 'Arc: JavaScript developer hourly rate', url: 'https://arc.dev/freelance-developer-rates/javascript' },
    { label: 'Arc: PHP developer hourly rate', url: 'https://arc.dev/freelance-developer-rates/php' },
    { label: 'Arc: WordPress developer hourly rate', url: 'https://arc.dev/freelance-developer-rates/wordpress' },
    { label: 'Arc: Vue developer hourly rate', url: 'https://arc.dev/freelance-developer-rates/vue' },
    { label: 'Arc: React developer hourly rate', url: 'https://arc.dev/freelance-developer-rates/reactjs' },
    { label: 'Arc: Node.js developer hourly rate', url: 'https://arc.dev/freelance-developer-rates/nodejs' },
    {
      label: 'Arc Employer Blog: How much do freelance developers cost in 2026? (26 May 2026)',
      url: 'https://arc.dev/employer-blog/freelance-developers-cost/',
    },
    {
      label: 'Upwork: Hire the best web developers, cost section (read via Internet Archive copy, 21 Oct 2026)',
      url: 'https://www.upwork.com/hire/web-developers/',
    },
    {
      label: 'Upwork Help: Learn about the Freelancer Service Fee (read via Internet Archive copy, 10 Nov 2026)',
      url: 'https://support.upwork.com/hc/en-us/articles/211062538-Learn-about-the-Freelancer-Service-Fee',
    },
    {
      label: 'Fiverr Help: How Fiverr works for freelancers (read via Internet Archive copy, 27 Oct 2026)',
      url: 'https://help.fiverr.com/hc/en-us/articles/34069565843985-How-Fiverr-works-for-freelancers',
    },
    {
      label: 'Fiverr Help: How Fiverr works for clients (read via Internet Archive copy, 2 Nov 2026)',
      url: 'https://help.fiverr.com/hc/en-us/articles/360010558038-How-Fiverr-works-for-clients',
    },
    {
      label: 'Malt (France): Grille des tarifs 2026, freelance developers, in French (read via Internet Archive copy, 7 Oct 2026)',
      url: 'https://www.malt.fr/t/barometre-tarifs/tech',
    },
    { label: 'Toptal: pricing', url: 'https://www.toptal.com/pricing' },
    { label: 'Toptal: talent FAQ', url: 'https://www.toptal.com/freelance-jobs/faq' },
    {
      label: 'US Bureau of Labor Statistics: Occupational Outlook Handbook, Web Developers and Digital Designers (last modified 27 Aug 2026)',
      url: 'https://www.bls.gov/ooh/computer-and-information-technology/web-developers.htm',
    },
  ],
}

export default post
