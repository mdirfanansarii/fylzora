// Tool-specific guidance shown on every tool page (plain data, no JSX).
//   summary – the short lead under the page title, in plain words.
//   when    – when this tool helps in real life.
//   tips    – practical points that apply to this tool only.
// Facts here (limits, formats, behaviour) must match the tool itself and src/data/toolFaqs.js.

export const toolGuides = {
  // ------------------------------------------------------------------ IMAGE
  'image-compressor': {
    summary: 'Shrink a photo or screenshot so it fits an upload limit, loads faster or goes through email, and see the before-and-after size before you save anything.',
    when: 'Reach for it when a form, portal or email rejects your picture for being too big, when you are preparing images for a website, or when you want to save mobile data before sharing photos. If the dimensions are already right and you only need a smaller file, this is usually the quickest fix.',
    tips: [
      'Start from your original photo every time. Compressing an already compressed JPG again throws away more detail with each round.',
      'Photos usually shrink most as JPG or WebP. Keep PNG for logos, screenshots with text and anything that needs a see-through background.',
      'If the file is still too large at a quality you are happy with, reduce the pixel size first with the Image Resizer and then compress again.',
    ],
  },
  'multiple-image-compressor': {
    summary: 'Compress a whole batch of pictures in one go, then download them one by one or together as a single ZIP.',
    when: 'Useful after a trip or an event when a folder of photos has to be sent, when you are uploading a product gallery, or when several scanned pages saved as images must all meet the same size limit.',
    tips: [
      'Batch images that are alike. One quality setting suits a set of photos from the same camera better than a mix of screenshots and photographs.',
      'Check two or three results at full size before downloading everything. If they look soft, raise the quality a little and run the batch again from the originals.',
      'A large batch uses your device’s memory. If the page feels slow, process eight to ten images at a time instead of all twenty.',
    ],
  },
  'image-quality-controller': {
    summary: 'Choose the exact quality level for a JPG or WebP and watch how the file size changes before you download.',
    when: 'Handy when a form wants a file under a certain size and you would like to stay as close to it as possible without ruining the picture, or when you simply want to learn where quality starts to drop for your kind of image.',
    tips: [
      'Move the slider in small steps. Many photos look fine somewhere between 70% and 85%, and going lower often costs more clarity than it saves in size.',
      'PNG output is lossless, so the slider does not shrink it. Choose JPG or WebP when file size matters more than transparency.',
      'Judge the preview at its real size, not zoomed out. Faces, text and thin lines are the first places compression shows.',
    ],
  },
  'image-converter': {
    summary: 'Change an image from one format to another, such as PNG to JPG or JPG to WebP, without changing its width and height.',
    when: 'Handy when a website only accepts JPG, when you want lighter WebP images for a site, or when you have a GIF or BMP file and need a PNG, JPG or WebP copy of it.',
    tips: [
      'Converting PNG to JPG fills transparent areas with white, because JPG cannot store transparency. Keep the PNG if you need the see-through background.',
      'Turning a JPG into a PNG does not bring back lost quality. It only changes the container, and the PNG can be much larger.',
      'Check that the place you are uploading to accepts WebP before converting. Modern browsers show it, but some older tools and forms still refuse it.',
    ],
  },
  'image-resizer': {
    summary: 'Set an exact width and height in pixels, or scale an image by a percentage, while keeping its proportions if you want.',
    when: 'Use it when a form asks for specific pixel dimensions, when a photo is far bigger than the space it will be shown in, or when you need a smaller version for a profile picture, a banner or a social post.',
    tips: [
      'Leave the aspect-ratio option on unless you really want to stretch the picture. Type only the width and the height follows automatically.',
      'Making an image smaller is safe, but enlarging it beyond its original size makes it soft, because the extra pixels have to be guessed.',
      'Resizing is often the biggest single saving in file size. Do it before compressing if you are chasing a limit in KB.',
    ],
  },
  'image-cropper': {
    summary: 'Cut an image down to the part you need, using a free selection, a fixed ratio or exact pixel values.',
    when: 'Handy for square profile pictures (1:1), for 16:9 banners and thumbnails, for trimming empty borders off a scan or screenshot, and for preparing a photo to a required shape before resizing it.',
    tips: [
      'Choose the ratio first, then drag the box. The shape stays right while you position the crop.',
      'When a form states exact dimensions, type the values into the pixel fields instead of dragging. It is more precise.',
      'A tight crop lowers the file size too, but if you must meet a limit in KB, finish with the Image Compressor.',
    ],
  },
  'image-rotator': {
    summary: 'Turn a sideways photo upright or mirror an image, in simple 90-degree steps.',
    when: 'Useful for phone photos that open sideways, scanned documents that came out rotated, and for making a mirrored copy of a logo or picture.',
    tips: [
      'Rotation works in 90-degree steps. For a slightly crooked horizon you will need a photo editor.',
      'Flipping mirrors the image, so any text in it will read backwards. Use rotate, not flip, to fix orientation.',
      'Your original file is never changed, so you can download several versions and compare them.',
    ],
  },
  'image-background-color': {
    summary: 'Change connected background areas to a solid colour. Save the result as PNG, JPG or WebP.',
    when: 'Works best on pictures with a simple, even background, such as a signature on white paper, a logo on a flat colour or a product photographed against a plain sheet.',
    tips: [
      'The tool changes connected background areas, so check the preview carefully around the subject\'s edges.',
      'For a signature or stamp, a sharp photo taken in even light gives the cleanest result.',
      'Choose PNG or WebP to keep edges crisp. JPG is lossy and can leave faint halos around the subject.',
    ],
  },
  'image-checker': {
    summary: 'See an image’s real format, width, height and file size in a second, before you upload it anywhere.',
    when: 'Useful when a form states strict requirements, such as a maximum size in KB or minimum pixel dimensions, and you want to check your file instead of guessing. It reads the actual image data, not just the file extension.',
    tips: [
      'A file renamed from .png to .jpg is still a PNG. The checker shows the real format, which explains many “invalid file” errors.',
      'Look at the dimensions as well as the size. Many portals have both a KB limit and a pixel range.',
      'If the size is too large, go to the Image Compressor. If the dimensions are wrong, use the Image Resizer.',
    ],
  },

  // -------------------------------------------------------------------- PDF
  'pdf-compressor': {
    summary: 'Reduce the size of a PDF so it fits an email or upload limit, with a choice between shrinking embedded photos and turning every page into a picture.',
    when: 'Handy for scanned certificates, long reports full of photos, or any PDF a portal refuses because it is too large. Try the image option first and use the Maximum mode only if you do not need selectable text.',
    tips: [
      'Image compression keeps text selectable and searchable. Maximum mode turns every page into a picture, so text is no longer selectable or searchable.',
      'A PDF made from plain text is already small. If the result barely changes, the file probably has no photos to shrink.',
      'Compare the sizes shown in the tool. If the new file is not smaller, try another method or level instead of downloading it.',
    ],
  },
  'pdf-to-word': {
    summary: 'Turn the text of a PDF into an editable Word file when you need to reuse or rewrite it.',
    when: 'Best for PDFs that were created from a document, such as reports, articles and letters, when you want their text in Word. It cannot read scanned pages, because those are pictures of text.',
    tips: [
      'Check whether you can select text in the PDF. If you can, the converter can read it. If you only see a picture, the PDF is a scan and needs OCR first.',
      'Expect headings, paragraphs and bullet lists to come across, but not images, tables or columns. Plan a few minutes of tidying in Word.',
      'The tool handles up to 150 pages. For a longer file, split it into parts with the PDF Splitter first.',
    ],
  },
  'pdf-to-jpg': {
    summary: 'Save PDF pages as JPG or PNG pictures that you can post, drop into slides or send as images.',
    when: 'Handy when a platform only accepts images, when you want one page of a document in a presentation, or when you need a quick preview picture of a page.',
    tips: [
      'Standard (72 DPI) is fine for sharing on screen. Choose High or Very High if the image will be printed or zoomed.',
      'PNG keeps text and line art crisp. JPG makes smaller files for pages that are mostly photographs.',
      'Only the first 60 pages are converted. For a longer PDF, pull out the pages you need first with the PDF Page Extractor.',
    ],
  },
  'jpg-to-pdf': {
    summary: 'Put one or more pictures into a single PDF, one image per page, in the order you choose.',
    when: 'Useful for combining photos of a document, a set of scanned certificates or handwritten notes into one file when a portal asks for a PDF.',
    tips: [
      'Check the order before you create the PDF. Images are placed in the order they are listed.',
      'Photograph documents straight on and in good light. The PDF will only be as sharp as the pictures you give it.',
      'If the PDF turns out too large for an upload limit, compress the images first or run the finished PDF through the PDF Compressor.',
    ],
  },
  'pdf-merger': {
    summary: 'Combine several PDFs into one file, in exactly the order you want.',
    when: 'Useful for job or admission applications, for bundling invoices for accounts, or for joining the parts of an assignment into a single submission.',
    tips: [
      'Number your file names (01, 02, 03) before uploading so they are easy to put in the right order.',
      'Every PDF must open without a password. Remove any protection first.',
      'Open the merged file and flip through it once before you send it.',
    ],
  },
  'pdf-splitter': {
    summary: 'Break a PDF into separate files using page ranges such as 1-3, 5 and 8-10.',
    when: 'Handy for taking chapters out of a long document, sending someone only their part of a report, or splitting one scan of several documents into one file each.',
    tips: [
      'Each comma-separated range makes its own PDF. “1-3, 4-6” gives two files, while “1-6” gives one.',
      'Page numbers refer to the position in the PDF, not the number printed on the page.',
      'If you want one new PDF made from scattered pages, the PDF Page Extractor is the better fit.',
    ],
  },
  'pdf-organizer': {
    summary: 'Reorder, rotate and remove pages from a list, then save the updated PDF.',
    when: 'Fixes documents whose pages are in the wrong order or upside down, and lets you remove unwanted pages before sharing.',
    tips: [
      'Review the page list to confirm the order before you save.',
      'Rotation is saved into the new PDF, so check in the preview that each page looks upright.',
      'At least one page has to remain, so you cannot save an empty PDF.',
    ],
  },
  'pdf-editor': {
    summary: 'Make quick changes to a PDF: add text, highlight, draw shapes, and cover or replace small areas.',
    when: 'Handy for filling in a form that is not fillable, marking up a document for review, or covering a detail before you share a page.',
    tips: [
      'In normal mode a white box only hides what is underneath. The original text can still be copied, so it is not secure redaction.',
      'Turn on Flatten to remove content for good. It converts pages to images, so text is no longer selectable, and it also keeps Hindi and other scripts intact.',
      'Editing is disabled on rotated pages. Rotate the page upright first with the PDF Page Organizer.',
    ],
  },
  'pdf-page-numbers': {
    summary: 'Add page numbers to every page of a PDF, with your choice of position, starting number and “Page X of Y”.',
    when: 'Useful for assignments, reports and documents that will be printed or reviewed, where readers need to refer to pages by number.',
    tips: [
      'Use the starting number when your document continues from an earlier part, for example when it should begin at 5.',
      '“Page X of Y” helps readers notice a missing page in a printed copy.',
      'Numbers go at the bottom of the page. Check that they do not collide with a footer that is already there.',
    ],
  },
  'pdf-watermark': {
    summary: 'Stamp a diagonal text watermark such as DRAFT or CONFIDENTIAL on every page of a PDF.',
    when: 'Handy for marking drafts, internal documents, or copies that you are sharing for review only.',
    tips: [
      'Lower the opacity, somewhere around 15% to 30%, so the page stays readable underneath.',
      'Short words work best. The text is limited to 40 characters and sits at a fixed 45-degree angle.',
      'A watermark discourages casual reuse, but it does not stop someone who is determined to copy the content.',
    ],
  },
  'pdf-password': {
    summary: 'Add a password to a PDF so that only people who have it can open the file.',
    when: 'Use it before emailing a document that contains personal or financial details.',
    tips: [
      'Use at least six characters, and longer is better. A few unrelated words plus a number is stronger than a short single word.',
      'A forgotten password cannot be recovered, so keep an unprotected copy of the original somewhere safe.',
      'Send the password by a different route from the file, for example in a message or on a call.',
    ],
  },
  'pdf-metadata': {
    summary: 'Read a PDF’s hidden details: title, author, creator, dates, page count and whether it is encrypted.',
    when: 'Useful for checking what a PDF reveals before you publish or share it, or for finding out which program created a file.',
    tips: [
      'The author and creator fields can contain a real name or the software that made the file. Check them before publishing.',
      'This tool only reads the details. It does not change them.',
      'Password-protected or damaged PDFs may not open.',
    ],
  },
  'pdf-page-extractor': {
    summary: 'Pick the pages you want and save them as a new, smaller PDF.',
    when: 'Handy for sending just the signed page of a contract, a few certificates out of a long scan, or the one section of a report that someone needs.',
    tips: [
      'Mix single pages and ranges, for example “1-3, 7, 9-10”.',
      'Open the new PDF and check each page before you send it.',
      'Password-protected PDFs are not supported. Remove the password first.',
    ],
  },

  // ------------------------------------------------------------------- WORD
  'docx-to-pdf': {
    summary: 'Create a simple, text-only PDF from a Word document.',
    when: 'Useful when what matters is the words, and you want a PDF that is easy to share, read on a phone or print.',
    tips: [
      'This is a text-only conversion. Images, tables, fonts and colours are not kept.',
      'If your document depends on its layout, use Save as PDF inside Word instead.',
      'Characters outside basic Latin may appear as question marks in the PDF, so read it through before sending.',
    ],
  },
  'docx-to-txt': {
    summary: 'Pull the plain text out of a Word document.',
    when: 'Useful for moving text into a notes app, a script or a database, or for stripping heavy formatting before pasting into another editor.',
    tips: [
      'Only .docx files are supported. Save an older .doc file as .docx first.',
      'Tables, images, fonts and page layout are left out of plain text.',
      'Keep the original document for anything that depends on formatting.',
    ],
  },
  'txt-to-docx': {
    summary: 'Turn plain text into a Word document by uploading a .txt file or by typing and pasting.',
    when: 'Useful for lecture notes, a draft copied from a messaging app, exported logs, or any text you want to format properly in Word later.',
    tips: [
      'Save your text file as UTF-8 to keep Hindi, Urdu and accented letters intact.',
      'The result contains your text only. Add headings, fonts and images afterwards in your editor.',
      'You do not need a file at all. Typing or pasting into the text box works too.',
    ],
  },
  'docx-to-html': {
    summary: 'Convert a Word document into an HTML file you can use on a website or in a content system.',
    when: 'Handy when text written in Word has to go onto a web page, a blog or a CMS, and you want clean markup instead of pasted formatting.',
    tips: [
      'Headings, paragraphs and basic formatting are converted. Complex layouts may change, so review the result.',
      'The output is plain markup. Your site’s own styles decide how it finally looks.',
      'Preview the HTML before you download it and fix anything unexpected in your editor.',
    ],
  },
  'docx-to-markdown': {
    summary: 'Convert a Word document into Markdown that you can reuse in notes, documentation or on GitHub.',
    when: 'Useful when you write in Word but publish in a Markdown-based system, such as a docs site, a README or a note-taking app.',
    tips: [
      'Preview the Markdown first. Complex layouts and some Word formatting are not carried over.',
      'Only .docx files are supported. Save older .doc files as .docx first.',
      'Read headings and lists after converting. They are the parts that matter most when the text is published.',
    ],
  },
  'docx-compressor': {
    summary: 'Make a Word file smaller by optimising the JPEG pictures inside it.',
    when: 'Useful when a document full of photos is too large to email or upload.',
    tips: [
      'Only supported JPEG images are optimised. Text and PNG images are not touched, so a text-only file will barely change.',
      'Use the JPG quality slider before you upload. Lower quality gives a smaller file but a softer picture.',
      'You only get a download when the result is smaller than the original.',
    ],
  },
  'docx-editor': {
    summary: 'Make basic text edits to a Word document in your browser, or start a new one from scratch.',
    when: 'Handy for fixing a typo or rewriting a paragraph when you do not have Word at hand.',
    tips: [
      'Images, tables and complex layouts are not preserved when you save, so avoid opening documents that rely on them.',
      'Bold, italic, underline, headings and lists are available, along with undo.',
      'Only .docx files can be opened. Save an older .doc file as .docx first.',
    ],
  },
  'docx-viewer': {
    summary: 'Open and read a Word document in your browser without installing Microsoft Word.',
    when: 'Useful when someone sends you a .docx on a computer or phone that has no Word, and you only need to read it.',
    tips: [
      'This is a read-only preview. To change the text, use the DOCX Editor.',
      'Complex formatting may look different from the original.',
      'Only .docx files are supported.',
    ],
  },
  'word-counter': {
    summary: 'Count words, characters, sentences and paragraphs as you type or paste, and see an estimate of pages and reading time.',
    when: 'Useful for essays with a word limit, articles, captions and any writing that has a length target.',
    tips: [
      'Pages are estimated at 500 words per page and reading time at 200 words per minute, so treat them as rough guides.',
      'Sentences are counted by their ending marks (., ! and ?), so abbreviations with a full stop can raise the count slightly.',
      'Paragraphs are separated by blank lines. If your count looks low, check that there is an empty line between paragraphs.',
    ],
  },
  'document-text-extractor': {
    summary: 'Read the text of a Word document in your browser and copy it with one click.',
    when: 'Useful when you need the words from a .docx for an email, a note or a script, without the formatting coming along.',
    tips: [
      'Only .docx files are supported. TXT files and older .doc files are not accepted.',
      'Images and tables are not part of the extracted text, and scanned images of text are not read.',
      'Check the preview for missing text before you rely on the copy.',
    ],
  },
  'document-formatter': {
    summary: 'Clean up messy text by removing extra spaces, trimming line ends and reducing repeated blank lines.',
    when: 'Useful for text copied from emails, PDFs or chats that arrives with odd spacing, and for tidying notes before you share them.',
    tips: [
      'It only applies basic cleaning rules. It does not rewrite your text or change its meaning.',
      'Turn on “straighten curly quotes” when the text is going into code, a CSV file or a system that dislikes curly quotation marks.',
      'You can copy the cleaned text or download it as TXT or DOCX.',
    ],
  },

  // ------------------------------------------------------------------ EXCEL
  'xlsx-to-csv': {
    summary: 'Export an Excel sheet, or every sheet in a workbook, as CSV files.',
    when: 'Useful when another system, such as a database, an online shop or an email tool, wants a CSV import file instead of an Excel workbook.',
    tips: [
      'CSV keeps values only. Formulas appear as their calculated results, and formatting and colours are not kept.',
      'Choose one sheet, or export every sheet. Each sheet becomes its own CSV file.',
      'Open the result in a text editor and look at dates and numbers before you import it somewhere else.',
    ],
  },
  'csv-to-xlsx': {
    summary: 'Turn a CSV file into an Excel workbook that you can open, format and add formulas to.',
    when: 'Useful when data exported from an app arrives as CSV and you want to work on it in Excel, or share it with someone who prefers a workbook.',
    tips: [
      'A CSV holds a single table, so the workbook starts with one worksheet.',
      'The tool expects comma-separated values. If everything lands in one column, your file may use a different separator.',
      'Your original CSV is not changed. A new XLSX file is created for download.',
    ],
  },
  'xlsx-to-json': {
    summary: 'Convert spreadsheet rows into JSON objects for a website, an app or an API.',
    when: 'Handy when lists such as products, prices or FAQs live in Excel but your project needs them as JSON data.',
    tips: [
      'The first row of each sheet becomes the field names, so keep it as a clean header row.',
      'Blank headers get generated names and repeated headers get unique suffixes. It is neater to fix them in the sheet first.',
      'A workbook with several sheets is exported as one JSON object, grouped by sheet name.',
    ],
  },
  'xlsx-to-pdf': {
    summary: 'Create a PDF of your worksheet’s values that is easy to share and print.',
    when: 'Useful for sending a table to someone who only needs to read it, or for printing a sheet without opening Excel.',
    tips: [
      'The PDF contains cell values. Colours, borders and fonts are not preserved.',
      'Wide sheets continue on extra pages, so check how the columns are split before printing.',
      'Some unsupported characters can appear as question marks. Read the PDF through before sending.',
    ],
  },
  'json-to-xlsx': {
    summary: 'Turn a JSON file into an Excel workbook so you can read and edit the data as a table.',
    when: 'Useful for looking through an API response, an app export or any structured data in a familiar spreadsheet view.',
    tips: [
      'The JSON must be an array, either an array of objects or an array of arrays. Empty arrays cannot be converted.',
      'For an array of objects, the keys become the column headings.',
      'Nested objects and arrays are stored as JSON text inside a single cell.',
    ],
  },
  'excel-viewer': {
    summary: 'Open an Excel workbook in your browser and browse its sheets without installing Excel.',
    when: 'Useful when a spreadsheet arrives on a device that has no Excel and you just need to look at what is in it.',
    tips: [
      'The preview shows up to 200 rows and 30 columns at a time, so a large sheet can contain more than you see.',
      'Use the sheet tabs to move between worksheets.',
      'Only .xlsx files open. Save an older .xls file as .xlsx first.',
    ],
  },
  'excel-editor': {
    summary: 'Change cell values in an Excel workbook and save the result as XLSX or CSV.',
    when: 'Handy for fixing a few wrong entries when you do not have Excel with you.',
    tips: [
      'You can edit the visible grid of up to 200 rows and 30 columns. Data outside the visible grid is retained when saving, but the workbook is rebuilt from cell values. Original formatting is not retained, and formulas become their last calculated values.',
      'Keep a copy of important workbooks before editing, especially if they contain formulas or special formatting.',
      'You can save as XLSX, or as CSV if you only need the values.',
    ],
  },
  'excel-merger': {
    summary: 'Combine several Excel or CSV files into one workbook.',
    when: 'Useful for joining monthly reports, exports from different branches, or any set of files that share the same columns.',
    tips: [
      'Choose “keep all worksheets” to collect everything in one workbook, or “stack” to put the rows of every file into a single sheet.',
      'When stacking, only the first worksheet of each file is used. Skip header rows so the heading is not repeated in the middle of your data.',
      'You need at least two files, up to 20, and each can be up to 20 MB.',
    ],
  },
  'excel-sheet-exporter': {
    summary: 'Save each worksheet of a workbook as its own XLSX or CSV file.',
    when: 'Useful when you want to share a single sheet with someone, or when a system needs every sheet as a separate file.',
    tips: [
      'Choose XLSX to keep each sheet as a workbook, or CSV for plain values.',
      'CSV exports contain values only. Formulas appear as their last calculated results.',
      'Each exported file is downloaded separately.',
    ],
  },
  'csv-editor': {
    summary: 'Edit a CSV file in a spreadsheet-style grid and save it as CSV or XLSX.',
    when: 'Handy for correcting a few entries in an exported file before you import it somewhere.',
    tips: [
      'Commas and quotation marks inside cells are handled with standard CSV rules.',
      'The grid shows up to 200 rows and 30 columns at a time. Rows and columns outside the visible grid are included when saving. Empty lines and original CSV formatting may be normalized.',
      'Only CSV files can be opened here. For Excel files, use the Excel Editor.',
    ],
  },
  'duplicate-row-finder': {
    summary: 'Find repeated rows in an Excel or CSV file and remove them, keeping the first copy.',
    when: 'Useful for mailing lists, customer records or stock lists that have picked up the same entry more than once.',
    tips: [
      'The tool compares complete rows, so two rows count as duplicates only when every cell matches.',
      'Turn on the case option if “ABC” and “abc” should count as the same, and mark the first row as a header so it is not compared.',
      'Review the highlighted rows before you remove anything, then save the cleaned result as XLSX or CSV.',
    ],
  },
  'blank-row-remover': {
    summary: 'Delete empty rows, and optionally empty columns, from a spreadsheet.',
    when: 'Useful for exports that came with gaps in them, or for cleaning a table before importing or sorting it.',
    tips: [
      'A row counts as blank when all its cells are empty or contain only spaces. Rows with any data are kept.',
      'Turn on the empty-column option if blank columns are getting in the way as well.',
      'Look through the cleaned sheet before saving it as XLSX or CSV.',
    ],
  },
  'column-row-manager': {
    summary: 'Add or delete rows and columns, move columns around and edit cells, all in one grid.',
    when: 'Handy for reshaping a table before you share or import it, such as adding a column, deleting an unused one or putting columns in a new order.',
    tips: [
      'Use the left and right buttons to move a column rather than copying and pasting it.',
      'Deleting rows and columns cannot be undone once you save, so work on a copy of the file.',
      'You can save the updated sheet as XLSX or CSV.',
    ],
  },
  'spreadsheet-formatter': {
    summary: 'Tidy an Excel or CSV file in one step: trim spaces, fix numbers stored as text and get a clean, readable sheet.',
    when: 'Useful for data exported from another system that arrives with stray spaces, text-formatted numbers and no styling.',
    tips: [
      'Turn on “trim extra spaces” and “convert numbers stored as text” when your data came from an export or a copy-paste.',
      'The result is an XLSX file with a bold header, a frozen first row and automatically sized columns.',
      'Blank rows are removed automatically, so check that none of them mattered to you.',
    ],
  },
  'excel-formula-helper': {
    summary: 'Look up common Excel formulas with a plain-language explanation and an example you can adapt.',
    when: 'Useful when you know what you want to calculate, such as a lookup, a count with a condition or a list of unique values, but not which function to use.',
    tips: [
      'Search by what you want to do, for example “lookup”, “unique” or “count”, as well as by the formula name.',
      'Newer functions such as XLOOKUP, FILTER and UNIQUE need Excel 2021 or Microsoft 365.',
      'Copy the example into Excel and change the cell ranges to match your own sheet.',
    ],
  },
};
