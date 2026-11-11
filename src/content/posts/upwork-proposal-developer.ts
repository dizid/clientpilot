import type { BlogPost } from './types'

// Every Upwork number or rule below comes from Upwork's own pages listed in `sources`.
// Upwork blocks automated readers (HTTP 403), so those pages were read as Internet Archive
// copies; the copy date is in each source label. Advice that is not from Upwork is labelled
// "rule of thumb" or "our advice". No Connects-per-job number is given because Upwork says it
// varies per job and shows it on the job post. Fees are not restated: see the fees post.
const post: BlogPost = {
  slug: 'upwork-proposal-developer',
  title: 'Upwork proposals for developers: Connects and cover letter',
  description:
    'How an Upwork proposal looks to a client, how Connects and boosts work, what to put in the cover letter and screening answers, a short dev example and what not to do.',
  date: '2026-11-13',
  checked: '2026-11-11',
  readingMinutes: 8,
  html: `
<p>On Upwork you pay to apply, the client sees your proposal in a list next to many others, and you get a few seconds of attention. A developer who understands what is shown first, what an application costs and where the rules bite can spend fewer Connects and write better proposals. This guide covers what the client sees, how Connects and boosted proposals work, the cover letter and screening questions, which profile parts matter, a short example for a development job and the mistakes that can cost you your account.</p>
<p><strong>Checked November 2026.</strong> Upwork's help pages block automated readers, so we read the latest Internet Archive copies of Upwork's own pages. The copy date is next to each link in the sources. Upwork changes Connects and boost rules often, so look at the live page before you spend money. For Upwork's fees, see our <a href="/blog/freelance-platform-fees-compared">platform fees comparison</a>; this post doesn't repeat them.</p>

<h2>What the client sees first</h2>
<p>According to <a href="https://www.upwork.com/resources/cover-letter-tips" target="_blank" rel="noopener noreferrer">Upwork's cover letter guide</a>, only the first few sentences of your cover letter appear in the client's results list. Next to them the client sees your name, profile picture, talent badges, hourly rate and Job Success Score. The guide says the start of the letter has to hook the client so that they open your proposal.</p>
<p>So the first two lines do the work of a subject line. Say what you will do about their problem, not "Hello, I am a full-stack developer".</p>
<p>The same guide also says to write a cover letter that is tailored to the job and client, to keep it to 200 to 300 words or fewer, to address the client by name if you can find it, and to end with a next step. A loose template for the structure is fine, but each letter should be written for the specific job.</p>

<h2>How Connects work</h2>
<p>Connects are the tokens you spend to apply. <a href="https://support.upwork.com/hc/en-us/articles/211062898-Understanding-and-using-Connects" target="_blank" rel="noopener noreferrer">Upwork's Connects article</a> says:</p>
<ul>
<li><strong>Price:</strong> Connects cost $0.15 each and are sold in bundles. You need a verified billing method even if you pay from your Upwork earnings.</li>
<li><strong>Per proposal:</strong> the number of Connects a job needs varies per job and can change while the job is posted. Upwork considers things like project size, scope and market demand, and shows the number on the job post. We don't quote a typical number, because Upwork doesn't publish one.</li>
<li><strong>Free monthly Connects:</strong> "some freelancers may receive 10 free Connects each month", and you can check your eligibility in your Connects history. Support can't add them manually. Freelancer Plus, Upwork's paid membership, adds a monthly allowance: Upwork's cover letter guide says 100 Connects per month.</li>
<li><strong>Other free Connects:</strong> 30 for each of the Rising Talent, Top Rated and Top Rated Plus badges (90 at most), and a one-time 10 the first time you successfully boost a proposal.</li>
</ul>
<h3>When you get Connects back</h3>
<p>Upwork says Connects are refunded if the client cancels the project before a contract is made (this does not apply to expired posts), or if Upwork removes the job post for violating its Terms of Service. Refunded Connects go back to your balance for reuse, not as cash.</p>
<p>They are <em>not</em> refunded when the client rejects your proposal, picks another freelancer, lets the job expire without a hire, or when you withdraw your proposal. That means every application is a small bet. Upwork's own advice before you spend: check that the job matches your skills and availability, read the client's history and feedback, check whether they have hired anyone yet, and look at activity on the post, because many proposals or ongoing interviews may reduce your chances.</p>
<p><strong>Rule of thumb (ours):</strong> skip jobs where the post is vague about the goal and the budget, where the client has a poor history, or where interviews have already started. Spend your Connects on jobs you could describe the solution to.</p>

<h2>Boosted proposals</h2>
<p>A boost is an optional bid of extra Connects to put your proposal at the top of the client's list. <a href="https://support.upwork.com/hc/en-us/articles/4406395531795-Boost-your-proposal" target="_blank" rel="noopener noreferrer">Upwork's boost article</a> describes it like this:</p>
<ul>
<li>It is optional, and the client gets your proposal either way. Whether you are eligible to boost depends on how strong a match Upwork thinks you are for the job and the client's requirements.</li>
<li>If you can boost, you bid any amount of Connects on top of the required Connects. A table shows what others are bidding.</li>
<li>The highest bidders get one of the top four slots with a "Boosted" icon. The boost lasts until the client interacts with your proposal, opens it three times without further action, sees it five times without interaction, or you are outbid.</li>
<li>The auction closes after seven days or at the first hire, whichever comes first.</li>
<li>You are charged the base Connects immediately. The boost bid is charged at the end of the auction only if you are in the top four, or if the client interacts with your proposal while it is boosted (opens, shortlists, messages, archives or declines it, or sends an offer). If you are knocked out before any of that, you aren't charged the bid.</li>
<li>Refunds apply only to the extra boost Connects, never to the standard Connects used to submit the proposal.</li>
</ul>
<p><strong>Rule of thumb (ours):</strong> don't boost until you have sent several proposals without boosting and know what answers they get. A boost makes a good proposal more visible. It does nothing for a weak one.</p>

<h2>The cover letter and the screening questions</h2>
<p>A cover letter on Upwork is a short pitch, not a profile. A structure that follows Upwork's guide and works for developers:</p>
<ol>
<li><strong>The first two lines: their problem, and that you can solve it.</strong> Restate the core of the job post in your own words. If the post says the checkout fails on iPhones, say that.</li>
<li><strong>One relevant example of your work,</strong> with a link. Similar beats impressive. A short sentence on what you built and what changed for the client is enough.</li>
<li><strong>One or two sentences on how you would start,</strong> or a specific question that shows you read the post.</li>
<li><strong>A next step:</strong> an invitation to talk or a question they can answer in one line.</li>
</ol>
<p>Many job posts add screening questions. A guest article hosted on Upwork's resource centre, written by a freelancer (Upwork says it doesn't necessarily reflect Upwork's views), claims that the answers to these questions are the first thing a client sees when the proposal opens, so you should answer them first and well (<a href="https://www.upwork.com/resources/write-proposals-freelancer-advice" target="_blank" rel="noopener noreferrer">Advice From Freelancers</a>). We can't confirm that order from Upwork's own documentation, but the safe approach doesn't depend on it: treat the answers as part of the pitch, be specific, and don't paste the same lines everywhere. The same author says a question about which part of the project will be hardest is a chance to offer a concrete idea.</p>

<h2>Profile parts that matter</h2>
<p>What Upwork says the client sees next to your proposal is a short list: name, picture, talent badges, hourly rate and Job Success Score. Of these, you can control your picture and rate directly. Your badges and score come from work you complete.</p>
<ul>
<li><strong>Job Success Score.</strong> <a href="https://support.upwork.com/hc/en-us/articles/38437362753171-What-is-a-Job-Success-Score" target="_blank" rel="noopener noreferrer">Upwork's help page</a> says it reflects client satisfaction, contract outcomes and long-term relationships, and is updated daily over 6, 12 and 24 months of contracts. A score of 90% or above signals strong performance and is needed, for an extended period, for the Top Rated badges. Below 79% can make it harder to win projects. It appears in search results and on your profile once you have earned one, so a new developer doesn't have one yet; Upwork says the Rising Talent badge may apply before the first score.</li>
<li><strong>Hourly rate.</strong> It sits next to your proposal. It must fit the kind of jobs you are bidding on. For how to set it, see <a href="/blog/freelance-developer-rates">our rate guide</a>.</li>
<li><strong>Your title, overview and portfolio.</strong> Upwork's pages we read don't say how much weight clients give them, so this is our advice: write the title and overview for one kind of client and job (for example "Vue developer for booking and checkout flows"), and put two or three projects with live links where the client can see them. A proposal that links to a similar finished job saves the client a step.</li>
</ul>

<h2>A short example for a development job</h2>
<p>Imagine a job post that says: "Our Vue shop's checkout form loses customers on mobile. We need someone to find out why and fix it. Budget around a fixed price, start next week." This is invented for illustration, so don't copy it word for word. A proposal that follows the structure above:</p>
<blockquote>
<p>Hi Sam, your checkout form losing people on phones is usually one of three things: the keyboard covering the pay button, validation that fires too early, or a slow payment script. I'd check those first.</p>
<p>I fixed a similar problem on a Vue shop last year (link: [project, one line on what changed]). Here is how I would start: record a few real checkouts on an iPhone and an Android phone, list what breaks, send you a short priced plan within two days, and only then start on the fix.</p>
<p>One question: do you see the drop-off in your analytics at a particular step, or is this from customer reports? Happy to do a 15-minute call this week, or answer here.</p>
<p>[Your name]</p>
</blockquote>
<p>That is about 120 words. It names the problem in the first line, shows a related example, says what happens first and ends on a question the client can answer in one line. For a longer paid project with price options, see our <a href="/blog/freelance-project-proposal-template">project proposal template</a>.</p>

<h2>What not to do: moving off Upwork too early</h2>
<p>Upwork is strict about this, and the penalty is large. <a href="https://support.upwork.com/hc/en-us/articles/360052511833-On-platform-Interviews" target="_blank" rel="noopener noreferrer">Upwork's article on on-platform interviews</a> says that communicating with users outside Upwork before starting a contract is against its Terms of Service, that you have agreed to keep discussions on Upwork before a contract starts (project goals, costs, deadlines, negotiating the contract and payments), and that Upwork Messages and video calls exist so people can talk without giving out contact details. Enterprise clients get "a little more leeway". That copy dates from 2022, so check the live version.</p>
<p><a href="https://support.upwork.com/hc/en-us/articles/360048105134-Why-Can-t-I-Get-Paid-Directly" target="_blank" rel="noopener noreferrer">Upwork's "Why can't I get paid directly?" page</a> defines circumvention as a client and freelancer who meet on Upwork and then conduct the relationship outside it by sending payment another way without paying the Conversion Fee. It calls this a serious violation of the Terms of Service (Section 7 of the User Agreement), says it enforces a zero-tolerance policy, and says that violating it "will result in loss of the ability to use Upwork (account suspension)" and that violators can also be charged the Conversion Fee.</p>
<p>There is a legal route: the client starts a contract conversion in their Upwork account and the Conversion Fee is paid. Upwork says the fee is 13.5% of estimated earnings over 12 months for that client and freelancer, with a discount based on marketplace fees paid and the length of the relationship, and shows the exact amount when the conversion starts. A relationship that began outside Upwork and was brought onto it isn't treated as circumvention. That copy is from August 2025, so check the live page.</p>
<p>Practical advice (ours): keep the whole pre-contract conversation in Upwork Messages, don't put your email, phone or website in your cover letter to start a chat elsewhere, and if you want a client who is your own, find them somewhere else. Our <a href="/blog/cold-email-freelance-developer">cold email guide</a> and <a href="/blog/linkedin-outreach-freelance-developer">LinkedIn guide</a> cover that, and our <a href="/blog/freelance-follow-up-email">follow-up guide</a> covers messages outside the platform.</p>

<h2>A simple routine</h2>
<ol>
<li>Pick jobs that match a kind of project you have done before, and write down the client's problem in one sentence.</li>
<li>Answer the screening questions first, then write the cover letter in under 250 words.</li>
<li>Send it early on a job with few proposals, and don't boost until you know your baseline.</li>
<li>Track Connects spent, proposals sent, replies and interviews in one sheet for a month. If replies are rare, change the letter before you buy more Connects.</li>
</ol>
<p>If you want a draft of the outreach and profile side of this, ClientPilot's outreach templates include a reply to a freelance platform inquiry and it can write a platform profile from your own profile. You still need to write each Upwork cover letter for the job in front of you.</p>
`,
  sources: [
    {
      label: 'Upwork Help: Understanding and using Connects (read via Internet Archive copy, 10 Oct 2026)',
      url: 'https://support.upwork.com/hc/en-us/articles/211062898-Understanding-and-using-Connects',
    },
    {
      label: 'Upwork Help: How to boost your proposal (read via Internet Archive copy, 24 Oct 2025)',
      url: 'https://support.upwork.com/hc/en-us/articles/4406395531795-Boost-your-proposal',
    },
    {
      label: 'Upwork: cover letter guide, what the client sees, 200 to 300 words, Freelancer Plus Connects (read via Internet Archive copy, 30 Oct 2025)',
      url: 'https://www.upwork.com/resources/cover-letter-tips',
    },
    {
      label:
        'Upwork resources: How to Write Proposals on Upwork, advice from a guest freelancer, not Upwork itself (read via Internet Archive copy, 16 Aug 2025)',
      url: 'https://www.upwork.com/resources/write-proposals-freelancer-advice',
    },
    {
      label: 'Upwork Help: What is a Job Success Score? (read via Internet Archive copy, 7 Apr 2026)',
      url: 'https://support.upwork.com/hc/en-us/articles/38437362753171-What-is-a-Job-Success-Score',
    },
    {
      label: 'Upwork Help: On-platform interviews (read via Internet Archive copy, 29 Nov 2022)',
      url: 'https://support.upwork.com/hc/en-us/articles/360052511833-On-platform-Interviews',
    },
    {
      label: "Upwork Help: Why can't I get paid directly? Circumvention and the Conversion Fee (read via Internet Archive copy, 3 Aug 2025)",
      url: 'https://support.upwork.com/hc/en-us/articles/360048105134-Why-Can-t-I-Get-Paid-Directly',
    },
  ],
}
export default post
