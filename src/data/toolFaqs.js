export const toolFaqs = {
  // IMAGE TOOLS
  'image-compressor': [
    ['How can I reduce an image file size?', 'Choose an image, adjust the compression settings and check the resulting file size before downloading.'],
    ['Will compression reduce image quality?', 'It can. Lower compression quality may make the image smaller but less clear. Always preview the result.'],
    ['Which image formats are supported?', 'The image tools support JPEG, PNG and WebP for normal image processing.'],
    ['How can I reduce a picture to 100KB?', 'Choose your image and adjust the compression settings. Try lower quality settings until the file size is close to or below 100KB.'],
    ['How can I make a photo smaller than 100KB?', 'Compress the photo and check its output size. If it is still too large, try reducing its dimensions or compression quality.'],
    ['Can I compress an image to exactly 100KB?', 'The final file size depends on the image and compression settings. Check the output size after compression.']
  ],
  'multiple-image-compressor': [
    ['Can I compress multiple images together?', 'Yes. You can select multiple images and process them in one session.'],
    ['How many images can I process at once?', 'The tool supports up to 20 images in one batch.'],
    ['Can I check the results before downloading?', 'Yes. Review the compressed image results and their file sizes before downloading.']
  ],
  'image-quality-controller': [
    ['What does image quality control do?', 'It lets you adjust the output quality to balance image clarity and file size.'],
    ['Does lower quality make an image smaller?', 'Usually, yes. Lower quality can reduce file size, but it may also make details less clear.'],
    ['How do I choose the right quality?', 'Try a few quality levels and compare the preview and file size before downloading.']
  ],
  'image-converter': [
    ['Which formats can I convert images to?', 'You can choose JPG, PNG or WebP as the output format.'],
    ['Does converting an image change its dimensions?', 'Format conversion changes the file format. Use the Image Resizer if you also need different dimensions.'],
    ['Can I convert PNG to JPG?', 'Yes. Choose JPG as the output format. Transparent areas are filled with a white background when creating JPG files.']
  ],
  'image-resizer': [
    ['Can I resize an image to exact pixel dimensions?', 'Yes. Enter the width and height in pixels using the available resize controls.'],
    ['Can I keep the original image proportions?', 'Yes. The aspect-ratio option can keep the image proportions while resizing.'],
    ['Will resizing reduce image quality?', 'Changing dimensions can affect sharpness. Check the output before downloading.']
  ],
  'image-rotator': [
    ['Can I rotate an image?', 'Yes. Use the rotation controls to change the image orientation.'],
    ['Can I flip an image?', 'Yes. The tool includes horizontal and vertical flip options.'],
    ['Will the original image be changed?', 'No. The tool creates a processed output file. Your original file remains unchanged.']
  ],
  'image-background-color': [
    ['Can I change a transparent image background?', 'Yes. You can replace connected background areas with a selected colour.'],
    ['Can I use a white background?', 'Yes. Choose white or another available colour for the output background.'],
    ['Will every part of the image be replaced?', 'The tool detects connected areas from the image edges. Check the preview because complex images may need careful results checking.']
  ],
  'image-checker': [
    ['How can I check image dimensions online?', 'Select an image to view its width, height and file size.'],
    ['Which image formats can I check?', 'The checker supports JPG, PNG, WebP, GIF and BMP images.'],
    ['Does it show the actual image format?', 'Yes. It checks the image data to identify its format, along with its dimensions and file size.']
  ],
  'image-cropper': [
    ['Can I crop an image to a fixed ratio?', 'Yes. Available ratios include 1:1, 4:3, 3:2, 16:9 and 9:16, as well as free crop.'],
    ['Can I enter exact crop dimensions?', 'Yes. You can set the crop position and size using pixel values.'],
    ['Which output formats are available?', 'You can save the cropped image as JPG, PNG or WebP.']
  ],

  // PDF TOOLS
  'pdf-merger': [
    ['Can I combine multiple PDF files?', 'Yes. Add PDF files and combine them into one document.'],
    ['Can I change the order of PDF files?', 'Yes. Arrange the files in the required order before merging.'],
    ['Can I merge password-protected PDFs?', 'No. Password-protected PDFs are not supported by these PDF tools.']
  ],
  'pdf-splitter': [
    ['Can I split a PDF into separate files?', 'Yes. Enter page ranges to create separate PDF files.'],
    ['Can I split a PDF by page numbers?', 'Yes. Use page numbers or page ranges in the page-range field.'],
    ['What if my PDF is password-protected?', 'Password-protected PDFs cannot be opened by this tool.']
  ],
  'pdf-page-extractor': [
    ['Can I extract selected pages from a PDF?', 'Yes. Enter the page numbers or ranges you want to keep.'],
    ['Will selected pages be combined into one PDF?', 'Yes. The selected pages are combined into a single output PDF.'],
    ['Can I extract pages from a protected PDF?', 'No. Password-protected PDFs are not supported.']
  ],
  'pdf-organizer': [
    ['Can I rearrange PDF pages?', 'Yes. Move pages into the order you want before saving the PDF.'],
    ['Can I rotate or delete PDF pages?', 'Yes. You can rotate pages by 90 degrees and delete pages you do not need.'],
    ['Can I delete every page?', 'No. At least one page must remain in the PDF.']
  ],
  'pdf-page-numbers': [
    ['Can I add page numbers to a PDF?', 'Yes. The tool adds page numbers to your PDF pages.'],
    ['Can I choose where page numbers appear?', 'Yes. You can place them at the bottom-left, bottom-centre or bottom-right.'],
    ['Can I start numbering from a different number?', 'Yes. Set the starting number and optionally enable the Page X of Y format.']
  ],
  'pdf-watermark': [
    ['Can I add a text watermark to a PDF?', 'Yes. Enter watermark text and apply it to the PDF pages.'],
    ['Can I change watermark size and opacity?', 'Yes. You can adjust the text size and transparency.'],
    ['Can I use a long watermark message?', 'The watermark text is limited to 40 characters.']
  ],
  'pdf-metadata': [
    ['What PDF information can I check?', 'The tool can show details such as title, author, subject, keywords, creator, producer and dates.'],
    ['Can I see the number of PDF pages?', 'Yes. The metadata view includes the page count and first-page dimensions.'],
    ['Does it show whether a PDF is encrypted?', 'Yes. The metadata includes an encrypted status.']
  ],
  'jpg-to-pdf': [
    ['Can I convert multiple images into one PDF?', 'Yes. You can select multiple supported images and create a PDF from them.'],
    ['Which image formats can I use?', 'The tool accepts JPEG, PNG and WebP images.'],
    ['How are images placed in the PDF?', 'Each image is fitted to a PDF page. Check the result before sharing or printing it.']
  ],
  'pdf-to-jpg': [
    ['Can I convert PDF pages into JPG images?', 'Yes. You can export PDF pages as JPG or PNG images.'],
    ['Can I choose image quality?', 'Yes. Choose one of the available rendering quality levels. Higher levels use higher resolution.'],
    ['How many pages can I convert?', 'The tool processes up to the first 60 pages of a PDF.']
  ],
  'pdf-compressor': [
    ['How can I reduce PDF file size?', 'Choose a compression mode and level, then download the result if it is smaller.'],
    ['Will compressed PDF text remain selectable?', 'In the image-compression mode, text and vector content remain selectable. Maximum compression renders pages as images, so text is no longer selectable.'],
    ['Why did my PDF size not reduce?', 'The PDF may not contain supported JPEG images to compress, or the selected mode may not produce a smaller file.']
  ],
  'pdf-editor': [
    ['Can I add text to a PDF?', 'Yes. You can add text, highlight content and draw shapes such as rectangles, ellipses and lines.'],
    ['Can I edit or remove existing PDF text?', 'The editor supports limited editing of existing text and can cover areas with a white rectangle. Results depend on the PDF text layout.'],
    ['What happens when I use flatten mode?', 'Flatten mode turns pages into images with edits included. The resulting text is no longer selectable or searchable.']
  ],
  'pdf-to-word': [
    ['Can I convert a PDF into an editable Word document?', 'Yes. The tool extracts selectable text and creates a DOCX file.'],
    ['Can it convert scanned PDFs?', 'No. Scanned pages are pictures of text. This tool does not include OCR.'],
    ['Will images, tables and fonts be preserved?', 'No. The conversion detects headings, paragraphs and bullet lists, but does not recreate images, tables, columns or exact fonts. The limit is 150 pages.']
  ],
  'pdf-password': [
    ['How do I add a password to a PDF?', 'Select a PDF, enter a password of at least 6 characters, confirm it and choose Protect PDF.'],
    ['Can I block printing and copying?', 'Yes. You can enable the option to restrict printing and copying in PDF viewers that respect these permissions.'],
    ['Can I recover a forgotten PDF password?', 'No. The password cannot be recovered. Keep a safe copy of your password and original PDF.']
  ],

  // WORD TOOLS
  'docx-to-pdf': [
    ['Can I convert a Word document to PDF?', 'Yes. Select a DOCX file to create a PDF copy.'],
    ['Will images and tables appear in the PDF?', 'This converter creates a text-only PDF. Images, tables, fonts and complex styling are not preserved.'],
    ['Which Word file format is supported?', 'The tool supports DOCX files. Older DOC files need to be saved as DOCX first.']
  ],
  'docx-to-txt': [
    ['Can I convert DOCX to plain text?', 'Yes. The tool extracts document text and creates a TXT file.'],
    ['Will formatting be included in the TXT file?', 'No. Plain text does not preserve fonts, colours, images or page layout.'],
    ['Can I use an old DOC file?', 'The tool supports DOCX files. Save older DOC files as DOCX before using it.']
  ],
  'txt-to-docx': [
    ['How do I convert TXT to DOCX?', 'Choose a TXT file or enter text, then create and download the DOCX document.'],
    ['Can I edit the converted DOCX file?', 'Yes. Open the downloaded DOCX file in Microsoft Word or another compatible editor.'],
    ['Will the conversion add images or formatting?', 'No. TXT contains plain text, so the conversion cannot restore formatting or images that were not in the original.']
  ],
  'docx-to-html': [
    ['Can I convert a Word document to HTML?', 'Yes. Select a DOCX file to create an HTML file.'],
    ['Will the HTML look exactly like the Word document?', 'Not always. The conversion focuses on document content and basic structure; complex layouts may change.'],
    ['Can I use the HTML on a website?', 'Yes. You can review the generated HTML and use it in a website or content editor.']
  ],
  'docx-to-markdown': [
    ['Can I convert DOCX to Markdown?', 'Yes. The tool extracts Word document content into Markdown format.'],
    ['Will complex Word formatting be preserved?', 'No. Complex layouts and some formatting may change during conversion.'],
    ['Where can I use the Markdown file?', 'You can use Markdown in compatible note apps, blogs and platforms such as GitHub.']
  ],
  'docx-compressor': [
    ['How does DOCX compression work?', 'The tool optimises supported JPEG images inside a DOCX file to try to reduce its size.'],
    ['Will all images become smaller?', 'Only supported JPEG images are optimised. PNG images and document text are not changed.'],
    ['Why is my compressed DOCX not smaller?', 'Text-only documents or files without supported JPEG images may not become smaller. The tool only creates a download when the result is smaller.']
  ],
  'docx-editor': [
    ['Can I create a new Word document?', 'Yes. You can start with a blank document or load a DOCX file.'],
    ['What editing options are available?', 'The editor supports basic text formatting, headings, paragraphs, bullet lists, numbered lists and undo.'],
    ['Will images and tables be preserved?', 'Images, tables and complex layouts are not preserved by this editor.']
  ],
  'docx-viewer': [
    ['Can I view a DOCX file without Microsoft Word?', 'Yes. Select a DOCX file to view its converted content in your browser.'],
    ['Will the document look exactly the same?', 'Not always. The viewer displays the document structure, but complex formatting may differ.'],
    ['Can I edit the document in the viewer?', 'The viewer is for reading. Use the DOCX Editor if you need to make basic changes.']
  ],
  'word-counter': [
    ['Can I count words in a document?', 'Yes. Enter or load text to see word and character counts.'],
    ['Does it count characters without spaces?', 'Yes. The results include characters with and without spaces.'],
    ['Can it estimate reading time and pages?', 'Yes. It provides estimated page count and reading time based on the text length.']
  ],
  'document-text-extractor': [
    ['Can I extract text from a document?', 'Yes. The tool extracts text from supported document files.'],
    ['Will images and formatting be extracted as text?', 'No. The extracted result is text, not a recreation of images or document layout.'],
    ['What should I do if some text is missing?', 'Check whether the source document contains selectable text and try opening the original file in a compatible editor.']
  ],
  'document-formatter': [
    ['What text problems can this formatter clean?', 'It can trim extra spaces, reduce repeated blank lines and straighten curly quotation marks.'],
    ['Can I download the cleaned text?', 'Yes. You can copy the result or create a DOCX or TXT file.'],
    ['Does it rewrite or change the meaning of my text?', 'No. It applies basic text-cleaning changes rather than rewriting the content.']
  ],

  // EXCEL AND CSV TOOLS
  'xlsx-to-csv': [
    ['Can I convert an Excel workbook to CSV?', 'Yes. The tool exports worksheet data to CSV files.'],
    ['Are formulas and formatting preserved?', 'The export contains cell values, including available calculated formula results. Formatting, colours and other workbook features are not preserved.'],
    ['Can I export more than one sheet?', 'Yes. You can export workbook sheets as separate CSV files.']
  ],
  'csv-to-xlsx': [
    ['Can I convert a CSV file to Excel?', 'Yes. Select a CSV file to create an XLSX workbook.'],
    ['Can CSV contain multiple sheets?', 'No. CSV is a single-table text format. The converted workbook starts with the data from that CSV file.'],
    ['Will the original CSV be changed?', 'No. The tool creates a new XLSX output file.']
  ],
  'xlsx-to-pdf': [
    ['Can I convert an Excel sheet to PDF?', 'Yes. The tool creates a PDF view of spreadsheet values.'],
    ['Will colours, borders and fonts be preserved?', 'No. The PDF export focuses on cell values and does not preserve spreadsheet colours, borders or fonts.'],
    ['What happens if my sheet is very wide?', 'Wide sheets may continue across additional PDF pages. Check the PDF before printing or sharing.']
  ],
  'xlsx-to-json': [
    ['Can I convert Excel data to JSON?', 'Yes. The tool converts worksheet data into JSON.'],
    ['How are JSON field names created?', 'The first row is used for field names. Blank headers are given generated names, and duplicate headers receive suffixes.'],
    ['Can it convert a workbook with multiple sheets?', 'Yes. Multi-sheet workbooks are represented using sheet names in the JSON output.']
  ],
  'json-to-xlsx': [
    ['Can I convert JSON data to Excel?', 'Yes. The tool accepts JSON arrays of objects or arrays of arrays and creates an XLSX workbook.'],
    ['What JSON structure is supported?', 'The input must be an array of objects or an array of arrays.'],
    ['Can I open the output in spreadsheet software?', 'Yes. The generated XLSX file can be opened in Microsoft Excel and other compatible spreadsheet apps.']
  ],
  'excel-viewer': [
    ['Can I view an Excel workbook online?', 'Yes. Select an XLSX file to preview its worksheets in your browser.'],
    ['Can I view different sheets?', 'Yes. The viewer can load workbook sheets so you can browse their contents.'],
    ['Does the preview show the entire workbook?', 'The grid preview shows up to 200 rows and 30 columns at a time.']
  ],
  'excel-editor': [
    ['Can I edit Excel cell values online?', 'Yes. You can edit cells shown in the spreadsheet grid and save the result.'],
    ['Are formulas and formatting preserved?', 'The saved workbook is values-focused. Formulas are saved as their last calculated results, and formatting may not be retained.'],
    ['Can I edit every row in a large workbook?', 'The grid shows up to 200 rows and 30 columns. Edits apply to the cells shown; other workbook data is saved unchanged.']
  ],
  'excel-merger': [
    ['Can I combine multiple Excel files?', 'Yes. You can combine worksheets into one workbook or stack the first sheet from each file into one sheet.'],
    ['Can I skip repeated header rows?', 'Yes. When stacking the first sheet from each file, you can choose to skip headers after the first file.'],
    ['How many files can I merge?', 'The tool supports up to 20 files in one merge.']
  ],
  'excel-sheet-exporter': [
    ['Can I export each Excel sheet separately?', 'Yes. The tool can save each worksheet as its own file.'],
    ['Which export formats are available?', 'You can export sheets as XLSX or CSV files.'],
    ['Can CSV keep multiple sheets?', 'No. Each CSV file contains one sheet of tabular data.']
  ],
  'csv-editor': [
    ['Can I edit a CSV file online?', 'Yes. Load a CSV file, edit the cells shown in the grid and save the result.'],
    ['Will commas and quotation marks be handled?', 'The tool uses CSV parsing to read and write the data, helping handle standard CSV quoting.'],
    ['How much data is shown in the editor?', 'The grid preview shows up to 200 rows and 30 columns.']
  ],
  'duplicate-row-finder': [
    ['How can I find duplicate rows in a spreadsheet?', 'Load your data and use the duplicate-row finder to identify repeated rows.'],
    ['Can I ignore uppercase and lowercase differences?', 'Yes. The tool includes an option to ignore letter case when comparing rows.'],
    ['What happens when I remove duplicates?', 'The tool keeps the first copy and removes later matching rows.']
  ],
  'blank-row-remover': [
    ['Can I remove empty rows from a spreadsheet?', 'Yes. The tool identifies and removes blank rows.'],
    ['Can I remove empty columns too?', 'Yes. You can also choose to remove completely empty columns.'],
    ['Will rows containing data be removed?', 'The tool targets blank rows. Review the result before downloading it.']
  ],
  'column-row-manager': [
    ['Can I add or delete spreadsheet rows?', 'Yes. The tool provides options to add and delete rows and columns.'],
    ['Can I change the order of columns?', 'Yes. You can move columns left or right.'],
    ['Can I edit cell values too?', 'Yes. The grid also allows you to edit the displayed cells.']
  ],
  'spreadsheet-formatter': [
    ['What formatting changes can this tool make?', 'It can bold the header, freeze the first row and set automatic column widths.'],
    ['Can it remove blank rows?', 'Yes. The formatter can remove blank rows and optionally completely empty columns.'],
    ['Can it clean spaces and numbers?', 'Yes. Optional settings can trim repeated spaces and convert numeric text into numbers.']
  ],
  'excel-formula-helper': [
    ['Can I search for an Excel formula?', 'Yes. Search by formula name or a related word to find matching examples.'],
    ['Which Excel formulas are included?', 'The guide includes examples for functions such as SUM, IF, COUNTIF, VLOOKUP, XLOOKUP, INDEX, MATCH, FILTER and UNIQUE.'],
    ['Do all formulas work in every Excel version?', 'No. Some newer functions, including XLOOKUP, UNIQUE and FILTER, require Excel 2021 or Microsoft 365.']
  ]
};
