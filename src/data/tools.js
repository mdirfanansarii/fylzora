// ---------------------------------------------------------------
// TOOL REGISTRY – the single source of truth for every tool.
// To ship a tool: build its component in src/tools/, register it in
// src/tools/components.js, then set `live: true` here.
// Pages that are not live are marked noindex and left out of sitemap.xml.
// ---------------------------------------------------------------

export const categories = {
  image: { slug: 'image-tools', name: 'Image Tools', short: 'Image', phase: 2,
    blurb: 'Compress, resize, crop and convert images online for websites, sharing and everyday tasks.' },
  pdf: { slug: 'pdf-tools', name: 'PDF Tools', short: 'PDF', phase: 3,
    blurb: 'Merge, split, compress, convert and annotate PDF files online without installing software.' },
  word: { slug: 'word-tools', name: 'Word Tools', short: 'Word', phase: 4,
    blurb: 'View, edit and convert DOCX documents online using free browser-based tools.' },
  excel: { slug: 'excel-tools', name: 'Excel Tools', short: 'Excel', phase: 5,
    blurb: 'View, edit, clean and convert spreadsheets online using free browser-based tools.' },
};

const t = (category, slug, name, description, extra = {}) =>
  ({ category, slug, name, description, live: false, alsoIn: [], notes: [], ...extra });

const rawTools = [
  // ---- Images (Phase 2) ----
  t('image', 'image-compressor', 'Image Compressor', 'Compress JPG, PNG and WebP images online. Keep the original format or choose JPG, PNG or WebP output. Adjust quality for JPG and WebP, preview the result and compare file sizes. PNG output remains lossless. Supports images up to 25 MB.'),
  t('image', 'image-converter', 'Image Converter', 'Convert JPG, PNG, WebP, GIF and BMP images to JPG, PNG or WebP online. Adjust quality for JPG and WebP output. Image dimensions remain unchanged, and transparent areas become white when converting to JPG.'),
  t('image', 'image-resizer', 'Image Resizer', 'Resize JPG, PNG and WebP images online. Set exact width and height in pixels or scale from 5% to 200%. Keep the original aspect ratio or set custom dimensions. Upload images up to 25 MB.'),
  t('image', 'image-cropper', 'Image Cropper', 'Crop JPG, PNG and WebP images online. Choose free crop or fixed aspect ratios, enter exact pixel dimensions and save the result in your preferred format.'),
  t('image', 'image-rotator', 'Image Rotator', 'Rotate JPG, PNG and WebP images online in 90-degree steps. Flip images horizontally or vertically and download the result in the original format.'),
  t('image', 'image-checker', 'Image Format & Size Checker', 'Check the actual format, dimensions and file size of JPG, PNG, WebP, GIF and BMP images online. Compare the detected format with the declared file type. Supports images up to 25 MB.'),
  t('image', 'multiple-image-compressor', 'Multiple Image Compressor', 'Compress up to 20 JPG, PNG and WebP images online, with a 25 MB limit per image. Choose JPG, PNG or WebP output, adjust quality for JPG and WebP, compare file sizes and download successful results individually or together in a ZIP file.'),
  t('image', 'image-quality-controller', 'Image Quality Controller', 'Adjust JPG and WebP image quality from 10% to 100%. Preview the result and compare file sizes before downloading. PNG output remains lossless. Supports JPG, PNG and WebP images up to 25 MB.'),
  t('image', 'image-background-color', 'Image Background Color Tool', 'Change connected image background areas to a solid colour online. Detect background pixels from the image edges and export as PNG, JPG or WebP. Supports JPG, PNG and WebP images up to 25 MB.'),

  // ---- PDF (Phase 3) ----
  t('pdf', 'pdf-compressor', 'PDF Compressor', 'Compress PDF files online up to 25 MB. Choose image compression to optimise supported embedded JPEG photos while keeping text selectable, or maximum compression to turn every page into a JPEG image. Select Light, Balanced or Strong compression and compare file sizes before downloading.',
   { notes: ['Results depend on PDF content. PDFs without supported JPEG images may barely shrink.', 'Maximum compression makes text non-selectable and non-searchable.'] }),
  t('pdf', 'pdf-to-word', 'PDF to Word Converter', 'Turn a text-based PDF into an editable DOCX file.', { alsoIn: ['word'],
    notes: ['Scanned PDFs are pictures of text and need OCR, which this tool doesn’t do.', 'Images, tables and complex layouts are not recreated.'] }),
  t('pdf', 'pdf-to-jpg', 'PDF to JPG & PNG Converter', 'Convert PDF pages to JPG or PNG images online. Choose standard 72 DPI, high 144 DPI or very high 216 DPI resolution. Convert up to the first 60 pages and download images individually or together as a ZIP file.'),
  t('pdf', 'jpg-to-pdf', 'JPG & PNG to PDF Converter', 'Combine pictures into a single PDF, one image per page.'),
  t('pdf', 'pdf-merger', 'PDF Merger', 'Join several PDFs into one file in the order you choose.'),
  t('pdf', 'pdf-splitter', 'PDF Splitter', 'Split a PDF into smaller files by page range.'),
  t('pdf', 'pdf-organizer', 'PDF Page Organizer', 'Reorder, rotate and delete pages using thumbnails.'),
  t('pdf', 'pdf-editor', 'PDF Editor', 'Edit PDF files online up to 25 MB. Replace supported existing text, erase areas, add text, highlight content and draw rectangles, ellipses and lines. Edit multiple pages and save your changes. Use Flatten mode to permanently remove original page content by converting pages into images.'),
  t('pdf', 'pdf-page-numbers', 'PDF Page Number Tool', 'Add page numbers to PDF files online up to 25 MB. Choose bottom-left, bottom-centre or bottom-right position, set the starting number and optionally show Page X of Y on every page.'),
  t('pdf', 'pdf-watermark', 'PDF Watermark Tool', 'Add a diagonal text watermark to every page of PDF files online up to 25 MB. Enter up to 40 characters, adjust text size from 20 to 120 pt and set opacity from 5% to 100%.'),
  t('pdf', 'pdf-password', 'PDF Password Protection', 'Protect PDF files online with a password. Upload a PDF up to 25 MB, set and confirm a password of at least 6 characters, and optionally restrict printing and copying in PDF viewers that respect these permissions.',
    { notes: ['Use a password you can remember. A lost password cannot be recovered.', 'The file is encrypted in your browser. The password is not sent to a server.'] }),
  t('pdf', 'pdf-metadata', 'PDF Metadata Viewer', 'View PDF properties online, including title, author, subject, keywords, creator, producer, creation and modification dates, page count, first-page dimensions, file size and encrypted status. Upload a PDF up to 25 MB.'),
  t('pdf', 'pdf-page-extractor', 'PDF Page Extractor', 'Pull selected pages out of a PDF into a new file.'),

  // ---- Word (Phase 4) ----
  t('word', 'docx-to-pdf', 'DOCX to PDF Converter', 'Convert a Word document to PDF.', { alsoIn: ['pdf'],
    notes: ['This converter creates a text-only PDF. Images, table structure, fonts, colours and complex layouts are not preserved.'] }),
  t('word', 'docx-to-txt', 'DOCX to TXT Converter', 'Extract plain text from DOCX Word documents online. Convert document text into a TXT file for notes, coding and data processing. Images, tables and formatting are not preserved.'),
  t('word', 'txt-to-docx', 'TXT to DOCX Converter', 'Create a Word document from a TXT file or text you type or paste.'),
  t('word', 'docx-to-html', 'DOCX to HTML Converter', 'Convert a Word document into clean HTML.'),
  t('word', 'docx-to-markdown', 'DOCX to Markdown Converter', 'Convert a Word document into Markdown.'),
  t('word', 'docx-compressor', 'DOCX Compressor', 'Compress DOCX Word documents online by optimising supported JPEG images. PNG images and document text are not compressed, so some files may show little or no size reduction.',
    { notes: ['Gains are often small, especially for text-only documents.'] }),
  t('word', 'docx-editor', 'DOCX Editor', 'Write and edit a document in a simple rich-text editor, then save it as DOCX.',
    { notes: ['Only .docx is supported. Older .doc files must be re-saved as .docx first.'] }),
  t('word', 'docx-viewer', 'DOCX Viewer', 'Open and read a Word document without Word installed.'),
  t('word', 'word-counter', 'Word Counter', 'Count words, characters and estimated pages.'),
  t('word', 'document-text-extractor', 'Document Text Extractor', 'Copy all the text out of a document.'),
  t('word', 'document-formatter', 'Document Formatter', 'Clean up spacing, line breaks and basic formatting.'),

  // ---- Excel (Phase 5) ----
  t('excel', 'xlsx-to-csv', 'XLSX to CSV Converter', 'Convert Excel XLSX workbooks to CSV. Export the selected worksheet or every worksheet as separate CSV files. CSV keeps cell values, including available formula results, but not Excel formatting or colours.',
    { notes: ['CSV keeps values only: formulas, formatting and extra sheets are lost.'] }),
  t('excel', 'csv-to-xlsx', 'CSV to XLSX Converter', 'Convert CSV files into Excel XLSX workbooks. Parse comma-separated and quoted data, skip empty lines and create a single worksheet from the CSV table.'),
  t('excel', 'xlsx-to-json', 'XLSX to JSON Converter', 'Convert Excel XLSX workbooks to JSON. Use the first row of each worksheet as field names. Blank headers receive generated names, duplicate headers get unique suffixes, and formula cells use their last saved results. Multiple worksheets are grouped by sheet name in the JSON output.'),
  t('excel', 'xlsx-to-pdf', 'XLSX to PDF Converter', 'Convert Excel XLSX workbooks to landscape PDF pages. Export worksheet cell values, with wide tables split across pages. Original formatting is not preserved, and long cell text may be shortened.', { alsoIn: ['pdf'] }),
  t('excel', 'json-to-xlsx', 'JSON to XLSX Converter', 'Convert JSON arrays of objects or arrays into Excel XLSX workbooks. Object keys become column headings, while nested data is stored as JSON text in cells.'),
  t('excel', 'excel-viewer', 'Excel Viewer', 'View XLSX Excel workbooks online. Browse multiple worksheets and preview up to 200 rows and 30 columns at a time.'),
  t('excel', 'excel-editor', 'Excel Editor', 'Edit cell values in Excel XLSX spreadsheets online. Update up to 200 rows and 30 columns, then save as XLSX or CSV. Original formulas and formatting may not be preserved.'),
  t('excel', 'excel-merger', 'Excel File Merger', 'Merge up to 20 XLSX or CSV files into one workbook. Combine all worksheets or stack rows from the first sheet of each file into one sheet.'),
  t('excel', 'excel-sheet-exporter', 'Excel Sheet Exporter', 'Export Excel worksheets as separate XLSX or CSV files. Save each sheet in its own workbook or as tabular CSV data.'),
  t('excel', 'csv-editor', 'CSV Editor', 'Edit CSV files online in a spreadsheet-style grid. Preview up to 200 rows and 30 columns, then save your changes as CSV or XLSX.'),
  t('excel', 'duplicate-row-finder', 'Duplicate Row Finder', 'Find and highlight duplicate rows in XLSX and CSV files. Ignore case differences, keep the first matching row and remove later duplicates.'),
  t('excel', 'blank-row-remover', 'Blank Row Remover', 'Remove empty rows and optionally completely empty columns from XLSX and CSV spreadsheets.'),
  t('excel', 'column-row-manager', 'Column & Row Manager', 'Add, delete and reorder rows and columns. Edit spreadsheet cell values directly.'),
  t('excel', 'spreadsheet-formatter', 'Spreadsheet Formatter', 'Format Excel XLSX and CSV spreadsheets. Remove blank rows, clean spaces, convert text to numbers, bold headers and adjust column widths.'),
  t('excel', 'excel-formula-helper', 'Excel Formula Helper', 'Browse 20 Excel formula entries with examples, simple explanations and practical uses. Includes calculations, lookups, text, dates and newer functions such as XLOOKUP, UNIQUE and FILTER.'),
];

// Tools whose component exists in src/tools/components.js.
const LIVE = new Set(['image-compressor','multiple-image-compressor','image-quality-controller','image-converter',
  'image-resizer','image-rotator','image-background-color','image-checker',
  'pdf-merger','pdf-splitter','pdf-page-extractor','pdf-organizer','pdf-page-numbers','pdf-watermark','pdf-metadata','jpg-to-pdf','pdf-to-jpg',
  'docx-to-pdf','docx-to-txt','txt-to-docx','docx-to-html','docx-to-markdown','docx-compressor','docx-editor','docx-viewer',
  'word-counter','document-text-extractor','document-formatter',
  'xlsx-to-csv','csv-to-xlsx','xlsx-to-pdf','xlsx-to-json','json-to-xlsx','excel-viewer','excel-editor','excel-merger',
  'excel-sheet-exporter','csv-editor','duplicate-row-finder','blank-row-remover','column-row-manager','spreadsheet-formatter','excel-formula-helper',
  'image-cropper','pdf-compressor','pdf-editor','pdf-to-word','pdf-password']);
const withLive = rawTools.map((x) => (LIVE.has(x.slug) ? { ...x, live: true } : x));
// Set VITE_HIDE_UNFINISHED=true before applying for AdSense: "Coming soon" tools then disappear
// from lists, routes (they 404), the sitemap and prerendered pages.
const hide = (import.meta.env?.VITE_HIDE_UNFINISHED ?? globalThis.process?.env?.VITE_HIDE_UNFINISHED) === 'true';
export const tools = hide ? withLive.filter((x) => x.live) : withLive;

export const bySlug = (slug) => tools.find((x) => x.slug === slug);
export const toolPath = (tool) => `/${tool.slug}`;
export const categoryPath = (key) => `/${categories[key].slug}`;
export const categoryKeyBySlug = (slug) => Object.keys(categories).find((k) => categories[k].slug === slug);

export const toolsInCategory = (key) =>
  tools.filter((x) => x.category === key || x.alsoIn.includes(key));

export const relatedTools = (tool, n = 4) => {
  const pool = tools.filter((x) => x.slug !== tool.slug && x.category === tool.category);
  const i = tools.findIndex((x) => x.slug === tool.slug);
  return pool
    .sort((a, b) => Math.abs(tools.indexOf(a) - i) - Math.abs(tools.indexOf(b) - i))
    .slice(0, n);
};

export function searchTools(query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return tools
    .map((x) => {
      const hay = `${x.name} ${x.slug.replace(/-/g, ' ')} ${x.description}`.toLowerCase();
      if (!terms.every((w) => hay.includes(w))) return null;
      const score = x.name.toLowerCase().startsWith(terms[0]) ? 0 : x.name.toLowerCase().includes(terms[0]) ? 1 : 2;
      return { x, score };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score)
    .map((r) => r.x);
}
