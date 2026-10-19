# FileHarbor – Phase 1

Free online file tools (images, PDF, Word, Excel) that run in the browser.
**Phase 1 = project setup, homepage, navigation, responsive design, dark mode, search, SEO structure.**
No tool is working yet. Every tool page is labelled "Coming soon" and is `noindex` until it is built (Phase 2 onwards).

Rename the site in one place: `src/config.js` (`name`).

---

## 1. Linux Mint par setup (beginner friendly)

Terminal kholo (`Ctrl + Alt + T`) aur ek-ek command chalao.

```bash
# 1) curl install karo (internet se file download karne wala tool)
sudo apt update && sudo apt install -y curl git
```
`sudo apt update` = software list refresh karta hai. `apt install` = programs install karta hai. Password maangega (type karte waqt kuch dikhega nahi, normal hai).

```bash
# 2) nvm install karo (Node.js ke versions manage karne ke liye)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```
Iske baad **terminal band karke dobara kholo**, warna `nvm` command nahi milega.

```bash
# 3) Node.js (LTS version) install karo
nvm install --lts
node -v      # version dikhayega, 18 ya usse bada hona chahiye
npm -v       # npm = Node ka package manager (libraries install karta hai)
```

```bash
# 4) project folder me jao (zip extract karne ke baad)
cd ~/Downloads/fileharbor
```
`cd` = folder badalna. Path apne hisaab se badlo.

```bash
# 5) saari libraries install karo (React, Vite, Router) – sirf pehli baar
npm install
```
Ye `node_modules` folder banata hai. Thoda time lagta hai.

```bash
# 6) .env file banao
cp .env.example .env
```
`cp` = copy. Phir `.env` kholo (`xed .env`) aur apna domain/email likho. `VITE_ADSENSE_CLIENT` **khaali** rehne do.

```bash
# 7) site chalao (development mode)
npm run dev
```
Browser me `http://localhost:5173` kholo. Band karne ke liye terminal me `Ctrl + C`.

```bash
# 8) production build banao (deploy se pehle test)
npm run build      # dist/ + sitemap.xml + robots.txt + har route ka prerendered meta HTML
npm run preview    # build ki hui site local par dekho
```

---

## 2. Project structure

```
fileharbor/
├─ index.html                 # base meta tags + dark-mode flash fix
├─ public/                    # favicon, _headers (security + caching), robots.txt, sitemap.xml (auto)
├─ scripts/generate-seo-files.js   # sitemap.xml + robots.txt (runs before build)
└─ src/
   ├─ config.js               # site name, URL, email, AdSense client (from .env)
   ├─ data/tools.js           # REGISTRY of all 48 tools (single source of truth)
   ├─ data/pages.js           # footer/legal links
   ├─ tools/components.js     # slug -> lazy-loaded tool component (empty in Phase 1)
   ├─ hooks/                  # useSeo (title, canonical, OG, breadcrumbs JSON-LD), useTheme
   ├─ components/             # Layout, SearchBox, Breadcrumbs, ToolList, AdSlot, Logo
   ├─ pages/                  # Home, AllTools, CategoryPage, ToolPage, Legal pages, NotFound
   └─ styles.css              # CSS variables, light/dark theme, responsive layout
```

### Naya tool kaise add/finish karein (Phase 2+ me)
1. Component likho: `src/tools/image/ImageCompressor.jsx` (heavy libraries yahin `import()` karo, taaki homepage par load na hon).
2. `src/tools/components.js` me register karo: `'image-compressor': lazy(() => import('./image/ImageCompressor.jsx'))`
3. `src/data/tools.js` me us tool ka `live: true` karo (aur description/notes check karo).

`live: true` hote hi page indexable ho jaata hai, sitemap me aata hai, aur AdSlot (agar configured ho) sirf tab dikhta hai.

---

## 3. Phase 1 test checklist

- [ ] `npm run build` bina error ke complete hota hai
- [ ] Home, All Tools, 4 category pages, 7 info pages (About, Contact, Privacy, Terms, Disclaimer, Cookies, FAQ) khulte hain
- [ ] Koi bhi tool URL (e.g. `/image-compressor`) "Coming soon" page dikhata hai, koi fake button nahi
- [ ] Galat URL (e.g. `/abcxyz`) 404 page dikhata hai
- [ ] Header search me "pdf" type karne par results aate hain; Arrow keys + Enter kaam karte hain; Esc band karta hai
- [ ] Dark mode toggle kaam karta hai aur refresh ke baad yaad rehta hai
- [ ] Mobile width (~375px) par menu button se navigation khulta hai, horizontal scroll nahi aata
- [ ] Keyboard se (Tab) skip link, nav, search, footer tak pahunch sakte ho; focus ring dikhta hai
- [ ] Browser "View Source/Inspect" me page `<title>`, canonical, robots (`noindex` on unfinished tools) route ke hisaab se badalte hain
- [ ] `public/sitemap.xml` me sirf finished pages hain (Phase 1 me: home, all-tools, info pages)

---

## 4. GitHub + free hosting (Cloudflare Pages)

```bash
git init                      # folder ko git repository banao
git add .                     # saari files stage karo
git commit -m "Phase 1"       # snapshot save karo
```
GitHub par naya empty repo banao, phir:
```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git   # repo ka address jodo
git push -u origin main       # code upload
```
Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → repo chuno:
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: `VITE_SITE_URL`, `VITE_CONTACT_EMAIL` (same as `.env`)

Build ke baad har route ka apna `index.html` (prerendered meta) banta hai, isliye clean URLs (`/image-compressor`) refresh par bhi chalte hain. `404.html` galat URLs par asli 404 status deta hai.

---

## 5. AdSense – abhi kya karna hai aur kya nahi

- **Abhi apply mat karo.** Phase 1 me koi working tool nahi hai; Google "under construction" ya thin content pasand nahi karta. Phase 2–5 me real tools aur original content aane ke baad apply karo (Phase 7).
- Approval Google ke review par depend karta hai; koi guarantee nahi.
- Approval ke baad: `.env` me asli `VITE_ADSENSE_CLIENT=ca-pub-...` aur ad-unit ID `VITE_ADSENSE_SLOT_TOOL_BOTTOM` daalo. `ads.txt` agar Google de to `public/ads.txt` me rakho.
- Kabhi fake publisher ID mat daalo. `AdSlot` khaali ho to kuch render nahi karta.
- EEA/UK/Switzerland visitors ke liye Google-certified consent banner (CMP) chahiye hoga – Phase 7 me.
- Privacy/Terms pages template hain. Launch se pehle apne hisaab se review karo (zaruri ho to legal advice lo).

## 6. Search Console (Phase 7 me)
1. https://search.google.com/search-console → "Add property" → Domain/URL prefix.
2. DNS TXT record ya HTML tag se verify karo.
3. Sitemaps → `https://your-domain.com/sitemap.xml` submit karo.

---

## 7. Known limits / decisions

- **Image tool #10 ("Download Tool")** alag tool nahi hai; har tool ka download panel (aur multiple compressor me ZIP) yehi kaam karega. Isliye image me 9 tools hain.
- **Duplicate list items merge kiye gaye:** PDF to Word / DOCX to PDF / XLSX to PDF ek hi tool hain jo do categories me dikhte hain (`alsoIn`). Total unique tools: **48**.
- **SEO note:** Ye client-side React app hai. Google JavaScript render kar leta hai, par Phase 6 me tool pages ko build time par prerender karna behtar rahega.
- Browser-side limits (aage ke phases me): scanned PDF ke liye OCR, Word→PDF layout exact nahi hoga, DOC (purana format) unsupported, PDF password protection sirf tab jab safe tareeke se ho sake.

---

## Phase 2 – Image tools (live)

Working (browser-side, Canvas API, no extra libraries): Image Compressor, Multiple Image Compressor (up to 20 files), Image Quality Controller, Image Converter (JPG/PNG/WebP, input also GIF/BMP), Image Resizer (px or %), Image Rotator (rotate + flip), Background Colour Tool, Format & Size Checker.

**Update:** Image Cropper ab live hai (neeche "Final additions").

Honest limits: PNG lossless hota hai, isliye PNG compress karne par size kam na ho to tool WebP/JPG try karne ko kehta hai. GIF animation sirf pehla frame bachta hai. "Download all as ZIP" abhi nahi hai (har file ka alag Download button).

### Phase 2 test checklist
- [ ] Har tool par JPG, PNG, WebP upload karke result + Download test karo
- [ ] 25 MB se bada file / PDF file upload karne par red error message aata hai
- [ ] Compressor: quality slider hilane par new size aur % saved badalta hai
- [ ] Multiple compressor: 3+ images, har ek ka alag result aur download
- [ ] Resizer: Keep proportions on/off, px aur percentage dono
- [ ] Rotator: left/right + flip, result preview sahi dikhta hai
- [ ] Background tool: transparent PNG par colour bharta hai (PNG output), JPG output par bhi
- [ ] Checker: asli format (extension badal kar rename ki hui file bhi) sahi dikhta hai
- [ ] "Process another file" naya upload box dikhata hai
- [ ] Mobile par drag-drop ki jagah Browse files kaam karta hai; dark mode me tool readable hai

---

## Phase 3 – PDF tools (live)

Libraries (open-source): **pdf-lib** (MIT) for editing PDFs, **pdf.js / pdfjs-dist** (Apache-2.0) for rendering pages. Dono sirf tab load hote hain jab PDF tool page khulta hai.

Working: PDF Merger, PDF Splitter (har range alag file), PDF Page Extractor, PDF Page Organizer (reorder / rotate / remove), Page Number Tool, Watermark Tool, Metadata Viewer, JPG & PNG to PDF (WebP bhi), PDF to JPG/PNG (max 60 pages).

**Update:** PDF Compressor, PDF Editor, PDF to Word aur PDF Password Protection ab live hain (neeche "Final additions"). Page **thumbnails** organizer/splitter me abhi nahi; list me page numbers hain.

Limits: password-protected ya damaged PDF par clear error aata hai. Page numbers/watermark rotated pages par apni jagah thodi alag dikh sakti hai.

### Phase 3 test checklist
- [ ] Merger: 3 PDFs add karo, ↑/↓ se order badlo, Remove test karo, merged.pdf kholo
- [ ] Splitter: `1-2, 4` => 2 alag files; galat range (`0`, `99`, `abc`) par error
- [ ] Extractor: `1, 3-4` => ek file jisme sirf wahi pages
- [ ] Organizer: page up/down, rotate, remove; output kholkar order check karo
- [ ] Page numbers: teeno positions + "Page X of Y"; Watermark: text/size/opacity
- [ ] Metadata: title/author/pages sahi; protected PDF par error ya "Encrypted: Yes"
- [ ] JPG/PNG/WebP to PDF: order sahi, har image ek page
- [ ] PDF to JPG: 3–5 page PDF, JPG aur PNG dono; 25 MB se bada ya non-PDF file reject
- [ ] Mobile + dark mode me buttons/list readable

---

## Phase 4 – Word tools (live)

Libraries (open-source): **mammoth** (BSD-2) DOCX padhne/convert ke liye, **docx** (MIT) DOCX banane ke liye, **JSZip** (MIT/GPL dual) DOCX compress ke liye. Teeno lazy-load hote hain.

Working: DOCX Viewer, DOCX to TXT, TXT to DOCX, DOCX to HTML, DOCX to Markdown, Document Text Extractor (Copy button), Page & Word Counter, Document Formatter, DOCX Editor (bold/italic/underline, headings, lists), DOCX Compressor, DOCX to PDF.

**Honest limits:**
- Sirf **.docx** support hai. Purani **.doc** file par clear message aata hai ("save as .docx").
- **DOCX to PDF text-only** hai: images, tables, fonts aur styling nahi bachte; non-Latin characters (Hindi, Chinese etc.) `?` ban jaate hain. Asli layout-accurate conversion free browser library se reliable nahi hai.
- **DOCX Compressor** sirf JPG images recompress karta hai (max 1600px). Text-only doc ya PNG images par bachat nahi hoti; tab download button nahi aata.
- **Editor** basic formatting hi save karta hai; original ki images/tables save par nahi bachti.
- Markdown output me mammoth kuch characters escape karta hai (jaise `\.`).
- **PDF to Word** ab live hai (text-PDF only, approximate layout), "Final additions" dekho.

### Phase 4 test checklist
- [ ] Viewer: headings, bold, lists, table, image wali .docx sahi dikhti hai
- [ ] DOCX to TXT/HTML/Markdown: output kholkar check karo; Download kaam karta hai
- [ ] Text Extractor: Copy text button clipboard me copy karta hai
- [ ] TXT to DOCX: text paste karo ya .txt upload karo, DOCX Word/LibreOffice me khulti hai
- [ ] Counter: paste karte hi counts badalte hain; .docx upload par bhi
- [ ] Formatter: 3 checkboxes ka asar, Copy, Create TXT/DOCX
- [ ] Editor: .docx kholo, edit karo, "Save as DOCX", dobara kholkar check karo; "Blank document" bhi
- [ ] Compressor: photos wali .docx par % saved; text-only par "no savings" note
- [ ] DOCX to PDF: multi-page doc, line wrapping aur page breaks
- [ ] `.doc` file, 25 MB+ file, nakli .docx (renamed file) par error message

---

## Phase 5 – Excel tools (live)

Libraries (open-source, npm par maintained): **ExcelJS** (MIT) XLSX padhne/likhne ke liye, **PapaParse** (MIT) CSV ke liye. pdf-lib XLSX→PDF ke liye. Sab sirf tool page khulne par lazy-load hote hain (ExcelJS bada hai, ~270 KB gzip).

Working (15/15): XLSX to CSV, CSV to XLSX, XLSX to PDF, XLSX to JSON, JSON to XLSX, Excel Viewer (sheet tabs), Excel Editor, Excel File Merger (workbook me sheets ya rows stack), Sheet Exporter, CSV Editor, Duplicate Row Finder (highlight + remove), Blank Row Remover (+ blank columns), Column & Row Manager (add/delete/move), Spreadsheet Formatter, Formula Helper (20 common formulas, search ke saath).

**Honest limits:**
- Sirf **.xlsx** aur **.csv** (JSON bhi json-to-xlsx ke liye). Purani **.xls** unsupported – clear message aata hai.
- **Formulas:** file padhte waqt formula ki last calculated value li jaati hai; save karne par values store hoti hain, formulas nahi. Formatting/colours/charts/macros bhi nahi bachte. Ye warning tools me dikhti hai.
- **XLSX to CSV:** sirf values; multiple sheets ke liye har sheet ki alag CSV.
- **XLSX to PDF:** values-only table, styling nahi; wide sheets extra pages par; non-Latin characters `?` ban jaate hain.
- Grid sirf pehli **200 rows × 30 columns** dikhata hai (baaki data save me unchanged rehta hai). Badi files (20 MB+) browser memory ki wajah se fail ho sakti hain.
- **Formatter** header row ko bold + frozen karta hai aur numbers-as-text ko numbers me badalta hai; ye assumption hai ki pehli row header hai.

### Phase 5 test checklist
- [ ] XLSX (2+ sheets) to CSV: "Export every sheet" on/off, CSV Excel me sahi khulti hai (Hindi/UTF-8 text bhi)
- [ ] CSV to XLSX: commas wale quoted fields sahi; JSON to XLSX: array of objects aur nested value
- [ ] XLSX to JSON: header names field bante hain; XLSX to PDF: multi-page PDF
- [ ] Viewer: sheet tabs; Editor: cell badlo, Save as XLSX/CSV, dobara kholkar check
- [ ] Merger: 2 files "every sheet in one workbook" aur "stack rows" (header skip)
- [ ] Sheet Exporter: XLSX aur CSV dono mode
- [ ] Duplicate finder: Find (rows red) → Remove → Save; case-insensitive option
- [ ] Blank rows/columns remover; Manager: add/delete/move row-column, save
- [ ] Formatter: output Excel me bold header, freeze, widths; text-numbers numbers bane
- [ ] Formula Helper: search "lookup" / "count"
- [ ] `.xls`, 20 MB+ file, khali/damaged file par error message


---

## Phase 6 – Content, accessibility, performance, testing, SEO

**Kya badla / jura:**
- **Automated checks:** `npm test` – registry sahi hai (unique slugs, har live tool ka component, har live tool ka "when to use it" text) aur har page (home, categories, 48 tool pages, info pages) bina error render hota hai.
- **Prerendered meta:** `npm run build` ke baad har route ka apna HTML (sahi `<title>`, description, canonical, robots, noscript summary). Unfinished tools `noindex` rehte hain. **Ye full server-side rendering nahi hai** – page ka content abhi bhi JavaScript se aata hai; Google JS render karta hai.
- **404.html:** galat URL par asli 404 status (soft-404 se bachne ke liye). Naya route add karo to `prerender-meta.js` use khud cover karta hai (registry/pages.js se).
- **Tool pages par original content:** har live tool par "When to use it" + category tips (`src/data/toolContent.js`). Naya tool live karte waqt yahan bhi ek line likhna zaruri hai (`npm test` yaad dilata hai).
- **ZIP download:** Multiple Image Compressor, PDF Splitter aur PDF to JPG me "Download all (ZIP)".
- **Accessibility:** page badalne par focus main content par jaata hai, galat ARIA tab roles hataye, sab controls labelled, keyboard se chalte hain, `prefers-reduced-motion` respect hota hai.
- **Headers:** `public/_headers` (nosniff, referrer policy, permissions policy, assets ka long cache). Content-Security-Policy jaan-boojh kar nahi lagayi – AdSense ke saath galat CSP ads tod deti hai; Phase 7 me ads ke saath test karke lagana.
- **Legal/About/FAQ text** ab live tools ke hisaab se sahi hai (pehle "under construction" likha tha).

**Update:** ab saare 48 tools live hain. `live: false` wale tools (agar future me banao) sitemap me nahi aate aur `noindex` rehte hain.

### Performance
- Homepage par sirf React + router + page code load hota hai. Tool libraries (pdf-lib, pdf.js, mammoth, docx, ExcelJS, JSZip, PapaParse) sirf us tool ke page par, dynamic `import()` se load hoti hain.
- Heavy kaam abhi main thread par hota hai (Web Workers nahi) – bade files par page thodi der atak sakta hai; isliye 25 MB (Excel 20 MB) limit hai. Workers baad ka improvement hai.
- Test karo: Chrome DevTools → Lighthouse (Mobile) on `npm run preview`; DevTools → Performance → CPU 4× slowdown se low-end laptop simulate karo; real Android phone par bhi.

### Phase 6 manual test checklist
- [ ] `npm test` – sab ✔
- [ ] `npm run build` ke baad `dist/image-compressor/index.html` kholkar title/canonical/robots dekho; `dist/image-cropper/index.html` me `noindex`
- [ ] `npm run preview`: kisi tool URL par seedha jao aur refresh karo (404 nahi aana chahiye); `/galat-url` par 404 page
- [ ] Keyboard-only: Tab se poora flow (upload → option → download) chalao; focus ring dikhta hai
- [ ] Screen reader (Orca on Linux Mint): skip link, headings, errors ("alert") padhe jaate hain
- [ ] Lighthouse: Accessibility, SEO, Best Practices ≥ 90 (mobile); Performance dekho aur note karo
- [ ] Dark mode me har category ka ek tool check karo
- [ ] Multiple compressor / PDF splitter / PDF to JPG me ZIP download kholkar files check karo
- [ ] Har tool par: galat file type, khali file, bahut badi file, damaged file ka error message


---

## Phase 7 – Deployment, domain, Search Console, AdSense readiness

Poori step-by-step guide: **[LAUNCH.md](LAUNCH.md)** (Hinglish).

Code me kya add hua:
- `npm run launch-check` – build ke baad batata hai kya baaki hai (domain/email placeholder, sitemap, legal pages, unfinished tools, AdSense ID format, ads.txt).
- `VITE_HIDE_UNFINISHED=true` – "Coming soon" tools list, routes aur sitemap se hata deta hai (AdSense apply karne se pehle).
- `VITE_ADSENSE_CLIENT` set hone par: har page ke `<head>` me AdSense script, `ads.txt` auto-generate, aur Privacy/Cookies pages ka ad-text badal jaata hai. Khaali ho to **kuch load nahi hota**.
- Fake publisher ID kahin nahi hai.

**Dhyan rakho:** AdSense approval Google ke review par depend karta hai; consent banner ke liye Google ka certified message (AdSense > Privacy & messaging) use karo; apna banaya banner is kaam ke liye certified nahi hota.


---

## Final additions – saare 48 tools live (koi "Coming soon" nahi)

Naye tools aur wo kaise kaam karte hain (sab browser-side):
- **Image Cropper** – photo par crop box drag/resize karo (corners se), ya exact pixel numbers type karo (keyboard users ke liye); shapes: Free, 1:1, 4:3, 3:2, 16:9, 9:16; JPG/PNG/WebP output.
- **PDF Compressor** – 2 methods. (1) *Photos shrink*: PDF ke andar ki JPEG photos dobara compress hoti hain, **text selectable rehta hai**. (2) *Maximum*: har page picture ban jaata hai (bahut chhota file, par text select/search nahi hota; max 100 pages). Agar file chhoti nahi hoti to download nahi dikhaya jaata aur saaf bataya jaata hai. PNG/CMYK/gray images abhi untouched rehti hain.
- **PDF Editor** – page preview par Text, Highlight, Rectangle, Ellipse, Line add karo; Undo / Clear page; "Apply edits" par asli PDF me likha jaata hai. **Existing text edit nahi hota** (sirf upar se add hota hai). Rotated pages par editing band hai (pehle Organizer se seedha karo). Text sirf basic Latin characters me.
- **PDF to Word** – text-based PDF se headings, paragraphs aur bullets detect karke DOCX banata hai. **Images, tables, columns, exact fonts nahi bante.** Scanned PDF par saaf message ("OCR chahiye") – OCR jaan-boojh kar nahi joda, kyunki free OCR libraries language data third-party servers se download karti hain.
- **PDF Password Protection** – asli **AES-256** encryption (`@cantoo/pdf-lib`, pdf-lib ka maintained fork). File browser me hi encrypt hoti hai; password kahin nahi jaata. Save se pehle tool khud check karta hai ki bina password ke file khulti nahi. Password bhoolne par recover nahi hota. Optional: printing/copying block (sirf un viewers me jo PDF permissions maante hain).

### Test checklist (naye tools)
- [ ] Cropper: drag/resize, har shape preset, number inputs, JPG/PNG/WebP; phone par touch se bhi
- [ ] PDF Compressor: photos wali PDF par dono methods; text-only PDF par "koi saving nahi" message; compressed file Adobe/Chrome me kholo
- [ ] PDF Editor: har tool, multi-page, Undo, Apply edits, saved PDF kisi dusre viewer me kholkar position check karo; rotated page par message
- [ ] PDF to Word: text PDF (headings/bullets), scanned PDF (OCR message), multi-page; DOCX Word/LibreOffice me kholo
- [ ] Password Protect: protected file Chrome/Adobe me kholo – password maangna chahiye, sahi password se khule; chhota/mismatch password par error
