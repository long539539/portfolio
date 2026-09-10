/* =========================================================
   TRÌNH — Robotics Portfolio · interactions
   Vanilla JS, no dependencies. Safe to run on every page.
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Nav: hide on scroll down, invert over dark sections ---------- */
  var nav = document.querySelector('.nav');
  var bar = document.querySelector('.progress');
  var lastY = window.scrollY;

  function darkUnderNav() {
    var probes = document.querySelectorAll('.dark, .hero, .phero, .foot, .marquee');
    var edge = (nav ? nav.offsetHeight : 68) * 0.55;
    for (var i = 0; i < probes.length; i++) {
      var r = probes[i].getBoundingClientRect();
      if (r.top <= edge && r.bottom > edge) return true;
    }
    return false;
  }

  function onScroll() {
    var y = window.scrollY;
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (nav) {
      var menuOpen = links && links.classList.contains('open');
      nav.classList.toggle('hide', !menuOpen && y > 240 && y > lastY);
      nav.classList.toggle('on-dark', darkUnderNav());
    }
    lastY = y;
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
    }
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  var revealables = document.querySelectorAll('.rv, .clip');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero parallax ---------- */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg && !reduced) {
    var praf = false;
    window.addEventListener('scroll', function () {
      if (praf) return;
      praf = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.3) {
          heroBg.style.transform = 'translate3d(0,' + (y * 0.16).toFixed(1) + 'px,0)';
        }
        praf = false;
      });
    }, { passive: true });
  }

  /* ---------- Chapter rail: highlight the section in view ---------- */
  var rail = document.querySelector('.rail');
  if (rail) {
    var railBox = rail.querySelector('.rail-in');
    var railLinks = Array.prototype.slice.call(rail.querySelectorAll('a[href^="#"]'));
    var targets = railLinks
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);

    var syncRail = function () {
      var line = (nav ? nav.offsetHeight : 68) + rail.offsetHeight + 40;
      var current = -1;
      targets.forEach(function (t, i) {
        if (t.getBoundingClientRect().top <= line) current = i;
      });
      railLinks.forEach(function (a, i) { a.classList.toggle('on', i === current); });
      var active = railLinks[current];
      if (active && railBox) {
        var aLeft = active.offsetLeft;
        var aRight = aLeft + active.offsetWidth;
        if (aLeft < railBox.scrollLeft || aRight > railBox.scrollLeft + railBox.clientWidth) {
          railBox.scrollTo({ left: aLeft - 20, behavior: reduced ? 'auto' : 'smooth' });
        }
      }
    };
    var railTick = false;
    window.addEventListener('scroll', function () {
      if (railTick) return;
      railTick = true;
      window.requestAnimationFrame(function () { syncRail(); railTick = false; });
    }, { passive: true });
    syncRail();
  }

  /* ---------- Drag-to-scroll for horizontal galleries ---------- */
  document.querySelectorAll('.hscroll').forEach(function (box) {
    var down = false, startX = 0, startLeft = 0, moved = 0;
    box.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      down = true; moved = 0;
      startX = e.clientX; startLeft = box.scrollLeft;
      box.classList.add('dragging');
    });
    box.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.abs(dx);
      box.scrollLeft = startLeft - dx;
    });
    var end = function () {
      if (!down) return;
      down = false;
      box.classList.remove('dragging');
    };
    box.addEventListener('pointerup', end);
    box.addEventListener('pointerleave', end);
    box.addEventListener('click', function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  });

  /* ---------- Lightbox ---------- */
  var zoomable = document.querySelectorAll('.fig.clickable img');
  if (zoomable.length) {
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Enlarged photo');
    lb.innerHTML =
      '<button class="lb-x" type="button" aria-label="Close photo">&#10005;</button>' +
      '<img alt="">' +
      '<p class="lb-cap"></p>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lb-cap');
    var lastFocus = null;

    var openLb = function (img) {
      lastFocus = document.activeElement;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      var fig = img.closest('figure');
      var cap = fig ? fig.querySelector('.cap span') || fig.querySelector('.cap') : null;
      lbCap.textContent = cap ? cap.textContent.trim() : (img.alt || '');
      lb.classList.add('on');
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(function () { lb.classList.add('vis'); });
      lb.querySelector('.lb-x').focus();
    };
    var closeLb = function () {
      lb.classList.remove('vis');
      document.body.style.overflow = '';
      window.setTimeout(function () {
        lb.classList.remove('on');
        lbImg.removeAttribute('src');
      }, 260);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    zoomable.forEach(function (img) {
      var host = img.closest('.fig');
      host.setAttribute('tabindex', '0');
      host.setAttribute('role', 'button');
      host.setAttribute('aria-label', 'Enlarge photo: ' + (img.alt || 'photo'));
      host.addEventListener('click', function () { openLb(img); });
      host.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(img); }
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.closest('.lb-x')) closeLb();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('on')) closeLb();
    });
  }

  /* ---------- Count-up for stat numbers ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduced && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        cio.unobserve(el);
        var end = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var t0 = null, dur = 1100;
        var step = function (ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(end * eased) + suffix;
          if (p < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Current year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
