import type { BlogPost } from './types'

// Facts checked 2026-11-11 against the official pages listed in `sources`.
const post: BlogPost = {
  slug: 'cold-email-freelance-developer',
  title: 'Cold email for freelance developers: template and rules',
  description:
    'A cold email template for freelance web developers with two follow-ups, plus the Gmail and Yahoo sender rules and what CAN-SPAM, PECR and GDPR require.',
  date: '2026-11-11',
  checked: '2026-11-11',
  readingMinutes: 9,
  html: `
<p>The cold emails worth answering read like a note from one person who actually looked at the recipient's business. Here's a template with two follow-ups, the sender rules Gmail and Yahoo publish, and what the law says in the US, UK and EU. It's practical guidance, not legal advice.</p>

<h2>What makes a first email worth answering</h2>
<p>A first email needs four parts and little else:</p>
<ol>
<li><strong>One specific observation</strong> you actually found: a slow page, a contact form that doesn't send, a checkout step that breaks on mobile. Test it yourself. No real issue, no email.</li>
<li><strong>One concrete offer:</strong> what you would do about it, in one sentence.</li>
<li><strong>Short proof:</strong> one link to similar work. No portfolio dump, no attachment.</li>
<li><strong>One small ask:</strong> a question they can answer with "yes". Not a request for a call.</li>
</ol>

<h3>Example: a developer writing to a small clinic</h3>
<p>Names, links and the address are placeholders.</p>
<blockquote>
<p><strong>Subject:</strong> Your booking form on mobile</p>
<p>Hi Jane,</p>
<p>I tried the "Book an appointment" form on Northside Physio's website from my phone this morning. After I tapped Send, nothing happened: no confirmation and no error. The same form worked on my laptop, so some mobile visitors may be leaving without booking, and you'd never see it.</p>
<p>I'm a freelance web developer who fixes this kind of problem for small businesses. I'd find the cause and fix it for a fixed price, agreed before I start.</p>
<p>Here's a similar fix I did for a dental practice: [link]</p>
<p>Would it help if I sent you a two-minute screen recording of what I saw?</p>
<p>Sam Rivera</p>
<p>Sam Rivera Web Development, [your postal address]. I found this email address on your website's contact page. You can object to further emails at any time: reply "no" and I won't email you again. Privacy notice: [link]</p>
</blockquote>

<h3>Why each line is there</h3>
<ul>
<li><strong>The subject</strong> says what the email is about. No "Quick question", no fake "Re:".</li>
<li><strong>The observation</strong> proves you looked, and they can check it in a minute.</li>
<li><strong>"May be leaving"</strong> says why it matters. You don't know their numbers, so don't pretend to.</li>
<li><strong>The offer</strong> is one job with a clear way of pricing it.</li>
<li><strong>The link</strong> is the proof: one similar fix, not a whole portfolio.</li>
<li><strong>The ask</strong> needs a one-word answer and helps them even if they never hire you.</li>
<li><strong>The footer</strong> says who you are, where you're based, where you found their address and how to opt out. The rules below explain why.</li>
</ul>

<h3>Two follow-ups, then stop</h3>
<p>Send them as replies in the same thread, so the "Re:" is real, and keep the same footer.</p>
<p><strong>Follow-up 1, about four working days later:</strong> add something new.</p>
<blockquote>
<p>Hi Jane, I checked the booking form again today and it still doesn't confirm on my phone. Happy to send the screen recording, free. Sam</p>
</blockquote>
<p><strong>Follow-up 2, about a week after that:</strong> close the loop.</p>
<blockquote>
<p>Hi Jane, last note from me. If the form is sorted or not a priority, no problem, I won't follow up again. If you want the recording or a quote later, just reply. Sam</p>
</blockquote>
<p>Then stop. Three emails without a reply is an answer.</p>

<h2>What to avoid</h2>
<ul>
<li><strong>Mass templates.</strong> The same text sent to hundreds of businesses can't contain a real observation, and it invites spam reports. <a href="https://support.google.com/a/answer/81126" target="_blank" rel="noopener noreferrer">Google's sender guidelines</a> say not to send messages to people who didn't sign up, because those recipients might mark your messages as spam. Cold email is unrequested by definition, so keep it rare and relevant.</li>
<li><strong>Fake "Re:" or "Fwd:" subjects.</strong> <a href="https://support.google.com/a/answer/81126" target="_blank" rel="noopener noreferrer">Google</a> says not to start a subject with Re: or Fwd: unless the message really is a reply or forward. The <a href="https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business" target="_blank" rel="noopener noreferrer">FTC</a> says the subject line must accurately reflect the content.</li>
<li><strong>Attachments.</strong> A file from a stranger is a trust decision for the recipient. A link is easier to check, and easier to ignore.</li>
<li><strong>Tracking-pixel heavy tools on a fresh domain.</strong> The <a href="https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/" target="_blank" rel="noopener noreferrer">ICO</a> says the UK's PECR rules on cookies and similar technologies apply to tracking pixels that store or access information on the reader's device. <a href="https://support.google.com/a/answer/81126" target="_blank" rel="noopener noreferrer">Google</a> says it doesn't track open rates and can't verify the open rates third parties report. A reply is the only signal that counts, and a fresh domain should start slow (see below).</li>
<li><strong>Personal addresses scraped from the web.</strong> A sole trader's own Gmail or a named address from a directory is personal data, and under UK PECR sole traders count as individuals. The <a href="https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/" target="_blank" rel="noopener noreferrer">ICO</a> says you can't assume public personal data means the person agrees to direct marketing, and <a href="https://support.google.com/a/answer/81126" target="_blank" rel="noopener noreferrer">Google</a> says not to purchase email addresses. Use the enquiry address the business publishes on its own site.</li>
</ul>

<h2>Deliverability basics for 1:1 senders</h2>
<p><em>Checked November 2026 against Google's <a href="https://support.google.com/a/answer/81126" target="_blank" rel="noopener noreferrer">Email sender guidelines</a>, Google's <a href="https://support.google.com/a/answer/14229414" target="_blank" rel="noopener noreferrer">Email sender guidelines FAQ</a> and Yahoo's <a href="https://senders.yahooinc.com/best-practices/" target="_blank" rel="noopener noreferrer">Sender Best Practices</a>.</em></p>

<h3>SPF, DKIM and DMARC</h3>
<p><strong>SPF</strong> lists the servers allowed to send mail for your domain. <strong>DKIM</strong> signs each message so receivers can check that your domain sent it. <strong>DMARC</strong>, in Google's words, "tells receiving servers what to do with your messages that don't pass SPF or DKIM". <a href="https://support.google.com/a/answer/81126" target="_blank" rel="noopener noreferrer">Google</a> requires a DKIM key of 1024 bits or longer for personal Gmail accounts and recommends 2048 bits.</p>

<h3>What Gmail and Yahoo require</h3>
<p>Both split their rules into all senders and bulk senders (<a href="https://support.google.com/a/answer/81126" target="_blank" rel="noopener noreferrer">Google</a>, <a href="https://senders.yahooinc.com/best-practices/" target="_blank" rel="noopener noreferrer">Yahoo</a>). Google's rules cover mail to personal Gmail accounts (addresses ending in @gmail.com or @googlemail.com).</p>
<table>
<thead>
<tr><th>Requirement</th><th>All senders</th><th>Bulk senders</th></tr>
</thead>
<tbody>
<tr><td>Authentication</td><td>SPF or DKIM</td><td>SPF and DKIM, plus DMARC (p=none is enough), with the From: domain aligned to the SPF or DKIM domain</td></tr>
<tr><td>Spam rate</td><td>Below 0.3% (Google advises staying below 0.1%)</td><td>Below 0.3%</td></tr>
<tr><td>Unsubscribe</td><td>Not listed</td><td>One-click unsubscribe plus a visible unsubscribe link for marketing and subscribed messages. Yahoo: honor unsubscribes within 2 days</td></tr>
<tr><td>DNS and format</td><td>Valid forward and reverse DNS records, RFC 5322 format. Gmail also requires TLS</td><td>Same</td></tr>
</tbody>
</table>
<p><strong>Who is a bulk sender?</strong> <a href="https://support.google.com/a/answer/14229414" target="_blank" rel="noopener noreferrer">Google's FAQ</a> says it's a sender that sends "close to 5,000 messages or more to personal Gmail accounts within a 24-hour period", counting all mail from the same primary domain. Meet that once and the status is permanent. Yahoo's page gives no number.</p>
<p>Sending 1:1 emails, you're far below that, but the all-sender rules still apply, including the 0.3% spam rate. Spam rate is a share of your mail, so when you send little, each "Report spam" click counts for a lot. <a href="https://senders.yahooinc.com/best-practices/" target="_blank" rel="noopener noreferrer">Yahoo</a> strongly urges all senders to publish DMARC, so set up all three.</p>

<h3>Why not to send outreach from your main domain</h3>
<p>Your main domain carries quotes, invoices and client updates. <a href="https://support.google.com/a/answer/81126" target="_blank" rel="noopener noreferrer">Google</a> says spam reports can lower your domain's reputation over time. <a href="https://senders.yahooinc.com/best-practices/" target="_blank" rel="noopener noreferrer">Yahoo</a> says each IP and DKIM domain has a reputation that unsolicited commercial email can hurt, and recommends separating mail types by IP or DKIM domain. If you send cold email regularly, use a separate outreach domain that is still clearly you.</p>

<h3>Keep volume low</h3>
<p><a href="https://support.google.com/a/answer/81126" target="_blank" rel="noopener noreferrer">Google</a> advises starting with a low volume, increasing slowly and avoiding sudden spikes, because suddenly doubling your volume can lead to rate limiting or a drop in reputation. For a freelancer, that means a handful of researched emails a day.</p>

<h2>The rules (not legal advice)</h2>
<p><em>Checked November 2026 against the official sources linked below. A summary, not legal advice: the rules depend on where you and the recipient are, so check both.</em></p>

<h3>United States: CAN-SPAM</h3>
<p>The <a href="https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business" target="_blank" rel="noopener noreferrer">FTC's compliance guide</a> says CAN-SPAM covers all commercial messages, not only bulk email, and "makes no exception for business-to-business email". A pitch for paid work promotes a commercial service, so it counts. You must:</p>
<ul>
<li>use accurate header information (From, To, Reply-To, routing) that identifies you;</li>
<li>use a subject line that accurately reflects the content;</li>
<li>disclose clearly and conspicuously that the message is an advertisement (the FTC says the law gives "a lot of leeway" in how);</li>
<li>include a valid physical postal address: a street address, a PO box registered with the US Postal Service, or a registered private mailbox;</li>
<li>explain how to opt out, honor opt-outs within 10 business days, and keep your opt-out working for at least 30 days after you send.</li>
</ul>
<p>Penalties: up to $53,088 per email in violation (<a href="https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business" target="_blank" rel="noopener noreferrer">FTC</a>).</p>

<h3>United Kingdom: PECR and UK GDPR</h3>
<p>The ICO's guidance on <a href="https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/" target="_blank" rel="noopener noreferrer">electronic mail marketing</a> and <a href="https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/" target="_blank" rel="noopener noreferrer">business-to-business marketing</a> splits recipients into two groups:</p>
<ul>
<li><strong>Corporate subscribers</strong> (companies, limited liability partnerships, Scottish partnerships, some government bodies): PECR's email marketing rule doesn't apply, so no consent is needed under PECR. You still must not disguise who you are, you must give a valid opt-out address, and the ICO says you should honor opt-outs.</li>
<li><strong>Individual subscribers</strong>, including sole traders and some partnerships: you need their specific consent, or the "soft opt-in" for your own previous customers, which the ICO says doesn't apply to prospective customers. So PECR doesn't allow a cold email to a sole trader.</li>
</ul>
<p>If you can't tell which group an address belongs to, the ICO says to treat it as an individual's. If the address identifies a person, UK GDPR applies too, including their absolute right to stop their data being used for direct marketing. Both ICO pages are under review after the Data (Use and Access) Act, so recheck them.</p>

<h3>European Union: GDPR plus national rules</h3>
<p><strong>GDPR</strong> applies when the address identifies a person. <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj" target="_blank" rel="noopener noreferrer">Recital 47</a> says processing personal data for direct marketing "may be regarded as carried out for a legitimate interest", but that interest has to be weighed against the person's reasonable expectations. Article 21 lets people object to direct marketing at any time, after which you must stop, and you must point out this right clearly and separately by your first message. Article 14 says that if you didn't get the data from the person, you must tell them certain things, including the source, by your first contact. Hence the example footer.</p>
<p><strong>National rules</strong> sit on top. Article 13 of the <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02002L0058-20091219" target="_blank" rel="noopener noreferrer">ePrivacy Directive</a> generally requires prior consent for email marketing to natural persons and leaves the protection of other subscribers, such as companies, to each member state, so the rules for emailing businesses differ by country. Germany is strict: under <a href="https://www.gesetze-im-internet.de/uwg_2004/__7.html" target="_blank" rel="noopener noreferrer">§ 7 UWG</a>, email advertising without the addressee's prior express consent always counts as unreasonable harassment, whether the recipient is a consumer or a business. The § 7(3) exception covers only existing customers, under strict conditions.</p>
<p>Check the rules in your own country and in the recipient's before you send. If the recipient's country requires prior consent even for business email, don't send a cold email there.</p>

<h2>Checklist</h2>
<ul>
<li>A real issue on their site that I checked myself.</li>
<li>One observation, one offer, one link, one small ask, about 100 words.</li>
<li>An honest subject line, no attachments, no open tracking.</li>
<li>The business's published enquiry address, not a scraped personal one.</li>
<li>I checked what the recipient's country requires (UK: company or sole trader?).</li>
<li>Footer: who I am, postal address, where I found their address, how to object, privacy notice. US: marked as an advertisement.</li>
<li>SPF, DKIM and DMARC set up.</li>
<li>A handful a day, not from the domain my client mail depends on.</li>
<li>Two follow-ups at most, then stop.</li>
<li>Every "no" goes on a do-not-contact list the same day.</li>
</ul>

<p>If you'd rather not start each first draft from a blank page, ClientPilot writes outreach email templates from your own profile. There's a free preview, and Pro is $9 a month.</p>
`,
  sources: [
    {
      label: 'Google: Email sender guidelines (Gmail Help)',
      url: 'https://support.google.com/a/answer/81126',
    },
    {
      label: 'Google: Email sender guidelines FAQ (Gmail Help)',
      url: 'https://support.google.com/a/answer/14229414',
    },
    {
      label: 'Yahoo Sender Hub: Sender Best Practices',
      url: 'https://senders.yahooinc.com/best-practices/',
    },
    {
      label: 'FTC: CAN-SPAM Act, a compliance guide for business',
      url: 'https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business',
    },
    {
      label: 'ICO: Guide to PECR, electronic mail marketing',
      url: 'https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/',
    },
    {
      label: 'ICO: Business-to-business marketing',
      url: 'https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/',
    },
    {
      label: 'EUR-Lex: General Data Protection Regulation (EU) 2016/679 (Recital 47, Articles 14 and 21)',
      url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
    },
    {
      label: 'EUR-Lex: ePrivacy Directive 2002/58/EC, consolidated text (Article 13)',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02002L0058-20091219',
    },
    {
      label: 'Gesetze im Internet: § 7 UWG (Unzumutbare Belästigungen)',
      url: 'https://www.gesetze-im-internet.de/uwg_2004/__7.html',
    },
  ],
}

export default post
