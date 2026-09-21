/** Мінімальний PDF (одна сторінка A4 із JPEG-зображенням) без сторонніх бібліотек. */
export function pdfFromJpeg(jpg: Uint8Array, wpx: number, hpx: number): Blob {
  const enc = new TextEncoder(), parts: BlobPart[] = [], off: number[] = [];
  let len = 0;
  const add = (x: string | Uint8Array) => {
    const b = typeof x === 'string' ? enc.encode(x) : x;
    parts.push(b as BlobPart);
    len += b.length;
  };
  add('%PDF-1.4\n');
  off[1] = len;
  add('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  off[2] = len;
  add('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  off[3] = len;
  add('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n');
  off[4] = len;
  add('4 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + wpx + ' /Height ' + hpx +
    ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpg.length + ' >>\nstream\n');
  add(jpg);
  add('\nendstream\nendobj\n');
  const cs = 'q 595 0 0 842 0 0 cm /Im0 Do Q';
  off[5] = len;
  add('5 0 obj\n<< /Length ' + cs.length + ' >>\nstream\n' + cs + '\nendstream\nendobj\n');
  const xr = len;
  add('xref\n0 6\n0000000000 65535 f \n' + [1, 2, 3, 4, 5].map((i) => ('0000000000' + off[i]).slice(-10) + ' 00000 n \n').join('') +
    'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xr + '\n%%EOF\n');
  return new Blob(parts, { type: 'application/pdf' });
}
