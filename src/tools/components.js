import { createElement, lazy } from 'react';

// slug -> lazily loaded tool component. Heavy code loads only when the tool page opens.
const image = (mode) =>
  lazy(() => import('./image/ImageTool.jsx').then((m) => ({ default: () => createElement(m.default, { mode }) })));

const pdf = (mode) =>
  lazy(() => import('./pdf/PdfTool.jsx').then((m) => ({ default: () => createElement(m.default, { mode }) })));

const word = (mode) =>
  lazy(() => import('./word/WordTool.jsx').then((m) => ({ default: () => createElement(m.default, { mode }) })));

const sheet = (mode) =>
  lazy(() => import('./excel/SheetTool.jsx').then((m) => ({ default: () => createElement(m.default, { mode }) })));

export const toolComponents = {
  'image-cropper': lazy(() => import('./image/ImageCropper.jsx')),
  'pdf-compressor': lazy(() => import('./pdf/PdfCompressor.jsx')),
  'pdf-editor': lazy(() => import('./pdf/PdfEditor.jsx')),
  'pdf-to-word': lazy(() => import('./pdf/PdfToWord.jsx')),
  'pdf-password': lazy(() => import('./pdf/PdfProtect.jsx')),
  'xlsx-to-csv': sheet('xlsx2csv'), 'csv-to-xlsx': sheet('csv2xlsx'), 'xlsx-to-pdf': sheet('xlsx2pdf'),
  'xlsx-to-json': sheet('xlsx2json'), 'json-to-xlsx': sheet('json2xlsx'), 'excel-viewer': sheet('viewer'),
  'excel-editor': sheet('edit'), 'excel-merger': sheet('merge'), 'excel-sheet-exporter': sheet('export'),
  'csv-editor': sheet('csvedit'), 'duplicate-row-finder': sheet('dupes'), 'blank-row-remover': sheet('blanks'),
  'column-row-manager': sheet('manage'), 'spreadsheet-formatter': sheet('format'),
  'excel-formula-helper': lazy(() => import('./excel/FormulaHelper.jsx')),
  'docx-to-pdf': word('pdf'), 'docx-to-txt': word('txt'), 'txt-to-docx': word('txt2docx'), 'docx-to-html': word('html'),
  'docx-to-markdown': word('md'), 'docx-compressor': word('compress'), 'docx-editor': word('editor'),
  'docx-viewer': word('viewer'), 'word-counter': word('counter'), 'document-text-extractor': word('extract'),
  'document-formatter': word('format'),
  'pdf-merger': pdf('merge'),
  'pdf-splitter': pdf('split'),
  'pdf-page-extractor': pdf('extract'),
  'pdf-organizer': pdf('organize'),
  'pdf-page-numbers': pdf('numbers'),
  'pdf-watermark': pdf('watermark'),
  'pdf-metadata': pdf('meta'),
  'jpg-to-pdf': pdf('img2pdf'),
  'pdf-to-jpg': pdf('pdf2img'),
  'image-compressor': image('compress'),
  'multiple-image-compressor': image('multi'),
  'image-quality-controller': image('quality'),
  'image-converter': image('convert'),
  'image-resizer': image('resize'),
  'image-rotator': image('rotate'),
  'image-background-color': image('background'),
  'image-checker': image('check'),
};
