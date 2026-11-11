import type { BlogPost } from './types'

// Facts checked 2026-11-11 against the LinkedIn pages listed in `sources`.
// LinkedIn's own Help pages disagree on the free-account note allowance (three vs five a month),
// so the post names both figures and tells the reader to check the screen in their own account.
const post: BlogPost = {
  slug: 'linkedin-outreach-freelance-developer',
  title: 'LinkedIn outreach for freelance developers: a 3-step plan',
  description:
    'How a freelance developer can find clients on LinkedIn without spam: profile basics, the connection note, InMail, invitation limits, three messages to adapt.',
  date: '2026-11-12',
  checked: '2026-11-11',
  readingMinutes: 8,
  html: `
<p>LinkedIn is a good place to reach the people who hire freelance developers: founders, marketing leads, product managers and agency owners. It's also a place where an obvious pitch gets ignored or reported. This guide covers what to fix on your profile first, which way of contacting someone to use, what LinkedIn says about limits and automation, and a three-message sequence you can adapt.</p>
<p>Every rule below comes from LinkedIn's own Help Center, User Agreement or Professional Community Policies, linked where it's used. LinkedIn doesn't publish a weekly invitation number, so this post doesn't give one either.</p>

<h2>Fix your profile before you message anyone</h2>
<p>Everyone you contact will open your profile before they answer. If it says "Software Engineer at Self-employed" and nothing else, a good message won't save you. Four things matter most, and none of them takes long:</p>
<ul>
<li><strong>Headline:</strong> say what you do and for whom, for example "Freelance Vue developer for SaaS and e-commerce teams". Not "Open to opportunities".</li>
<li><strong>About section:</strong> three or four sentences on the problems you fix, the kind of client you work with, and how someone starts a project with you.</li>
<li><strong>Featured section:</strong> one or two case studies or live projects, each with a result in plain words ("checkout load time cut from 6 to 2 seconds", if that's true).</li>
<li><strong>Photo and name:</strong> a clear photo and your real name. LinkedIn's <a href="https://www.linkedin.com/help/linkedin/answer/a1340522" target="_blank" rel="noopener noreferrer">account restrictions page</a> says its Professional Community Policies require members to use their true identity.</li>
</ul>
<p>Also check that your recent activity doesn't contradict your headline. A feed full of job-hunting reposts tells a prospective client you're hunting for a job, not running a business.</p>

<h2>Three ways to reach someone, and when to use each</h2>
<table>
<thead>
<tr><th>Method</th><th>Who you can reach</th><th>What LinkedIn says</th></tr>
</thead>
<tbody>
<tr><td>Connection request, with or without a note</td><td>Almost anyone who accepts requests</td><td>Free accounts can add a note to only a few requests a month. Notes are limited to 200 characters. Premium members can send unlimited personalized invitations</td></tr>
<tr><td>Message after they accept</td><td>1st-degree connections</td><td>Once connected, you can message each other</td></tr>
<tr><td>InMail</td><td>Members you aren't connected to</td><td>A Premium feature. Up to 200 characters in the subject and 2,000 in the body. You can't InMail someone who has turned it off. Open Profile members can be messaged for free</td></tr>
</tbody>
</table>

<h3>The connection note</h3>
<p>LinkedIn's page on <a href="https://www.linkedin.com/help/linkedin/answer/a563153" target="_blank" rel="noopener noreferrer">personalizing invitations</a> says each note can be up to 200 characters, and that a free account can add a note to up to three requests a month. Its page on <a href="https://www.linkedin.com/help/linkedin/answer/a6239760" target="_blank" rel="noopener noreferrer">InMail and personalized invitations</a> and its page on <a href="https://www.linkedin.com/help/linkedin/answer/a550555" target="_blank" rel="noopener noreferrer">invitation limits</a> both say five a month for free accounts. The pages disagree, so treat the allowance as a handful per month and check what your own account shows. Premium members get unlimited personalized invitations on all of these pages.</p>
<p>Two things follow. First, a free account can't put a note on every request, so save the notes for people worth a note: a short list of prospects you researched. Second, 200 characters is about two sentences, so there's room for who you are and why this person, and nothing else.</p>
<p>LinkedIn's own advice on what a note should contain is short: how you found the person or what you have in common, why you want to connect now, and a polite tone.</p>

<h3>A request with no note is fine</h3>
<p>A request without a note is a normal request. If you only have a few notes a month, send the rest blank and put your first real message in after they accept. One thing to watch: when you send a request and choose "We don't know each other", <a href="https://www.linkedin.com/help/linkedin/answer/a541669" target="_blank" rel="noopener noreferrer">LinkedIn says</a> you may be prompted to send a message first.</p>

<h3>InMail</h3>
<p>InMail is a Premium feature: per <a href="https://www.linkedin.com/help/linkedin/answer/a546814" target="_blank" rel="noopener noreferrer">LinkedIn's InMail page</a>, a free account can't use it. Credits are limited per month and <a href="https://www.linkedin.com/help/linkedin/answer/a543695" target="_blank" rel="noopener noreferrer">can't be bought extra</a>. LinkedIn also says you can't send a second InMail to someone until they've replied to the first, and that a credit comes back if the recipient responds, accepts or declines within 90 days. So an InMail is one shot: write it like a first email, not a nudge. It makes sense for a person who matters to you and whose connection requests you expect to be ignored, such as a head of engineering at a company you really want to work with.</p>
<p>If a Premium member has Open Profile switched on, you can message them without using a credit (<a href="https://www.linkedin.com/help/linkedin/answer/a544787" target="_blank" rel="noopener noreferrer">LinkedIn</a>). LinkedIn limits how many of these you can send in a given period and doesn't say how many.</p>

<h2>Limits and restrictions</h2>
<p>LinkedIn says all members, free and Premium, are subject to invitation limits, and its <a href="https://www.linkedin.com/help/linkedin/answer/a550555" target="_blank" rel="noopener noreferrer">invitation limit page</a> gives no weekly figure. What it does publish is why accounts get restricted. According to its page on <a href="https://www.linkedin.com/help/linkedin/answer/a551012" target="_blank" rel="noopener noreferrer">types of restrictions for sending invitations</a>, an account can be temporarily restricted when:</p>
<ul>
<li>you've sent many invitations within a short amount of time;</li>
<li>many of your invitations have been ignored, left pending, or marked as spam;</li>
<li>you send an excessive number and LinkedIn suspects an automation tool, in which case it may suspend or restrict the account.</li>
</ul>
<p>What happens next: most restrictions are removed automatically within one week. Withdrawing pending invitations doesn't lift a restriction, you can't buy more invitations, and LinkedIn can't shorten the wait or tell you the reason. If you withdraw an invitation, you can't resend one to the same person for up to three weeks. Repeated suspensions may result in permanent restriction.</p>
<p>The practical lesson is that your acceptance rate matters as much as your volume. Ten well-chosen requests that get accepted do you more good than a hundred that sit pending. Send a small batch, only to people who have a reason to care about what you do, and spread it over the week.</p>

<h2>A three-message sequence</h2>
<p>Pick one person: someone who plausibly buys what you do, and about whom you can say one true specific thing. Examples below are for a freelance developer writing to a founder. Replace the details.</p>

<h3>Touch 1: the connection request (under 200 characters)</h3>
<blockquote>
<p>Hi Anna, I read your post on moving Brightline's checkout to Stripe. I build and fix web apps for small SaaS teams. Would be good to be connected.</p>
</blockquote>
<p>That's about 150 characters. It says who you are, why this person, and asks for nothing. No link, no pitch, no "I can help you grow".</p>

<h3>Touch 2: after they accept (a few days later is fine)</h3>
<blockquote>
<p>Thanks for connecting, Anna. I noticed Brightline's pricing page takes about five seconds to load on my phone. If that's slowing sign-ups, I've fixed the same thing for a similar product: [link to case study]. Do you want me to send you what I found? No obligation.</p>
</blockquote>
<p>One observation they can check themselves, one proof link, one yes-or-no question. Don't send this on the day they accept: let the connection settle, or it reads like a scripted sequence.</p>

<h3>Touch 3: one follow-up, a week later</h3>
<blockquote>
<p>Hi Anna, I put my notes on the pricing page into a short list: three changes, none needing a redesign. Happy to send it over if useful. If the timing's wrong, no problem, and I'll leave you to it.</p>
</blockquote>
<p>It adds something new, offers a concrete thing, and gives them an easy way to say no. After that, stop. If they reply "not now", note a date to check in months later and move on.</p>

<h3>If they answer</h3>
<p>Answer within a day, in the same thread, with the thing you offered. Then move to a call or an email so the conversation isn't stuck in LinkedIn's inbox. LinkedIn's <a href="https://www.linkedin.com/help/linkedin/answer/a563153" target="_blank" rel="noopener noreferrer">help page</a> notes that a recipient can reply to a note without accepting the invitation, so a reply doesn't always mean you're connected.</p>

<h2>What to avoid</h2>
<ul>
<li><strong>Pitching in the note.</strong> LinkedIn's <a href="https://www.linkedin.com/legal/professional-community-policies" target="_blank" rel="noopener noreferrer">Professional Community Policies</a> say: "Do not use our invitation feature to send promotional messages to people you don't know or to otherwise spam people." The policies also rule out untargeted, irrelevant or gratuitously repetitive messages. Keep the note about the connection and save the offer for after.</li>
<li><strong>Automation tools.</strong> LinkedIn's page on <a href="https://www.linkedin.com/help/linkedin/answer/a1341387" target="_blank" rel="noopener noreferrer">prohibited software and extensions</a> says it doesn't permit third-party software, including bots and browser extensions, that automates activity on LinkedIn. It cites Section 8.2 of the <a href="https://www.linkedin.com/legal/user-agreement" target="_blank" rel="noopener noreferrer">User Agreement</a>, which prohibits using bots or other unauthorized automated methods to "send or redirect messages" and to add contacts. Members who use such tools risk having their accounts restricted or shut down, and the tools may stop working without notice. Your profile is your business card as a freelancer. It's not worth risking it to save an hour a week.</li>
<li><strong>The same text to everyone.</strong> If you can swap the name and send it to a hundred people, it's a template, and LinkedIn's spam policy targets exactly that kind of message.</li>
<li><strong>Long chains of follow-ups.</strong> Three touches, then stop.</li>
<li><strong>Connecting with people you have no reason to contact.</strong> LinkedIn recommends in several places that you only send invitations to people you know and trust. For a freelancer that means people connected to your work: possible clients, referrers and peers.</li>
</ul>
<p>Not all of this needs to be manual from scratch. Writing the first draft of each note and message from your own profile is the part a tool like ClientPilot can do, as long as you check the text, add the real detail about the person, and send it yourself.</p>

<h2>A weekly routine that fits around client work</h2>
<ol>
<li>Pick ten prospects you can say something true about.</li>
<li>Send the requests, with a note for the best few.</li>
<li>Message new connections the same week with touch 2.</li>
<li>Send touch 3 to anyone who hasn't replied after a week.</li>
<li>Write down who you contacted, when, and what happened. A simple spreadsheet is enough.</li>
</ol>
<p>If after a month the acceptance rate is low, the problem is more likely your targeting or your profile than your note.</p>
`,
  sources: [
    {
      label: 'LinkedIn Help: Personalize invitations to connect',
      url: 'https://www.linkedin.com/help/linkedin/answer/a563153',
    },
    {
      label: 'LinkedIn Help: Differences between InMail Messages and personalized invitations',
      url: 'https://www.linkedin.com/help/linkedin/answer/a6239760',
    },
    {
      label: 'LinkedIn Help: Invitation limit reached',
      url: 'https://www.linkedin.com/help/linkedin/answer/a550555',
    },
    {
      label: 'LinkedIn Help: Types of restrictions for sending invitations',
      url: 'https://www.linkedin.com/help/linkedin/answer/a551012',
    },
    {
      label: 'LinkedIn Help: Various ways to connect with people on LinkedIn',
      url: 'https://www.linkedin.com/help/linkedin/answer/a541669',
    },
    {
      label: 'LinkedIn Help: Send an InMail Message',
      url: 'https://www.linkedin.com/help/linkedin/answer/a546814',
    },
    {
      label: 'LinkedIn Help: InMail message credits and renewal process',
      url: 'https://www.linkedin.com/help/linkedin/answer/a543695',
    },
    {
      label: 'LinkedIn Help: Send an Open Profile message on LinkedIn',
      url: 'https://www.linkedin.com/help/linkedin/answer/a544787',
    },
    {
      label: 'LinkedIn Help: Account restrictions',
      url: 'https://www.linkedin.com/help/linkedin/answer/a1340522',
    },
    {
      label: 'LinkedIn Help: Prohibited software and extensions',
      url: 'https://www.linkedin.com/help/linkedin/answer/a1341387',
    },
    {
      label: 'LinkedIn: Professional Community Policies',
      url: 'https://www.linkedin.com/legal/professional-community-policies',
    },
    {
      label: 'LinkedIn: User Agreement (Section 8.2)',
      url: 'https://www.linkedin.com/legal/user-agreement',
    },
  ],
}

export default post
