import type { BlogPost } from './types'

// Mostly practice-based advice. Anything stated as a rule of thumb is labelled as one.
// The only outside source is Upwork's own cover letter guide (read as an Internet Archive
// copy because upwork.com blocks automated readers); no contract-law, tax or e-signature
// claims are made on purpose. No win-rate numbers.
const post: BlogPost = {
  slug: 'freelance-project-proposal-template',
  title: 'Freelance project proposal: structure and template',
  description:
    'How to write a freelance project proposal a client reads to the end: structure, length, scope and out-of-scope wording, price options, expiry date and a web-dev template.',
  date: '2026-11-13',
  checked: '2026-11-11',
  readingMinutes: 8,
  html: `
<p>A project proposal has one job: make it easy for one person to say yes. That person is busy, may not be technical, and often has to show your proposal to someone else before they can decide. So the best proposals are short, written in the client's words, and end with one clear next step. This guide covers the structure, how long it should be, what changes when you send it cold or after a call, a copy-paste template for a web development job, and the mistakes that cost freelancers jobs.</p>

<p><em>A note on what this is.</em> There is no official standard for proposals, so most of what follows is practice: rules of thumb that many freelancers use and that we have labelled as such. Where a law or a contract matters (what makes an agreement binding, tax on invoices), this guide doesn't make claims. Check those with a lawyer or accountant in your country.</p>

<h2>The structure: six parts, in this order</h2>
<ol>
<li><strong>The problem, in the client's words.</strong> One to three sentences that repeat what they told you, using their wording, not yours. "Your booking form loses people on phones, and you get about five phone calls a week from people who gave up on it" beats "Mobile UX optimisation".</li>
<li><strong>The outcome.</strong> What is different when you're done, described from their side. "Visitors can book on a phone in under a minute and you get an email for each booking." Avoid promising numbers you can't control, like traffic or sales.</li>
<li><strong>Scope, with an explicit out-of-scope list.</strong> What you will deliver, and what you will not. More on this below.</li>
<li><strong>Timeline.</strong> A start date, key moments (first version, review, launch) and what you need from them by when. Dates depend on their feedback, so say so.</li>
<li><strong>Price: two or three options.</strong> What each costs, what each includes, how and when you invoice.</li>
<li><strong>The next step,</strong> with an expiry date: "If you reply by 28 November I can start on 2 December."</li>
</ol>
<p>Put a one-sentence summary and the price range at the top if the proposal runs past a page. The reader who only opens the first screen should still know what you are offering and roughly what it costs.</p>

<h2>How long should it be?</h2>
<p><strong>Rule of thumb:</strong> one page for a small job, two to three for a larger one, and nothing that needs a table of contents. The reader should be able to finish it in under five minutes. If a section keeps growing, move the detail to an appendix and keep the main text short.</p>
<p>Upwork's own guide on cover letters points the same way. It tells freelancers to aim for 200 to 300 words or fewer and to tailor every letter to the job, because clients often review many proposals back to back (<a href="https://www.upwork.com/resources/cover-letter-tips" target="_blank" rel="noopener noreferrer">Upwork cover letter guide</a>). A cover letter on a marketplace is shorter than a proposal for a paid project, but the principle carries over: specific beats long. For writing on Upwork itself, see our <a href="/blog/upwork-proposal-developer">Upwork proposal guide for developers</a>.</p>

<h2>Scope: say what you will not do</h2>
<p>Most arguments about scope start with something that was never written down. Two habits prevent most of them.</p>
<p><strong>List deliverables as things, not activities.</strong> "A five-page responsive website built in Vue, with the contact form connected to your email" is checkable. "Website development" isn't.</p>
<p><strong>Add an out-of-scope list.</strong> Typical items for a web job: writing the copy, taking photos, migrating old content, ongoing hosting or maintenance, browser support beyond the latest two versions, and anything not named above. Then add one sentence that says what happens to extras: "Anything outside this list is quoted separately before I start it."</p>
<p>Also state how many rounds of changes are included. <strong>Rule of thumb:</strong> two rounds of feedback on each stage, collected in one message per round. A round means one consolidated list from the client, not a stream of small messages.</p>

<h2>Price: give two or three options</h2>
<p>One price invites a yes or a no, and "no" often means "too much". Two or three options turn the question into "which one", and that is a more useful question for a client who is already interested. It also lets you show where you would cut if the budget is tight, instead of discounting.</p>
<ul>
<li><strong>Option 1, the focused version:</strong> the smallest piece that solves the core problem.</li>
<li><strong>Option 2, the recommended version:</strong> the whole job as discussed. Mark it as your recommendation and say why.</li>
<li><strong>Option 3, optional:</strong> the full job plus something extra, like a month of support after launch, training for their team, or a second round of testing.</li>
</ul>
<p>Keep the options clearly different in scope, not just in size of discount. For how to arrive at your numbers and when fixed price beats hourly, see <a href="/blog/freelance-developer-rates">how to set your freelance developer rate</a>. Don't hide the price at the bottom of page three: clients who have to hunt for it tend to assume it's high. Put it where they expect it, after the scope, and show it plainly.</p>

<h2>Sent after a call, or sent cold?</h2>
<p>The structure stays the same. What changes is how much you can assume.</p>
<table>
<thead>
<tr><th></th><th>After a call</th><th>Cold, unasked</th></tr>
</thead>
<tbody>
<tr><td>Problem section</td><td>Repeat what they said on the call, including a sentence or two you noted verbatim</td><td>Based on what you saw on their site or in their post. Keep it modest, they haven't confirmed it</td></tr>
<tr><td>Price</td><td>Full options, since you've discussed budget</td><td>A short range plus an offer to confirm after a 20-minute call</td></tr>
<tr><td>Length</td><td>One to three pages</td><td>A short email, not a PDF. An unasked-for multi-page proposal is a lot to read</td></tr>
<tr><td>Next step</td><td>Accept by a date, I start on another date</td><td>A call, with two time slots proposed</td></tr>
</tbody>
</table>
<p>If you haven't talked to them, a full proposal is premature. Write a short cold email first (see our <a href="/blog/cold-email-freelance-developer">cold email guide</a>) and offer the proposal once you have heard their side. After you send a proposal, <a href="/blog/freelance-follow-up-email">the follow-up guide</a> covers when to nudge and what each message should add.</p>

<h2>A template for a web development job</h2>
<p>Copy this and replace everything in [brackets]. Delete the notes in italics in your own copy.</p>
<blockquote>
<p><strong>Proposal: [project name] for [client company]</strong></p>
<p>Prepared [date] by [your name]. Valid until [date, for example 14 days from today].</p>
<p><strong>Summary.</strong> I will [one-sentence description of the outcome] for [price range], starting [date] and launching [date].</p>
<p><strong>What you told me.</strong> [Two or three sentences in their words: the problem, why it matters now, what they tried before.]</p>
<p><strong>What changes when it's done.</strong> [One to three outcomes from their side: who can do what, how long it takes, what they no longer have to do by hand.]</p>
<p><strong>What I will deliver.</strong></p>
<ul>
<li>[Deliverable 1, described so it can be checked]</li>
<li>[Deliverable 2]</li>
<li>[Deliverable 3]</li>
<li>Two rounds of changes after the first version, each as one list from you</li>
<li>[Handover: source code, login details, a short guide for editing content]</li>
</ul>
<p><strong>Not included.</strong> [Copywriting, photography, content migration, hosting and maintenance, features not listed above.] Anything outside the list above I will quote separately before starting it.</p>
<p><strong>Timeline.</strong> Start [date]. First version [date]. Your feedback by [date]. Launch [date]. The dates assume I receive [content, access, logos] by [date]. Every day later pushes launch back by a day.</p>
<p><strong>Options and price.</strong></p>
<ul>
<li><strong>Focused:</strong> [what is included], [price].</li>
<li><strong>Recommended:</strong> everything above, [price]. [One sentence on why you recommend it.]</li>
<li><strong>Extended:</strong> recommended plus [extra], [price].</li>
</ul>
<p>Invoicing: [for example 50% before I start, 50% on launch]. Payment within [number] days of invoice. [Whether your prices include or exclude tax: check with your accountant how to word this.]</p>
<p><strong>Next step.</strong> Reply with the option you want by [date] and I will send the agreement and first invoice. If you have questions first, I'm free for a short call on [two time slots].</p>
</blockquote>
<p>This template is a proposal, not a contract. Many freelancers send a separate short agreement after the client accepts. Have a lawyer in your country check your agreement wording once, then reuse it.</p>

<h2>Common mistakes</h2>
<ul>
<li><strong>Vague scope wording.</strong> "Unlimited revisions", "and other small tweaks", "etc." and "as needed" are invitations to scope creep. Replace them with a number of rounds and a list.</li>
<li><strong>No expiry date.</strong> A proposal with no end date stays open forever, and your price and availability change while the client takes their time. A validity period of two to three weeks is a common rule of thumb. It also gives you a natural reason to follow up.</li>
<li><strong>Burying the price.</strong> Putting it on the last page, or only in an attachment, makes it look like you're hiding it. Put it in the summary and again in the options.</li>
<li><strong>Talking about yourself first.</strong> The opening paragraph about your years of experience tells the client nothing about their problem. Start with them and move your credentials to a short section near the end.</li>
<li><strong>Unexplained jargon.</strong> If the client isn't technical, write "the site loads in under three seconds on a phone", not "LCP optimisation".</li>
<li><strong>Dead-end endings.</strong> "Let me know your thoughts" gives the client a task. "Reply with 1, 2 or 3 by 28 November" gives them an answer to give.</li>
<li><strong>Sending the same document to everyone.</strong> Reusing a structure is fine. Reusing the text isn't: the problem and outcome sections are the part that shows you listened.</li>
</ul>

<h2>Before you send</h2>
<ol>
<li>Read it as the client, on a phone. Is the price easy to find? Is the next step obvious?</li>
<li>Check every date, name and number against your notes from the call.</li>
<li>Ask yourself whether a stranger could tell, from the scope and out-of-scope lists alone, if the job was done.</li>
<li>Write the follow-up message now and put the date in your calendar.</li>
</ol>
<p>If you track your outreach, ClientPilot gives each message it generates a draft, used or replied status, so you can see which of your messages got an answer. A spreadsheet works as well.</p>
`,
  sources: [
    {
      label:
        'Upwork: cover letter guide (read via Internet Archive copy, 30 Oct 2025; used for the 200 to 300 words and tailoring advice)',
      url: 'https://www.upwork.com/resources/cover-letter-tips',
    },
  ],
}
export default post
