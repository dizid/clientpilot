import type { BlogPost } from './types'

// Facts checked 2026-11-11 against the official pages listed in `sources`.
// Not verified and therefore left out: the full list of GDPR Art. 28(3) processor duties
// (EUR-Lex would not load for the checker), the NY State effective date and look-back window.
const post: BlogPost = {
  slug: 'freelance-developer-contract-clauses',
  title: 'Freelance developer contract: the clauses that protect you',
  description:
    'Clauses a freelance developer contract needs: scope, change requests, payment, IP assignment, data protection, liability cap, plus NYC and NY State rules.',
  date: '2026-11-12',
  checked: '2026-11-11',
  readingMinutes: 9,
  html: `
<p>Most freelance disputes aren't about bad code. They're about things nobody wrote down: what was included, who pays for the extra page, when the invoice is due, who owns the result. This guide goes through the clauses that matter most for a freelance web or app developer, what each one should say, and the legal rules worth knowing in the US, the EU and New York.</p>
<p><em>This is a summary, not legal advice. Rules depend on where you and the client are.</em></p>

<h2>The clauses at a glance</h2>
<table>
<thead>
<tr><th>Clause</th><th>What it says</th><th>Why it matters</th></tr>
</thead>
<tbody>
<tr><td>Scope and exclusions</td><td>Lists deliverables, and names what is not included</td><td>Stops "while you're at it" work from becoming free work</td></tr>
<tr><td>Change requests</td><td>Anything outside scope is quoted and approved in writing first</td><td>Gives you a polite way to say "that's extra"</td></tr>
<tr><td>Milestones and deposit</td><td>Payment split into stages, with a deposit before work starts</td><td>You're never far ahead of the money</td></tr>
<tr><td>Payment terms</td><td>Due date, method, late fee in general terms</td><td>A due date can be enforced; "soon" cannot</td></tr>
<tr><td>IP ownership</td><td>Who owns the work and when it transfers</td><td>The default may not be what the client expects</td></tr>
<tr><td>Data protection</td><td>Rules for handling the client's personal data</td><td>Required in writing under GDPR if you process data for an EU client</td></tr>
<tr><td>Warranty period</td><td>A fixed window for fixing defects you caused</td><td>Ends the open-ended "it's still your bug"</td></tr>
<tr><td>Liability cap</td><td>Your maximum liability, usually tied to fees paid</td><td>Keeps one mistake from costing more than the project</td></tr>
<tr><td>Termination</td><td>How either side ends it, and what's owed</td><td>Pays you for work done if the client walks away</td></tr>
<tr><td>Handover</td><td>Who owns hosting, domains, accounts and credentials</td><td>Avoids hostage situations in both directions</td></tr>
</tbody>
</table>

<h2>Scope and what is out of scope</h2>
<p>Write the deliverables as outcomes you can check, not activities. "A five-page marketing site, responsive, built in the client's CMS" can be verified. "Website development" can't. Then list exclusions, because that is where scope creep starts: copywriting, image sourcing, SEO, content migration, ongoing maintenance, third-party fees.</p>
<p>Also state your assumptions: design rounds, and who supplies content and by when. Our <a href="/blog/freelance-project-proposal-template">proposal template guide</a> covers how to structure scope in the proposal itself, so the contract can refer to it instead of repeating it.</p>
<blockquote>
<p><strong>Example wording (not legal advice):</strong> The Work consists only of the items listed in Schedule A. Anything not listed in Schedule A is outside the scope of this agreement, including copywriting, photography, hosting fees and ongoing maintenance.</p>
</blockquote>

<h2>Change requests</h2>
<p>A change clause turns an awkward conversation into a process: the client asks, you estimate time and cost, they approve in writing, then you build it. Say that you won't start until it's approved. Rates are covered in our <a href="/blog/freelance-developer-rates">freelance developer rates guide</a>.</p>
<blockquote>
<p><strong>Example wording (not legal advice):</strong> Requests outside Schedule A will be estimated by the Developer in writing. Work on a change starts only after the Client approves the estimate by email.</p>
</blockquote>

<h2>Milestones, deposits and payment terms</h2>
<p>Split the fee into stages tied to deliverables, not to dates alone, and take a deposit before you start. A common split is 30 to 50 percent upfront (a rule of thumb, not a rule), with the rest at milestones. Don't get more than one stage ahead of your payments.</p>
<p>Payment terms should include:</p>
<ul>
<li><strong>A due date</strong> as a number of days from the invoice, or a fixed calendar date per milestone.</li>
<li><strong>A late-payment clause</strong> in general terms: that overdue invoices may carry a stated fee or interest, and that you may pause work while an invoice is overdue. Check what interest or fees are allowed where you and the client are.</li>
</ul>
<p>If you find clients through a platform, its cut changes what you take home: see <a href="/blog/freelance-platform-fees-compared">freelance platform fees compared</a>.</p>
<blockquote>
<p><strong>Example wording (not legal advice):</strong> The Client pays a 40% deposit before work starts. Each invoice is due 14 days after the invoice date. The Developer may pause work while any invoice is overdue.</p>
</blockquote>

<h2>Acceptance and sign-off</h2>
<p>Define how the client approves a deliverable: against the scope, within a set number of working days, by email. Then say what happens if they don't respond, for example that silence counts as acceptance after the review period.</p>

<h2>Who owns the code: IP ownership and transfer</h2>
<p>In the US, the starting point is that the creator owns the copyright. The Copyright Act says that copyright in a work <a href="https://www.copyright.gov/title17/92chap2.html" target="_blank" rel="noopener noreferrer">"vests initially in the author or authors of the work"</a> (17 U.S.C. section 201(a)). Paying for the work doesn't by itself move that ownership.</p>
<p>There are two ways it can end up with the client. The first is a "work made for hire." The US Copyright Office's <a href="https://www.copyright.gov/circs/circ30.pdf" target="_blank" rel="noopener noreferrer">Circular 30</a> says a work is made for hire in two situations: when an employee creates it as part of their regular duties, or when a certain type of work is created under an express written agreement between the creator and the party commissioning it. For an independent contractor, the work must fall into one of nine listed categories (for example a contribution to a collective work, part of an audiovisual work, a translation, a compilation or an instructional text), and the parties must <a href="https://www.copyright.gov/title17/92chap1.html" target="_blank" rel="noopener noreferrer">"expressly agree in a written instrument signed by them"</a> that it is a work made for hire (17 U.S.C. section 101). Our reading, not an official statement: much custom site and app code doesn't clearly fit those nine, so a work-for-hire label alone is a weak basis.</p>
<p>The second way is a written assignment. Under <a href="https://www.copyright.gov/title17/92chap2.html" target="_blank" rel="noopener noreferrer">17 U.S.C. section 204(a)</a>, a transfer of copyright ownership is not valid unless it is in writing and signed by the owner of the rights conveyed. So the contract needs to say, in plain words, that you assign the rights in the finished deliverables to the client, and when.</p>
<p>The when is the part that protects you. Make the transfer take effect on full payment, not on signing. Until then, the client has a license to use the work, or nothing at all.</p>
<blockquote>
<p><strong>Example wording (not legal advice):</strong> On receipt of full payment, the Developer assigns to the Client all copyright in the Deliverables listed in Schedule A. Until full payment, the Client may use the Deliverables only for testing and review.</p>
</blockquote>

<h2>Keep your own generic code: the reuse license</h2>
<p>An assignment of "all code" can accidentally hand over tools and libraries you had before the project. Carve them out, keep ownership, and give the client a license to use them as part of the delivered work.</p>
<blockquote>
<p><strong>Example wording (not legal advice):</strong> The Developer keeps ownership of pre-existing code, tools and libraries, and of generic components created during the project that contain no Client content. The Client receives a non-exclusive, perpetual license to use them as part of the Deliverables.</p>
</blockquote>

<h2>Open-source components</h2>
<p>You can't assign code you don't own. Say that third-party and open-source components stay under their own licenses, and keep a list of what you used (your lockfile is a start).</p>

<h2>Confidentiality</h2>
<p>Define what's confidential (business information, unpublished designs, credentials, customer data), exclude what's already public, set a duration, and make it mutual if you can. Say whether you may show the project in your portfolio.</p>

<h2>Data protection when you handle the client's personal data</h2>
<p>If you get access to a client's customer list, database or user accounts, you may be processing personal data on their behalf. For EU data, that makes you a "processor" and the client the "controller." <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng" target="_blank" rel="noopener noreferrer">GDPR Article 28</a> says processing by a processor must be governed by a contract or other legal act that binds the processor to the controller and sets out the subject matter and duration of the processing, its nature and purpose, the type of personal data and the categories of data subjects, and the obligations and rights of the controller. Article 28(3) continues with further duties for the processor, so read the whole paragraph.</p>
<p>In practice, attach a short data processing schedule, use staging data instead of live data where you can, and say what happens to copies when the project ends.</p>

<h2>Warranty and bug-fix period</h2>
<p>Promise what you can deliver: that the work matches the agreed scope, and that you'll fix defects you caused if reported within a fixed window (30 or 60 days is a common rule of thumb, nothing official). After that, fixes go on a maintenance retainer or hourly. Exclude problems caused by the client's changes or third-party services. Don't promise "bug-free".</p>

<h2>Limitation of liability</h2>
<p>A cap says your total liability under the contract can't exceed a set amount, commonly the fees paid under the contract (again a rule of thumb). Some places limit what you can exclude, so have a lawyer check this clause once and reuse it.</p>
<blockquote>
<p><strong>Example wording (not legal advice):</strong> The Developer's total liability under this agreement is limited to the fees the Client has paid under it. Neither party is liable for lost profit or other indirect losses.</p>
</blockquote>

<h2>Termination and kill fee</h2>
<p>Say how each side can end the contract (written notice, a notice period, or for cause with a chance to fix the problem), and what's owed when it ends. At minimum: payment for work done to that point, plus non-refundable deposits. A kill fee is an extra payment if the client cancels after you've reserved time for them. Keep it proportionate and agree it before work starts.</p>

<h2>Hosting, accounts and credentials</h2>
<p>Decide who owns the domain, hosting, repositories and third-party accounts, and say so. A simple default is that the client owns and pays for them, with you added as a user. If you set things up in your own accounts, say when they transfer (after full payment). List what you hand over: repository, build instructions, admin logins and a short readme. Share passwords through a password manager, not email.</p>

<h2>New York: the Freelance Isn't Free Act</h2>
<p>If you work for clients in New York City, a written contract is the law, not just good practice. The NYC Department of Consumer and Worker Protection (DCWP) says that <a href="https://www.nyc.gov/site/dca/workers/workersrights/freelancer-workers.page" target="_blank" rel="noopener noreferrer">all contracts worth $800 or more must be in writing</a>, and that this includes agreements with the same hiring party that total $800 within any 120-day period. DCWP's <a href="https://www.nyc.gov/assets/dca/downloads/pdf/workers/FAQs-Freelance.pdf" target="_blank" rel="noopener noreferrer">FAQ</a> says the written contract must include:</p>
<ol>
<li>the name and mailing address of both the freelancer and the hiring party;</li>
<li>an itemization of all services to be provided;</li>
<li>the value of those services;</li>
<li>the rate of compensation;</li>
<li>the method of compensation; and</li>
<li>the date the hiring party must pay, or the mechanism by which that date will be set.</li>
</ol>
<p>Both sides must keep a copy. If the contract doesn't set a payment date, the same FAQ says the hiring party must pay no later than 30 days after the services are completed. If the only violation alleged is the missing contract, the freelancer must show they asked for a written contract before starting work, so ask in writing.</p>
<p>New York State now has a statewide version. <a href="https://www.nysenate.gov/legislation/laws/GBS/1412" target="_blank" rel="noopener noreferrer">General Business Law section 1412</a> says the contract between a hiring party and a freelance worker shall be reduced to writing, with the same kind of minimum contents: names and mailing addresses, an itemization of services with their value and the rate and method of compensation, and the payment date or how it is set. The state version also adds the date by which the freelancer must submit a list of services rendered, and says the hiring party must keep the contract for at least six years. The Governor's <a href="https://www.governor.ny.gov/news/governor-hochul-signs-legislation-protect-rights-freelance-workers" target="_blank" rel="noopener noreferrer">announcement</a> describes the expanded protections as applying to freelancers paid at least $800. <a href="https://www.nysenate.gov/legislation/laws/GBS/1411" target="_blank" rel="noopener noreferrer">Section 1411</a> sets the same 30-day fallback for payment.</p>

<h2>Contract checklist</h2>
<ul>
<li>Deliverables written as checkable outcomes, with exclusions and assumptions listed.</li>
<li>Change requests quoted and approved in writing before work starts.</li>
<li>Deposit, milestones, due dates, payment method and a general late-payment clause.</li>
<li>Acceptance process with a review period.</li>
<li>Written IP assignment, effective on full payment, signed by you.</li>
<li>Your pre-existing and generic code excluded, with a license to the client.</li>
<li>Confidentiality, and a data processing schedule if you touch personal data.</li>
<li>Warranty window, liability cap and termination terms, including any kill fee.</li>
<li>Hosting, domain and credentials handover plan.</li>
<li>For NYC or New York State clients: names and addresses, itemized services, value, rate, method and payment date, copies kept.</li>
</ul>
<p>ClientPilot drafts outreach messages for freelancers; it doesn't write contracts.</p>
`,
  sources: [
    {
      label: 'U.S. Copyright Office: Circular 30, Works Made for Hire',
      url: 'https://www.copyright.gov/circs/circ30.pdf',
    },
    {
      label: 'U.S. Copyright Office: 17 U.S.C. chapter 1 (section 101, definitions)',
      url: 'https://www.copyright.gov/title17/92chap1.html',
    },
    {
      label: 'U.S. Copyright Office: 17 U.S.C. chapter 2 (sections 201 and 204)',
      url: 'https://www.copyright.gov/title17/92chap2.html',
    },
    {
      label: 'EUR-Lex: General Data Protection Regulation (EU) 2016/679, Article 28',
      url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng',
    },
    {
      label: 'NYC DCWP: Freelance Worker Rights',
      url: 'https://www.nyc.gov/site/dca/workers/workersrights/freelancer-workers.page',
    },
    {
      label: 'NYC DCWP: Freelance Isn\'t Free Act, Frequently Asked Questions',
      url: 'https://www.nyc.gov/assets/dca/downloads/pdf/workers/FAQs-Freelance.pdf',
    },
    {
      label: 'New York State: General Business Law section 1412 (Written contracts)',
      url: 'https://www.nysenate.gov/legislation/laws/GBS/1412',
    },
    {
      label: 'New York State: General Business Law section 1411 (Timely payment)',
      url: 'https://www.nysenate.gov/legislation/laws/GBS/1411',
    },
    {
      label: 'Governor of New York: Governor Hochul signs legislation to protect the rights of freelance workers',
      url: 'https://www.governor.ny.gov/news/governor-hochul-signs-legislation-protect-rights-freelance-workers',
    },
  ],
}

export default post
