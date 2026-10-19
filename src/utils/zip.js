// Bundles several output files into one ZIP and downloads it. JSZip loads only when clicked.
export async function downloadZip(items, zipName) {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const used = new Set();
  items.forEach(({ name, blob }) => {
    let n = name;
    let i = 1;
    while (used.has(n)) n = name.replace(/(\.[^.]+)?$/, `-${i++}$1`);
    used.add(n);
    zip.file(n, blob);
  });
  const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = zipName;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
