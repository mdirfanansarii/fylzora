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
    ['Can I merge password-protected PDFs?', 'No. Password-protected PDFs are not supported by these PDF tools.'],
    ['How many PDF files can I merge at once?', 'You can add up to 30 PDF files in one merge operation.'],
    ['What is the maximum PDF file size?', 'Each PDF file can be up to 25 MB.']
  ],
  'pdf-splitter': [
    ['Can I split a PDF into separate files?', 'Yes. Enter page ranges to create separate PDF files.'],
    ['Can I split a PDF by page numbers?', 'Yes. Use page numbers or page ranges in the page-range field.'],
    ['How can I download the split PDF files?', 'You can download each generated PDF separately or download all files together as a ZIP file.'],
    ['What is the maximum PDF file size?', 'You can upload a PDF file up to 25 MB.'],
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
    ['What is the maximum PDF file size?', 'You can upload a PDF file up to 25 MB.'],
    ['Can I delete every page?', 'No. At least one page must remain in the PDF.']
  ],
  'pdf-page-numbers': [
    ['Can I add page numbers to a PDF?', 'Yes. The tool adds page numbers to every page of your PDF.'],
    ['Can I choose where page numbers appear?', 'Yes. You can place them at the bottom-left, bottom-centre or bottom-right.'],
    ['Can I start numbering from a different number?', 'Yes. Set your preferred starting number and optionally enable the Page X of Y format.'],
    ['What is the PDF upload size limit?', 'You can upload a PDF file up to 25 MB.']
  ],
  'pdf-watermark': [
    ['Can I add a text watermark to a PDF?', 'Yes. You can add a text watermark to every page of your PDF.'],
    ['Can I change watermark size and opacity?', 'Yes. You can adjust the text size from 20 to 120 points and opacity from 5% to 100%.'],
    ['Can I use a long watermark message?', 'Watermark text is limited to 40 characters.'],
    ['Can I change the watermark angle?', 'No. The watermark is placed diagonally at a fixed 45-degree angle.'],
    ['What is the PDF upload size limit?', 'You can upload a PDF file up to 25 MB.']
  ],
  'pdf-metadata': [
    ['What PDF information can I check?', 'You can view the title, author, subject, keywords, creator, producer, creation date and modification date.'],
    ['Can I see the number of PDF pages?', 'Yes. The tool displays the total page count and the dimensions of the first page.'],
    ['Does it show whether a PDF is encrypted?', 'Yes. The metadata includes an encrypted status.'],
    ['Can I check the PDF file size?', 'Yes. The tool displays the uploaded PDF file size.'],
    ['What is the PDF upload size limit?', 'You can upload a PDF file up to 25 MB.']
  ],
  'jpg-to-pdf': [
    ['Can I convert multiple images into one PDF?', 'Yes. You can select multiple supported images and create a single PDF from them.'],
    ['Which image formats can I use?', 'The tool accepts JPEG, PNG and WebP images.'],
    ['How are images placed in the PDF?', 'Each image is placed on a separate PDF page in the order you upload them.'],
    ['What is the maximum image file size?', 'Each image file can be up to 25 MB.'],
    ['What is the name of the downloaded PDF?', 'The generated PDF is named images.pdf.']
  ],
  'pdf-to-jpg': [
    ['Can I convert PDF pages into JPG images?', 'Yes. You can export PDF pages as JPG or PNG images.'],
    ['Can I choose image quality?', 'Yes. Choose one of the available rendering quality levels. Higher levels use higher resolution.'],
    ['How many pages can I convert?', 'The tool processes up to the first 60 pages of a PDF.']
  ],
  'pdf-compressor': [
    ['How can I reduce PDF file size?', 'Choose a compression method and level, then click Compress PDF. Download the result if it is smaller.'],
    ['What are the PDF compression methods?', 'You can shrink supported JPEG images inside the PDF or use Maximum compression to turn every page into a JPEG image.'],
    ['Will compressed PDF text remain selectable?', 'When you shrink embedded images, text and vector content remain selectable. Maximum compression turns pages into images, so text is no longer selectable or searchable.'],
    ['Which compression levels are available?', 'Choose Light, Balanced or Strong compression. Strong aims for a smaller file, while Light aims to preserve more image quality.'],
    ['Why did my PDF size not reduce?', 'The PDF may not contain supported JPEG images to compress, or the selected method and level may not produce a smaller file. Try another method or level.'],
    ['What is the maximum PDF file size?', 'You can upload a PDF file up to 25 MB.']
  ],
  'pdf-editor': [
    ['Can I add text to a PDF?', 'Yes. You can add text, highlight content and draw shapes such as rectangles, ellipses and lines.'],
    ['Can I edit or remove existing PDF text?', 'The editor supports limited editing of existing text and can cover areas with a white rectangle. In normal mode, the original text remains inside the PDF and may still be copied. This is not secure redaction. Use Flatten mode to turn pages into images and remove the original selectable text.'],
    ['What happens when I use flatten mode?', 'Flatten mode turns pages into images with edits included. The resulting text is no longer selectable or searchable.'],
    ['Can I edit rotated PDF pages?', 'No. Editing is disabled on rotated pages. Use PDF Page Organizer to rotate the page upright first.'],
    ['Does the editor support Hindi text?', 'Normal mode has limited character support. Use Flatten mode to preserve Hindi and other scripts in your edited PDF.'],
    ['What is the maximum PDF file size?', 'You can upload a PDF file up to 25 MB.']
  ],
  'pdf-to-word': [
    ['Can I convert a PDF into an editable Word document?', 'Yes. The tool extracts selectable text and creates an editable DOCX file.'],
    ['Can it convert scanned PDFs?', 'No. Scanned pages are pictures of text. This tool does not include OCR.'],
    ['Will images, tables and fonts be preserved?', 'No. The conversion detects headings, paragraphs and bullet lists, but does not recreate images, tables, columns or exact fonts.'],
    ['What is the maximum PDF file size?', 'You can upload a PDF file up to 25 MB.'],
    ['How many PDF pages can I convert?', 'The tool supports PDFs with up to 150 pages. Split larger PDFs into smaller files first.'],
    ['Can I convert a password-protected PDF?', 'No. The PDF must be readable without a password. Damaged PDFs may also fail to convert.'],
    ['What file format will I get?', 'The converted document is downloaded in DOCX format, which you can open in Microsoft Word and other compatible editors.']
  ],
  'pdf-password': [
    ['How do I add a password to a PDF?', 'Upload a PDF, enter a password of at least 6 characters, confirm it and select Protect PDF.'],
    ['Can I block printing and copying?', 'Yes. Enable the restriction option. These restrictions work only in PDF viewers that respect PDF permissions.'],
    ['Can I recover a forgotten PDF password?', 'No. The password cannot be recovered. Keep it safe and retain your original PDF.'],
    ['What is the PDF upload size limit?', 'You can upload a PDF file up to 25 MB.'],
    ['Does the tool verify password protection?', 'Yes. It checks that the generated PDF asks for a password before offering the download.'],
    ['Why could the tool not protect my PDF?', 'The PDF may already be password-protected or damaged. Try an unlocked, working PDF file.']
  ],

  // WORD TOOLS
  'docx-to-pdf': [
    ['Can I convert a Word document to PDF?', 'Yes. Select a DOCX file to create a PDF copy.'],
    ['Will images and tables appear in the PDF?', 'No. This converter creates a text-only PDF. Images, tables, fonts and complex styling are not preserved.'],
    ['Which Word file format is supported?', 'The tool supports DOCX files. Older DOC files need to be saved as DOCX first.'],
    ['What is the maximum file size?', 'You can upload a DOCX file up to 25 MB.'],
    ['Are all special characters supported?', 'Some characters outside basic Latin may be replaced with a question mark (?) in the PDF.']
  ],
  'docx-to-txt': [
    ['Can I convert DOCX to plain text?', 'Yes. The tool extracts document text and creates a TXT file.'],
    ['Will formatting be included in the TXT file?', 'No. Plain text does not preserve fonts, colours, images, tables or page layout.'],
    ['Can I use an old DOC file?', 'The tool supports DOCX files. Save older DOC files as DOCX before using it.'],
    ['What is the maximum file size?', 'You can upload a DOCX file up to 25 MB.'],
    ['Why can’t the tool read my file?', 'Make sure the file is a valid DOCX document. Older DOC files and files renamed with a DOCX extension are not supported.']
  ],
  'txt-to-docx': [
    ['How do I convert TXT to DOCX?', 'Choose a TXT file or enter text, then click Create DOCX and download the Word document.'],
    ['Can I edit the converted DOCX file?', 'Yes. Open the downloaded DOCX file in Microsoft Word or another compatible editor.'],
    ['Will the conversion add images or formatting?', 'No. TXT contains plain text, so the conversion cannot restore images or rich formatting that were not in the original.'],
    ['Can I upload a DOCX file?', 'Yes. You can upload a TXT or DOCX file, or type and paste text directly.'],
    ['What is the maximum file size?', 'You can upload a file up to 25 MB.']
  ],
  'docx-to-html': [
    ['Can I convert a Word document to HTML?', 'Yes. Select a DOCX file to create an HTML file.'],
    ['Will the HTML look exactly like the Word document?', 'Not always. The conversion supports basic structure and formatting, but complex layouts may change.'],
    ['Can I use the HTML on a website?', 'Yes. You can review the generated HTML and use it in a website or content editor.'],
    ['What is the maximum DOCX file size?', 'You can upload a DOCX file up to 25 MB.'],
    ['Why can’t the tool read my file?', 'Make sure the file is a valid DOCX document. Older DOC files and renamed files are not supported.']
  ],
  'docx-to-markdown': [
    ['Can I convert DOCX to Markdown?', 'Yes. The tool extracts Word document content into Markdown format and creates a downloadable MD file.'],
    ['Will complex Word formatting be preserved?', 'No. Complex layouts and some formatting may change during conversion.'],
    ['Where can I use the Markdown file?', 'You can use Markdown in compatible note apps, blogs and platforms such as GitHub.'],
    ['What is the maximum DOCX file size?', 'You can upload a DOCX file up to 25 MB.'],
    ['Why can’t the tool read my file?', 'Make sure the file is a valid DOCX document. Older DOC files and renamed files are not supported.']
  ],
  'docx-compressor': [
    ['How does DOCX compression work?', 'The tool optimises supported JPEG images inside a DOCX file to try to reduce its size.'],
    ['Will all images become smaller?', 'Only supported JPEG images are optimised. PNG images and document text are not changed.'],
    ['Why is my compressed DOCX not smaller?', 'Text-only documents or files without supported JPEG images may not become smaller. The tool only creates a download when the result is smaller.'],
    ['Can I adjust JPEG image quality?', 'Yes. Use the JPG image quality slider before uploading your DOCX file.'],
    ['What is the maximum DOCX file size?', 'You can upload a DOCX file up to 25 MB.']
  ],
  'docx-editor': [
    ['Can I create a new Word document?', 'Yes. You can start with a blank document or load a DOCX file.'],
    ['What editing options are available?', 'The editor supports bold, italic, underline, headings, paragraphs, bullet lists, numbered lists and undo.'],
    ['Will images and tables be preserved?', 'Images, tables and complex layouts are not preserved by this editor.'],
    ['Which Word file format is supported?', 'The editor supports DOCX files. Older DOC files are not supported.'],
    ['What is the maximum file size?', 'You can upload a DOCX file up to 25 MB.']
  ],
  'docx-viewer': [
    ['Can I view a DOCX file without Microsoft Word?', 'Yes. Select a DOCX file to view its converted content in your browser.'],
    ['Will the document look exactly the same?', 'Not always. The viewer displays the document structure, but complex formatting may differ.'],
    ['Can I edit the document in the viewer?', 'The viewer is for reading. Use the DOCX Editor if you need to make basic changes.'],
    ['Which Word file format is supported?', 'The viewer supports DOCX files. Older DOC files are not supported.'],
    ['What is the maximum file size?', 'You can upload a DOCX file up to 25 MB.']
  ],
  'word-counter': [
    ['Can I count words in a document?', 'Yes. Enter or paste text to see word and character counts instantly.'],
    ['Does it count characters without spaces?', 'Yes. The results include characters with and without spaces.'],
    ['Can it estimate reading time and pages?', 'Yes. It estimates pages using 500 words per page and reading time using 200 words per minute.'],
    ['How does the tool count sentences?', 'It counts sentence endings marked with a period (.), exclamation mark (!) or question mark (?).'],
    ['How are paragraphs counted?', 'Paragraphs are counted by separating text with blank lines.']
  ],
  'document-text-extractor': [
    ['Can I extract text from a DOCX file?', 'Yes. The tool extracts readable text from DOCX files.'],
    ['Will images and formatting be extracted as text?', 'No. The extracted result is plain text. Images, tables and document formatting are not included.'],
    ['What should I do if some text is missing?', 'Check whether the source DOCX contains readable text. Scanned images of text are not converted by OCR.'],
    ['Which file formats are supported?', 'The tool supports DOCX files only. Older DOC files and TXT files are not accepted.'],
    ['What is the maximum DOCX file size?', 'You can upload a DOCX file up to 25 MB.']
  ],
  'document-formatter': [
    ['What text problems can this formatter clean?', 'It can trim extra spaces at the start and end of lines, replace repeated spaces and tabs with a single space, and reduce repeated blank lines.'],
    ['Can I straighten curly quotation marks?', 'Yes. Enable the Straighten curly quotes option to change curly quotation marks into straight quotes.'],
    ['Can I download the cleaned text?', 'Yes. You can copy the cleaned text or create a DOCX or TXT file.'],
    ['Does it rewrite or change the meaning of my text?', 'No. It applies basic text-cleaning rules and does not rewrite your content.'],
    ['Which file formats are supported?', 'You can upload DOCX and TXT files, or type and paste text directly.'],
    ['What is the maximum file size?', 'You can upload a DOCX or TXT file up to 25 MB.']
  ],

  // EXCEL AND CSV TOOLS
  'xlsx-to-csv': [
    ['Can I convert an Excel workbook to CSV?', 'Yes. Upload an XLSX workbook and click Convert to CSV.'],
    ['Are formulas and formatting preserved?', 'The export contains cell values, including available calculated formula results. Formatting, colours and other workbook features are not preserved.'],
    ['Can I export more than one sheet?', 'Yes. Export every worksheet as a separate CSV file, or select one sheet to export.'],
    ['Which Excel file formats are supported?', 'The tool supports XLSX files. Older XLS files are not supported.'],
    ['What is the maximum upload size?', 'You can upload an XLSX file up to 20 MB.']
  ],
  'csv-to-xlsx': [
    ['Can I convert a CSV file to Excel?', 'Yes. Upload a CSV file and click Convert to XLSX to create an Excel workbook.'],
    ['Can CSV contain multiple sheets?', 'No. CSV is a single-table text format. The converted workbook contains one worksheet.'],
    ['Will the original CSV be changed?', 'No. The tool creates a new XLSX output file and leaves your original CSV unchanged.'],
    ['What is the maximum CSV file size?', 'You can upload a CSV file up to 20 MB.'],
    ['Which file format is supported?', 'The tool accepts CSV files. Older Excel XLS files are not supported as input.']
  ],
  'xlsx-to-pdf': [
    ['Can I convert an Excel sheet to PDF?', 'Yes. The tool creates a PDF view of spreadsheet values.'],
    ['Will colours, borders and fonts be preserved?', 'No. The PDF export focuses on cell values and does not preserve spreadsheet colours, borders or fonts.'],
    ['What happens if my sheet is very wide?', 'Wide sheets may continue across additional PDF pages. Check the PDF before printing or sharing.']
  ],
  'xlsx-to-json': [
    ['Can I convert Excel data to JSON?', 'Yes. The tool converts worksheet data into JSON objects.'],
    ['How are JSON field names created?', 'The first row of each worksheet is used for field names. Blank headers receive generated names, and duplicate headers receive unique suffixes.'],
    ['Can it convert a workbook with multiple sheets?', 'Yes. All worksheets are included in the JSON output using their sheet names.'],
    ['Which Excel file format is supported?', 'The tool supports XLSX files. Older XLS files are not supported.'],
    ['What is the maximum upload size?', 'You can upload an XLSX file up to 20 MB.']
  ],
  'json-to-xlsx': [
    ['Can I convert JSON data to Excel?', 'Yes. Upload a JSON file and click Convert to XLSX to create an Excel workbook.'],
    ['What JSON structure is supported?', 'The input must be a JSON array of objects or an array of arrays. Empty arrays and arrays without usable object keys cannot be converted.'],
    ['How are spreadsheet columns created?', 'For an array of objects, object keys become column headings. For an array of arrays, each inner array becomes a spreadsheet row.'],
    ['How are nested objects handled?', 'Nested objects and arrays are stored as JSON text inside spreadsheet cells.'],
    ['What is the maximum JSON file size?', 'You can upload a JSON file up to 20 MB.']
  ],
  'excel-viewer': [
    ['Can I view an Excel workbook online?', 'Yes. Upload an XLSX file to preview its worksheets in your browser.'],
    ['Can I view different sheets?', 'Yes. Use the sheet tabs to browse worksheets in the workbook.'],
    ['Does the preview show the entire workbook?', 'No. The preview displays up to 200 rows and 30 columns at a time.'],
    ['Which Excel file formats are supported?', 'The viewer supports XLSX files. Older XLS files are not supported.'],
    ['What is the maximum upload size?', 'You can upload an XLSX file up to 20 MB.']
  ],
  'excel-editor': [
    ['Can I edit Excel cell values online?', 'Yes. Upload an XLSX workbook, edit cells in the spreadsheet grid and save the result.'],
    ['Can I edit multiple worksheets?', 'Yes. Use the worksheet tabs to switch between sheets and edit their visible cells.'],
    ['Are formulas and formatting preserved?', 'Formulas are saved as their last calculated values. Original formatting may not be retained.'],
    ['Can I edit every row in a large workbook?', 'The grid shows up to 200 rows and 30 columns. Edits apply to visible cells; other workbook data is saved unchanged.'],
    ['Which Excel file format is supported?', 'The editor accepts XLSX files. Older XLS files are not supported.'],
    ['What is the maximum upload size?', 'You can upload an XLSX file up to 20 MB.'],
    ['Can I save the edited data as CSV?', 'Yes. You can save the edited data as either XLSX or CSV.']
  ],
  'excel-merger': [
    ['Can I combine multiple Excel and CSV files?', 'Yes. You can merge XLSX and CSV files into one Excel workbook.'],
    ['How many files can I merge?', 'You can merge up to 20 files. At least 2 files are required.'],
    ['What is the maximum file size?', 'Each uploaded file can be up to 20 MB.'],
    ['Can I keep worksheets separate?', 'Yes. Choose the workbook option to put every worksheet into the merged workbook.'],
    ['Can I combine rows from different files into one sheet?', 'Yes. Choose the stacking option. It uses only the first worksheet from each file.'],
    ['Can I skip repeated header rows?', 'Yes. When stacking rows, you can skip the first row of every file after the first one.'],
    ['What is the output file format?', 'The merged workbook is downloaded as an XLSX file named merged.xlsx.']
  ],
  'excel-sheet-exporter': [
    ['Can I export each Excel sheet separately?', 'Yes. The tool exports every worksheet as a separate file.'],
    ['Which export formats are available?', 'You can export worksheets as XLSX workbooks or CSV files.'],
    ['Can CSV files contain multiple sheets?', 'No. Each CSV file contains data from one worksheet only.'],
    ['Are formulas and formatting preserved?', 'CSV exports contain cell values, including available calculated formula results. Formatting, colours and other workbook features are not preserved.'],
    ['Which Excel file format is supported?', 'The tool supports XLSX workbooks. Older XLS files are not supported.'],
    ['What is the maximum upload size?', 'You can upload an XLSX workbook up to 20 MB.']
  ],
  'csv-editor': [
    ['Can I edit a CSV file online?', 'Yes. Upload a CSV file and edit cell values directly in the spreadsheet grid.'],
    ['Can I save the edited file as Excel?', 'Yes. You can save your edited data as CSV or XLSX.'],
    ['Will commas and quotation marks be handled?', 'Yes. The tool uses CSV parsing to handle standard commas and quotation marks.'],
    ['How much data is shown in the editor?', 'The grid preview shows up to 200 rows and 30 columns at a time.'],
    ['What is the maximum CSV file size?', 'You can upload a CSV file up to 20 MB.'],
    ['Can I upload an XLSX file?', 'No. CSV Editor accepts CSV files only.']
  ],
  'duplicate-row-finder': [
    ['How can I find duplicate rows in a spreadsheet?', 'Upload an XLSX or CSV file and click Find duplicates to highlight repeated rows.'],
    ['Does the tool keep the first copy?', 'Yes. It keeps the first matching row and highlights later duplicate rows.'],
    ['Can I ignore uppercase and lowercase differences?', 'Yes. Enable Ignore upper/lower case to treat values such as ABC and abc as the same.'],
    ['Are extra spaces considered?', 'No. Extra spaces at the beginning and end of cell values are ignored when comparing rows.'],
    ['Can I save the cleaned spreadsheet?', 'Yes. You can save the result as XLSX or CSV.'],
    ['Which file formats are supported?', 'You can upload XLSX and CSV spreadsheet files. Older XLS files are not supported.'],
    ['What is the maximum upload size?', 'You can upload a spreadsheet file up to 20 MB.']
  ],
  'blank-row-remover': [
    ['Can I remove empty rows from a spreadsheet?', 'Yes. The tool removes rows that contain only empty cells or spaces.'],
    ['Can I remove empty columns too?', 'Yes. Enable the option to remove completely empty columns.'],
    ['Will rows containing data be removed?', 'No. Rows containing at least one non-empty cell are kept.'],
    ['Can I save the cleaned file as Excel or CSV?', 'Yes. You can save the result as XLSX or CSV.'],
    ['What is the maximum upload size?', 'You can upload a spreadsheet file up to 20 MB.']
  ],
  'column-row-manager': [
    ['Can I add or delete spreadsheet rows?', 'Yes. You can add new rows and delete existing rows.'],
    ['Can I add or delete columns?', 'Yes. You can add new columns and delete columns you do not need.'],
    ['Can I change the order of columns?', 'Yes. Use the left and right buttons to move columns.'],
    ['Can I edit cell values too?', 'Yes. You can edit cell values directly in the spreadsheet grid.'],
    ['Can I save the updated spreadsheet?', 'Yes. You can save your changes as XLSX or CSV.'],
    ['What is the maximum upload size?', 'You can upload a spreadsheet file up to 20 MB.']
  ],
  'spreadsheet-formatter': [
    ['What formatting changes can this tool make?', 'It removes blank rows, bolds the header row, freezes the first row and adjusts column widths automatically.'],
    ['Can it clean extra spaces?', 'Yes. Enable Trim extra spaces to remove extra spaces and tabs from text.'],
    ['Can it convert numbers stored as text?', 'Yes. Enable the number conversion option to convert supported numeric text into numbers.'],
    ['Which input formats are supported?', 'You can upload XLSX and CSV files.'],
    ['What is the output file format?', 'The formatted spreadsheet is downloaded as an XLSX workbook.'],
    ['What is the maximum upload size?', 'You can upload a spreadsheet file up to 20 MB.']
  ],
  'excel-formula-helper': [
    ['Can I search for an Excel formula?', 'Yes. Search by formula name or a related word to find matching examples.'],
    ['Which Excel formulas are included?', 'The guide includes examples for functions such as SUM, IF, COUNTIF, VLOOKUP, XLOOKUP, INDEX, MATCH, FILTER and UNIQUE.'],
    ['Do all formulas work in every Excel version?', 'No. Some newer functions, including XLOOKUP, UNIQUE and FILTER, require Excel 2021 or Microsoft 365.']
  ]
};
