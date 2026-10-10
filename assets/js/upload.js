/* ============================================================
   UPLOAD — แนบรูปในฟอร์ม (สูงสุด 10 รูป)
   รูปจะถูกย่อ (ด้านยาวสุด 1280px, JPEG) แล้วเก็บเป็น JSON ใน
   <input name="photosData"> ส่งไปพร้อมฟอร์มที่ script.js ส่งให้ Google Apps Script
   ============================================================ */
'use strict';

(() => {
  const MAX_PHOTOS = 10;
  const MAX_SIDE = 1280;
  const QUALITY = 0.72;

  const form = document.getElementById('contactForm');
  const input = document.getElementById('photoInput');
  if (!form || !input) return;
  const preview = document.getElementById('photoPreview');
  const data = document.getElementById('photosData');
  const count = document.getElementById('photoCount');
  const counter = document.getElementById('photoCounter');
  const warn = document.getElementById('photoWarn');

  let photos = []; // { name, data }

  const compress = (file) => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const w = Math.round(img.width * s), h = Math.round(img.height * s);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', QUALITY));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('read fail')); };
    img.src = url;
  });

  const render = () => {
    preview.innerHTML = '';
    photos.forEach((p, i) => {
      const box = document.createElement('div');
      box.className = 'up-thumb';
      const im = document.createElement('img');
      im.src = p.data; im.alt = p.name;
      const del = document.createElement('button');
      del.type = 'button'; del.setAttribute('aria-label', 'ลบรูป'); del.innerHTML = '&times;';
      del.addEventListener('click', () => { photos.splice(i, 1); warn.hidden = true; render(); });
      box.append(im, del);
      preview.appendChild(box);
    });
    data.value = photos.length ? JSON.stringify(photos) : '';
    count.value = photos.length;
    counter.hidden = photos.length === 0;
    counter.textContent = `เลือกแล้ว ${photos.length}/${MAX_PHOTOS} รูป`;
  };

  input.addEventListener('change', async () => {
    const files = [...input.files].filter((f) => f.type.startsWith('image/'));
    let overflow = false;
    for (const f of files) {
      if (photos.length >= MAX_PHOTOS) { overflow = true; break; }
      try { photos.push({ name: f.name, data: await compress(f) }); } catch (e) { /* ข้ามไฟล์ที่เปิดไม่ได้ */ }
    }
    input.value = '';
    warn.hidden = !overflow;
    render();
  });

  form.addEventListener('reset', () => { photos = []; warn.hidden = true; render(); });
  render();
})();
