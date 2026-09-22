(() => {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

  navToggle?.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('is-open'));
  });

  // Back to top button
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    toTop.classList.toggle('is-visible', window.scrollY > 500);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Count-up stats
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Scroll reveal + triggers for skill bars / stats
  const revealEls = document.querySelectorAll('[data-reveal]');
  const skillFills = document.querySelectorAll('.skill__fill');
  const statNums = document.querySelectorAll('.stat__num');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  revealEls.forEach(el => io.observe(el));

  const skillIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      skillIO.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  skillFills.forEach(el => skillIO.observe(el));

  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      statIO.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statIO.observe(el));

  // Contact form (client-side only — no backend wired up)
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const required = contactForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) valid = false;
    });

    if (!valid) {
      contactStatus.textContent = 'Please fill in your name, email, and message.';
      contactStatus.classList.add('is-error');
      return;
    }

    contactStatus.classList.remove('is-error');
    contactStatus.textContent = "Thanks! Your message has been received — we'll be in touch soon.";
    contactForm.reset();
  });

  // FAQ accordion (contact page)
  document.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-item__a');
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(open => {
        if (open !== item) {
          open.classList.remove('is-open');
          open.querySelector('.faq-item__a').style.maxHeight = null;
        }
      });
      item.classList.toggle('is-open', !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });
  // set initial open state height (the FAQ item marked is-open by default)
  document.querySelectorAll('.faq-item.is-open .faq-item__a').forEach(a => {
    a.style.maxHeight = a.scrollHeight + 'px';
  });

  // Newsletter form (contact page + footer)
  document.querySelectorAll('.newsletter__form, .footer__newsletter form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const status = form.parentElement.querySelector('#newsletterStatus');
      if (!input.value.trim() || !input.checkValidity()) {
        if (status) { status.textContent = 'Please enter a valid email address.'; status.classList.add('is-error'); }
        return;
      }
      if (status) { status.textContent = "Thanks for subscribing!"; status.classList.remove('is-error'); }
      form.reset();
    });
  });

  // Load More buttons (services / projects pages) — stub for now
  document.querySelectorAll('#loadMoreServices, #loadMoreWork').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = 'No more results';
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.style.cursor = 'default';
    });
  });

  // Language switch (FR default / AR translation)
  (() => {
    const STORAGE_KEY = 'novaLang';
    const switchEl = document.getElementById('langSwitch');
    const originals = new Map(); // element -> original french text/attr value
    const currentPage = location.pathname.split('/').pop() || 'index.html';

    const collectOriginals = () => {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        if (!originals.has(el)) originals.set(el, el.innerHTML);
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        if (!originals.has(el)) originals.set(el, el.getAttribute('placeholder'));
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        if (!originals.has(el)) originals.set(el, el.getAttribute('aria-label'));
      });
    };

    const applyLang = (lang) => {
      const isAr = lang === 'ar';
      document.documentElement.setAttribute('lang', isAr ? 'ar' : 'fr');
      document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerHTML = isAr ? (I18N_AR[key] || originals.get(el)) : originals.get(el);
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', isAr ? (I18N_AR[key] || originals.get(el)) : originals.get(el));
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        el.setAttribute('aria-label', isAr ? (I18N_AR[key] || originals.get(el)) : originals.get(el));
      });

      const titleKey = (typeof I18N_PAGE_TITLE_KEY !== 'undefined') ? I18N_PAGE_TITLE_KEY[currentPage] : null;
      if (titleKey) {
        if (isAr) {
          if (!document.title.__enOriginal) document.title.__enOriginal = document.title;
          document.title = I18N_AR[titleKey] || document.title;
        } else if (originals.get('__title__')) {
          document.title = originals.get('__title__');
        }
      }

      if (switchEl) {
        switchEl.querySelectorAll('.lang-switch__btn').forEach(btn => {
          btn.classList.toggle('is-active', btn.dataset.lang === lang);
        });
      }
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    };

    collectOriginals();
    originals.set('__title__', document.title);

    // Expose so dynamically-rendered content (e.g. the interactive
    // services list) can register itself and pick up the current
    // language after it's built.
    window.NovaI18N = {
      applyLang,
      collectOriginals,
      getLang: () => (document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'fr')
    };

    if (switchEl) {
      switchEl.querySelectorAll('.lang-switch__btn').forEach(btn => {
        btn.addEventListener('click', () => applyLang(btn.dataset.lang));
      });
    }

    let saved = 'fr';
    try { saved = localStorage.getItem(STORAGE_KEY) || 'fr'; } catch (e) {}
    if (saved === 'ar') applyLang('ar');
  })();

  // Horizontal media showcase — a reusable "row" component used for
  // the Reels teaser on the homepage, and the Reels + Designs rows
  // on the Works page. Each call to initShowcase() is one independent
  // row: its own items, media type, direction and speed.
  (() => {
    // Registry so the video modal can pause/resume every row's auto-scroll
    // (keyed by trackId, filled in by initShowcase below).
    const showcaseControls = {};

    // ---- YouTube URL helpers ----
    // Supports: watch?v=ID, shorts/ID, youtu.be/ID (and embed/ID, just in case).
    const YT_SHORTS_RE = /youtube\.com\/shorts\/([\w-]{6,})/i;
    const YT_SHORT_RE  = /youtu\.be\/([\w-]{6,})/i;
    const YT_WATCH_RE  = /youtube\.com\/watch\?[^#]*\bv=([\w-]{6,})/i;
    const YT_EMBED_RE  = /youtube\.com\/embed\/([\w-]{6,})/i;

    const getYouTubeId = (url) => {
      if (!url || typeof url !== 'string') return null;
      const match =
        url.match(YT_SHORTS_RE) ||
        url.match(YT_SHORT_RE) ||
        url.match(YT_WATCH_RE) ||
        url.match(YT_EMBED_RE);
      return match ? match[1] : null;
    };
    const isShortsUrl = (url) => YT_SHORTS_RE.test(url || '');
    const ytThumbUrl = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    const initShowcase = ({
      trackId,        // id of the empty <div> that will hold the strip
      items,          // array of file paths (videos or images) — same array can feed multiple rows
      mediaType,       // 'video' | 'image'
      direction = 1,   // 1 = right→left,  -1 = left→right
      duration = 35,   // seconds for ONE full loop of the item set — lower = faster
      resumeDelay = 1200 // ms of idle time after a drag/swipe before auto-scroll resumes
    }) => {
      const track = document.getElementById(trackId);
      if (!track || !items || !items.length) return;

      const itemClass = 'showcase-item ' + (mediaType === 'video' ? 'showcase-item--reel' : 'showcase-item--design');

      const buildSet = () => items.map((src, i) => {
        const item = document.createElement('div');
        item.className = itemClass;
        if (mediaType === 'video') {
          item.setAttribute('aria-label', `Reel video ${i + 1}`);
          item.setAttribute('role', 'button');
          item.tabIndex = 0;

          const ytId = getYouTubeId(src);
          if (ytId) {
            // YouTube source: show a real thumbnail + play button.
            // No iframe/video is created here — nothing loads or plays
            // until the card is clicked and the modal opens.
            const thumb = document.createElement('img');
            thumb.src = ytThumbUrl(ytId);
            thumb.loading = 'eager';
            thumb.decoding = 'async';
            thumb.alt = `Reel video ${i + 1}`;
            thumb.draggable = false;
            item.appendChild(thumb);

            const playBtn = document.createElement('span');
            playBtn.className = 'showcase-item__play';
            playBtn.setAttribute('aria-hidden', 'true');
            playBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
            item.appendChild(playBtn);
          } else {
            // Local file fallback (kept for backward compatibility).
            const video = document.createElement('video');
            video.src = src;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.setAttribute('playsinline', '');
            video.preload = 'metadata';
            video.tabIndex = -1;
            item.appendChild(video);
          }

          item.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openVideoLightbox(src);
          });
        } else {
          item.setAttribute('aria-label', `Design ${i + 1}`);
          item.setAttribute('role', 'button');
          item.tabIndex = 0;

          const img = document.createElement('img');
          img.src = src;
          img.loading = 'eager';
          img.decoding = 'async';
          img.alt = `Design work sample ${i + 1}`;
          img.draggable = false;
          item.appendChild(img);

          item.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openImageLightbox(src);
          });
        }
        return item;
      });

      // Duplicate the set once (internally only — no extra files needed)
      // so the strip can wrap from the last item back to the first with
      // no visible jump.
      buildSet().forEach(el => track.appendChild(el));
      buildSet().forEach(el => track.appendChild(el));

      const els = Array.from(track.children);

      // Videos: only decode/play the ones near/within the visible area,
      // so off-screen rows and off-screen items don't burn CPU/GPU.
      if (mediaType === 'video') {
        const playIO = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const video = entry.target.querySelector('video');
            if (!video) return;
            if (entry.isIntersecting) {
              if (video.preload !== 'auto') video.preload = 'auto';
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        }, { root: null, rootMargin: '0px 250px', threshold: 0.15 });
        els.forEach(el => playIO.observe(el));
      }

      let position = 0;
      let dragging = false;
      let paused = false;
      let startX = 0;
      let startPosition = 0;
      let resumeTimer = null;
      let lastTime = null;

      // Half the track's width = the width of ONE (non-duplicated) set —
      // that's the distance one full loop travels.
      const halfWidth = () => track.scrollWidth / 2;
      const wrap = (val) => {
        const half = halfWidth();
        if (half <= 0) return 0;
        let v = val % half;
        if (v < 0) v += half;
        return v;
      };

      // translate3d keeps this on the GPU compositor instead of
      // triggering layout/paint on every frame.
      const render = () => { track.style.transform = `translate3d(${-position}px,0,0)`; };

      const tick = (time) => {
        if (lastTime === null) lastTime = time;
        const dt = time - lastTime;
        lastTime = time;
        if (!dragging && !paused) {
          const half = halfWidth();
          if (half > 0 && duration > 0) {
            const pxPerMs = half / (duration * 1000);
            position = wrap(position + pxPerMs * dt * direction);
            render();
          }
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      // Which reel item (if any) the current pointer interaction started on,
      // and whether it moved enough to count as a drag rather than a tap.
      let pointerDownItem = null;
      let pointerMoved = false;

      const openItemMedia = (item) => {
        if (!item) return;
        const index = els.indexOf(item) % items.length;
        if (index < 0 || !items[index]) return;
        if (mediaType === 'video') openVideoLightbox(items[index]);
        else openImageLightbox(items[index]);
      };

      const itemSelector = mediaType === 'video' ? '.showcase-item--reel' : '.showcase-item--design';

      const onPointerDown = (e) => {
        dragging = true;
        paused = true;
        clearTimeout(resumeTimer);
        startX = e.clientX;
        startPosition = position;
        track.classList.add('is-dragging');
        track.setPointerCapture?.(e.pointerId);
        pointerMoved = false;
        pointerDownItem = e.target.closest(itemSelector);
      };
      const onPointerMove = (e) => {
        if (!dragging) return;
        const delta = e.clientX - startX;
        // Once horizontal intent is clear, take over from native scroll
        // (touch-action: pan-y on the track still lets vertical page
        // scroll pass through until this fires).
        if (Math.abs(delta) > 4) {
          e.preventDefault();
          pointerMoved = true;
        }
        position = wrap(startPosition - delta);
        render();
      };
      // Note: on Chromium, setPointerCapture() above causes the click event
      // that would normally follow pointerup to be re-targeted to `track`
      // itself instead of the card the user actually tapped — which makes
      // event.target.closest(itemSelector) fail and silently does nothing.
      // So opening the media is driven directly from this tap detection
      // instead of from a 'click' listener.
      const onPointerUp = () => {
        if (dragging && !pointerMoved && pointerDownItem) {
          openItemMedia(pointerDownItem);
        }
        endDrag();
      };
      const endDrag = () => {
        if (!dragging) return;
        dragging = false;
        pointerDownItem = null;
        track.classList.remove('is-dragging');
        clearTimeout(resumeTimer);
        // Resume with this row's own original automatic direction —
        // "direction" never changes, only "paused" does.
        resumeTimer = setTimeout(() => { paused = false; }, resumeDelay);
      };

      track.addEventListener('pointerdown', onPointerDown);
      track.addEventListener('pointermove', onPointerMove, { passive: false });
      track.addEventListener('pointerup', onPointerUp);
      track.addEventListener('pointercancel', endDrag);
      track.addEventListener('pointerleave', endDrag);
      track.addEventListener('dragstart', (e) => e.preventDefault());

      // Fallback for input paths that don't go through the pointerdown/up
      // handlers above (synthetic clicks, some assistive tech). Guarded by
      // the debounce inside openVideoLightbox/openImageLightbox so it can't
      // double-open.
      track.addEventListener('click', (event) => {
        const item = event.target.closest(itemSelector);
        if (!item || !track.contains(item)) return;
        event.preventDefault();
        event.stopPropagation();
        openItemMedia(item);
      }, true);

      // Let the video modal pause/resume THIS row's auto-scroll while
      // a video is open, without touching the drag-driven "paused" flag
      // logic above — same variables, just controlled externally too.
      showcaseControls[trackId] = {
        pause: () => {
          paused = true;
          clearTimeout(resumeTimer);
        },
        resume: (delay = resumeDelay) => {
          clearTimeout(resumeTimer);
          resumeTimer = setTimeout(() => { paused = false; }, delay);
        }
      };
    };

    // ---- EDIT THESE LISTS to add/remove media ----
    // Reel videos are now real YouTube links — paste any of these formats:
    //   https://www.youtube.com/watch?v=VIDEO_ID
    //   https://www.youtube.com/shorts/VIDEO_ID
    //   https://youtu.be/VIDEO_ID
    // The card will show the real YouTube thumbnail; clicking it opens
    // the video in a fullscreen modal and plays it with sound.
    // (Old local "videos/reel-N.mp4" paths still work too, as a fallback.)
    const reels = [
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786835108/reel-4.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786834959/reel-2.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786834807/reel-5.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786834483/reel-8.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786834473/reel-6.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786834387/reel-10.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786834281/reel-13.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786834255/reel-9.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786834204/reel-1.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786833676/reel-14.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786832981/reel-12.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786832787/reel-11.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786832611/reel-3.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1786913849/reel-7.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1787262307/Ouverture.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1787349426/Localisation.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1790031183/Brand_Presentation_Video.mp4',
      'https://res.cloudinary.com/gzeufpvy/video/upload/v1790030251/Perla_Project.mp4',

      // Add more here as you upload them, e.g.:
      // 'videos/reel-2.mp4',
      // 'videos/reel-3.mp4',
    ];

    // Design images live in a "designs" folder next to index.html.
    // The SAME list feeds every Designs row — no duplicate files needed.
    const designs = [
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1787261971/Untitled_design.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1787261916/ChatGPT_Image_Aug_19_2026_09_40_45_PM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1787261907/WhatsApp_Image_2026-08-19_at_19.37.15.jpg',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904482/ChatGPT_Image_Aug_11_2026_04_41_25_PM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904478/ChatGPT_Image_Aug_9_2026_03_47_35_PM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904465/mockup_chocolat_A4_300dpi.jpg',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904456/ChatGPT_Image_Aug_9_2026_03_52_07_PM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904453/ChatGPT_Image_Aug_8_2026_12_11_52_PM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904406/ChatGPT_Image_Aug_8_2026_10_32_07_AM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904404/ChatGPT_Image_Aug_8_2026_11_55_47_AM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904369/ChatGPT_Image_Aug_7_2026_10_38_50_PM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904367/ChatGPT_Image_Aug_8_2026_11_46_14_AM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904365/ChatGPT_Image_Aug_8_2026_10_30_46_AM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904341/ChatGPT_Image_Aug_8_2026_10_59_33_AM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904285/ChatGPT_Image_Aug_7_2026_11_21_59_PM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904269/ChatGPT_Image_Aug_8_2026_04_36_13_PM.png',
      'https://res.cloudinary.com/gzeufpvy/image/upload/v1786904204/ChatGPT_Image_Aug_7_2026_10_36_55_PM.png'
    ];
    // Split each list in half so row 1 and row 2 never show the same
    // video/design — each row gets its own exclusive subset.
    const splitInHalf = (list) => {
      const mid = Math.ceil(list.length / 2);
      return [list.slice(0, mid), list.slice(mid)];
    };
    const [reelsRow1, reelsRow2] = splitInHalf(reels);
    const [designsRow1, designsRow2] = splitInHalf(designs);

    // ---- Central speed/direction config ----
    // direction: 1 = right → left, -1 = left → right
    // duration: seconds for one full loop — lower number = faster row
    // Keys are named by their VISUAL position on the Works page
    // (row1 = first row on the page, and so on).
    const ROW_CONFIG = {
      homeTeaser: { direction: 1,  duration: 32 },
      row1:       { direction: 1,  duration: 35 }, // videos — right → left
      row2:       { direction: -1, duration: 38 }, // designs — left → right
      row3:       { direction: 1,  duration: 35 }, // videos — right → left
      row4:       { direction: -1, duration: 38 }  // designs — left → right
    };

    // Homepage "Our Work" teaser strip
    initShowcase({ trackId: 'reelTrack', items: reels, mediaType: 'video', ...ROW_CONFIG.homeTeaser });

    // Works page — 4 rows, in visual order: video, design, video, design
    // Each row uses its own exclusive half of the list (see splitInHalf
    // above) so the same video/design never appears in both rows of its type.
    initShowcase({ trackId: 'reelsTrackRow1',   items: reelsRow1,   mediaType: 'video', ...ROW_CONFIG.row1 });
    initShowcase({ trackId: 'designsTrackRow1', items: designsRow1, mediaType: 'image', ...ROW_CONFIG.row2 });
    initShowcase({ trackId: 'reelsTrackRow2',   items: reelsRow2,   mediaType: 'video', ...ROW_CONFIG.row3 });
    initShowcase({ trackId: 'designsTrackRow2', items: designsRow2, mediaType: 'image', ...ROW_CONFIG.row4 });

    const lightbox = document.createElement('div');
    lightbox.className = 'video-lightbox';
    lightbox.innerHTML = `
      <div class="video-lightbox__backdrop"></div>
      <div class="video-lightbox__stage" role="dialog" aria-modal="true" aria-label="Video player">
        <button type="button" class="video-lightbox__close" aria-label="Close video">&times;</button>
        <div class="video-lightbox__player"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const stage = lightbox.querySelector('.video-lightbox__stage');
    const player = lightbox.querySelector('.video-lightbox__player');

    let savedScrollY = 0;
    let resumeAllTimer = null;

    const pauseAllRows = () => {
      Object.values(showcaseControls).forEach(ctrl => ctrl.pause());
    };
    const resumeAllRows = (delay) => {
      clearTimeout(resumeAllTimer);
      resumeAllTimer = setTimeout(() => {
        Object.values(showcaseControls).forEach(ctrl => ctrl.resume(0));
      }, delay);
    };

    const closeVideoLightbox = () => {
      if (!lightbox.classList.contains('is-open')) return;
      lightbox.classList.remove('is-open');
      // Emptying the player removes the iframe/video from the DOM —
      // that's what actually stops YouTube playback (and its audio).
      player.innerHTML = '';
      document.body.classList.remove('video-lightbox-open');

      // Return to the same portfolio scroll position...
      window.scrollTo(0, savedScrollY);
      // ...then resume every row's auto-scroll after a short delay.
      resumeAllRows(900);
    };

    // Guards against the same video being opened twice from a single tap
    // (e.g. the direct tap-detection path above AND a click event both firing).
    let lastOpenSrc = null;
    let lastOpenAt = 0;

    const openVideoLightbox = (src) => {
      if (!src) return;
      const now = Date.now();
      if (src === lastOpenSrc && now - lastOpenAt < 400) return;
      lastOpenSrc = src;
      lastOpenAt = now;

      clearTimeout(resumeAllTimer);
      player.innerHTML = '';

      const ytId = getYouTubeId(src);

      if (ytId) {
        // Real YouTube iframe — created fresh on every open, destroyed on
        // close. Never downloaded or hosted locally.
        stage.classList.toggle('video-lightbox__stage--horizontal', !isShortsUrl(src));

        const iframe = document.createElement('iframe');
        const params = new URLSearchParams({
          autoplay: '1',
          playsinline: '1',
          rel: '0',
          modestbranding: '1',
          enablejsapi: '1',
          origin: window.location.origin
        });
        iframe.src = `https://www.youtube.com/embed/${ytId}?${params.toString()}`;
        iframe.title = 'YouTube video player';
        iframe.setAttribute('frameborder', '0');
        // Real audio + full YouTube controls — never muted, never stripped.
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.setAttribute('allowfullscreen', '');
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        player.appendChild(iframe);
      } else {
        // Local file fallback (kept for backward compatibility).
        stage.classList.remove('video-lightbox__stage--horizontal');
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.muted = false;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('controlslist', 'nodownload');
        player.appendChild(video);
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }

      savedScrollY = window.scrollY;
      pauseAllRows();
      lightbox.classList.add('is-open');
      document.body.classList.add('video-lightbox-open');
    };

    lightbox.querySelector('.video-lightbox__close').addEventListener('click', closeVideoLightbox);
    lightbox.querySelector('.video-lightbox__backdrop').addEventListener('click', closeVideoLightbox);

    // ---- Image (design) Lightbox — same pattern as the video one above ----
    const imageLightbox = document.createElement('div');
    imageLightbox.className = 'image-lightbox';
    imageLightbox.innerHTML = `
      <div class="image-lightbox__backdrop"></div>
      <div class="image-lightbox__stage" role="dialog" aria-modal="true" aria-label="Design preview">
        <button type="button" class="image-lightbox__close" aria-label="Close design preview">&times;</button>
        <img class="image-lightbox__img" alt="Design preview"/>
      </div>
    `;
    document.body.appendChild(imageLightbox);

    const imageEl = imageLightbox.querySelector('.image-lightbox__img');
    let savedScrollYImage = 0;
    let lastOpenImageSrc = null;
    let lastOpenImageAt = 0;

    const closeImageLightbox = () => {
      if (!imageLightbox.classList.contains('is-open')) return;
      imageLightbox.classList.remove('is-open');
      imageEl.src = '';
      document.body.classList.remove('image-lightbox-open');
      window.scrollTo(0, savedScrollYImage);
      resumeAllRows(900);
    };

    const openImageLightbox = (src) => {
      if (!src) return;
      const now = Date.now();
      if (src === lastOpenImageSrc && now - lastOpenImageAt < 400) return;
      lastOpenImageSrc = src;
      lastOpenImageAt = now;

      imageEl.src = src;
      savedScrollYImage = window.scrollY;
      pauseAllRows();
      imageLightbox.classList.add('is-open');
      document.body.classList.add('image-lightbox-open');
    };

    imageLightbox.querySelector('.image-lightbox__close').addEventListener('click', closeImageLightbox);
    imageLightbox.querySelector('.image-lightbox__backdrop').addEventListener('click', closeImageLightbox);

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (lightbox.classList.contains('is-open')) closeVideoLightbox();
      if (imageLightbox.classList.contains('is-open')) closeImageLightbox();
    });
  })();

  // Trusted By / Clients logo strip — single-line marquee that auto-scrolls
  // and can also be dragged/swiped manually. Auto-scroll pauses on hover
  // and while dragging, then resumes shortly after.
  (() => {
    const rail = document.getElementById('trustedRail');
    const track = document.getElementById('trustedTrack');
    if (!rail || !track) return;

    const duration = 30; // seconds for one full loop — lower = faster
    const direction = 1; // 1 = right→left
    const resumeDelay = 1000; // ms of idle time after a drag before auto-scroll resumes
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Duplicate the logo set once so the strip can loop from the last
    // logo back to the first with no visible jump.
    Array.from(track.children).forEach(el => track.appendChild(el.cloneNode(true)));

    let position = 0;
    let dragging = false;
    let hovering = false;
    let paused = false;
    let startX = 0;
    let startPosition = 0;
    let resumeTimer = null;
    let lastTime = null;

    const halfWidth = () => track.scrollWidth / 2;
    const wrap = (val) => {
      const half = halfWidth();
      if (half <= 0) return 0;
      let v = val % half;
      if (v < 0) v += half;
      return v;
    };
    const render = () => { track.style.transform = `translate3d(${-position}px,0,0)`; };

    const tick = (time) => {
      if (lastTime === null) lastTime = time;
      const dt = time - lastTime;
      lastTime = time;
      if (!reduceMotion && !dragging && !hovering && !paused) {
        const half = halfWidth();
        if (half > 0 && duration > 0) {
          const pxPerMs = half / (duration * 1000);
          position = wrap(position + pxPerMs * dt * direction);
          render();
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const onPointerDown = (e) => {
      dragging = true;
      paused = true;
      clearTimeout(resumeTimer);
      startX = e.clientX;
      startPosition = position;
      rail.classList.add('is-dragging');
      rail.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      const delta = e.clientX - startX;
      if (Math.abs(delta) > 4) e.preventDefault();
      position = wrap(startPosition - delta);
      render();
    };
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove('is-dragging');
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, resumeDelay);
    };

    rail.addEventListener('pointerdown', onPointerDown);
    rail.addEventListener('pointermove', onPointerMove, { passive: false });
    rail.addEventListener('pointerup', endDrag);
    rail.addEventListener('pointercancel', endDrag);
    rail.addEventListener('pointerleave', () => { hovering = false; endDrag(); });
    rail.addEventListener('dragstart', (e) => e.preventDefault());
    rail.addEventListener('mouseenter', () => { hovering = true; });
    rail.addEventListener('mouseleave', () => { hovering = false; });
  })();

  // Interactive Services list (Services page — accordion-style reveal)
  (() => {
    const container = document.getElementById('servicesInteractive');
    if (!container) return;

    // ---- EDIT THIS LIST to add, remove, or edit services ----
    // "image" points to a file inside the images/services/ folder.
    // If an image is missing, the layout simply stays clean (no broken icon).
    const services = [
      {
        number: '01.',
        icon: '📷',
        titleKey: 's117',
        title: 'Photographie',
        descKey: 's128',
        description: 'Une photographie professionnelle qui capture vos produits, vos espaces et les moments forts de votre marque avec une netteté saisissante.',
        image: 'images/services/01_photography.jpg'
      },
      {
        number: '02.',
        icon: '🎨',
        titleKey: 's118',
        title: 'Design graphique',
        descKey: 's129',
        description: 'Des designs visuels créatifs pour votre marque, vos réseaux sociaux, votre publicité et votre communication d\'entreprise.',
        image: 'images/services/02_graphic_design.jpg'
      },
      {
        number: '03.',
        icon: '📱',
        titleKey: 's122',
        title: 'Réseaux sociaux',
        descKey: 's130',
        description: 'Des visuels créatifs pour les réseaux sociaux et du contenu court conçus pour capter l\'attention et augmenter l\'engagement.',
        image: 'images/services/03_social_media.webp'
      },
      {
        number: '04.',
        icon: '🎥',
        titleKey: 's120',
        title: 'Vidéographie',
        descKey: 's131',
        description: 'Une production vidéo et un tournage professionnels qui donnent vie à l\'histoire de votre marque à l\'écran.',
        image: 'images/services/04_videography.jpg'
      },
      {
        number: '05.',
        icon: '🖨️',
        titleKey: 's121',
        title: 'Impression',
        descKey: 's132',
        description: 'Des supports imprimés de haute qualité, des cartes de visite aux affichages grand format, réalisés avec précision.',
        image: 'images/services/05_printing.jpg'
      },
      {
        number: '06.',
        icon: '✨',
        titleKey: 's119',
        title: 'Branding',
        descKey: 's133',
        description: 'Des identités de marque, des logos et des systèmes visuels distinctifs qui rendent votre entreprise mémorable.',
        image: 'images/services/06_branding.jpg'
      }
    ];

    // A container can show a subset (and choose the order) by listing
    // titleKeys, e.g. data-services="s118,s120,s117". No attribute = show all.
    const filterAttr = container.dataset.services;
    const list = filterAttr
      ? filterAttr.split(',').map(k => k.trim()).map(key => services.find(s => s.titleKey === key)).filter(Boolean)
      : services;

    list.forEach((service, i) => {
      const row = document.createElement('article');
      row.className = 'service-row';

      const visual = document.createElement('div');
      visual.className = 'service-row__visual';

      const num = document.createElement('span');
      num.className = 'service-row__num';
      num.textContent = String(i + 1).padStart(2, '0') + '.';

      const imgWrap = document.createElement('div');
      imgWrap.className = 'service-row__img';
      const img = document.createElement('img');
      img.src = service.image;
      img.alt = service.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => { imgWrap.style.display = 'none'; };
      imgWrap.appendChild(img);

      visual.appendChild(num);
      visual.appendChild(imgWrap);

      const body = document.createElement('div');
      body.className = 'service-row__body';

      const titleRow = document.createElement('div');
      titleRow.className = 'service-row__title-row';
      titleRow.innerHTML = `
        <span class="service-row__icon">${service.icon}</span>
        <h3 class="service-row__title"><span data-i18n="${service.titleKey}">${service.title}</span></h3>
      `;

      const desc = document.createElement('p');
      desc.className = 'service-row__desc';
      desc.innerHTML = `<span data-i18n="${service.descKey}">${service.description}</span>`;

      body.appendChild(titleRow);
      body.appendChild(desc);

      row.appendChild(visual);
      row.appendChild(body);
      container.appendChild(row);
    });

    // This list is built after the i18n module already ran its initial
    // pass, so these new [data-i18n] elements were missed on first paint
    // (e.g. a saved Arabic preference). Register them and re-apply the
    // current language now that they exist.
    if (window.NovaI18N) {
      window.NovaI18N.collectOriginals();
      window.NovaI18N.applyLang(window.NovaI18N.getLang());
    }

    const rows = Array.from(container.querySelectorAll('.service-row'));
    const setActive = (row) => {
      rows.forEach(r => r.classList.toggle('is-active', r === row));
    };

    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (hasHover) {
      // Desktop / mouse: open on hover (and keyboard focus).
      rows.forEach((row) => {
        row.addEventListener('mouseenter', () => setActive(row));
        row.addEventListener('mouseleave', () => setActive(null));
        row.addEventListener('focus', () => setActive(row));
        row.addEventListener('blur', () => setActive(null));
      });
    } else {
      // Phone: still allow a direct tap to open/close a card...
      rows.forEach((row) => {
        row.addEventListener('click', () => {
          setActive(row.classList.contains('is-active') ? null : row);
        });
      });

      // ...but also auto-open a card as it scrolls to the middle of the
      // screen, so the details reveal themselves while browsing without
      // needing a tap. Whichever visible card sits closest to the
      // vertical center of the viewport becomes the active one.
      const visibleRows = new Set();

      const activateClosestToCenter = () => {
        if (visibleRows.size === 0) return;
        const viewportCenter = window.innerHeight / 2;
        let closest = null;
        let closestDistance = Infinity;
        visibleRows.forEach((row) => {
          const rect = row.getBoundingClientRect();
          const rowCenter = rect.top + rect.height / 2;
          const distance = Math.abs(rowCenter - viewportCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closest = row;
          }
        });
        setActive(closest);
      };

      const rowIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleRows.add(entry.target);
          else visibleRows.delete(entry.target);
        });
        activateClosestToCenter();
      }, { threshold: 0.6 });

      rows.forEach((row) => rowIO.observe(row));
    }
  })();

  // Active nav link on scroll
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { threshold: 0.5 });
  sections.forEach(sec => navIO.observe(sec));
})();
