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
  t('image', 'image-compressor', 'Image Compressor', 'Make JPG, PNG and WebP files smaller and see exactly how much space you saved.'),
  t('image', 'image-converter', 'Image Converter', 'Change an image between JPG, PNG and WebP.'),
  t('image', 'image-resizer', 'Image Resizer', 'Set a new width and height in pixels, or scale by percentage.'),
  t('image', 'image-cropper', 'Image Cropper', 'Drag a crop box over your picture and keep only the part you need.'),
  t('image', 'image-rotator', 'Image Rotator', 'Rotate a picture by 90° steps or flip it horizontally or vertically.'),
  t('image', 'image-checker', 'Image Format & Size Checker', 'See an image’s real format, dimensions and file size.'),
  t('image', 'multiple-image-compressor', 'Multiple Image Compressor', 'Compress several images in one go and download them together.'),
  t('image', 'image-quality-controller', 'Image Quality Controller', 'Pick an exact quality level and compare the result before you download.'),
  t('image', 'image-background-color', 'Image Background Color Tool', 'Fill the transparent areas of a PNG or WebP with a solid colour.'),

  // ---- PDF (Phase 3) ----
  t('pdf', 'pdf-compressor', 'PDF Compressor', 'Reduce the size of a PDF where its content allows it.',
    { notes: ['Savings depend on the file. PDFs that are already optimised or have no photos may barely shrink.', 'The “maximum” method turns pages into pictures, so text can no longer be selected.'] }),
  t('pdf', 'pdf-to-word', 'PDF to Word Converter', 'Turn a text-based PDF into an editable DOCX file.', { alsoIn: ['word'],
    notes: ['Scanned PDFs are pictures of text and need OCR, which this tool doesn’t do.', 'Images, tables and complex layouts are not recreated.'] }),
  t('pdf', 'pdf-to-jpg', 'PDF to JPG & PNG Converter', 'Save each page of a PDF as a JPG or PNG image.'),
  t('pdf', 'jpg-to-pdf', 'JPG & PNG to PDF Converter', 'Combine pictures into a single PDF, one image per page.'),
  t('pdf', 'pdf-merger', 'PDF Merger', 'Join several PDFs into one file in the order you choose.'),
  t('pdf', 'pdf-splitter', 'PDF Splitter', 'Split a PDF into smaller files by page range.'),
  t('pdf', 'pdf-organizer', 'PDF Page Organizer', 'Reorder, rotate and delete pages using thumbnails.'),
  t('pdf', 'pdf-editor', 'PDF Editor', 'Add text, shapes, highlights and notes on top of a PDF.'),
  t('pdf', 'pdf-page-numbers', 'PDF Page Number Tool', 'Stamp page numbers onto every page of a PDF.'),
  t('pdf', 'pdf-watermark', 'PDF Watermark Tool', 'Add a text watermark to every page.'),
  t('pdf', 'pdf-password', 'PDF Password Protection', 'Add a password to a PDF.',
    { notes: ['Use a password you can remember. A lost password can’t be recovered.', 'The file is encrypted on your device with AES-256 and the password is never sent anywhere.'] }),
  t('pdf', 'pdf-metadata', 'PDF Metadata Viewer', 'See a PDF’s title, author, page count and other document properties.'),
  t('pdf', 'pdf-page-extractor', 'PDF Page Extractor', 'Pull selected pages out of a PDF into a new file.'),

  // ---- Word (Phase 4) ----
  t('word', 'docx-to-pdf', 'DOCX to PDF Converter', 'Convert a Word document to PDF.', { alsoIn: ['pdf'],
    notes: ['Fonts, tables and special formatting may look slightly different from Microsoft Word.'] }),
  t('word', 'docx-to-txt', 'DOCX to TXT Converter', 'Strip a Word document down to plain text.'),
  t('word', 'txt-to-docx', 'TXT to DOCX Converter', 'Turn a plain text file into a Word document.'),
  t('word', 'docx-to-html', 'DOCX to HTML Converter', 'Convert a Word document into clean HTML.'),
  t('word', 'docx-to-markdown', 'DOCX to Markdown Converter', 'Convert a Word document into Markdown.'),
  t('word', 'docx-compressor', 'DOCX Compressor', 'Shrink a Word file by optimising the images inside it.',
    { notes: ['Gains are often small, especially for text-only documents.'] }),
  t('word', 'docx-editor', 'DOCX Editor', 'Write and edit a document in a simple rich-text editor, then save it as DOCX.',
    { notes: ['Only .docx is supported. Older .doc files must be re-saved as .docx first.'] }),
  t('word', 'docx-viewer', 'DOCX Viewer', 'Open and read a Word document without Word installed.'),
  t('word', 'word-counter', 'Document Page & Word Counter', 'Count words, characters and estimated pages.'),
  t('word', 'document-text-extractor', 'Document Text Extractor', 'Copy all the text out of a document.'),
  t('word', 'document-formatter', 'Document Formatter', 'Clean up spacing, line breaks and basic formatting.'),

  // ---- Excel (Phase 5) ----
  t('excel', 'xlsx-to-csv', 'XLSX to CSV Converter', 'Export a worksheet as a CSV file.',
    { notes: ['CSV keeps values only: formulas, formatting and extra sheets are lost.'] }),
  t('excel', 'csv-to-xlsx', 'CSV to XLSX Converter', 'Turn a CSV file into an Excel workbook.'),
  t('excel', 'xlsx-to-pdf', 'XLSX to PDF Converter', 'Convert an Excel workbook to PDF.', { alsoIn: ['pdf'] }),
  t('excel', 'xlsx-to-json', 'XLSX to JSON Converter', 'Convert spreadsheet rows to JSON.'),
  t('excel', 'json-to-xlsx', 'JSON to XLSX Converter', 'Convert a JSON array into an Excel workbook.'),
  t('excel', 'excel-viewer', 'Excel Viewer', 'Browse every sheet and cell of a workbook in a table.'),
  t('excel', 'excel-editor', 'Excel Editor', 'Change cell values in a spreadsheet grid and save the file.'),
  t('excel', 'excel-merger', 'Excel File Merger', 'Combine several workbooks or sheets into one.'),
  t('excel', 'excel-sheet-exporter', 'Excel Sheet Exporter', 'Save individual sheets from a workbook as separate files.'),
  t('excel', 'csv-editor', 'CSV Editor', 'Edit a CSV file in a table.'),
  t('excel', 'duplicate-row-finder', 'Duplicate Row Finder', 'Find, highlight and remove repeated rows.'),
  t('excel', 'blank-row-remover', 'Blank Row Remover', 'Delete empty rows from a sheet.'),
  t('excel', 'column-row-manager', 'Column & Row Manager', 'Add, delete, hide and reorder columns and rows.'),
  t('excel', 'spreadsheet-formatter', 'Spreadsheet Formatter', 'Tidy column widths, headers and number formats.'),
  t('excel', 'excel-formula-helper', 'Excel Formula Helper', 'Browse common formulas with plain-language explanations and examples.'),
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
