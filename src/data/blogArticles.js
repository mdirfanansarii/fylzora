// Body text for the guides rendered by src/pages/BlogArticle.jsx.
// Block types: ['p', text] ['h2', text] ['h3', text] ['ul', [items]] ['ol', [items]] ['code', text]
// Inline: **bold** and [link text](/internal-path) work inside any text.
// Every tool fact here (limits, formats, behaviour) must match the tool itself and src/data/toolFaqs.js.

export const blogArticles = {
  // ---------------------------------------------------------------------------------------------
  'image-size-for-online-forms': {
    body: [
      ['p', 'Application forms, exam portals and government websites describe image requirements in three different ways, and mixing them up is the most common reason a picture gets rejected. “Under 50 KB”, “3.5 × 4.5 cm” and “200 × 230 pixels” all sound like “size”, yet they are three separate things. Once you know which one a form is asking for, the fix usually takes a minute.'],

      ['h2', 'The three kinds of image size'],
      ['ul', [
        '**File size (KB or MB)** is how much storage the file takes. It changes when you compress the image, change its dimensions or switch its format.',
        '**Pixel dimensions (width × height)** are the number of dots the picture is made of, for example 600 × 800. They decide how much detail the image holds.',
        '**Print size (cm or inches)** is how large the picture would be on paper. It depends on the pixels and on the DPI (dots per inch) used for printing.',
      ]],
      ['p', 'A form that asks for “passport size” may be describing the printed photo, while its upload box checks pixel dimensions and KB. These are different checks. For example, a form could ask for a 3.5 × 4.5 cm photo and also set a separate maximum file size. Meeting one requirement does not automatically meet the other. Read the instructions and write down every number before editing.'],

      ['h2', 'Converting centimetres to pixels'],
      ['p', 'When a form gives centimetres and no pixel count, convert them yourself. One inch is 2.54 cm, and pixels = inches × DPI.'],
      ['ul', [
        '3.5 × 4.5 cm is about 1.38 × 1.77 inches.',
        'At 300 DPI that is roughly **413 × 531 pixels**.',
        'At 200 DPI it is roughly **276 × 354 pixels**.',
      ]],
      ['p', 'If the form does not mention DPI, do not guess a print setting and assume it will pass. Ask the organisation or follow its photo instructions. For an online upload, the required pixel width and height matter more directly than the DPI label stored in the image.'],

      ['h2', 'A reliable order of work'],
      ['p', 'The order matters, because each step makes the next one easier and cheaper in quality.'],
      ['ol', [
        '**Check what you have.** Open the [Image Size Checker](/image-checker) to see the real format, dimensions and file size. It reads the actual image data, so it also catches a file that was only renamed from .png to .jpg.',
        '**Crop to the right shape.** Use the [Image Cropper](/image-cropper) with a fixed ratio, or type exact pixel values if the form requires them.',
        '**Resize to the required pixels.** The [Image Resizer](/image-resizer) lets you set the width and height, or scale by a percentage.',
        '**Compress last, only if the file is still over the KB limit.** Use the [Image Compressor](/image-compressor), or the [Image Quality Controller](/image-quality-controller) if you want to choose the quality yourself.',
        '**Check again.** Run the final file through the Image Size Checker and compare every number with the form.',
      ]],
      ['p', 'Compressing before you resize wastes effort: a large image gets squeezed hard, then shrunk again. Cropping and resizing first removes pixels you did not need, so the compressor has less to do and the picture stays clearer.'],

      ['h2', 'Signatures and stamps'],
      ['p', 'Signature uploads are usually small and have strict limits. A few habits make them far easier:'],
      ['ul', [
        'Sign with a dark pen on plain white paper and photograph it in even daylight, without shadows.',
        'Crop tightly around the signature so no pixels are wasted on empty paper.',
        'If the paper looks grey or patchy, the [Image Background Colour](/image-background-color) tool can replace a plain background with a solid colour. It works best on even backgrounds, so check the preview before you download.',
        'Save as JPG unless the form says otherwise. JPG files are usually the smallest and almost every portal accepts them.',
      ]],

      ['h2', 'Why uploads still get rejected'],
      ['ul', [
        '**The file is too large.** Resize first, then compress.',
        '**The file is too small.** Some forms also set a minimum, such as 20 KB. If compression pushes the file under it, raise the quality a little or use slightly larger dimensions.',
        '**The wrong format.** A forced rename does not change the real format. Use the [Image Converter](/image-converter) to produce a genuine JPG or PNG.',
        '**Wrong dimensions.** Check the width and height, not only the KB.',
        '**The photo looks blurry.** It was probably enlarged from a small image. Start again from the original or retake the picture.',
      ]],
    ],
    faqs: [
      ['Is “KB” the same as “kb”?', 'No. KB means kilobytes, which is what file sizes use. A lowercase “kb” can mean kilobits, which is eight times smaller. Forms almost always mean kilobytes, so use the KB value shown in your file manager or in the Image Size Checker.'],
      ['How many KB is 1 MB?', 'Roughly 1,000 KB. Depending on how it is counted it can be 1,024 KB, so leave a small margin when a form says “under 1 MB”.'],
      ['Can I make a small image bigger to meet a minimum size?', 'You can increase the pixel dimensions, but the picture will not gain real detail and may look soft. If the original is too small, retaking the photo is better.'],
      ['Which format should I use for form uploads?', 'JPG unless the form asks for something else. It gives the smallest files for photographs and is accepted almost everywhere.'],
    ],
  },

  // ---------------------------------------------------------------------------------------------
  'how-to-reduce-pdf-file-size': {
    body: [
      ['p', 'A PDF that is too large for an email, an upload form or a messaging app is one of the most common small frustrations with documents. Fortunately the reason is almost always the same, and so is the fix. This guide explains why PDFs grow and how to reduce their size while checking that the result is still usable.'],

      ['h2', 'Why a PDF gets large'],
      ['ul', [
        '**Images.** Photos and scanned pages are by far the biggest cause. A scan is a picture of each page, so a 20-page scan can easily be bigger than a 200-page text report.',
        '**Embedded fonts and graphics.** They add some weight but rarely make a file huge.',
        '**Page count.** More pages means more data.',
      ]],
      ['p', 'A PDF made purely from text is already small, which is why compressing it often changes almost nothing. If the file barely shrinks, that usually means there were no photos to shrink.'],

      ['h2', 'Choose settings carefully'],
      ['p', 'Open the [PDF Compressor](/pdf-compressor) and review the compression choices shown on the page. The exact result depends on the PDF: image-heavy scans may shrink differently from text-based documents. Start with a moderate setting, then inspect the downloaded file before trying a stronger option.'],

      ['h2', 'Step by step'],
      ['ol', [
        'Open the [PDF Compressor](/pdf-compressor) and add your file. The upload limit is 25 MB.',
        'Choose a moderate compression setting offered by the tool.',
        'Compress, then compare the original and compressed file sizes.',
        'If the file is still too large, try another available setting and compare the result again.',
        'Open the downloaded file and read a page or two at normal zoom, especially anything with small text or signatures.',
      ]],

      ['h2', 'If the PDF is too large to upload or still too big'],
      ['ul', [
        '**Split it first.** Cut the file into parts with the [PDF Splitter](/pdf-splitter), compress each part, then join them again with the [PDF Merger](/pdf-merger) if you need a single file.',
        '**Remove pages you do not need.** The [PDF Page Extractor](/pdf-page-extractor) saves only the pages you pick, and the [PDF Page Organizer](/pdf-organizer) can delete blank or duplicate pages.',
        '**Fix it at the source.** If you are building a PDF from photos, resize and compress the pictures before using [JPG to PDF](/jpg-to-pdf). Scanning at a lower resolution also gives smaller files.',
      ]],

      ['h2', 'Do not compress more than you need'],
      ['p', 'Every compression step trades detail for size. Stop as soon as the file meets the limit. Keep the original PDF as it is, and always give the result a different file name so you do not overwrite the good copy.'],
    ],
    faqs: [
      ['Why did my PDF barely get smaller?', 'Some PDFs are already compact, especially documents made mostly of text. The amount of reduction depends on the images and other data inside the file.'],
      ['Will the text still be selectable after compression?', 'Check the downloaded PDF after compression. Do not assume that text selection or document quality will remain unchanged; test the parts you need.'],
      ['Is the compressed PDF good enough for a job or admission form?', 'Usually yes, as long as every page stays readable. Always open the result and check small text, stamps and signatures before you upload it.'],
      ['What is the maximum file size?', 'The tool accepts a PDF of up to 25 MB. For larger files, split the document first.'],
    ],
  },

  // ---------------------------------------------------------------------------------------------
  'pdf-to-word-formatting': {
    body: [
      ['p', 'If you have ever converted a PDF to Word and found the result messy, the converter was probably not at fault. The two formats work in opposite ways, so no tool can turn one into the other perfectly. Knowing why helps you choose the right file, set realistic expectations and finish the clean-up quickly.'],

      ['h2', 'Why the formatting changes'],
      ['p', 'A Word document describes **flowing text**: paragraphs, headings and lists that rearrange themselves to fit the page. A PDF describes **fixed positions**: this word here, that line there, exactly as printed. It does not remember what a paragraph or a heading is. A converter therefore has to guess the structure from where things sit on the page, and the guesses are best on simple layouts.'],

      ['h2', 'What converts well and what does not'],
      ['ul', [
        '**Works well:** single-column text such as letters, articles, notes and reports, with headings and bullet lists.',
        '**Often needs fixing:** tables, multi-column layouts, text boxes and pages that mix text with graphics.',
        '**Not carried across:** pictures. The [PDF to Word](/pdf-to-word) tool is built to bring over the text, so plan to re-insert images in Word.',
      ]],

      ['h2', 'Scanned PDFs cannot be converted this way'],
      ['p', 'A scanned PDF is a photograph of each page, so there are no words in it for the tool to read. A quick test: open the PDF and try to select a sentence with your mouse. If you can highlight individual words, the PDF contains text. If you drag a box over a whole picture, it is a scan. Scans need OCR (text recognition) first, which this tool does not do.'],

      ['h2', 'Getting a cleaner result'],
      ['ol', [
        '**Use the original if you have it.** If you still have the Word file the PDF was made from, edit that instead.',
        '**Convert only what you need.** Pull the relevant pages out with the [PDF Page Extractor](/pdf-page-extractor) so there is less to tidy.',
        '**Work with smaller sections.** If the document is too large or difficult to review, use the [PDF Splitter](/pdf-splitter) to create page ranges and convert only the parts you need. Check the tool page for its current file and page limits.',
        '**Remove protection first.** A password-protected PDF has to be unlocked before any tool can read it.',
      ]],

      ['h2', 'A short clean-up checklist for the Word file'],
      ['ul', [
        'Apply real heading styles to titles so the structure is correct.',
        'Join lines that were broken in the middle of a sentence.',
        'Delete repeated page numbers, headers and footers that were converted as normal text.',
        'Rebuild any table with Word’s own table tool and re-insert images.',
        'Compare the first and last page with the PDF to be sure nothing is missing.',
      ]],
      ['p', 'For small corrections in Word without installing it, the [DOCX Editor](/docx-editor) can open a .docx and change the text. It does not preserve images and tables when saving, so use it for text-only documents.'],

      ['h2', 'When converting is the wrong tool'],
      ['p', 'If you only need to fill in a form, add a note or highlight a passage, use the [PDF Editor](/pdf-editor) and keep the file as a PDF. If you need just a few lines of text, copying them straight out of the PDF is quicker than converting everything.'],
    ],
    faqs: [
      ['Why does my converted document look different from the PDF?', 'Because a PDF stores exact positions rather than paragraphs. The converter rebuilds the structure from the page layout, which is never identical, especially for tables and columns.'],
      ['Can I convert a scanned PDF to Word?', 'Not with this tool. It reads real text, and a scan contains only pictures of text. OCR is needed first.'],
      ['Are images and tables converted?', 'The converter focuses on text, headings and simple lists. Plan to add images back and check tables manually.'],
      ['Can I convert a very long PDF?', 'Check the current file and page limits shown on the PDF to Word tool page. If your document is too large, split it into smaller page ranges and try the relevant sections.'],
    ],
  },

  // ---------------------------------------------------------------------------------------------
  'fix-garbled-text-utf8': {
    body: [
      ['p', 'You convert a text file and your Hindi, Urdu or accented words come out as boxes, question marks or strings like “Ã©”. This can happen when a program reads text using the wrong **text encoding**, or when the original characters were already replaced or damaged. The right fix depends on which problem occurred.'],

      ['h2', 'What text encoding is'],
      ['p', 'A computer stores text as numbers, and an encoding is the table that says which number means which letter. Old encodings could only describe a small set of characters. **UTF-8** can describe practically every writing system, including Hindi, Urdu, Arabic, accented European letters and symbols. It is the modern standard for the web and for most tools, so it is the safe choice for any file you plan to convert.'],
      ['p', 'Problems appear when the file was saved in one encoding and opened as another. For example, the Hindi word “नमस्ते” should remain “नमस्ते”. If it appears as “à¤¨à¤®à¤¸à¥à¤¤à¥”, the bytes may have been read as the wrong encoding. Save a fresh copy from the original source as UTF-8; changing the encoding of already-corrupted text may not restore it.'],

      ['h2', 'How to spot the problem'],
      ['ul', [
        'Question marks or diamond symbols where letters should be.',
        'Sequences such as “Ã©” or “à¤¹” instead of normal accented or Hindi letters.',
        'Everything looks fine until you open the converted file in another program.',
      ]],

      ['h2', 'How to save a file as UTF-8'],
      ['ul', [
        '**Windows Notepad:** choose File → Save As, and set “Encoding” to UTF-8 before saving.',
        '**Visual Studio Code:** use “Save with Encoding” from the encoding label at the bottom right and choose UTF-8.',
        '**Mac TextEdit:** convert the file to plain text first, then choose UTF-8 under “Plain Text Encoding” when you save.',
        '**Google Docs:** use File → Download → Plain Text (.txt). Then reopen the downloaded file in a text editor and confirm that the characters still look correct. If the text was already damaged before downloading, changing the encoding cannot recreate the missing original characters.',
      ]],
      ['p', 'After saving, convert again. For plain text to Word, the [TXT to DOCX](/txt-to-docx) tool reads UTF-8 text and builds the document from it. You can also skip the file entirely and paste your text into the tool’s text box.'],

      ['h2', 'Know the limits of each conversion'],
      ['p', 'Even when the source is perfect, not every converter can draw every script:'],
      ['ul', [
        'The [DOCX to PDF](/docx-to-pdf) tool has limitations with some non-Latin characters, which may appear incorrectly in the output. For documents in Hindi, Urdu or other scripts, export to PDF from Word, LibreOffice or Google Docs and inspect the result before sharing.',
        'The same applies to [XLSX to PDF](/xlsx-to-pdf). Read the PDF through before you send it.',
        'When editing a PDF that contains Hindi or other non-Latin text, turn on the Flatten option in the [PDF Editor](/pdf-editor). It converts pages to images so the text keeps its shape, though it is no longer selectable.',
      ]],

      ['h2', 'CSV files and Excel'],
      ['p', 'Excel sometimes opens a CSV with the wrong encoding when you simply double-click it. Open a blank workbook and use **Data → From Text/CSV**, then choose UTF-8 as the file origin. Our guide to [CSV vs XLSX](/blog/csv-vs-xlsx) covers other common CSV surprises.'],
    ],
    faqs: [
      ['Why do I see question marks instead of letters?', 'Either the file was saved in a different encoding than the one used to read it, or the conversion method cannot draw that character. Re-save the source as UTF-8 and, for PDF output, prefer your word processor’s own Save as PDF.'],
      ['Does UTF-8 work for Hindi and Urdu?', 'Yes. UTF-8 can represent virtually every script, so it is the right choice for text in Hindi, Urdu, Arabic and many other languages.'],
      ['Which program should I use to check the encoding?', 'A plain text editor such as Notepad or Visual Studio Code shows and lets you change the encoding when you save.'],
    ],
  },

  // ---------------------------------------------------------------------------------------------
  'csv-vs-xlsx': {
    body: [
      ['p', 'CSV and XLSX can both hold a table of data, and people often treat them as interchangeable. They are not. Choosing the wrong one can quietly cost you formulas, formatting or leading zeros. This guide explains what each format is, what you lose when you convert, and when each one makes sense.'],

      ['h2', 'What each format is'],
      ['ul', [
        '**XLSX** is an Excel workbook. It can contain several sheets, formulas, number and date formats, colours, column widths, charts and images.',
        '**CSV** (comma-separated values) is a plain text file. It holds **one table of values** and nothing more. Each line is a row, and commas separate the columns.',
      ]],

      ['h2', 'What you lose when you convert XLSX to CSV'],
      ['ul', [
        '**Formulas.** A cell with =A1+B1 becomes the calculated result, not the formula.',
        '**Formatting.** Colours, fonts, borders and column widths do not exist in CSV.',
        '**Extra sheets.** A CSV can only describe one sheet. The [XLSX to CSV](/xlsx-to-csv) tool lets you export one sheet or every sheet, and each sheet becomes its own file.',
        '**Charts and images.** They are not stored in plain text.',
      ]],
      ['p', 'Converting the other way with [CSV to XLSX](/csv-to-xlsx) gives you a workbook you can format and add formulas to, but it cannot recover what CSV never stored.'],

      ['h2', 'When CSV is the better choice'],
      ['ul', [
        'Importing data into another system, such as an online shop, a CRM, an email tool or a database. Many of them accept CSV and nothing else.',
        'Working with data in code. Almost every programming language reads CSV easily.',
        'Keeping a file small and simple, with no risk of hidden formatting.',
      ]],

      ['h2', 'When XLSX is the better choice'],
      ['ul', [
        'The sheet contains formulas that need to keep working.',
        'You want it to look good: headers, colours, column widths.',
        'There are several related sheets in one file.',
        'You are sharing it with people who will read or edit it in Excel.',
      ]],

      ['h2', 'Common CSV problems and fixes'],
      ['ul', [
        '**Leading zeros disappear.** A code such as 00123 can be present in the CSV, but Excel may interpret it as a number and display 123. Import that column as Text, or format the destination column as Text before bringing the data in. Check the saved result as well as the display.',
        '**Everything lands in one column.** The file may use a semicolon or tab instead of commas. Check how the values are separated.',
        '**Strange characters.** This is an encoding issue. See the guide on [fixing garbled text with UTF-8](/blog/fix-garbled-text-utf8).',
        '**Commas inside a value.** A value such as “Ranchi, Jharkhand” needs quotation marks in a comma-separated file so the comma is not mistaken for a new column. A standard CSV row can look like: `Irfan,"Ranchi, Jharkhand",Student`. Always test the exported file in the system that will import it.',
      ]],

      ['h2', 'A quick checklist before you import a CSV'],
      ['ol', [
        'Keep a copy of the original workbook.',
        'Make sure the first row holds clear, unique column headings.',
        'Look for blank rows and duplicates, and clean them before importing.',
        'Open the CSV in a plain text editor and confirm that dates and numbers look the way the other system expects.',
      ]],
    ],
    faqs: [
      ['Does CSV keep my formulas?', 'No. CSV stores values only, so a formula is saved as its calculated result.'],
      ['Can a CSV file have more than one sheet?', 'No. One CSV file is one table. To get several sheets out of a workbook, export each as its own CSV file.'],
      ['Why did a code with leading zeros change?', 'The CSV holds the zeros, but Excel treats the column as a number when you open it and drops them. Import the column as text.'],
      ['Is CSV smaller than XLSX?', 'Usually, because it contains no formatting or other extras, only the values.'],
    ],
  },

  // ---------------------------------------------------------------------------------------------
  'excel-to-json-for-developers': {
    body: [
      ['p', 'Product lists, price tables, FAQs and menu items often start life in a spreadsheet, while the website or app that uses them wants JSON. Converting is quick with the [XLSX to JSON](/xlsx-to-json) tool, and a little preparation in the sheet decides whether the output is tidy or needs hand editing.'],

      ['h2', 'Prepare your spreadsheet'],
      ['ul', [
        '**Use the first row as headers.** The tool turns it into the field names, so use short, clear names such as name, category and city.',
        '**Keep headers unique and filled in.** Blank headers get generated names and repeated headers get suffixes, which is rarely what you want. Fix them in the sheet first.',
        '**One table per sheet.** Avoid merged cells, notes above the table and blank rows in the middle of your data.',
        '**Clean the data.** Remove stray spaces and duplicates beforehand with the [Duplicate Row Finder](/duplicate-row-finder) or the [Blank Row Remover](/blank-row-remover).',
      ]],

      ['h2', 'What the JSON looks like'],
      ['p', "Each data row becomes an object, and the first row's headings become its keys. For example, start with this small spreadsheet (the values are sample data):"],
      ['code', 'name | category | city\nNotebook | Stationery | Ranchi\nDesk lamp | Home | Giridih'],
      ['p', 'The corresponding JSON is:'],
      ['code', '[\n  { "name": "Notebook", "category": "Stationery", "city": "Ranchi" },\n  { "name": "Desk lamp", "category": "Home", "city": "Giridih" }\n]'],
      ['p', 'If your workbook has several sheets, check the tool\'s output carefully rather than assuming how the sheets are combined or named. Confirm which sheet data appears in the JSON. Also check how numbers and dates came out: a cell displaying `00123` might be stored as text, while another cell displaying `123` might be numeric. Your application may treat those values differently. Confirm the JSON types and field names match what your code expects before using the file in production.'],

      ['h2', 'Use it in a project'],
      ['p', 'Save the file as something like `products.json`, then load it in your project. In a JavaScript project that supports JSON imports, you may be able to import it directly; otherwise, you can serve it as a static file and fetch it. Before using it, validate the JSON and check that every record has the fields your code expects. One missing comma or mismatched quote can make the whole file invalid.'],

      ['h2', 'Going the other way: JSON to Excel'],
      ['p', 'The [JSON to XLSX](/json-to-xlsx) tool turns a JSON file into a workbook so non-developers can read and edit it as a table. The file must be an array: either an array of objects or an array of arrays. Empty arrays cannot be converted. For an array of objects, the keys become the column headings, and any nested object or array is saved as JSON text inside a single cell.'],

      ['h2', 'Check before you ship'],
      ['ol', [
        'Open the original in the [Excel Viewer](/excel-viewer) and compare a few rows with the JSON.',
        'Look at the first and last records, because that is where problems usually hide.',
        'Keep the spreadsheet as the master copy and regenerate the JSON when it changes, instead of editing both by hand.',
      ]],
    ],
    faqs: [
      ['Which row is used for the field names?', 'The first row of each sheet. Give every column a unique, non-empty heading.'],
      ['What happens with several sheets?', 'Check the generated JSON to see which sheets are included and how the tool represents them. Do not assume every workbook sheet is exported in a particular structure.'],
      ['Can I convert JSON back to Excel?', 'Yes, if the JSON is an array of objects or an array of arrays. Nested values are stored as JSON text in a cell.'],
      ['Why do numbers or dates look different in the JSON?', 'Spreadsheets can store look-alike values as text or numbers, and dates have their own format. Check them in the output and adjust the sheet if needed.'],
    ],
  },
};
