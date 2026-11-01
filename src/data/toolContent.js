// Original "when to use it" text for each live tool, plus category tips. Shown on tool pages.
export const useCases = {
  'image-compressor': 'Shrink a photo so it fits a job-portal, exam-form or email attachment size limit.',
  'multiple-image-compressor': 'Prepare a whole folder of photos for upload or sharing in one pass.',
  'image-quality-controller': 'Find the lowest quality number that still looks good for your picture.',
  'image-converter': 'Switch a picture to WebP for your website, or to JPG when a form only accepts JPG.',
  'image-resizer': 'Match the exact pixel size a profile photo or banner requires.',
  'image-rotator': 'Fix a sideways phone photo or mirror an image.',
  'image-background-color': 'Give a transparent logo or signature a white or coloured background before printing.',
  'image-checker': 'Confirm what format and size a file really is before you upload it.',
  'pdf-merger': 'Combine scanned pages, certificates or invoices into a single application file.',
  'pdf-splitter': 'Break a long PDF into chapters or separate documents.',
  'pdf-page-extractor': 'Keep only the pages you need, such as one signed page from a contract.',
  'pdf-organizer': 'Put scanned pages in the right order, turn sideways pages upright, or delete blanks.',
  'pdf-page-numbers': 'Number the pages of a report or thesis before printing.',
  'pdf-watermark': 'Mark a draft as “DRAFT” or “CONFIDENTIAL” before sharing it.',
  'pdf-metadata': 'Check a PDF’s author, title, dates and page size before publishing it.',
  'jpg-to-pdf': 'Turn photos of documents into one tidy PDF.',
  'pdf-to-jpg': 'Save PDF pages as pictures for slides, social posts or chat apps.',
  'docx-to-pdf': 'Get a quick text-only PDF copy of a Word document.',
  'docx-to-txt': 'Strip a document down to plain text for notes or code.',
  'txt-to-docx': 'Turn plain notes into a Word document you can format later.',
  'docx-to-html': 'Move Word content into a web page or CMS.',
  'docx-to-markdown': 'Convert a document into Markdown for GitHub, blogs or note apps.',
  'docx-compressor': 'Reduce a Word file that is large because of photos inside it.',
  'docx-editor': 'Make quick text changes or write a simple document without installing Word.',
  'docx-viewer': 'Read a Word file on a device that has no Word installed.',
  'word-counter': 'Check an essay against a word limit or estimate its page count.',
  'document-text-extractor': 'Copy all the text out of a document in one click.',
  'document-formatter': 'Clean up text pasted from emails or PDFs: extra spaces, blank lines and curly quotes.',
  'xlsx-to-csv': 'Export a sheet for an import tool or database that wants CSV.',
  'csv-to-xlsx': 'Open a CSV export as a proper Excel workbook.',
  'xlsx-to-pdf': 'Share a simple, read-only copy of a table.',
  'xlsx-to-json': 'Turn spreadsheet rows into JSON for a website or API.',
  'json-to-xlsx': 'Look at API or app data in a spreadsheet.',
  'excel-viewer': 'Browse a workbook’s sheets without opening Excel.',
  'excel-editor': 'Fix a few cell values quickly and save the file again.',
  'excel-merger': 'Combine monthly sheets or several exports into one file.',
  'excel-sheet-exporter': 'Pull every sheet of a workbook out as its own file.',
  'csv-editor': 'Correct a CSV file without worrying about quotes and commas.',
  'duplicate-row-finder': 'Find repeated customers, orders or emails in a list.',
  'blank-row-remover': 'Remove empty rows left behind by exports and copy-paste.',
  'column-row-manager': 'Add, delete or reorder columns and rows in a table.',
  'spreadsheet-formatter': 'Make a raw export readable with a bold header, frozen first row and sensible column widths.',
  'excel-formula-helper': 'Look up the right function and see an example you can copy.',
};

Object.assign(useCases, {
  'image-cropper': 'Cut a photo down to a passport, profile or banner shape, with exact pixel control.',
  'pdf-compressor': 'Get a PDF under an email or upload size limit.',
  'pdf-editor': 'Fill in a form by typing on it, highlight key lines or mark up a document.',
  'pdf-to-word': 'Reuse the text of a PDF report or article in an editable document.',
  'pdf-password': 'Lock a PDF with a password before emailing a sensitive document.',
});

export const categoryTips = {
  image: ['PNG is lossless, so photos usually shrink far more as JPG or WebP.', 'Lowering the quality a little (70–80%) often saves a lot of space with little visible change.', 'Resizing to the dimensions you actually need is the biggest saving of all.'],
  pdf: ['Scanned PDFs are pictures of text; text-based tools and conversions work best on PDFs created from documents.', 'Keep the original file until you have checked the result.', 'Password-protected PDFs can’t be opened by these tools.'],
  word: ['Only .docx files are supported. Re-save older .doc files as .docx first.', 'Conversions keep text and basic structure; complex layouts, tables and fonts can change.'],
  excel: ['Only .xlsx and .csv files are supported. Re-save older .xls files as .xlsx first.', 'Saved files contain values, not formulas, formatting or charts.', 'CSV can’t store several sheets, formulas or colours.'],
};
export const toolSeoContent = {
  'image-checker': {
    intro: 'Check image dimensions, file size and actual image format online for free. Fylzora Image Checker helps you inspect JPG, PNG, WebP, GIF and BMP images before uploading them to websites, forms or applications.',
    steps: [
      'Select an image from your device or drag it into the upload area.',
      'View its actual format, dimensions and file size.',
      'Check the details before uploading or sharing your image.'
    ],
    faqs: [
      ['How can I check image size online?', 'Upload your image to the Image Checker. It displays the file size and image dimensions.'],
      ['Which image formats are supported?', 'The checker supports JPG, PNG, WebP, GIF and BMP images.'],
      ['Can I check image dimensions in pixels?', 'Yes. You can see the image width and height in pixels.'],
      ['Is my image uploaded to a server?', 'No. Image checking happens in your browser on your device.']
    ]
  },
  'image-compressor': {
    intro: 'Compress images online for free and reduce photo file size for websites, email attachments, online forms and job applications. Use Fylzora to make images smaller while keeping their quality as clear as possible.',
    steps: [
      'Select the image you want to compress.',
      'Choose the available compression settings.',
      'Check the compressed image and download it.'
    ],
    faqs: [
      ['How can I reduce a photo to 100 KB?', 'Upload your photo, adjust the available compression settings and check the output file size. Repeat if needed.'],
      ['Does image compression reduce quality?', 'It can. Lower file sizes may reduce image quality, so check the result before downloading.'],
      ['Which image formats can I compress?', 'Supported formats depend on the tool options. Check the upload area for accepted formats.'],
      ['Is this image compressor free?', 'Yes. You can use the online image compressor for free without creating an account.']
    ]
  },
  'txt-to-docx': {
    intro: 'Convert TXT files to DOCX online for free. Turn plain text notes, drafts and other text files into editable Microsoft Word-compatible documents without installing extra software.',
    steps: [
      'Choose a TXT file from your device.',
      'Start the TXT to DOCX conversion.',
      'Download the generated DOCX document.'
    ],
    faqs: [
      ['How do I convert TXT to DOCX?', 'Select your TXT file, run the conversion and download the DOCX document.'],
      ['Can I edit the converted DOCX file?', 'Yes. You can open and edit the downloaded DOCX file in Microsoft Word or another compatible editor.'],
      ['Does TXT support images and formatting?', 'Plain TXT files contain text only, so the conversion cannot restore images or formatting that were not in the original file.'],
      ['Is TXT to DOCX conversion free?', 'Yes. You can use this converter online for free.']
    ]
  }
};
