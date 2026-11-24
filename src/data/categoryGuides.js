// Introductory guidance for each category page (plain data, no JSX).
// `choose` is a short “which tool for which problem” list: [tool slug, text].

export const categoryGuides = {
  image: {
    intro: [
      'Most image problems come down to three numbers: the file size in KB or MB, the width and height in pixels, and the file format. When a form or website rejects your picture, it is usually unhappy with one of those, and the fix is different for each.',
      'A good habit is to check first and fix second. Open the Image Size Checker to see what you actually have, then use the tool that matches the problem. Keep your original file untouched and always work from it, because every round of lossy compression removes a little more detail.',
    ],
    choose: [
      ['image-checker', 'Not sure what is wrong? See the real format, dimensions and size first.'],
      ['image-compressor', 'File too big in KB or MB? Compress it.'],
      ['image-resizer', 'Wrong pixel dimensions? Resize it.'],
      ['image-cropper', 'Wrong shape, or too much empty space? Crop it.'],
      ['image-converter', 'The site wants JPG, PNG or WebP? Convert it.'],
      ['image-rotator', 'Photo opens sideways? Rotate it.'],
      ['image-background-color', 'Need a clean, plain background behind a signature or logo? Change the colour.'],
    ],
  },
  pdf: {
    intro: [
      'PDFs are designed to look the same everywhere, which makes them great for sharing and awkward for changing. The tools here cover the jobs people most often face: joining files for an application, taking a few pages out of a long document, shrinking a file for email, and turning pages into pictures or text.',
      'One thing to know before you start: a scanned PDF is really a set of photographs of pages. Tools that need real text, such as PDF to Word, cannot read it. If you can select a sentence with your mouse, the PDF contains text. If you cannot, it is a scan.',
    ],
    choose: [
      ['pdf-merger', 'Several files that must become one? Merge them.'],
      ['pdf-splitter', 'One file that must become several? Split it by page ranges.'],
      ['pdf-page-extractor', 'Only need a few pages out of many? Extract them.'],
      ['pdf-organizer', 'Pages in the wrong order, upside down or unwanted? Organise them.'],
      ['pdf-compressor', 'Too large for email or an upload form? Compress it.'],
      ['pdf-to-word', 'Need to edit the text? Convert it to Word.'],
      ['jpg-to-pdf', 'Photos of documents that need to be one PDF? Combine them.'],
      ['pdf-password', 'Sending something private? Protect it with a password.'],
    ],
  },
  word: {
    intro: [
      'Word files carry a lot with them: fonts, layout, images, tables. The tools here help when you need less than that, such as just the text, or more than that, such as moving a document into a website. Because the conversions are done in your browser, they keep what is easy to keep (text, headings, basic formatting) and are honest about what they leave out.',
      'Only the modern .docx format is supported. If you have an older .doc file, open it in Word or LibreOffice and save it as .docx first. Keep your original document, since conversions to plain text, PDF or Markdown cannot be turned back into the exact original.',
    ],
    choose: [
      ['docx-viewer', 'Just need to read a .docx on a device without Word? Open it in the viewer.'],
      ['docx-editor', 'Need to fix some text quickly? Edit it.'],
      ['docx-to-txt', 'Only want the words? Convert to plain text.'],
      ['docx-to-pdf', 'Need a simple, shareable text PDF? Convert to PDF.'],
      ['txt-to-docx', 'Have plain text that should be a Word document? Convert it.'],
      ['docx-to-html', 'Putting a document on a website? Convert to HTML.'],
      ['docx-to-markdown', 'Publishing in docs or GitHub? Convert to Markdown.'],
      ['docx-compressor', 'Document too large to send? Compress its pictures.'],
      ['word-counter', 'Need a word limit check? Count your text.'],
    ],
  },
  excel: {
    intro: [
      'Spreadsheet problems are rarely about the numbers. They are usually about the file: the wrong format for the system you are importing into, duplicate rows, empty rows, columns in the wrong order, or a CSV file that opens as one long line. The tools here deal with those everyday jobs.',
      'It helps to understand the difference between XLSX and CSV. An XLSX workbook can hold several sheets, formulas and formatting. A CSV file holds one plain table of values and nothing else, so formulas, colours and extra sheets are lost when you convert to it. Work on a copy of anything important.',
    ],
    choose: [
      ['excel-viewer', 'Just want to look inside a workbook? View it.'],
      ['xlsx-to-csv', 'A system wants CSV? Convert your sheet.'],
      ['csv-to-xlsx', 'Have a CSV and want a workbook? Convert it.'],
      ['xlsx-to-json', 'Need the data as JSON for a website or API? Convert it.'],
      ['excel-merger', 'Several files to combine? Merge them.'],
      ['duplicate-row-finder', 'Repeated entries? Find and remove them.'],
      ['blank-row-remover', 'Gaps in your data? Remove empty rows.'],
      ['spreadsheet-formatter', 'Messy export? Tidy it in one step.'],
      ['excel-formula-helper', 'Not sure which formula to use? Look it up.'],
    ],
  },
};
