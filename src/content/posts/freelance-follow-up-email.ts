import type { BlogPost } from './types'

// Facts checked 2026-11-11 against the official pages listed in `sources`
// (the same URLs and the same readings as the cold-email post).
const post: BlogPost = {
  slug: 'freelance-follow-up-email',
  title: 'Freelance follow-up emails: when, how often, templates',
  description:
    'When a freelancer should follow up after a proposal, cold email or call, how many times, what each message should add, four templates and the rules that apply.',
  date: '2026-11-12',
  checked: '2026-11-11',
  readingMinutes: 8,
  html: `
<p>Most freelance leads that go quiet haven't said no. They got busy, forwarded your proposal to someone, or meant to reply "tomorrow". A good follow-up gets you an answer, yes or no, without annoying anyone. A bad one ("just checking in!") is easy to ignore and tells the reader nothing new. This guide covers when to follow up, how many times, what each message should add, four short templates, and the few rules that still apply when the email is a follow-up.</p>

<h2>The one rule: every follow-up adds something</h2>
<p>"Just checking in" asks the reader to do the work of remembering you, finding your last message and deciding what to say. Each follow-up should give them a new reason to answer. Good additions are cheap to produce:</p>
<ul>
<li><strong>A new fact</strong> about their problem: you checked the page again and it's still broken, or a deadline they mentioned is getting closer.</li>
<li><strong>A small piece of free value:</strong> a screen recording, a short list of three fixes, a link to a relevant bit of your own work.</li>
<li><strong>A smaller question</strong> than the one you asked before. If "Can we do a call?" got silence, try "Is the problem the timing or the price?"</li>
<li><strong>A change in the offer:</strong> a smaller first step, a fixed price for part of the job, a different start date.</li>
</ul>
<p>If you can't think of anything new to add, don't send it yet.</p>

<h2>When to follow up, by situation</h2>
<p>These timings are rules of thumb from practice, not research. Adjust them to the size of the project and how urgent the client said it was.</p>
<table>
<thead>
<tr><th>Situation</th><th>First follow-up</th><th>How many in total</th></tr>
</thead>
<tbody>
<tr><td>Cold email, no reply</td><td>About four working days later</td><td>Two, then stop</td></tr>
<tr><td>Proposal sent after a call</td><td>Two or three working days later, sooner if they gave you a decision date</td><td>Up to three over about three weeks, then a closing email</td></tr>
<tr><td>Call or meeting, no proposal asked for yet</td><td>The same day (a thank-you with the next step), then a week later if you owe them nothing and they owe you nothing</td><td>One or two</td></tr>
<tr><td>They said "not now, try in a month"</td><td>On the date you agreed, not before</td><td>One, then a closing email if silent</td></tr>
</tbody>
</table>
<p>The cold-email row matches the two-follow-ups limit in our <a href="/blog/cold-email-freelance-developer">cold email guide</a>. A cold contact never asked to hear from you, so the limit is tighter. Someone who asked for a proposal did, so a few more nudges are fair.</p>

<h2>Four templates</h2>
<p>Send each as a reply in the same thread, so the earlier message is right there. Names, links and numbers are placeholders.</p>

<h3>1. After a proposal: add a decision aid</h3>
<blockquote>
<p><strong>Subject:</strong> Re: Proposal for the booking system rebuild</p>
<p>Hi Jane, I've been thinking about the booking system since we spoke. The part I'd start with is the mobile form, because that's where visitors are dropping off. I wrote up a one-page version of the plan with just that piece, fixed price: [link]. If the full proposal feels big, this could be the first step. Which would you rather decide on?</p>
<p>Sam</p>
</blockquote>
<p>It adds a smaller option and ends with a choice between two answers, both of which are replies.</p>

<h3>2. After a proposal, a week later: add a date</h3>
<blockquote>
<p>Hi Jane, a quick one: I have room to start on the 24th, and after that my next gap is early January. If you'd like to start before the new year, let me know by Friday and I'll hold the slot. If the timing doesn't work, tell me and I'll stop nudging.</p>
<p>Sam</p>
</blockquote>
<p>Only say this if it's true. A fake deadline is easy to spot and costs you trust.</p>

<h3>3. After a cold email: add new information</h3>
<blockquote>
<p>Hi Jane, I checked the booking form again today and it still doesn't confirm on my phone. I recorded a two-minute video of what happens: [link]. Happy to walk through it if useful. Sam</p>
</blockquote>
<p>This is the first follow-up from the cold-email template, with the proof attached instead of offered.</p>

<h3>4. The breakup email</h3>
<blockquote>
<p>Hi Jane, I haven't heard back, so I'm assuming the timing isn't right or you went another way. That's fine. I'll close this on my side and won't write again. If it comes back up, reply to this thread and I'll pick it up. Good luck with the launch.</p>
<p>Sam</p>
</blockquote>
<p>A breakup email is short, polite and final. It makes a decision easy for the reader, because a no takes less effort than an ongoing "maybe". It's also an honest end to the thread, so you can put the lead in a "closed, no reply" list and stop thinking about it. No reply rate is promised here: the value is the clean end, with the door left open.</p>

<h2>What to avoid</h2>
<ul>
<li><strong>"Just checking in" and "bumping this".</strong> Neither gives the reader anything.</li>
<li><strong>Guilt.</strong> "I haven't heard back from you" sounds like a debt collector. State what's new instead.</li>
<li><strong>Daily nudges.</strong> If two working days is too soon for you to read a proposal properly, it's too soon for them.</li>
<li><strong>A fake "Re:" on a new thread.</strong> <a href="https://support.google.com/a/answer/81126" target="_blank" rel="noopener noreferrer">Google's sender guidelines</a> say not to start a subject with Re: or Fwd: unless the message really is a reply or forward. Reply to your own earlier message in the same thread, and it's honest.</li>
<li><strong>Switching channels to dodge silence.</strong> If email got no answer, one message on the platform where you first met is fine. Emailing, DMing, calling and posting a comment in the same week is not.</li>
<li><strong>Ignoring a "no".</strong> A reply that says no, not now or please stop ends the sequence for that person. Reply once with thanks, and put them on a do-not-contact list so nobody emails them by accident later.</li>
</ul>

<h2>The rules that still apply to follow-ups</h2>
<p><em>Checked November 2026 against the official sources linked here and in the cold email guide. A summary, not legal advice: the rules depend on where you and the recipient are.</em></p>
<p>The cold email guide explains these in full. The short version is that a follow-up is another commercial email, so each one has to meet the same rules as the first.</p>
<ul>
<li><strong>United States:</strong> The <a href="https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business" target="_blank" rel="noopener noreferrer">FTC's CAN-SPAM guide</a> says the law covers all commercial messages, "makes no exception for business-to-business email", and requires an accurate subject line, a valid physical postal address and a clear way to opt out. Opt-outs must be honored within 10 business days. Putting that footer on every message in the sequence, not just the first, keeps you inside the rule.</li>
<li><strong>United Kingdom:</strong> The ICO's guidance on <a href="https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/" target="_blank" rel="noopener noreferrer">business-to-business marketing</a> says that emailing individual subscribers, including sole traders and some partnerships, needs their consent, while corporate subscribers, such as limited companies, don't need to consent but must be given a valid opt-out. Put the opt-out line in every follow-up either way.</li>
<li><strong>European Union:</strong> Under <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj" target="_blank" rel="noopener noreferrer">GDPR Article 21</a>, a person can object to direct marketing at any time, after which you must stop. National rules for business email differ by country.</li>
<li><strong>Gmail and Yahoo:</strong> <a href="https://support.google.com/a/answer/81126" target="_blank" rel="noopener noreferrer">Google</a> says to keep the spam rate below 0.3% and warns that recipients who didn't sign up might mark your messages as spam. When you send a few emails, a single spam report counts for a lot, which is another reason to stop after the last follow-up. <a href="https://senders.yahooinc.com/best-practices/" target="_blank" rel="noopener noreferrer">Yahoo's sender guidance</a> covers the same ground.</li>
</ul>
<p>A simple footer that covers this on every message: your name, your business and postal address, one line saying how to stop ("reply 'no' and I won't email you again"), and a link to your privacy notice.</p>

<h2>Keep track of who you followed up with</h2>
<p>Follow-ups fail mostly because nobody remembers them. A spreadsheet with one row per lead is enough:</p>
<table>
<thead>
<tr><th>Column</th><th>Example</th></tr>
</thead>
<tbody>
<tr><td>Lead and company</td><td>Jane, Northside Physio</td></tr>
<tr><td>Source</td><td>Cold email, call, referral</td></tr>
<tr><td>Last message sent, and date</td><td>Proposal, 3 Nov</td></tr>
<tr><td>What it added</td><td>One-page smaller plan</td></tr>
<tr><td>Next follow-up date</td><td>10 Nov</td></tr>
<tr><td>Follow-up count</td><td>1 of 3</td></tr>
<tr><td>Status</td><td>Open, won, lost, no reply, do not contact</td></tr>
</tbody>
</table>
<p>Once a week, sort by next follow-up date and handle everything that's due. Write the new thing you'll add in the sheet before you write the email. If the cell is empty, the lead waits.</p>
<p>ClientPilot has a draft, used and replied status on each generated outreach piece, which is one way to see which messages got answers. A spreadsheet works as well.</p>

<h2>Checklist</h2>
<ul>
<li>Each follow-up adds one new thing.</li>
<li>Cold email: two follow-ups, then stop. Proposal: up to three, then a breakup email.</li>
<li>Sent as a reply in the same thread, with an honest subject line.</li>
<li>Footer with your identity, postal address and a way to opt out on every message.</li>
<li>Every "no" or "stop" goes on a do-not-contact list the same day.</li>
<li>Every lead has a next-follow-up date, or a closed status.</li>
</ul>
`,
  sources: [
    {
      label: 'FTC: CAN-SPAM Act, a compliance guide for business',
      url: 'https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business',
    },
    {
      label: 'ICO: Business-to-business marketing',
      url: 'https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/',
    },
    {
      label: 'EUR-Lex: General Data Protection Regulation (EU) 2016/679 (Article 21)',
      url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
    },
    {
      label: 'Google: Email sender guidelines (Gmail Help)',
      url: 'https://support.google.com/a/answer/81126',
    },
    {
      label: 'Yahoo Sender Hub: Sender Best Practices',
      url: 'https://senders.yahooinc.com/best-practices/',
    },
  ],
}

export default post
