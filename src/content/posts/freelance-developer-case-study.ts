import type { BlogPost } from './types'

// Writing advice is practice, labelled as rule of thumb where it matters; the worked example
// is invented and says so. Platform facts come only from the official pages in `sources`,
// read on 2026-11-11: Google Search Central, DEV Help and editor guide, LinkedIn Help.
// Upwork's help pages block automated readers (HTTP 403), so those were read as Internet
// Archive copies; the copy date is in each source label. No legal claims about NDAs.
const post: BlogPost = {
  slug: 'freelance-developer-case-study',
  title: 'Freelance developer case study: a structure that wins clients',
  description:
    "How to write a developer case study that wins clients: what buyers look for, a template, NDA-safe results, the client's OK, and cross-posting to Dev.to.",
  date: '2026-11-14',
  checked: '2026-11-11',
  readingMinutes: 8,
  html: `
<p>A case study is the proof you link from a proposal, a cold email or your profile. It answers one question for a buyer: has this developer solved a problem like mine, and can I believe it? Many developer case studies answer a different question, "what did I build and with which tools", and leave the buyer to work out the rest. This guide covers what to include, a structure with a made-up example, results under an NDA, getting the client's OK, and where to publish.</p>
<p><em>A note on what this is.</em> There is no official standard for case studies, so the writing advice is practice, labelled as a rule of thumb where it matters. Platform facts come from each platform's own help pages, linked where used and checked in November 2026. Nothing here is legal advice.</p>

<h2>What a buyer needs to see</h2>
<ol>
<li><strong>The problem, in business terms.</strong> "Orders from phones were failing at the payment step" is a problem. "Needed a React refactor" is a task.</li>
<li><strong>The constraints.</strong> The deadline, the budget, the old system that had to stay, who you worked with. Constraints make the job look like the buyer's own situation, and they show judgement.</li>
<li><strong>What you did, and why.</strong> Three to five decisions, each with its reason. "Kept the WordPress site and added the booking form as a small separate app, so staff could keep editing pages the way they knew" says more than a list of frameworks.</li>
<li><strong>The result.</strong> What changed, over what period, and how you know. Measured is best, observed is fine, invented is never fine.</li>
<li><strong>Proof.</strong> Something the buyer can check: a live link, screenshots, a quote with the client's name and role, a linked contract on a platform, a public repo.</li>
</ol>
<p>Your tech stack belongs in it too, as one line near the end. Buyers who aren't developers skip it; developers who hire you will find it there.</p>

<h2>A structure you can reuse</h2>
<p><strong>Rule of thumb:</strong> 400 to 800 words, with the result visible on the first screen. Someone who reads only the title and summary should know who you helped, with what, and what changed.</p>
<blockquote>
<p><strong>Title:</strong> [the result] for [type of client].</p>
<p><strong>Summary, two sentences:</strong> [Client or client type] had [problem]. I [what you did], and [result, with a time frame].</p>
<p><strong>The problem:</strong> [Who they are, what was going wrong, what it cost them.]</p>
<p><strong>Constraints:</strong> [Deadline, budget, systems that had to stay, who you worked with.]</p>
<p><strong>What I did:</strong> [Three to five decisions, each with one sentence on why.]</p>
<p><strong>The result:</strong> [What changed, over what period, and how you measured it.]</p>
<p><strong>What the client said:</strong> ["Quote", name, role, company. Only with their written OK.]</p>
<p><strong>Stack and next step:</strong> [One line each.]</p>
</blockquote>

<h2>A short example (made up)</h2>
<p><em>Everything in this example is invented to show the shape: the client, the numbers and the quote.</em></p>
<blockquote>
<p><strong>Online booking for a bike repair shop with three locations</strong></p>
<p>A bike repair shop with three locations took every booking by phone. I added an online booking form to their existing website in four weeks, and in the first two months about half of all bookings came in through it.</p>
<p><strong>The problem.</strong> Staff answered the phone mid-repair, missed calls at busy times and kept bookings in three paper diaries. Customers who couldn't get through went elsewhere.</p>
<p><strong>Constraints.</strong> Four weeks before the spring rush. The WordPress site had to stay. No time for staff training.</p>
<p><strong>What I did.</strong> Built the form as a small app embedded in the existing site, so nothing else had to change. Showed each shop's free slots from its own opening hours. Sent a confirmation to the customer and a copy to the shop. Replaced the diaries with one shared calendar per shop, which staff tested for a week before launch.</p>
<p><strong>The result.</strong> In the first two months, 52% of bookings came in online, counted from the booking system against the shop's own tally of phone bookings.</p>
<p><strong>What the client said.</strong> "We stopped losing Saturday customers to voicemail." [Name], owner, [shop name].</p>
<p><strong>Stack.</strong> Vue, a small Node API and PostgreSQL, embedded in WordPress.</p>
</blockquote>
<p>Notice what it doesn't say: "increased revenue". A developer can't know that from a booking count, so the result sticks to what was measured and who measured it.</p>

<h2>Results when you can't share numbers or the name</h2>
<p><strong>Start with your contract.</strong> If you signed an NDA or a contract with a confidentiality clause, its wording decides what you may share. If it's unclear, ask the client, and for anything serious ask a lawyer in your country. Then pick the most specific option you're allowed:</p>
<ul>
<li><strong>Describe the client instead of naming them.</strong> "A logistics company with around 200 staff in the Netherlands" gives size and sector. If only one company fits the description, it isn't anonymous.</li>
<li><strong>Use relative results.</strong> "Page load time roughly halved" or "from a weekly manual export to an automatic daily one", instead of absolute figures. Ask whether even that is OK.</li>
<li><strong>Measure your own work, not their business.</strong> Steps removed from a process, manual work replaced, how often they can release, errors that stopped. These are often less sensitive than revenue, and easier to back up.</li>
<li><strong>Show the work without the data.</strong> Screenshots with fake or blurred data, an architecture diagram without names, or a small demo you rebuilt yourself. Never show real customer data, and don't publish the client's code without their written OK.</li>
<li><strong>Say what you can't say.</strong> "Figures are confidential; the client approved this description" is honest, and buyers who sign NDAs themselves will understand.</li>
</ul>
<p>Whatever you choose: give a time frame, say how you know ("from their analytics"), and name other causes, such as a marketing campaign that started the same week. Never round up and never invent. A buyer who catches one inflated claim will doubt the rest.</p>

<h2>Getting the client's OK and a quote</h2>
<p><strong>Ask at the end of the project,</strong> when the result is fresh, and ask in writing. Better still, raise it at the start: some freelancers add a line to their agreement asking permission to show the work in their portfolio. If you do, have a lawyer check the wording once. Our <a href="/blog/freelance-project-proposal-template">proposal template</a> covers the proposal itself.</p>
<p>Ask about each part separately (name, logo, screenshots, numbers, quote), because a client may agree to some and not others. For the made-up example above:</p>
<blockquote>
<p>Hi [name], now that the booking form is live I'd like to write a short case study for my website. Draft attached. Which of these are you OK with: your company name, your logo, the screenshots, the 52% figure? If you'd rather stay anonymous, I'll write "a bike repair shop with three locations".</p>
<p>If you're happy to give a one- or two-sentence quote: what was it like before, and what's different now? I'll use your words and send you the final version before it goes live.</p>
</blockquote>
<p>Use the quote as they wrote it. If they ask you to draft one, send it as a suggestion and use only the version they approve. A quote with a real name and role is stronger than an anonymous one, because a buyer could check it.</p>
<p>Upwork has a built-in version of this: when you link a past Upwork contract to a portfolio item, Upwork notifies that client so they can review it, and the item is added once the client approves it or after three days pass (<a href="https://support.upwork.com/hc/en-us/articles/360016144974-How-to-enhance-your-freelancer-profile" target="_blank" rel="noopener noreferrer">Upwork's profile help page</a>).</p>

<h2>Where to publish it</h2>
<h3>1. Your own site first</h3>
<p>Put the full case study on a page you own. It doesn't disappear when a platform changes its rules, and it's the one link you can put in every proposal, <a href="/blog/cold-email-freelance-developer">cold email</a> and <a href="/blog/freelance-follow-up-email">follow-up</a>. It's also the version you want search engines to treat as the original.</p>
<p>Google's <a href="https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls" target="_blank" rel="noopener noreferrer">guide to canonical URLs</a> calls a <code>rel="canonical"</code> link annotation "a strong signal that the specified URL should become canonical". It recommends a canonical link on the canonical page itself, pointing to its own URL, and absolute URLs rather than relative paths. If you use a CMS, Google says it may offer a settings page for this. Check your page source for a <code>&lt;link rel="canonical"&gt;</code> line.</p>

<h3>2. Then cross-post to Dev.to with a canonical URL</h3>
<p>Dev.to readers are developers, so the version there works best as a technical write-up: the problem, the decision that mattered, what you learned, and a link to the full case study. DEV's <a href="https://dev.to/help/writing-editing-scheduling" target="_blank" rel="noopener noreferrer">help page on cross-posting</a> says you can cross-post from your own blog "as long as you have the rights you need to do so", one more reason to have the client's OK first. It gives three ways to point back to your original:</p>
<ul>
<li><strong>Rich + Markdown editor:</strong> click the gear icon next to "Save draft" and enter your original URL in the Canonical URL field.</li>
<li><strong>Basic Markdown editor:</strong> add a <code>canonical_url:</code> line to the front matter. DEV's <a href="https://dev.to/p/editor_guide" target="_blank" rel="noopener noreferrer">editor guide</a> calls it the "link for the canonical version of the content" and allows up to four tags per post.</li>
<li><strong>RSS import:</strong> under Settings, Extensions, enter your blog's feed and tick the option to mark the RSS source as the canonical URL, then edit and publish the imported drafts.</li>
</ul>
<p>DEV says a canonical URL helps search engines understand which version is the original. Google is more careful: a canonical preference "is a hint, not a rule", and Google may choose a different page (<a href="https://developers.google.com/search/docs/crawling-indexing/canonicalization" target="_blank" rel="noopener noreferrer">Google on canonicalization</a>). Its <a href="https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting" target="_blank" rel="noopener noreferrer">troubleshooting page</a> adds that the canonical link element is not recommended for avoiding duplication by syndication partners, because the pages are often very different, and that the most effective solution is for partners to block indexing of your content. <strong>Rule of thumb (ours):</strong> publish on your own site first, set the canonical URL on DEV, and accept that Google makes the final call.</p>
<p>If a tool helped you write, DEV's <a href="https://dev.to/guidelines-for-ai-assisted-articles-on-dev" target="_blank" rel="noopener noreferrer">guidelines for AI-assisted articles</a> apply: disclose the AI help (with the #ABotWroteThis tag or anywhere in the text) and check the facts before publishing. The same guidelines say AI-assisted articles should not promote any business "(including your own)" or be published mainly to build a personal brand. So keep the DEV version about the technical lesson and leave the pitch to your own site.</p>

<h3>3. Your Upwork portfolio</h3>
<p>Upwork blocks automated readers, so we read Internet Archive copies of its help pages (dates in the sources). Its <a href="https://support.upwork.com/hc/en-us/articles/360016144974-How-to-enhance-your-freelancer-profile" target="_blank" rel="noopener noreferrer">page on enhancing your profile</a> says a portfolio item has a title of up to 70 characters, your role (up to 100), a project description (up to 600) and up to five skill tags, plus images, video, audio, documents or links to external sites. Drafts aren't visible to clients until you publish. Six hundred characters is only a few sentences, so use your summary.</p>
<p>The same page says contact details aren't allowed in your portfolio: the files and linked sites can't include your email address, phone number or any other contact information. If you link the case study on your own site, check that page first, or upload screenshots instead. Upwork's <a href="https://support.upwork.com/hc/en-us/articles/39295510081811-How-can-I-share-my-portfolio-project" target="_blank" rel="noopener noreferrer">page on sharing portfolio projects</a> says you can attach items to proposals with the profile highlights feature (not available to agencies) or use the Share link on a published project. See also our <a href="/blog/upwork-proposal-developer">Upwork proposal guide</a>.</p>

<h3>4. LinkedIn: Featured and Projects</h3>
<p>LinkedIn's <a href="https://www.linkedin.com/help/linkedin/answer/a550399" target="_blank" rel="noopener noreferrer">help page on featured samples</a> says the Featured section can show your posts, your LinkedIn articles, links to external sites such as your personal blog or portfolio, and uploaded media. You add it from your profile: Add profile section, then Recommended, then Add featured. You can edit a featured item's title and description, so put the result in the title.</p>
<p>LinkedIn's <a href="https://www.linkedin.com/help/linkedin/answer/a552452" target="_blank" rel="noopener noreferrer">Featured section FAQ</a> adds two limits: viewers must be logged in to LinkedIn to see Featured items, and that content is not discoverable through search. Another reason the full case study should live on your own site.</p>
<p>Projects is a separate section, listed under Recommended on LinkedIn's <a href="https://www.linkedin.com/help/linkedin/answer/a540837" target="_blank" rel="noopener noreferrer">page on adding profile sections</a>. The same page says the Project URL field isn't available for newly added projects; to add a link, use Add media, then Add a link. For the rest of your profile, see our <a href="/blog/linkedin-outreach-freelance-developer">LinkedIn outreach guide</a>.</p>

<h2>Before you publish</h2>
<ol>
<li>Read only the title and summary. Do they say who, what and what changed?</li>
<li>Check every number and claim against your notes or the client's data.</li>
<li>Check that the client approved, in writing, every part that names or shows them, and that no screenshot shows real customer data.</li>
<li>Publish on your own site, then Dev.to with the canonical URL, then your Upwork portfolio and LinkedIn Featured section.</li>
<li>Link it from your next proposal.</li>
</ol>
<p>ClientPilot can draft two pieces of this from your profile: a Dev.to case-study article and portfolio page copy with a case studies section. Treat both as a first draft: check every claim against your own notes, remove anything the client hasn't approved, and follow DEV's disclosure rule if you post the article there.</p>
`,
  sources: [
    {
      label: 'Google Search Central: How to specify a canonical URL with rel="canonical" and other methods (page last updated 10 Jul 2026)',
      url: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls',
    },
    {
      label: 'Google Search Central: What is URL canonicalization, "a hint, not a rule" (page last updated 20 Aug 2026)',
      url: 'https://developers.google.com/search/docs/crawling-indexing/canonicalization',
    },
    {
      label: 'Google Search Central: Fix canonicalization issues, syndicated content (page last updated 21 Aug 2026)',
      url: 'https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting',
    },
    {
      label: 'DEV Help: Writing, Editing and Scheduling (cross-posting, canonical URL, RSS import)',
      url: 'https://dev.to/help/writing-editing-scheduling',
    },
    {
      label: 'DEV: Editor guide (front matter, canonical_url, up to four tags)',
      url: 'https://dev.to/p/editor_guide',
    },
    {
      label: 'DEV: Guidelines for AI-assisted Articles on DEV (last updated by DEV on 8 Apr 2024)',
      url: 'https://dev.to/guidelines-for-ai-assisted-articles-on-dev',
    },
    {
      label:
        'Upwork Help: How to enhance your freelancer profile, portfolio fields, linked contracts, no contact details (read via Internet Archive copy, 12 Mar 2026)',
      url: 'https://support.upwork.com/hc/en-us/articles/360016144974-How-to-enhance-your-freelancer-profile',
    },
    {
      label: 'Upwork Help: How can I share my portfolio project? (read via Internet Archive copy, 14 Oct 2025)',
      url: 'https://support.upwork.com/hc/en-us/articles/39295510081811-How-can-I-share-my-portfolio-project',
    },
    {
      label: 'LinkedIn Help: Manage featured samples of your work on your LinkedIn profile',
      url: 'https://www.linkedin.com/help/linkedin/answer/a550399',
    },
    {
      label: 'LinkedIn Help: Featured section on your profile FAQs',
      url: 'https://www.linkedin.com/help/linkedin/answer/a552452',
    },
    {
      label: 'LinkedIn Help: Add sections to your profile (Projects, Project URL tip)',
      url: 'https://www.linkedin.com/help/linkedin/answer/a540837',
    },
  ],
}
export default post
