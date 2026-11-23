// Shared behavior for every page. Kept small: the site works without it.

(function () {
  // Mobile menu: a disclosure button that shows and hides the nav panel.
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 760px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
  }

  // Footer year.
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();

// Copy-to-clipboard buttons (module 6). The status line announces the result to screen readers.
(function () {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const status = document.getElementById(btn.getAttribute("data-status") || "");
    const label = btn.textContent;
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch (_) { /* clipboard blocked */ }
      if (!ok) {
        // Fallback: select the address so the visitor can copy it themselves.
        const target = document.getElementById(btn.getAttribute("data-copy-target") || "");
        if (target) { const r = document.createRange(); r.selectNodeContents(target); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
      }
      const msg = btn.getAttribute(ok ? "data-copied" : "data-copy-failed") || "";
      if (status) status.textContent = msg;
      if (ok) { btn.textContent = msg; setTimeout(() => { btn.textContent = label; if (status) status.textContent = ""; }, 2000); }
    });
  });
})();

// Motion and interaction (module 7). Skipped entirely for prefers-reduced-motion.
(function () {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");

  // Header shadow after scrolling (not motion, so it always runs).
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Highlight the nav link of the section on screen (home page only: links that start with "#").
  const navLinks = [...document.querySelectorAll('.nav-list a[href^="#"]')];
  if (navLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const link = byId.get(e.target.id);
        if (!link) return;
        if (e.isIntersecting) {
          navLinks.forEach((a) => { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
          link.classList.add("is-active");
          link.setAttribute("aria-current", "true");
        } else if (link.classList.contains("is-active") && e.boundingClientRect.top > 0) {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  root.classList.add("motion");

  // Scroll reveal, staggered among siblings of the same group.
  const selector = [
    ".section-head", ".work-grid > li", ".about-block h3", ".strengths > li", ".steps > li", ".timeline > li", ".skills",
    ".contact-lead", ".contact-list", ".case-section-head", ".case-text", ".case-list", ".pillars > li", ".figures > li",
    ".case-cta", ".next-project",
  ].join(",");
  const items = [...document.querySelectorAll(selector)];
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("is-in");
      reveal.unobserve(el);
      const done = () => { el.classList.remove("reveal", "is-in"); el.style.removeProperty("--reveal-delay"); };
      el.addEventListener("transitionend", done, { once: true });
      setTimeout(done, 1500); // in case transitionend never fires
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  items.forEach((el) => {
    const group = [...el.parentElement.children].filter((c) => c.matches(selector));
    const i = group.indexOf(el);
    if (i > 0) el.style.setProperty("--reveal-delay", `${Math.min(i, 5) * 80}ms`);
    el.classList.add("reveal");
    reveal.observe(el);
  });

  // Count-up for the proof numbers. Screen readers get the final value from a hidden copy.
  const counters = document.querySelectorAll(".proof strong");
  const fmt = (n, commas) => (commas ? n.toLocaleString("en-US") : String(n));
  const count = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      count.unobserve(e.target);
      const el = e.target;
      const text = el.textContent;
      const nums = [...text.matchAll(/\d[\d,]*/g)];
      if (!nums.length) return;
      const last = nums[nums.length - 1];
      const target = parseInt(last[0].replace(/,/g, ""), 10);
      const from = nums.length > 1 ? parseInt(nums[0][0].replace(/,/g, ""), 10) : 0;
      const commas = last[0].includes(",");
      const before = text.slice(0, last.index), after = text.slice(last.index + last[0].length);
      const sr = document.createElement("span");
      sr.className = "visually-hidden";
      sr.textContent = text;
      el.after(sr);
      el.setAttribute("aria-hidden", "true");
      const start = performance.now(), dur = 1200;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = before + fmt(Math.round(from + (target - from) * eased), commas) + after;
        if (p < 1) requestAnimationFrame(tick); else el.textContent = text;
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => count.observe(el));
})();
