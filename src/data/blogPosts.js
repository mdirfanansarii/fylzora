// Plain data (no JSX / no import.meta) so build scripts can import it too, for example to
// add every guide to sitemap.xml. Pages 1-4 have their own components; the rest are rendered
// from src/data/blogArticles.js by src/pages/BlogArticle.jsx.

export const blogPath = (post) => `/blog/${post.slug}`;

export const blogPosts = [
  {
    slug: 'how-to-reduce-image-to-100kb',
    title: 'How to Reduce an Image to 100KB Online',
    description: 'Learn how to compress JPG and PNG images online, reduce image size to around 100KB, choose WebP, and balance file size with image quality.',
    category: 'image',
    tools: ['image-compressor', 'image-checker', 'image-resizer'],
  },
  {
    slug: 'compress-image-without-losing-quality',
    title: 'How to Compress an Image Without Losing Quality',
    description: 'Learn how to compress images while preserving visual quality. Compare JPEG, PNG and WebP, adjust dimensions and quality, and reduce image file size online.',
    category: 'image',
    tools: ['image-compressor', 'image-quality-controller', 'image-checker'],
  },
  {
    slug: 'how-to-convert-jpg-to-webp-online',
    title: 'How to Convert JPG to WebP Online for Free',
    description: 'Learn how to convert JPG images to WebP online. Follow simple steps, understand WebP benefits and create smaller images for websites.',
    category: 'image',
    tools: ['image-converter'],
  },
  {
    slug: 'how-to-merge-pdf-files-for-free',
    title: 'How to Merge PDF Files for Free Online',
    description: 'Combine multiple PDF files into one document in the order you choose, avoid common problems, and check the result before you send it.',
    category: 'pdf',
    tools: ['pdf-merger', 'pdf-organizer', 'pdf-compressor'],
  },
  {
    slug: 'image-size-for-online-forms',
    title: 'Image Size for Online Forms: KB, Pixels and Centimetres Explained',
    description: 'Understand file size, pixel dimensions and print size, and follow a simple check, crop, resize and compress workflow to meet any upload requirement.',
    category: 'image',
    tools: ['image-checker', 'image-cropper', 'image-resizer', 'image-compressor', 'image-background-color'],
    updated: 'November 14, 2026',
    minutes: 6,
  },
  {
    slug: 'how-to-reduce-pdf-file-size',
    title: 'How to Reduce PDF File Size: What Actually Works',
    description: 'Why PDFs get large, how image compression and maximum compression differ, and practical steps to get a PDF under an email or upload limit.',
    category: 'pdf',
    tools: ['pdf-compressor', 'pdf-splitter', 'pdf-page-extractor', 'pdf-organizer'],
    updated: 'November 14, 2026',
    minutes: 5,
  },
  {
    slug: 'pdf-to-word-formatting',
    title: 'PDF to Word Formatting: Why It Changes and How to Fix It',
    description: 'Understand why a PDF never converts to Word perfectly, which parts survive, why scanned PDFs fail, and how to prepare a PDF for a cleaner editable document.',
    category: 'pdf',
    tools: ['pdf-to-word', 'pdf-splitter', 'docx-editor'],
    updated: 'November 14, 2026',
    minutes: 5,
  },
  {
    slug: 'fix-garbled-text-utf8',
    title: 'Fix Strange Symbols in Converted Text: A UTF-8 Guide',
    description: 'Learn what text encoding is, how to save a file as UTF-8 so Hindi, Urdu and accented letters survive, and which conversions have character limits.',
    category: 'word',
    tools: ['txt-to-docx', 'docx-to-txt', 'docx-to-pdf', 'pdf-editor'],
    updated: 'November 14, 2026',
    minutes: 5,
  },
  {
    slug: 'csv-vs-xlsx',
    title: 'CSV vs XLSX: Which Spreadsheet Format Should You Use?',
    description: 'Learn what is lost when you convert Excel to CSV, when each format is the better choice, and how to avoid common CSV problems like missing leading zeros.',
    category: 'excel',
    tools: ['xlsx-to-csv', 'csv-to-xlsx', 'csv-editor', 'excel-sheet-exporter'],
    updated: 'November 14, 2026',
    minutes: 6,
  },
  {
    slug: 'excel-to-json-for-developers',
    title: 'How to Convert Excel to JSON for a Website or API',
    description: 'Prepare a spreadsheet so it converts to clean JSON, understand how headers and multiple sheets are handled, and convert JSON back to Excel.',
    category: 'excel',
    tools: ['xlsx-to-json', 'json-to-xlsx', 'excel-viewer'],
    updated: 'November 14, 2026',
    minutes: 5,
  },
];
