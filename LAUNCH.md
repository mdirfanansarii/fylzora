# Launch guide (Phase 7): deploy, domain, Search Console, AdSense

AdSense approval, traffic aur income ki **koi guarantee nahi** hai. Ye guide sirf site ko sahi tareeke se live karne aur Google ki requirements ke liye ready karne ke liye hai.

> **Budget note:** hosting (Cloudflare Pages) aur GitHub free hain, lekin **apna domain paid hota hai** (aam taur par kuch hundred rupees/saal). AdSense aam taur par apne domain par hi chalta hai; free `*.pages.dev` address par approval milne ki umeed mat rakho. Sahi rule AdSense Help Center me confirm kar lo.

---

## Step 0 – Local par final check
```bash
cp .env.example .env       # .env banao (agar pehle nahi banayi)
xed .env                   # editor me kholo: VITE_SITE_URL aur VITE_CONTACT_EMAIL asli bharo
npm install                # libraries (pehli baar)
npm test                   # sab ✔ hona chahiye
npm run build              # production build
npm run launch-check       # batata hai kya baaki hai (✘ = zaruri, ⚠ = dhyan do)
```
`launch-check` me koi `✘` nahi bachna chahiye.

## Step 1 – GitHub par code
```bash
git init                                   # git repository shuru
git add .                                  # saari files add (.env nahi jaati, .gitignore me hai)
git commit -m "FileHarbor launch"          # snapshot save
git branch -M main                         # main branch
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git   # GitHub repo ka address
git push -u origin main                    # upload
```

## Step 2 – Cloudflare Pages (free hosting)
1. Cloudflare account → **Workers & Pages → Create → Pages → Connect to Git** → apna repo.
2. Build command: `npm run build` · Output directory: `dist` · Node version: 20 ya naya (env var `NODE_VERSION=20`).
3. **Environment variables** (Production): `VITE_SITE_URL`, `VITE_CONTACT_EMAIL`, aur zarurat ho to `VITE_HIDE_UNFINISHED=true`. (`.env` GitHub par nahi jaati, isliye yahan dobara daalna zaruri hai.)
4. Deploy. Test karo: kisi tool URL par seedha jao + refresh; galat URL par 404 page aana chahiye.

## Step 3 – Domain
1. Domain kharido (kisi bhi registrar se), ya Cloudflare Registrar.
2. Pages project → **Custom domains → Set up a domain** → `your-domain.com`. DNS Cloudflare khud set karta hai agar domain Cloudflare par hai.
3. `www.your-domain.com` ko main domain par redirect karo (Cloudflare → Rules → Redirect Rules), taaki Google ko ek hi version dikhe.
4. `VITE_SITE_URL` ko `https://your-domain.com` karo aur redeploy (canonical, sitemap, robots sab isi se bante hain).

## Step 4 – Google Search Console
1. https://search.google.com/search-console → **Add property → Domain** → `your-domain.com`.
2. Google ek **TXT record** deta hai → Cloudflare DNS me add karo → Verify.
3. **Sitemaps** → `sitemap.xml` submit karo.
4. **URL inspection** me homepage aur 2–3 tool pages daalo → "Request indexing".
5. Indexing me din-hafte lag sakte hain. **Pages** report me "noindex" wale pages (Coming soon tools) normal hain.

## Step 5 – AdSense ke liye tayari (apply karne se pehle)
- [ ] `npm run launch-check` me koi ✘ nahi
- [ ] Saare tools live hain (koi "Coming soon" nahi). Future me naya unfinished tool jode to `VITE_HIDE_UNFINISHED=true` rakho
- [ ] Har tool khud test kiya (checklists README me), koi tool "kuch nahi karta" wala nahi
- [ ] Privacy Policy, Terms, Contact (asli working email), About, Disclaimer – saaf dikhte hain; legal text ko apne hisaab se review karo
- [ ] Site mobile par theek chalti hai; Lighthouse me accessibility/SEO achhe
- [ ] Koi copied/duplicate content, fake review ya misleading claim nahi
- [ ] Kuch hafte/mahine ka organic traffic aur Search Console me indexed pages (Google ki fixed requirement nahi hai, par bilkul naye khaali site ke approve hone ke chance kam hote hain)

## Step 6 – AdSense apply
1. https://adsense.google.com → sign up → apna domain add karo.
2. AdSense jo **publisher ID** deta hai (`ca-pub-XXXXXXXXXXXXXXXX`) use Cloudflare env var `VITE_ADSENSE_CLIENT` me daalo → redeploy.
   - Build khud har page ke `<head>` me AdSense script daalta hai aur `ads.txt` banata hai (`google.com, pub-…, DIRECT, f08c47fec0942fa0`). **AdSense jo line dikhaye usse compare karo.**
3. AdSense me site verify karo → review ka intezaar. Reject ho to reason padho, theek karo, phir dobara apply.
4. **Kabhi apne ads par click mat karo, na kisi se kehna.** Isse account band ho sakta hai.

## Step 7 – Approval ke baad
1. **Ads → By ad unit → Display ad** banao (responsive). Uska **ad-unit ID** `VITE_ADSENSE_SLOT_TOOL_BOTTOM` me daalo → redeploy. Ad sirf live tool pages ke **niche** aata hai, upload/download buttons se door.
2. **Auto ads OFF** rakho (ya tool pages exclude karo) – warna ad buttons ke paas aa sakta hai.
3. **Privacy & messaging** me EEA/UK/Switzerland ke liye Google ka consent message banao aur publish karo (ye free hai; apna banaya banner Google-certified nahi hota).
4. Privacy aur Cookies pages ab apne aap "ads dikhte hain" wala text dikhate hain (`VITE_ADSENSE_CLIENT` set hone par). Phir bhi unhe padho aur apne hisaab se update karo.
5. Content Security Policy abhi nahi hai. Lagana ho to AdSense ads ke saath test karke lagao (galat CSP ads tod deti hai).

## Step 8 – Launch ke baad
- Search Console: Performance (kaunsi queries), Pages (indexing errors), Core Web Vitals.
- AdSense: Policy center me warnings.
- Har tool ko alag-alag browsers par kabhi-kabhi test karo; bug reports contact email par aayenge.
- Naye tools tabhi add karo jab asli kaam karein; hazaaron thin/duplicate SEO pages mat banao.
- Aage ke improvements: Web Workers (bade files ke liye), PDF page thumbnails, scanned PDFs ke liye OCR (privacy disclosure ke saath).
