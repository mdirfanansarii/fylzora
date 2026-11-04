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
  t('image', 'image-compressor', 'Image Compressor', "Compress JPG, PNG and WebP images online for free. Reduce image file size, adjust image quality and choose your preferred output format. Compare original and compressed file sizes before downloading."),
  t('image', 'image-converter', 'Image Converter', "Convert JPG, PNG, WebP, GIF and BMP images to JPG, PNG or WebP. Adjust output quality and keep image dimensions unchanged."),
  t('image', 'image-resizer', 'Image Resizer', "Resize JPG, PNG and WebP images by pixels or percentage. Keep the original aspect ratio or set custom dimensions."),
  t('image', 'image-cropper', 'Image Cropper', 'Crop JPG, PNG and WebP images online. Choose free crop or fixed aspect ratios, enter exact pixel dimensions and save the result in your preferred format.'),
  t('image', 'image-rotator', 'Image Rotator', 'Rotate JPG, PNG and WebP images online in 90-degree steps. Flip images horizontally or vertically and download the result in the original format.'),
  t('image', 'image-checker', 'Image Size Checker', "Check image size, dimensions and file format online. View image width and height in pixels and file size. Supports JPG, PNG, WebP, GIF and BMP files up to 25 MB."),
  t('image', 'multiple-image-compressor', 'Multiple Image Compressor', "Compress multiple JPG, PNG and WebP images online for free. Reduce the file size of up to 20 images at once, adjust image quality and download compressed images individually or as a ZIP file."),
  t('image', 'image-quality-controller', 'Image Quality Controller', "Adjust JPG and WebP image quality from 10% to 100%. Preview results and compare file sizes. PNG remains lossless."),
  t('image', 'image-background-color', 'Image Background Color Tool', "Change connected image background areas to a solid colour. Export as PNG, JPG or WebP."),

  // ---- PDF (Phase 3) ----
  t('pdf', 'pdf-compressor', 'PDF Compressor', "Compress PDF files online for free. Reduce PDF file size up to 25 MB with image or maximum compression. Compare the original and compressed file sizes before downloading.",
   { notes: ['Results depend on PDF content. PDFs without supported JPEG images may barely shrink.', 'Maximum compression makes text non-selectable and non-searchable.'] }),
  t('pdf', 'pdf-to-word', 'PDF to Word Converter', 'Convert PDF to Word online for free. Turn text-based PDF files into editable DOCX documents while keeping the text easy to edit.', { alsoIn: ['word'],
    notes: ['Scanned PDFs are pictures of text and need OCR, which this tool doesn’t do.', 'Images, tables and complex layouts are not recreated.'] }),
  t('pdf', 'pdf-to-jpg', 'PDF to JPG & PNG Converter', "Convert PDF to JPG or PNG images online for free. Choose 72, 144 or 216 DPI resolution, convert up to 60 PDF pages and download images individually or as a ZIP file."),
  t('pdf', 'jpg-to-pdf', 'JPG & PNG to PDF Converter', 'Convert JPG and PNG images to PDF online for free. Combine multiple pictures into a single PDF, with each image on a separate page. Create and download your PDF easily.'),
  t('pdf', 'pdf-merger', 'PDF Merger', 'Merge PDF files online for free. Combine multiple PDF documents into one file in your preferred order. Upload your PDFs and download the merged file.'),
  t('pdf', 'pdf-splitter', 'PDF Splitter', 'Split PDF files online for free by page range. Divide a PDF into smaller PDF files by choosing the pages you want to split. Download your split PDF files easily.'),
  t('pdf', 'pdf-organizer', 'PDF Page Organizer', 'Organize PDF pages online for free. Reorder, rotate or delete PDF pages using page thumbnails. Arrange your document the way you want before downloading the updated PDF.'),
  t('pdf', 'pdf-editor', 'PDF Editor', "Edit PDF files online for free up to 25 MB. Add text, highlights and shapes, erase areas or replace supported text. Use flatten mode to convert edited PDF pages into images."),
  t('pdf', 'pdf-page-numbers', 'PDF Page Number Tool', "Add page numbers to PDF files online for free. Choose the number position, starting number and format, including Page X of Y. Download your numbered PDF easily."),
  t('pdf', 'pdf-watermark', 'PDF Watermark Tool', "Add text watermarks to PDF files online for free. Customize watermark text, size and opacity, and place diagonal watermarks on your PDF pages. Download your watermarked PDF easily."),
  t('pdf', 'pdf-password', 'PDF Password Protection', "Protect PDF files with a password online for free. Encrypt your PDF directly in your browser and optionally restrict printing and copying in compatible PDF viewers. Your password is not sent to a server.",
    { notes: ['Use a password you can remember. A lost password cannot be recovered.', 'The file is encrypted in your browser. The password is not sent to a server.'] }),
  t('pdf', 'pdf-metadata', 'PDF Metadata Viewer', "View PDF metadata online for free. Check a PDF file's title, author, subject, keywords, creator, producer, creation date, modification date, page count, file size and encryption status."),
  t('pdf', 'pdf-page-extractor', 'PDF Page Extractor', 'Extract selected pages from PDF files online for free. Choose specific page numbers or page ranges to create a new PDF containing only the pages you need. Download your extracted PDF easily.'),

  // ---- Word (Phase 4) ----
  t('word', 'docx-to-pdf', 'DOCX to PDF Converter', 'Convert DOCX to PDF online for free. Turn Word documents into text-only PDF files that are easy to share and view. Please note that images, tables, fonts, colours and complex layouts are not preserved.', { alsoIn: ['pdf'],
    notes: ['This converter creates a text-only PDF. Images, table structure, fonts, colours and complex layouts are not preserved.'] }),
  t('word', 'docx-to-txt', 'DOCX to TXT Converter', "Extract text from DOCX files online for free. Convert Word documents into plain text that you can read, copy and reuse. Images, tables and text formatting are not preserved."),
  t('word', 'txt-to-docx', 'TXT to DOCX Converter', 'Convert TXT to DOCX online for free. Turn text files into editable Word documents or create DOCX files from text you type or paste.'),
  t('word', 'docx-to-html', 'DOCX to HTML Converter', 'Convert DOCX to HTML online for free. Turn Word documents into clean HTML files that you can download and use on websites. Headings, paragraphs and basic text formatting are supported.'),
  t('word', 'docx-to-markdown', 'DOCX to Markdown Converter', 'Convert DOCX to Markdown online for free. Turn Word documents into Markdown (.md) files that you can read, edit and reuse. The converted Markdown is also available to download.'),
  t('word', 'docx-compressor', 'DOCX Compressor', "Compress DOCX files online for free by optimizing supported JPEG images. Reduce Word document file size and download the compressed file. Text and PNG images are not compressed, so file size reduction may be small.",
    { notes: ['Gains are often small, especially for text-only documents.'] }),
  t('word', 'docx-editor', 'DOCX Editor', 'Edit DOCX files online for free with a simple Word document editor. Format text with bold, italic, underline, headings and lists. Start with a blank document or edit an uploaded DOCX file, then download your edited document.',
    { notes: ['Only .docx is supported. Older .doc files must be re-saved as .docx first.'] }),
  t('word', 'docx-viewer', 'DOCX Viewer', 'View DOCX files online for free without installing Microsoft Word. Open and read Word documents directly in your browser with headings, paragraphs and basic text formatting. Upload a DOCX file to view its content easily.'),
  t('word', 'word-counter', 'Word Counter', 'Count words and characters online for free with Fylzora Word Counter. Check sentences, paragraphs, estimated page count and reading time instantly. Type or paste your text to get accurate text statistics as you edit.'),
  t('word', 'document-text-extractor', 'Document Text Extractor', 'Extract text from DOCX files online for free with Fylzora. Convert Word documents into plain text, view the extracted content and copy it easily. No need to install Microsoft Word. Images, tables and formatting are not preserved.'),
  t('word', 'document-formatter', 'Document Formatter', 'Format text online for free with Fylzora Document Formatter. Remove extra spaces, clean repeated blank lines and convert curly quotes to straight quotes. Copy the cleaned text or download it as a TXT or DOCX file.'),

  // ---- Excel (Phase 5) ----
  t('excel', 'xlsx-to-csv', 'XLSX to CSV Converter', "Convert XLSX to CSV online for free with Fylzora. Export Excel worksheets as CSV files, choose one sheet or convert every sheet into separate CSV files. Spreadsheet values are preserved, but formatting, colours and formulas are not included.",
    { notes: ['CSV keeps values only: formulas, formatting and extra sheets are lost.'] }),
  t('excel', 'csv-to-xlsx', 'CSV to XLSX Converter', 'Convert CSV to XLSX online for free with Fylzora. Turn CSV files into Excel spreadsheets that you can open and edit in Microsoft Excel or other spreadsheet apps. Convert comma-separated data into a downloadable XLSX workbook.'),
  t('excel', 'xlsx-to-json', 'XLSX to JSON Converter', "Convert XLSX to JSON online for free with Fylzora. Turn Excel worksheets into JSON files. Use the first row as field names and convert multiple worksheets into separate JSON objects grouped by sheet name."),
  t('excel', 'xlsx-to-pdf', 'XLSX to PDF Converter', "Convert XLSX to PDF online for free with Fylzora. Turn Excel worksheets into landscape PDF pages that are easy to view and share. Wide tables continue on extra pages. Cell values are preserved, but colours, borders and fonts are not included.", { alsoIn: ['pdf'] }),
  t('excel', 'json-to-xlsx', 'JSON to XLSX Converter', 'Convert JSON to XLSX online for free with Fylzora. Turn JSON data into Excel spreadsheets that you can open and edit in Microsoft Excel or other spreadsheet apps. Convert arrays of objects or arrays into a downloadable XLSX workbook.'),
  t('excel', 'excel-viewer', 'Excel Viewer', 'View XLSX Excel files online for free with Fylzora. Open workbooks in your browser and browse multiple worksheets without installing Microsoft Excel. Preview up to 200 rows and 30 columns at a time. Supports XLSX files up to 20 MB.'),
  t('excel', 'excel-editor', 'Excel Editor', "Edit XLSX Excel files online for free with Fylzora. Change cell values in your spreadsheet, browse multiple worksheets and preview up to 200 rows and 30 columns at a time. Download your edited workbook as XLSX or CSV. Supports files up to 20 MB."),
  t('excel', 'excel-merger', 'Excel File Merger', 'Merge Excel files online for free with Fylzora. Combine up to 20 XLSX or CSV files into one Excel workbook. Keep all worksheets in the merged workbook or stack rows from the first sheet of each file into one sheet. Optionally skip repeated header rows.'),
  t('excel', 'excel-sheet-exporter', 'Excel Sheet Exporter', 'Export Excel sheets online for free with Fylzora. Save each worksheet from an XLSX workbook as a separate Excel (XLSX) or CSV file. Choose your preferred format and download the exported sheets individually. Supports XLSX files up to 20 MB.'),
  t('excel', 'csv-editor', 'CSV Editor', 'Edit CSV files online for free with Fylzora. Change cell values in a spreadsheet-style grid, preview up to 200 rows and 30 columns, and download your edited file as CSV or XLSX. Supports CSV files up to 20 MB.'),
  t('excel', 'duplicate-row-finder', 'Duplicate Row Finder', 'Find duplicate rows in Excel and CSV files online for free with Fylzora. Compare complete rows, highlight repeated entries and remove duplicates while keeping the first copy. Ignore uppercase and lowercase differences or skip the header row. Supports XLSX and CSV files up to 20 MB.'),
  t('excel', 'blank-row-remover', 'Blank Row Remover', 'Remove blank rows from Excel and CSV files online for free with Fylzora. Clean your spreadsheets by removing empty rows and optionally deleting completely empty columns. Download your cleaned file as XLSX or CSV. Supports files up to 20 MB.'),
  t('excel', 'column-row-manager', 'Column & Row Manager', 'Manage Excel and CSV files online for free with Fylzora. Add or delete rows and columns, move columns left or right, and save your updated spreadsheet as XLSX or CSV. Supports files up to 20 MB.'),
  t('excel', 'spreadsheet-formatter', 'Spreadsheet Formatter', 'Format Excel and CSV files online for free with Fylzora. Remove blank rows, trim extra spaces and convert numbers stored as text into numeric values. Create a clean XLSX workbook with bold headers, a frozen header row and automatic column widths.'),
  t('excel', 'excel-formula-helper', 'Excel Formula Helper', "Find Excel formulas online with Fylzora Formula Helper. Explore 20 useful Excel functions, including SUM, IF, COUNTIF, VLOOKUP, XLOOKUP, FILTER and UNIQUE. Search formulas, view examples and understand what each function does with simple explanations."),
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
