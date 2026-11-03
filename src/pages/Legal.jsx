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
        {name} is a free online utility website that helps people complete
        everyday file-related tasks. It brings together tools for images,
        PDF files, Word documents and Excel spreadsheets in one place.
      </p>

      <h2>What you can do with Fylzora</h2>
      <ul>
        <li><strong>Image tools:</strong> Compress, resize, convert and check image details.</li>
        <li><strong>PDF tools:</strong> Merge, split, organize and manage PDF files.</li>
        <li><strong>Word tools:</strong> Convert and work with supported document formats.</li>
        <li><strong>Excel tools:</strong> Convert and manage supported spreadsheet files.</li>
      </ul>

      <h2>How to use our tools</h2>
      <ol>
        <li>Choose a tool based on the task you want to complete.</li>
        <li>Read the instructions and check its supported file formats.</li>
        <li>Select your file and use the available options.</li>
        <li>Start processing and download the result when it is ready.</li>
      </ol>

      <h2>File processing and privacy</h2>
      <p>
        Many Fylzora tools process files directly in your browser whenever
        technically possible. Processing methods can differ between tools.
        Please check the instructions on each tool page to understand how
        your file is handled.
      </p>
      <p>
        We do not ask visitors to create an account to use our tools.
        Read our <Link to="/privacy-policy">Privacy Policy</Link> for more
        information about data, cookies and advertising.
      </p>

      <h2>Our approach</h2>
      <p>
        We aim to make common file tasks simple and accessible. We continue
        to improve our tools, instructions and supported features based on
        user needs and feedback.
      </p>

      <h2>How Fylzora is funded</h2>
      <p>
        We may display advertisements through Google AdSense to support
        website maintenance and development. Advertising availability
        depends on Google's review and policies. Learn more on our  <Link to="/cookie-and-advertising"> Cookies &amp; Advertising</Link> page.
      </p>

      <h2>Contact us</h2>
      <p>
        Found a problem or have a suggestion? Visit our <Link to="/contact"> Contact Us</Link> page. We welcome useful
        feedback that helps us improve Fylzora.
      </p>
    </Doc>
  );
}

export function Contact() {
  return (
    <Doc title="Contact Us" path="/contact" description={`How to reach ${name} with questions, bug reports or privacy requests.`}>
      <p>For general questions and feedback, email us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
      <p>For technical help or tool-related problems, contact <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.</p>
      <p>It helps to include the tool name, your browser and device, and the file type you were using. Please don’t attach private documents; a description of the problem is enough.</p>
    </Doc>
  );
}

export function Privacy() {
  return (
    <Doc title="Privacy Policy" path="/privacy-policy" updated description={`How ${name} handles your files, data, cookies and advertising.`}>
      <h2>Your files</h2>
      <p>The tools that are available process files inside your browser, on your own device, so the file is not sent to our servers. If a particular tool ever needs to upload a file, its page will say so clearly before you use it, and we will update this policy.</p>
      <p>We do not claim end-to-end encryption. Processing locally simply means the file doesn’t leave your device during that step.</p>
      <h2>Information we may receive</h2>
      <p>Like any website, our hosting provider may keep standard server logs, such as IP address, browser type, pages requested and timestamps, for security and operations. We do not ask you to create an account.</p>
      <h2>Cookies and local storage</h2>
      <p>We store your light or dark mode choice in your browser’s local storage so the site remembers it. This stays on your device.</p>
      <h2>Analytics</h2>
      <p>We use Google Analytics to understand how visitors use our website, such as which pages are visited and how the site performs. Google Analytics may use cookies or similar technologies to collect usage information. This information helps us improve our website. You can manage cookies through your browser settings.</p>
      <h2>Advertising</h2>
      <p>Google AdSense may be used to display advertising on this site. When advertising is enabled, Google and its partners may use cookies or similar technologies to show and measure ads and may personalise them. See <Link to="/cookie-and-advertising">Cookies &amp; Advertising</Link> for details and how to manage your choices.</p>
      <h2>Third parties</h2>
      <p>We do not sell personal information. Services we use, such as hosting and advertising, have their own privacy policies.</p>
      <h2>Children</h2>
      <p>The site is not directed at children under 13, and we do not knowingly collect their personal information.</p>
      <h2>Your rights and contact</h2>
      <p>Depending on where you live, you may have rights over your personal data. Contact us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
      <h2>Changes</h2>
      <p>We will update this page and its date when our practices change.</p>
    </Doc>
  );
}

export function Terms() {
  return (
    <Doc title="Terms of Service" path="/terms-of-service" updated description={`The terms for using ${name}.`}>
      <h2>Using the service</h2>
      <p>By using {name} you agree to these terms. Use the tools only with files you have the right to use and process, and don’t use the site for anything unlawful or to interfere with its operation.</p>
      <h2>Your content</h2>
      <p>You keep all rights to your files. We do not claim ownership of anything you process.</p>
      <h2>No warranty</h2>
      <p>The tools are provided “as is” and “as available”. We do not guarantee that results will be accurate, complete or error-free, or that the service will always be available.</p>
      <h2>Limitation of liability</h2>
      <p>To the extent allowed by law, we are not liable for loss of data or any indirect or consequential damages arising from use of the site. Keep a copy of your original files.</p>
      <h2>Changes</h2>
      <p>We may change the site or these terms. Continued use means you accept the updated terms.</p>
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
      <p>We store your theme choice (light or dark) in your browser’s local storage.</p>
      <h2>Analytics</h2>
      <p>Google Analytics may use cookies or similar technologies to measure website traffic and understand how visitors use Fylzora. You can manage cookies through your browser settings. Where required by law, analytics technologies should only be used after the necessary consent.</p>
      <h2>Advertising</h2>
      <p>Google AdSense may be used to display advertising on this site. When advertising is enabled, Google and its advertising partners may use cookies or similar technologies to serve and measure ads. Ads may be personalised depending on your settings and applicable consent requirements.</p>
      <p>Where the law requires it, we will ask for your consent before loading advertising cookies.</p>
      <h2>Your choices</h2>
      <ul>
        <li>Manage personalised ads at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
        <li>Learn how Google uses data from sites that use its services at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">policies.google.com</a>.</li>
        <li>You can also block or delete cookies in your browser settings.</li>
      </ul>
      <h2>Ad placement</h2>
      <p>Ads will be clearly labelled and kept separate from upload, processing and download buttons.</p>
    </Doc>
  );
}

const faqs = [
  ['Is it really free?', 'Yes. There is no sign-up and no payment. The site plans to be supported by advertising.'],
  ['Are my files uploaded to your servers?', 'Our tools are designed to process files in your browser on your device. Check each tool page for details about how it handles your files.'],
  ['Which tools can I use today?', 'Visit the All Tools page to explore the available tools. Each tool page explains its features and limitations.'],
  ['Why is my converted PDF or Word file different from the original?', 'Conversions between formats can’t always keep fonts and layout identical. Scanned documents are images and need OCR before their text can be edited.'],
  ['Why did my CSV lose its formulas and sheets?', 'CSV is plain text with one table per file, so formulas, formatting and extra sheets can’t be stored in it.'],
  ['Does it work with old .doc files?', 'Word tools work with .docx. Open an older .doc file in Word or LibreOffice and save it as .docx first.'],
  ['Why did a large file fail?', 'Processing happens on your device, so very large files can run out of browser memory. Try a smaller file or a computer with more memory.'],
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
