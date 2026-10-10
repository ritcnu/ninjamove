/* ============================================================
   GALLERY — ผลงานของเรา
   ★ เพิ่มรูปใหม่: อัปโหลดไฟล์ไว้ใน assets/images/gallery/
     แล้วเพิ่มอีก 1 บรรทัดใน GALLERY_IMAGES ด้านล่าง ★
   ============================================================ */
'use strict';

const GALLERY_IMAGES = [
  { src: 'assets/images/gallery/work-01.jpg', caption: 'งานย้ายสำนักงาน' },
  { src: 'assets/images/gallery/work-02.jpg', caption: 'งานย้ายบ้าน แพ็คและห่อกันกระแทก' },
  { src: 'assets/images/gallery/work-03.jpg', caption: 'งานร้านกาแฟ แพ็คโต๊ะ-เก้าอี้' },
  // { src: 'assets/images/gallery/work-04.jpg', caption: 'คำอธิบายรูป' },
];

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('galleryTrack');
  if (!track) return;
  const dotsBox = document.getElementById('galleryDots');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');

  // ---------- render ----------
  GALLERY_IMAGES.forEach((g, i) => {
    const fig = document.createElement('figure');
    fig.className = 'gallery-item';
    fig.innerHTML = `<img src="${g.src}" alt="${g.caption}" loading="lazy">` +
      (g.caption ? `<figcaption><i class="fas fa-truck-fast"></i>${g.caption}</figcaption>` : '');
    fig.addEventListener('click', () => openBox(i));
    track.appendChild(fig);
  });
  const items = [...track.children];

  // ---------- slider ----------
  const step = () => (items[1] ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth);
  const maxScroll = () => track.scrollWidth - track.clientWidth;
  const go = (dir) => {
    const atEnd = track.scrollLeft >= maxScroll() - 4;
    if (dir > 0 && atEnd) track.scrollTo({ left: 0 });
    else if (dir < 0 && track.scrollLeft <= 4) track.scrollTo({ left: maxScroll() });
    else track.scrollBy({ left: dir * step() });
  };
  prevBtn.addEventListener('click', () => go(-1));
  nextBtn.addEventListener('click', () => go(1));

  const buildDots = () => {
    dotsBox.innerHTML = '';
    const n = Math.max(1, Math.round(maxScroll() / step()) + 1);
    for (let i = 0; i < n; i++) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `สไลด์ที่ ${i + 1}`);
      b.addEventListener('click', () => track.scrollTo({ left: i * step() }));
      dotsBox.appendChild(b);
    }
    const scrollable = maxScroll() > 4;
    prevBtn.hidden = nextBtn.hidden = !scrollable;
    dotsBox.style.display = scrollable ? 'flex' : 'none';
    syncDots();
  };
  const syncDots = () => {
    const i = Math.round(track.scrollLeft / step());
    [...dotsBox.children].forEach((d, k) => d.classList.toggle('active', k === i));
  };
  track.addEventListener('scroll', syncDots, { passive: true });
  window.addEventListener('resize', buildDots);
  buildDots();

  // ---------- autoplay ----------
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;
  const play = () => { if (!reduce && maxScroll() > 4) timer = setInterval(() => go(1), 4500); };
  const stop = () => { clearInterval(timer); timer = null; };
  const slider = track.parentElement;
  ['mouseenter', 'touchstart', 'focusin'].forEach(e => slider.addEventListener(e, stop, { passive: true }));
  ['mouseleave', 'touchend', 'focusout'].forEach(e => slider.addEventListener(e, () => { stop(); play(); }, { passive: true }));
  play();

  // ---------- lightbox ----------
  const box = document.getElementById('lightbox');
  const boxImg = box.querySelector('img');
  const boxCap = box.querySelector('.lightbox-cap');
  let cur = 0;
  const show = (i) => {
    cur = (i + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    boxImg.src = GALLERY_IMAGES[cur].src;
    boxImg.alt = GALLERY_IMAGES[cur].caption || '';
    boxCap.textContent = GALLERY_IMAGES[cur].caption || '';
  };
  function openBox(i) { show(i); box.classList.add('open'); document.body.style.overflow = 'hidden'; stop(); }
  const closeBox = () => { box.classList.remove('open'); document.body.style.overflow = ''; };
  box.querySelector('.lb-close').addEventListener('click', closeBox);
  box.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); show(cur - 1); });
  box.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); show(cur + 1); });
  box.addEventListener('click', (e) => { if (e.target === box) closeBox(); });
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') closeBox();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
});
