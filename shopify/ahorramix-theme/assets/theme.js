/* Ahorramix · interacción del tema (sin dependencias). */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Barra de avisos rotativa
  function initAnnounce(root = document) {
    $$("[data-announce]", root).forEach((bar) => {
      const msgs = $$(".announce__msg", bar);
      if (msgs.length < 2 || bar.dataset.ready) return;
      bar.dataset.ready = "1";
      let i = 0;
      setInterval(() => { msgs[i].classList.remove("is-active"); i = (i + 1) % msgs.length; msgs[i].classList.add("is-active"); }, Number(bar.dataset.interval) || 4000);
    });
  }

  // Menú de departamentos y menú móvil
  function initHeader(root = document) {
    $$("[data-dept]", root).forEach((d) => {
      const btn = $("[data-dept-toggle]", d), panel = $(".dept__panel", d);
      const set = (open) => { panel.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
      btn.addEventListener("click", (e) => { e.stopPropagation(); set(panel.hidden); });
      document.addEventListener("click", (e) => { if (!d.contains(e.target)) set(false); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
    });
    $$("[data-drawer-open]", root).forEach((b) => {
      const drawer = document.getElementById(b.dataset.drawerOpen);
      if (!drawer) return;
      const set = (open) => { drawer.hidden = !open; b.setAttribute("aria-expanded", String(open)); document.body.style.overflow = open ? "hidden" : ""; };
      b.addEventListener("click", () => set(true));
      $$("[data-drawer-close]", drawer).forEach((c) => c.addEventListener("click", () => set(false)));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
    });
  }

  // Vídeo de portada: pausa/reproducir
  function initHero(root = document) {
    $$("[data-hero]", root).forEach((hero) => {
      const btn = $("[data-hero-toggle]", hero), video = $("video", hero);
      if (!btn || !video) return;
      btn.addEventListener("click", () => {
        if (video.paused) { video.play(); hero.classList.remove("is-paused"); btn.setAttribute("aria-label", btn.dataset.labelPause); }
        else { video.pause(); hero.classList.add("is-paused"); btn.setAttribute("aria-label", btn.dataset.labelPlay); }
      });
    });
  }

  // Carrusel de ofertas con bucle infinito y autoplay
  function initCarousel(root = document) {
    $$("[data-carousel]", root).forEach((c) => {
      const track = $("[data-carousel-track]", c), slides = $$("[data-carousel-slide]", c), dots = $("[data-carousel-dots]", c);
      if (!slides.length) return;
      let i = 0, timer;
      dots.innerHTML = "";
      const btns = slides.map((_, n) => { const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Oferta " + (n + 1)); b.addEventListener("click", () => go(n)); dots.appendChild(b); return b; });
      const go = (n) => { i = (n + slides.length) % slides.length; track.style.transform = `translateX(-${i * 100}%)`; btns.forEach((b, k) => b.setAttribute("aria-current", String(k === i))); };
      const play = () => { clearInterval(timer); if (slides.length > 1) timer = setInterval(() => go(i + 1), Number(c.dataset.autoplay) || 6000); };
      $("[data-carousel-prev]", c)?.addEventListener("click", () => { go(i - 1); play(); });
      $("[data-carousel-next]", c)?.addEventListener("click", () => { go(i + 1); play(); });
      c.addEventListener("mouseenter", () => clearInterval(timer));
      c.addEventListener("mouseleave", play);
      let x0 = null;
      c.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
      c.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1); x0 = null; play(); });
      go(0); play();
    });
  }

  // Cuenta atrás de ofertas del día
  function initCountdown(root = document) {
    $$("[data-countdown]", root).forEach((el) => {
      const end = Date.parse(el.dataset.countdown);
      const clock = $("[data-countdown-clock]", el);
      if (!clock || Number.isNaN(end)) return;
      const pad = (n) => String(n).padStart(2, "0");
      const tick = () => {
        const left = Math.max(0, end - Date.now());
        if (left === 0 && el.dataset.countdownHide === "true") { el.closest("section").hidden = true; return false; }
        clock.hidden = false;
        $("[data-h]", clock).textContent = pad(Math.floor(left / 3.6e6));
        $("[data-m]", clock).textContent = pad(Math.floor((left % 3.6e6) / 6e4));
        $("[data-s]", clock).textContent = pad(Math.floor((left % 6e4) / 1000));
        return left > 0;
      };
      if (tick()) { const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }
    });
  }

  // Pestañas de productos
  function initTabs(root = document) {
    $$("[data-tabs]", root).forEach((wrap) => {
      const tabs = $$("[data-tab]", wrap);
      tabs.forEach((t) => t.addEventListener("click", () => {
        tabs.forEach((o) => { o.setAttribute("aria-selected", String(o === t)); document.getElementById(o.getAttribute("aria-controls")).hidden = o !== t; });
      }));
    });
  }

  // Ficha: variantes, galería y cantidad
  function initProduct(root = document) {
    $$("[data-product]", root).forEach((p) => {
      const select = $("[data-variant-select]", p);
      const slides = $$(".gallery__slide", p), thumbs = $$("[data-thumb]", p);
      const show = (id) => { if (!id) return; slides.forEach((s) => s.classList.toggle("is-active", s.dataset.mediaId === String(id))); thumbs.forEach((t) => t.classList.toggle("is-active", t.dataset.thumb === String(id))); };
      thumbs.forEach((t) => t.addEventListener("click", () => show(t.dataset.thumb)));
      if (thumbs[0]) thumbs[0].classList.add("is-active");
      $$("[data-qty]", p).forEach((b) => b.addEventListener("click", () => { const input = $("input[name=quantity]", p); input.value = Math.max(1, Number(input.value || 1) + Number(b.dataset.qty)); }));
      if (!select) return;
      const radios = $$("[data-option]", p);
      const update = () => {
        const chosen = [...new Set(radios.map((r) => r.dataset.option))].map((idx) => radios.find((r) => r.dataset.option === idx && r.checked)?.value);
        const opt = Array.from(select.options).find((o) => o.dataset.options === chosen.join("|"));
        const add = $("[data-add-button]", p), label = $("[data-add-label]", p), price = $("[data-price]", p);
        if (!opt) { add.disabled = true; label.textContent = p.dataset.unavailable || "No disponible"; return; }
        select.value = opt.value;
        const available = opt.dataset.available === "true";
        add.disabled = !available;
        label.textContent = available ? add.dataset.labelAdd : add.dataset.labelSold;
        price.innerHTML = `<div class="price price--lg${opt.dataset.compare ? " price--sale" : ""}"><span class="price__now">${opt.dataset.price}</span>${opt.dataset.compare ? `<s class="price__was">${opt.dataset.compare}</s>` : ""}</div>`;
        show(opt.dataset.media);
        const url = new URL(window.location.href); url.searchParams.set("variant", opt.value); history.replaceState(null, "", url);
      };
      radios.forEach((r) => r.addEventListener("change", update));
    });
  }

  // Añadir al carrito sin recargar (carrito nativo de Shopify)
  const toast = (html) => { const t = $("#CartToast"); if (!t) return; t.innerHTML = html; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => { t.hidden = true; }, 3500); };
  async function addToCart(form) {
    const btn = $("[type=submit]", form);
    btn && (btn.disabled = true);
    try {
      const res = await fetch(window.amRoutes.cartAdd + ".js", { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
      if (!res.ok) throw new Error((await res.json()).description || "");
      const cart = await (await fetch(window.amRoutes.cart + ".js")).json();
      $$("[data-cart-count]").forEach((c) => { c.textContent = cart.item_count; c.hidden = cart.item_count === 0; });
      toast(`${window.amStrings.added}<a href="${window.amRoutes.cart}">${window.amStrings.view}</a>`);
    } catch (e) { toast(e.message || window.amStrings.error); }
    finally { btn && (btn.disabled = false); }
  }
  document.addEventListener("submit", (e) => {
    const f = e.target;
    if (f.matches("[data-add-to-cart], [data-product-form]") && !e.submitter?.name?.includes("checkout")) { e.preventDefault(); addToCart(f); }
  });

  // Envío automático (ordenar colección, cantidades del carrito)
  document.addEventListener("change", (e) => { if (e.target.matches("[data-autosubmit]")) e.target.form.submit(); });

  function initAll(root) { initAnnounce(root); initHeader(root); initHero(root); initCarousel(root); initCountdown(root); initTabs(root); initProduct(root); }
  document.addEventListener("DOMContentLoaded", () => initAll(document));
  // Editor de temas: reinicia la sección cuando se edita
  document.addEventListener("shopify:section:load", (e) => initAll(e.target));
})();
