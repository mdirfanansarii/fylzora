import { Link } from 'react-router-dom';
import { siteConfig } from '../config';
import { useSeo } from '../hooks/useSeo.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

function Doc({ title, description, path, updated = false, children }) {
  const crumbs = [{ name: 'Home', to: '/' }, { name: title, to: path }];
  useSeo({ title, description, path, breadcrumbs: crumbs });
  return (
    <div className="wrap page prose">
      <Breadcrumbs items={crumbs} />
      <h1>{title}</h1>
      {updated && <p className="muted small">Last updated: {siteConfig.lastUpdated}</p>}
      {children}
    </div>
  );
}

const name = siteConfig.name;
const ads = !!siteConfig.adsenseClient;

export function About() {
  return (
    <Doc title="About Us" path="/about" description={`Learn about ${name}, its free online tools, features and file processing.`}>
      <p>
        {name} is a free online utility website that helps people finish
        everyday file tasks without installing software or creating an account.
        Images, PDFs, Word documents and Excel spreadsheets, the jobs people
        run into most often, are all in one place.
      </p>

      <h2>Why {name} exists</h2>
      <p>
        Small file jobs come up constantly: a photo that is a few KB over a
        form’s upload limit, several PDFs that need to become one, a text note
        that has to turn into a Word file. They take two minutes, but finding a
        tool that is simple, clear about what it does, and does not ask for a
        sign-up is harder than it should be. {name} is our attempt to make
        these jobs quick and easy to understand.
      </p>

      <h2>What you can do with {name}</h2>
      <ul>
        <li><strong>Image tools:</strong> compress, convert, resize, crop and rotate images, and check image size.</li>
        <li><strong>PDF tools:</strong> compress, merge and split PDF files, and convert between PDF and Word, JPG or PNG.</li>
        <li><strong>Word tools:</strong> convert between DOCX and PDF, TXT, HTML or Markdown, and turn TXT files into Word documents.</li>
        <li><strong>Excel tools:</strong> convert between XLSX and CSV, JSON or PDF, and view Excel files.</li>
      </ul>
      <p>
        Each tool page explains how the tool works, which file formats it
        supports and what to expect from the result. Common questions are
        answered on the <Link to="/faq">FAQ</Link> page, and our{' '}
        <Link to="/blog">guides</Link> explain everyday file problems in plain
        language, such as meeting an image upload limit or reducing the size of
        a PDF.
      </p>

      <h2>File processing and privacy</h2>
      <p>
        Our tools process files inside your browser, on your own device, so
        the file is not sent to our servers. If a particular
        tool ever needs to send a file elsewhere to be processed, its page
        will say so clearly before you use it. We do not ask visitors to
        create an account.
      </p>
      <p>
        Read our <Link to="/privacy-policy">Privacy Policy</Link> for more
        information about data, cookies and advertising, and our{' '}
        <Link to="/disclaimer">Disclaimer</Link> for the known limits of file
        conversion.
      </p>

      <h2>Who is behind {name}</h2>
      <p>
        {name} is built and maintained by IruTech, a technology brand built
        around one idea: “Technology Made Simple.” We read every message you
        send us.
      </p>

      <h2>Our approach</h2>
      <p>
        We would rather offer tools that work well and explain their limits
        honestly than a long list that over-promises. We keep improving the
        tools, instructions and supported features based on user needs and
        feedback.
      </p>

      <h2>How {name} is funded</h2>
      <p>
        {name} is free to use. To cover hosting and development, we{' '}
        {ads ? 'display' : 'may display'} advertisements through Google
        AdSense. Ads are kept separate from upload, processing and download
        buttons. Learn more on our{' '}
        <Link to="/cookie-and-advertising">Cookies &amp; Advertising</Link> page.
      </p>

      <h2>Contact us</h2>
      <p>
        Found a problem or have a suggestion? Visit our{' '}
        <Link to="/contact">Contact Us</Link> page. We welcome useful feedback
        that helps us improve {name}.
      </p>
    </Doc>
  );
}

export function Contact() {
  return (
    <Doc title="Contact Us" path="/contact" description={`How to reach ${name} with questions, bug reports or privacy requests.`}>
      <p>
        Questions, bug reports, ideas for new tools or privacy requests: we
        read every message and aim to reply to genuine ones within a few
        working days.
      </p>

      <h2>General questions and feedback</h2>
      <p>
        For general questions, feedback, suggestions and privacy-related
        requests, email us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>

      <h2>Technical help</h2>
      <p>
        If a tool is not working as expected, contact{' '}
        <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
        To help us find the problem faster, please include:
      </p>
      <ul>
        <li>The name of the tool you were using</li>
        <li>The type of file and roughly how large it was</li>
        <li>Your browser and device, for example Chrome on Android</li>
        <li>What you expected to happen and what happened instead</li>
      </ul>
      <p>Please don’t attach private documents; a description of the problem is enough.</p>

      <h2>Before you write</h2>
      <p>
        Many common questions are answered on our <Link to="/faq">FAQ</Link>{' '}
        page. The <Link to="/disclaimer">Disclaimer</Link> explains the known
        limits of file conversion, such as scanned PDFs or CSV files losing
        formulas.
      </p>

      <h2>Suggest a tool</h2>
      <p>
        Is there a file task you do often but cannot find a simple tool for?
        Tell us what you are trying to do, which formats are involved, and
        where you get stuck. Useful suggestions help us decide what to improve
        next.
      </p>
    </Doc>
  );
}

export function Privacy() {
  return (
    <Doc title="Privacy Policy" path="/privacy-policy" updated description={`How ${name} handles your files, data, cookies and advertising.`}>
      <p>
        This policy explains what information {name} (fylzora.online) may
        receive when you use the site and the choices you have. {name} is
        operated by IruTech.
      </p>

      <h2>Your files</h2>
      <p>Our tools process files inside your browser, on your own device, so the file is not sent to our servers. If a particular tool ever needs to upload a file, its page will say so clearly before you use it, and we will update this policy.</p>
      <p>We do not claim end-to-end encryption. Processing locally simply means the file doesn’t leave your device during that step. We do not use your files for any purpose other than the task you asked for.</p>

      <h2>Information we may receive</h2>
      <p>Like any website, our hosting provider may keep standard server logs, such as IP address, browser type, pages requested and timestamps, for security and operations. If you email us, we receive your email address and your message, and we use them only to reply. We do not ask you to create an account.</p>

      <h2>Cookies and local storage</h2>
      <p>We store your light or dark mode choice in your browser’s local storage so the site remembers it. This stays on your device. See <Link to="/cookie-and-advertising">Cookies &amp; Advertising</Link> for more detail.</p>

      <h2>Analytics</h2>
      <p>We use Google Analytics to understand how visitors use our website, such as which pages are visited and how the site performs. Google Analytics may use cookies or similar technologies to collect usage information. This information helps us improve our website. You can manage cookies through your browser settings, or use Google’s <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Analytics opt-out browser add-on</a>.</p>

      <h2>Advertising</h2>
      <p>Google AdSense may be used to display advertising on this site. When advertising is enabled, Google and its partners may use cookies or similar technologies to show and measure ads and may personalise them, including based on your previous visits to this and other websites. You can manage personalised ads at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. See <Link to="/cookie-and-advertising">Cookies &amp; Advertising</Link> for details and how to manage your choices.</p>

      <h2>How we use information</h2>
      <ul>
        <li>To run, secure and maintain the site</li>
        <li>To understand which tools are useful and where to improve them</li>
        <li>To reply to messages you send us</li>
        <li>To support the site through advertising</li>
      </ul>

      <h2>Third parties</h2>
      <p>We do not sell personal information. Services we use, such as hosting, analytics and advertising, have their own privacy policies.</p>

      <h2>Children</h2>
      <p>The site is not directed at children under 13, and we do not knowingly collect their personal information.</p>

      <h2>Your rights and contact</h2>
      <p>Depending on where you live, you may have rights over your personal data, such as asking what we hold about you or asking us to delete it. Contact us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>

      <h2>Changes</h2>
      <p>We will update this page and its date when our practices change.</p>
    </Doc>
  );
}

export function Terms() {
  return (
    <Doc title="Terms of Service" path="/terms-of-service" updated description={`The terms for using ${name}.`}>
      <p>By using {name} you agree to these terms. If you do not agree, please do not use the site.</p>

      <h2>Using the service</h2>
      <p>{name} provides free online tools for common file tasks. Use the tools only with files you have the right to use and process. You must not:</p>
      <ul>
        <li>Use the site for anything unlawful or to process material that infringes someone else’s rights</li>
        <li>Try to disrupt, overload or break into the site or its services</li>
        <li>Send large volumes of automated requests</li>
      </ul>

      <h2>Your content</h2>
      <p>You keep all rights to your files. We do not claim ownership of anything you process. See our <Link to="/privacy-policy">Privacy Policy</Link> for how files are handled.</p>

      <h2>Our content</h2>
      <p>The {name} name, logo, design and written content belong to IruTech. Please do not copy or republish them without permission.</p>

      <h2>No warranty</h2>
      <p>The tools are provided “as is” and “as available”. We do not guarantee that results will be accurate, complete or error-free, or that the service will always be available. See also our <Link to="/disclaimer">Disclaimer</Link>.</p>

      <h2>Limitation of liability</h2>
      <p>To the extent allowed by law, we are not liable for loss of data or any indirect or consequential damages arising from use of the site. Keep a copy of your original files.</p>

      <h2>Advertising and third-party links</h2>
      <p>The site may show advertisements and link to other websites. We do not control third-party services and are not responsible for their content or practices.</p>

      <h2>Changes</h2>
      <p>We may change the site or these terms. Continued use means you accept the updated terms.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India.</p>

      <p className="muted small">Contact: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
    </Doc>
  );
}

export function Disclaimer() {
  return (
    <Doc title="Disclaimer" path="/disclaimer" updated description={`Limits of ${name}’s tools and the accuracy of their results.`}>
      <p>File conversion and editing are technical and imperfect. Always check the output before relying on it.</p>
      <ul>
        <li>Converting PDF to Word works best with text-based PDFs. Scanned PDFs are images and need OCR, and complex layouts may not be kept exactly.</li>
        <li>Converting Word or Excel files to PDF can change fonts, spacing and page breaks compared with Microsoft Office.</li>
        <li>CSV files cannot store formulas, formatting or multiple sheets, so converting a workbook to CSV loses them.</li>
        <li>Compression results vary. Some files shrink a lot and some barely change. We make no promise about the amount saved.</li>
        <li>Very large files may fail because of browser memory limits on your device.</li>
      </ul>
      <p>Nothing on this site is legal, financial or professional advice. {name} is not affiliated with Adobe, Microsoft, Google or any other company whose products or file formats are mentioned.</p>
    </Doc>
  );
}

export function Cookies() {
  return (
    <Doc title="Cookies & Advertising" path="/cookie-and-advertising" updated description={`Which cookies ${name} uses and how advertising works on the site.`}>
      <h2>Cookies we use</h2>
      <p>We store your theme choice (light or dark) in your browser’s local storage. This stays on your device and is not used to track you.</p>

      <h2>Analytics</h2>
      <p>Google Analytics may use cookies or similar technologies to measure website traffic and understand how visitors use {name}. You can manage cookies through your browser settings or use Google’s <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Analytics opt-out browser add-on</a>.</p>

      <h2>Advertising</h2>
      <p>
        Google AdSense {ads ? 'is used' : 'may be used'} to display advertising on this site. When advertising is enabled, Google and its advertising partners may use cookies or similar technologies to serve and measure ads. Ads may be personalised depending on your Google account settings and the rules that apply where you live.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Manage personalised ads at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
        <li>Learn how Google uses data from sites that use its services at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">policies.google.com</a>.</li>
        <li>You can also block or delete cookies in your browser settings.</li>
      </ul>

      <h2>Ad placement</h2>
      <p>Ads will be clearly labelled and kept separate from upload, processing and download buttons.</p>

      <p>For more about how we handle information, read our <Link to="/privacy-policy">Privacy Policy</Link>.</p>
    </Doc>
  );
}

const faqs = [
  ['Is it really free?', 'Yes. There is no sign-up and no payment. To cover running costs, the site may show advertising.'],
  ['Do I need to create an account?', 'No. Open a tool, choose your file, and download the result.'],
  ['Are my files uploaded to your servers?', 'No. Our tools process files in your browser on your device, so the files are not sent to our servers. If a tool ever needs to send a file elsewhere, its page will say so before you use it.'],
  ['Can I use it for confidential documents?', 'Because the tools run in your browser, files are not sent to our servers. Still, as with any website, use your own judgement with highly sensitive documents and keep your browser and device up to date.'],
  ['Which tools can I use today?', 'We have image tools (compress, convert, resize, crop, rotate and check size), PDF tools (compress, merge, split and convert), Word tools (conversions between DOCX, PDF, TXT, HTML and Markdown) and Excel tools (conversions between XLSX, CSV, JSON and PDF, plus a viewer). Visit the All Tools page to explore them. Each tool page explains its features and limitations.'],
  ['Does it work on my phone?', 'Fylzora runs in a web browser, so you can open it on a phone, tablet or computer. Very large files are usually easier to handle on a computer.'],
  ['Will compressing an image reduce its quality?', 'Usually a little. Compression removes detail that is hard to see, so the difference is small at normal viewing size, but you may notice it if you zoom in. For the best result, always compress from your original file instead of compressing the same image again and again.'],
  ['Why is my converted PDF or Word file different from the original?', 'Conversions between formats can’t always keep fonts and layout identical. Scanned documents are images and need OCR before their text can be edited.'],
  ['Why do some characters look wrong after converting a text file?', 'This is usually an encoding issue. Save the original text file as UTF-8 and convert it again. UTF-8 handles Hindi, Urdu, accented letters and symbols.'],
  ['Why does my password-protected PDF not work?', 'Locked PDFs usually cannot be processed until the password is removed in the program that created the protection.'],
  ['Why did my CSV lose its formulas and sheets?', 'CSV is plain text with one table per file, so formulas, formatting and extra sheets can’t be stored in it.'],
  ['Does it work with old .doc files?', 'Word tools work with .docx. Open an older .doc file in Word or LibreOffice and save it as .docx first.'],
  ['Why did a large file fail?', 'Processing happens on your device, so very large files can run out of browser memory. Try a smaller file or a computer with more memory.'],
  ['Who runs Fylzora?', 'Fylzora is built and maintained by IruTech. You can read more on the About Us page.'],
  ['How do I report a problem?', 'Use the Contact page and tell us the tool, browser and file type.'],
];

export function Faq() {
  return (
    <Doc title="Frequently Asked Questions" path="/faq" description={`Answers about ${name}, file privacy, limits and supported formats.`}>
      {faqs.map(([q, a]) => (
        <details key={q} className="faq">
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </Doc>
  );
}
