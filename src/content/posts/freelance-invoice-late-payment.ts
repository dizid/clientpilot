import type { BlogPost } from './types'

// Facts checked 2026-11-11 against the official pages listed in `sources`.
const post: BlogPost = {
  slug: 'freelance-invoice-late-payment',
  title: "Client won't pay? How to chase a late freelance invoice",
  description:
    'How to chase a late freelance invoice: what to put on it, a reminder schedule with three templates, when to pause work, and late-payment rules in EU, UK, NYC.',
  date: '2026-11-13',
  checked: '2026-11-11',
  readingMinutes: 9,
  html: `
<p>A late invoice is rarely a refusal. Usually it sits in someone's inbox, waits for an approval, or fell behind a more urgent job. Some are not so innocent. Either way, you get paid faster when the invoice is easy to pay, when you chase on a fixed schedule and when you know what the law lets you add. This guide covers what to put on an invoice, a reminder schedule with templates, stopping work, and the late-payment rules in the EU, the Netherlands, the UK and New York City.</p>

<h2>Make the invoice easy to pay</h2>
<p>Most chasing is avoidable. A client's finance person can only pay an invoice that has everything they need on it. Put these on every invoice:</p>
<ul>
<li><strong>A due date, written as a date.</strong> "Due 28 November 2026" beats "net 30". If your contract sets payment terms, copy them exactly. Our guide to <a href="/blog/freelance-developer-contract-clauses">freelance developer contract clauses</a> covers payment terms, deposits and a late-fee clause.</li>
<li><strong>Payment details:</strong> account name, IBAN or account number and sort code, the payment link if you use one, and the currency.</li>
<li><strong>A reference they must quote</strong> (invoice number), plus their purchase order (PO) number if their company uses them. Many companies cannot pay an invoice without a PO number, and the invoice then waits until somebody notices.</li>
<li><strong>The right billing entity,</strong> with the legal name and address the client gave you, and a VAT or tax ID where it applies.</li>
<li><strong>What the invoice is for:</strong> project name, milestone or period, and the amount, so the approver can match it to what they agreed.</li>
<li><strong>The late-payment terms from your contract,</strong> in one line (for example, "Interest and recovery costs apply as set out in our agreement dated ...").</li>
</ul>
<p>Send it to the person who approves it, not only to the person you work with day to day. Ask once, at the start: "Who handles invoices, and do you need a PO number?" Then send it the day the milestone is done, not at the end of the month.</p>

<h2>A reminder schedule</h2>
<p>These timings are a rule of thumb from practice, not a legal requirement. Shorten them for a small invoice you can't afford to wait on, and lengthen them for large clients with known approval chains.</p>
<table>
<thead>
<tr><th>When</th><th>What to send</th></tr>
</thead>
<tbody>
<tr><td>A few days before the due date (optional)</td><td>A short heads-up with the invoice attached again. Useful for new clients and big companies.</td></tr>
<tr><td>The day after the due date</td><td>A friendly reminder. Assume it was missed.</td></tr>
<tr><td>About a week later</td><td>A firm reminder: the amount, the date it was due, the date you need it by.</td></tr>
<tr><td>About two weeks after the due date</td><td>A final notice: what you will do next, and when.</td></tr>
<tr><td>After the date in the final notice</td><td>Do what you said: pause work if your contract allows it, then move to the legal options below.</td></tr>
</tbody>
</table>
<p>Keep every message in writing, in one thread, with the invoice attached. If you also phone, follow up with an email that says what was agreed. That record is what you will rely on if the invoice ever goes to a claim.</p>

<h2>Three reminder templates</h2>
<p>Names, dates and amounts are placeholders.</p>

<h3>1. Friendly reminder (day after the due date)</h3>
<blockquote>
<p><strong>Subject:</strong> Invoice 2026-041, due yesterday</p>
<p>Hi Jane, invoice 2026-041 (EUR 3,200, website rebuild, milestone 2) was due on 12 November. I've attached it again in case it got lost. Payment details and the invoice number to quote are on the invoice. Could you confirm it's scheduled? Thanks, Sam</p>
</blockquote>
<p>Short, no blame, one question that needs a yes. Often this is all it takes.</p>

<h3>2. Firm reminder (about a week later)</h3>
<blockquote>
<p><strong>Subject:</strong> Overdue: invoice 2026-041 (EUR 3,200), payment needed by 26 November</p>
<p>Hi Jane, invoice 2026-041 is now 8 days overdue. I haven't had a reply to my note on the 13th. Please pay it by 26 November, or tell me today what's holding it up (a PO number, an approval, a wrong address) and I'll fix it on my side. Our agreement sets payment at 14 days, and it allows interest on late payments. I'd rather not use that clause, so a quick answer helps us both. Sam</p>
</blockquote>
<p>It names the date, asks what is blocking payment and mentions the contract once, calmly. The most common real blocker is a missing PO number or an invoice sent to the wrong person.</p>

<h3>3. Final notice (about two weeks after the due date)</h3>
<blockquote>
<p><strong>Subject:</strong> Final notice: invoice 2026-041, work paused from 30 November</p>
<p>Hi Jane, invoice 2026-041 (EUR 3,200) is 14 days overdue, and I haven't had a payment or a reply. If I haven't received it by 30 November, then under clause 7 of our agreement I'll pause work on the project, and I'll claim the interest and recovery costs the law and our agreement allow. I'd much rather resolve this directly. If a payment date is agreed in writing today, I'll continue as planned. Sam</p>
</blockquote>
<p>Only write this if you will do what it says, and only cite a clause that exists. A threat you don't follow up on teaches the client to ignore your next one.</p>

<h2>Stopping work, and what to do with access</h2>
<p>You can only pause work if your contract lets you. Check it before you write the final notice. If the contract has no clause on suspension, pausing could put you in breach, so a short written agreement with the client ("work resumes when invoice X is paid") is safer. If you are unsure, get advice from a lawyer who knows contract law where you are.</p>
<p>If your contract does allow it:</p>
<ul>
<li><strong>Say so in advance,</strong> in the final notice, with a date. A surprise lockout looks worse than a warned pause.</li>
<li><strong>Stop new work, and keep what is already theirs intact.</strong> Don't delete work, wipe a live site or lock them out of accounts they own. That can create liability for you and turns a payment dispute into a damage dispute.</li>
<li><strong>Credentials you hold on the client's behalf</strong> (hosting, domain, analytics, app stores) belong to them. Hand over what you were given, rotate any you created for yourself, and keep a written note of what you did. Whether you may withhold deliverables until payment depends on your contract, so only do so where it says that.</li>
<li><strong>Keep the door open.</strong> Say what happens on payment: work resumes, files go over.</li>
</ul>
<p>A deposit or milestone payments keep the amount at risk small to begin with. Your <a href="/blog/freelance-project-proposal-template">project proposal</a> is a good place to state the payment schedule up front.</p>

<h2>Legal options, by place</h2>
<p><em>This is a summary, not legal advice. The rules depend on where you and the client are, and on what your contract says.</em></p>
<table>
<thead>
<tr><th>Where</th><th>Interest and charges</th><th>Source</th></tr>
</thead>
<tbody>
<tr><td>EU</td><td>Statutory interest at least 8 percentage points above the ECB reference rate; at least EUR 40 for recovery costs</td><td><a href="https://eur-lex.europa.eu/eli/dir/2011/7/oj/eng" target="_blank" rel="noopener noreferrer">Directive 2011/7/EU (EUR-Lex)</a></td></tr>
<tr><td>Netherlands</td><td>Statutory commercial interest 10.4% since 1 July 2026</td><td><a href="https://www.rijksoverheid.nl/onderwerpen/schulden/vraag-en-antwoord/hoogte-wettelijke-rente" target="_blank" rel="noopener noreferrer">Rijksoverheid</a></td></tr>
<tr><td>UK</td><td>8% plus the Bank of England base rate; fixed sum of 40, 70 or 100 pounds by debt size</td><td><a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery" target="_blank" rel="noopener noreferrer">gov.uk</a></td></tr>
<tr><td>New York City</td><td>Right to double the unpaid amount, plus damages for retaliation and attorneys' fees and costs</td><td><a href="https://www.nyc.gov/site/dca/workers/workersrights/freelancer-workers.page" target="_blank" rel="noopener noreferrer">NYC DCWP</a></td></tr>
</tbody>
</table>

<h3>European Union</h3>
<p>The <a href="https://eur-lex.europa.eu/eli/dir/2011/7/oj/eng" target="_blank" rel="noopener noreferrer">Late Payment Directive (2011/7/EU)</a> sets the framework for business-to-business payments. According to the <a href="https://eur-lex.europa.eu/EN/legal-content/summary/combating-late-payment-in-business-dealings.html" target="_blank" rel="noopener noreferrer">EUR-Lex summary</a>, business-to-business payment periods are generally limited to 60 calendar days, and the statutory interest is at least 8 percentage points above the European Central Bank reference rate. A creditor is also entitled to a minimum of EUR 40 in compensation for recovery costs.</p>
<p>The European Union's <a href="https://europa.eu/youreurope/business/finance-and-tax/making-receiving-payments/late-payment/index_en.htm" target="_blank" rel="noopener noreferrer">Your Europe</a> page adds the practical points. If the contract sets no payment period, interest becomes payable 30 days after the client receives the invoice. The EUR 40 is a flat fee for each invoice paid late, and you can claim more if your recovery costs were higher. It also says that for two parties in the same country, national late-payment rules apply, and the listed statutory rates differ by country. The directive is implemented through each country's own law, so check the national rule that applies to you. These rules do not apply to consumers.</p>

<h3>Netherlands</h3>
<p>The Dutch government says the <a href="https://www.rijksoverheid.nl/onderwerpen/schulden/vraag-en-antwoord/hoogte-wettelijke-rente" target="_blank" rel="noopener noreferrer">wettelijke rente voor handelstransacties</a> (statutory interest on commercial transactions) is 10.4% since 1 July 2026, and that it covers agreements between businesses and between businesses and government bodies. The rate is adjusted over time, so look at that page for the figure that applies on the day you calculate it. (Your Europe's country table lists 10.15% for the Netherlands for the same half-year; for a Dutch claim, go by the Dutch government's own page.)</p>

<h3>United Kingdom</h3>
<p>The <a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery" target="_blank" rel="noopener noreferrer">gov.uk guidance on late commercial payments</a> says that if you don't agree a payment date, the payment is late 30 days after the customer receives the invoice or you deliver the goods or service, whichever is later. On <a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt" target="_blank" rel="noopener noreferrer">charging interest</a>, it says the interest is 8% plus the Bank of England base rate for business-to-business transactions. On <a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery/claim-debt-recovery-costs" target="_blank" rel="noopener noreferrer">debt recovery costs</a>, you can charge a fixed sum of 40 pounds for debts up to 999.99 pounds, 70 pounds for 1,000 to 9,999.99 pounds and 100 pounds for 10,000 pounds or more, once per payment. As a supplier you can also claim reasonable costs each time you try to recover the debt.</p>
<p>If the client still doesn't pay, gov.uk says you can <a href="https://www.gov.uk/make-court-claim-for-money" target="_blank" rel="noopener noreferrer">apply to a county court</a> to claim money owed by a person or business, online or by post. Claims against people or businesses in Scotland and Northern Ireland follow different processes.</p>

<h3>United States: New York City</h3>
<p>The US has no single federal rule for this. New York City's Freelance Isn't Free Act is one of the clearest, and the <a href="https://www.nyc.gov/site/dca/workers/workersrights/freelancer-workers.page" target="_blank" rel="noopener noreferrer">NYC Department of Consumer and Worker Protection (DCWP)</a> says you must be paid on or before the date in the contract, or within 30 days after you finish the work if the contract has no date. Contracts worth 800 dollars or more, including agreements totaling that amount within any 120-day period, must be in writing. If you are not paid on time, you have the right to collect double the unpaid amount, damages for retaliation, and attorneys' fees and costs.</p>
<p>You can file a complaint with DCWP, which forwards it to the hiring party, who must respond within 20 days. If they don't respond, a court will presume they violated the law unless they prove otherwise. This law applies to freelancers in New York City. Elsewhere in the US, small-claims limits and procedures are set state by state, so look up your own state's court rules before you file.</p>

<h2>What these rules mean for you in practice</h2>
<ul>
<li><strong>Interest and fixed fees are for invoices that are late, not just disputed.</strong> If the client disputes the work, that is a different conversation. Settle the dispute in writing first.</li>
<li><strong>Put the rate in your contract.</strong> A contractual late-fee clause is the clearest basis for what you charge. The statutory rules apply when the contract is silent, and they differ by country.</li>
<li><strong>Don't bill interest on the first reminder.</strong> Use it in the firm or final notice, as a reason to pay now. The legal step is the last resort.</li>
</ul>

<h2>Keep the paper trail</h2>
<p>Save the signed contract or accepted proposal, the invoice, proof it was sent (the email, with a date), each reminder and every reply. A short log ("sent 1 Nov; reminder 13 Nov; replied 15 Nov: 'next week'") turns a story into evidence. A spreadsheet or your accounting software can remind you of due dates. (ClientPilot drafts outreach messages to find clients; it doesn't do invoicing.)</p>

<h2>Checklist</h2>
<ul>
<li>Invoice has a due date, payment details, an invoice number and the client's PO number if they use one.</li>
<li>Invoice goes to the person who approves it, on the day the work is done.</li>
<li>Contract states payment terms, a late-fee or interest clause, and your right to pause work.</li>
<li>Reminder the day after the due date, a firm one about a week later, a final notice about two weeks after (rule of thumb).</li>
<li>Every reminder in writing, with the invoice attached.</li>
<li>Final notice has a date, and you do what it says.</li>
<li>Paused work only where the contract allows it. Client-owned accounts and files stay intact.</li>
<li>Know which interest and cost rules apply where you and the client are, and check the official page for the current rate.</li>
</ul>
`,
  sources: [
    {
      label: 'EUR-Lex: Directive 2011/7/EU on combating late payment in commercial transactions',
      url: 'https://eur-lex.europa.eu/eli/dir/2011/7/oj/eng',
    },
    {
      label: 'EUR-Lex: Combating late payment in business dealings (summary)',
      url: 'https://eur-lex.europa.eu/EN/legal-content/summary/combating-late-payment-in-business-dealings.html',
    },
    {
      label: 'Your Europe: Late payment',
      url: 'https://europa.eu/youreurope/business/finance-and-tax/making-receiving-payments/late-payment/index_en.htm',
    },
    {
      label: 'Rijksoverheid: Hoogte wettelijke rente',
      url: 'https://www.rijksoverheid.nl/onderwerpen/schulden/vraag-en-antwoord/hoogte-wettelijke-rente',
    },
    {
      label: 'GOV.UK: Late commercial payments: charging interest and debt recovery',
      url: 'https://www.gov.uk/late-commercial-payments-interest-debt-recovery',
    },
    {
      label: 'GOV.UK: Charging interest on late commercial payments',
      url: 'https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt',
    },
    {
      label: 'GOV.UK: Claim debt recovery costs on late payments',
      url: 'https://www.gov.uk/late-commercial-payments-interest-debt-recovery/claim-debt-recovery-costs',
    },
    {
      label: 'GOV.UK: Make a court claim for money',
      url: 'https://www.gov.uk/make-court-claim-for-money',
    },
    {
      label: 'NYC DCWP: Freelance Isn\'t Free Act (freelance workers)',
      url: 'https://www.nyc.gov/site/dca/workers/workersrights/freelancer-workers.page',
    },
  ],
}

export default post
