(() => {
  'use strict';

  // Mobile navigation toggle
  const menuBtn = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      mobileNav.dataset.open = String(!expanded);
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.dataset.open = 'false';
      });
    });
  }

  // Product filtering & search
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const searchInput = document.getElementById('catalog-search-input');
  const productCards = Array.from(document.querySelectorAll('.product-card'));
  const countEl = document.getElementById('catalog-count');
  let activeCategory = 'all';

  const applyFilters = () => {
    const query = (searchInput?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    productCards.forEach((card) => {
      const cat = card.dataset.category || '';
      const text = (card.dataset.keywords || card.textContent || '').toLowerCase();
      const matchesCat = activeCategory === 'all' || cat === activeCategory;
      const matchesQuery = !query || text.includes(query);
      const show = matchesCat && matchesQuery;
      card.hidden = !show;
      if (show) visibleCount += 1;
    });

    if (countEl) {
      countEl.textContent = `顯示 ${visibleCount} / ${productCards.length} 項產品型錄（點擊圖片可放大檢視規格）`;
    }
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.filter || 'all';
      filterButtons.forEach((b) => {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // Native <dialog> Lightbox
  const lightbox = document.getElementById('product-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCat = document.getElementById('lightbox-cat');

  const openLightbox = (card) => {
    if (!lightbox || !lightboxImg || !lightboxTitle || !lightboxCat) return;
    const img = card.querySelector('img');
    const title = card.querySelector('.product-title')?.textContent || '';
    const cat = card.querySelector('.product-cat')?.textContent || '';
    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxImg.width = img.width;
    lightboxImg.height = img.height;
    lightboxTitle.textContent = title;
    lightboxCat.textContent = cat;
    lightbox.showModal();
  };

  productCards.forEach((card) => {
    const thumbBtn = card.querySelector('.product-thumb-btn');
    const zoomBtn = card.querySelector('.product-zoom-hint');
    thumbBtn?.addEventListener('click', () => openLightbox(card));
    zoomBtn?.addEventListener('click', () => openLightbox(card));
  });

  // Fallback backdrop click for browsers without closedby="any"
  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        lightbox.close();
      }
    });
  }

  // Static Inquiry Form -> mailto + status announcement
  const inquiryForm = document.getElementById('inquiry-form');
  const formStatus = document.getElementById('form-status');
  if (inquiryForm && formStatus) {
    inquiryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!inquiryForm.checkValidity()) {
        const firstInvalid = inquiryForm.querySelector(':invalid');
        firstInvalid?.focus();
        return;
      }

      const data = new FormData(inquiryForm);
      const name = String(data.get('name') || '').trim();
      const company = String(data.get('company') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const email = String(data.get('email') || '').trim();
      const message = String(data.get('message') || '').trim();

      const subject = encodeURIComponent(`[官網詢價] ${company || name} - 明宏五金實業社`);
      const body = encodeURIComponent(
        `聯絡人：${name}\n公司名稱：${company || '未填寫'}\n聯絡電話：${phone}\n電子郵件：${email}\n\n詢價 / 留言內容：\n${message}`
      );

      formStatus.textContent = '已為您開啟郵件軟體傳送詢價單；若未自動開啟，請直接來電 (07)696-6006 或寄信至 mh.mh168@msa.hinet.net。';
      window.location.href = `mailto:mh.mh168@msa.hinet.net?subject=${subject}&body=${body}`;
    });
  }
})();
