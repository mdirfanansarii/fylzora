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
  t('image', 'image-compressor', 'Image Compressor', "Compress JPG, PNG and WebP images. Adjust quality, choose an output format and compare file sizes before downloading."),
  t('image', 'image-converter', 'Image Converter', "Convert JPG, PNG, WebP, GIF and BMP images to JPG, PNG or WebP. Adjust output quality and keep image dimensions unchanged."),
  t('image', 'image-resizer', 'Image Resizer', "Resize JPG, PNG and WebP images by pixels or percentage. Keep the original aspect ratio or set custom dimensions."),
  t('image', 'image-cropper', 'Image Cropper', 'Crop JPG, PNG and WebP images online. Choose free crop or fixed aspect ratios, enter exact pixel dimensions and save the result in your preferred format.'),
  t('image', 'image-rotator', 'Image Rotator', 'Rotate JPG, PNG and WebP images online in 90-degree steps. Flip images horizontally or vertically and download the result in the original format.'),
  t('image', 'image-checker', 'Image Size Checker', "Check image dimensions, file size and format. Supports JPG, PNG, WebP, GIF and BMP files up to 25 MB."),
  t('image', 'multiple-image-compressor', 'Multiple Image Compressor', "Compress up to 20 JPG, PNG or WebP images at once. Adjust quality and download files individually or as a ZIP."),
  t('image', 'image-quality-controller', 'Image Quality Controller', "Adjust JPG and WebP image quality from 10% to 100%. Preview results and compare file sizes. PNG remains lossless."),
  t('image', 'image-background-color', 'Image Background Color Tool', "Change connected image background areas to a solid colour. Export as PNG, JPG or WebP."),

  // ---- PDF (Phase 3) ----
  t('pdf', 'pdf-compressor', 'PDF Compressor', "Compress PDF files up to 25 MB using image or maximum compression. Compare file sizes before downloading.",
   { notes: ['Results depend on PDF content. PDFs without supported JPEG images may barely shrink.', 'Maximum compression makes text non-selectable and non-searchable.'] }),
  t('pdf', 'pdf-to-word', 'PDF to Word Converter', 'Convert PDF to Word online for free. Turn text-based PDF files into editable DOCX documents while keeping the text easy to edit.', { alsoIn: ['word'],
    notes: ['Scanned PDFs are pictures of text and need OCR, which this tool doesn’t do.', 'Images, tables and complex layouts are not recreated.'] }),
  t('pdf', 'pdf-to-jpg', 'PDF to JPG & PNG Converter', "Convert PDF pages to JPG or PNG at 72, 144 or 216 DPI. Export up to 60 pages as images or a ZIP file."),
  t('pdf', 'jpg-to-pdf', 'JPG & PNG to PDF Converter', 'Convert JPG and PNG images into one PDF, with each picture placed on a separate page.'),
  t('pdf', 'pdf-merger', 'PDF Merger', 'Merge PDF files online for free. Combine multiple PDF documents into one file in your preferred order. Upload your PDFs and download the merged file.'),
  t('pdf', 'pdf-splitter', 'PDF Splitter', 'Split PDF files by page range. Choose the pages you need and download the resulting PDF files.'),
  t('pdf', 'pdf-organizer', 'PDF Page Organizer', 'Organize PDF pages by moving, rotating or removing them. Review your changes before downloading.'),
  t('pdf', 'pdf-editor', 'PDF Editor', "Edit PDFs up to 25 MB. Add text, highlights and shapes, erase areas or replace supported text."),
  t('pdf', 'pdf-page-numbers', 'PDF Page Number Tool', "Add page numbers to PDF files online for free. Choose the number position, starting number and format, including Page X of Y. Download your numbered PDF easily."),
  t('pdf', 'pdf-watermark', 'PDF Watermark Tool', "Add customizable text watermarks to PDF pages. Adjust text size and opacity, and choose diagonal placement."),
  t('pdf', 'pdf-password', 'PDF Password Protection', "Encrypt PDF files with a password in your browser. Optionally restrict printing and copying in compatible viewers.",
    { notes: ['Use a password you can remember. A lost password cannot be recovered.', 'The file is encrypted in your browser. The password is not sent to a server.'] }),
  t('pdf', 'pdf-metadata', 'PDF Metadata Viewer', "View PDF details including title, author, keywords, dates, page count, file size and encryption status."),
  t('pdf', 'pdf-page-extractor', 'PDF Page Extractor', 'Extract selected PDF pages by entering page numbers or ranges. Download the extracted pages as a new PDF.'),

  // ---- Word (Phase 4) ----
  t('word', 'docx-to-pdf', 'DOCX to PDF Converter', 'Convert DOCX files into text-only PDFs. Images, tables, fonts, colours and complex layouts are not preserved.', { alsoIn: ['pdf'],
    notes: ['This converter creates a text-only PDF. Images, table structure, fonts, colours and complex layouts are not preserved.'] }),
  t('word', 'docx-to-txt', 'DOCX to TXT Converter', "Extract plain text from DOCX files. Images, tables and text formatting are not preserved."),
  t('word', 'txt-to-docx', 'TXT to Word Converter (TXT to DOCX)', 'Convert TXT files into editable DOCX documents, or type and paste text to create a Word file.'),
  t('word', 'docx-to-html', 'DOCX to HTML Converter', 'Convert DOCX files into HTML. Supports headings, paragraphs and basic text formatting.'),
  t('word', 'docx-to-markdown', 'DOCX to Markdown Converter', 'Convert DOCX documents into downloadable Markdown files that you can read, edit and reuse.'),
  t('word', 'docx-compressor', 'DOCX Compressor', "Reduce DOCX file size by optimizing supported JPEG images. Text and PNG images are not compressed.",
    { notes: ['Gains are often small, especially for text-only documents.'] }),
  t('word', 'docx-editor', 'DOCX Editor', 'Edit DOCX documents with bold, italic, underline, headings and lists. Create or upload a document.',
    { notes: ['Only .docx is supported. Older .doc files must be re-saved as .docx first.'] }),
  t('word', 'docx-viewer', 'DOCX Viewer', 'Open and read DOCX files in your browser without installing Microsoft Word. Supports basic text formatting.'),
  t('word', 'word-counter', 'Word Counter', 'Count words, characters, sentences and paragraphs. View estimated page count and reading time.'),
  t('word', 'document-text-extractor', 'Document Text Extractor', 'Extract and copy plain text from DOCX files. Images, tables and formatting are not preserved.'),
  t('word', 'document-formatter', 'Document Formatter', 'Clean text by removing extra spaces and blank lines and replacing curly quotes. Download as TXT or DOCX.'),

  // ---- Excel (Phase 5) ----
  t('excel', 'xlsx-to-csv', 'XLSX to CSV Converter', "Export one or all XLSX worksheets as CSV files. Cell values are preserved, but formatting and formulas are not.",
    { notes: ['CSV keeps values only: formulas, formatting and extra sheets are lost.'] }),
  t('excel', 'csv-to-xlsx', 'CSV to XLSX Converter', 'Convert CSV data into a downloadable XLSX workbook for use in Excel and other spreadsheet apps.'),
  t('excel', 'xlsx-to-json', 'XLSX to JSON Converter', "Convert XLSX worksheets to JSON. Use the first row as field names and group results by sheet."),
  t('excel', 'xlsx-to-pdf', 'XLSX to PDF Converter', "Convert XLSX worksheets into landscape PDF pages. Wide tables continue on extra pages; cell styling is not preserved.", { alsoIn: ['pdf'] }),
  t('excel', 'json-to-xlsx', 'JSON to XLSX Converter', 'Convert JSON arrays or arrays of objects into a downloadable XLSX workbook.'),
  t('excel', 'excel-viewer', 'Excel Viewer', 'View XLSX workbooks and browse worksheets. Preview up to 200 rows and 30 columns; supports files up to 20 MB.'),
  t('excel', 'excel-editor', 'Excel Editor', "Edit XLSX cell values and worksheets. Preview up to 200 rows and 30 columns, then download as XLSX or CSV."),
  t('excel', 'excel-merger', 'Excel File Merger', 'Combine up to 20 XLSX or CSV files. Merge worksheets or stack rows from the first sheet of each file.'),
  t('excel', 'excel-sheet-exporter', 'Excel Sheet Exporter', 'Export each XLSX worksheet as a separate XLSX or CSV file. Supports workbooks up to 20 MB.'),
  t('excel', 'csv-editor', 'CSV Editor', 'Edit CSV data in a spreadsheet-style grid. Preview up to 200 rows and 30 columns, then download as CSV or XLSX.'),
  t('excel', 'duplicate-row-finder', 'Duplicate Row Finder', 'Find and remove duplicate rows in XLSX or CSV files. Compare case-insensitively and optionally skip the header.'),
  t('excel', 'blank-row-remover', 'Blank Row Remover', 'Remove blank rows and optionally empty columns from Excel or CSV files. Download the cleaned XLSX or CSV.'),
  t('excel', 'column-row-manager', 'Column & Row Manager', 'Add, delete or move rows and columns in Excel and CSV files. Save the updated file as XLSX or CSV.'),
  t('excel', 'spreadsheet-formatter', 'Spreadsheet Formatter', 'Clean Excel and CSV data by removing blank rows, trimming spaces and formatting an XLSX workbook.'),
  t('excel', 'excel-formula-helper', 'Excel Formula Helper', "Explore 20 Excel formulas, including SUM, IF, COUNTIF, VLOOKUP and XLOOKUP. Search examples and explanations."),
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
  const sorted = pool.sort(
    (a, b) => Math.abs(tools.indexOf(a) - i) - Math.abs(tools.indexOf(b) - i)
  );

  if (tool.slug === 'image-checker' || tool.slug === 'image-compressor') {
    const prioritySlug = tool.slug === 'image-checker'
      ? 'image-compressor'
      : 'image-checker';
    const priorityTool = sorted.find((x) => x.slug === prioritySlug);
    if (priorityTool) {
      return [priorityTool, ...sorted.filter((x) => x.slug !== prioritySlug)].slice(0, n);
    }
  }

  return sorted.slice(0, n);
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
