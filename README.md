# Fylzora

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
