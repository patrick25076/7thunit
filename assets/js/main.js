/* ==========================================================================
   7th UNIT — main.js
   Vanilla JS. No frameworks. Honors prefers-reduced-motion.
   ========================================================================== */

(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ----------------------------------------------------------------------
       1. Scroll-triggered fade-up via IntersectionObserver
       ---------------------------------------------------------------------- */

    function initFadeUp() {
        const targets = document.querySelectorAll('.fade-up, .fade-up--soft');
        if (!targets.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            targets.forEach(el => el.setAttribute('data-revealed', 'true'));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.setAttribute('data-revealed', 'true');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        targets.forEach(el => io.observe(el));
    }


    /* ----------------------------------------------------------------------
       2. Hero "lights fading up" effect
       Triggered after image load. Applies to data-hero-image (homepage hero).
       ---------------------------------------------------------------------- */

    function initHeroLights() {
        const img = document.querySelector('[data-hero-image]');
        if (!img) return;

        const reveal = () => {
            setTimeout(() => img.setAttribute('data-lit', 'true'), prefersReducedMotion ? 0 : 350);
        };

        if (img.complete) reveal();
        else img.addEventListener('load', reveal, { once: true });
    }


    /* ----------------------------------------------------------------------
       3. Scene image reveal — second/third cinematic backgrounds
       Reveal each scene as it scrolls into view (not on initial load).
       ---------------------------------------------------------------------- */

    function initSceneImages() {
        const scenes = document.querySelectorAll('[data-scene-image]');
        if (!scenes.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            scenes.forEach(s => s.setAttribute('data-lit', 'true'));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.setAttribute('data-lit', 'true');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        scenes.forEach(s => io.observe(s));
    }


    /* ----------------------------------------------------------------------
       4. Countdown ticker
       Any element with [data-countdown][data-target="ISO_DATE"] gets a
       T-MINUS DDD : HH : MM : SS string, updated every second.
       ---------------------------------------------------------------------- */

    function initCountdowns() {
        const els = document.querySelectorAll('[data-countdown]');
        if (!els.length) return;

        const targets = Array.from(els).map(el => ({
            el,
            ts: Date.parse(el.dataset.target || '')
        })).filter(t => !isNaN(t.ts));

        if (!targets.length) return;

        const pad = (n, w) => String(Math.max(0, Math.floor(n))).padStart(w, '0');

        const render = () => {
            const now = Date.now();
            targets.forEach(({ el, ts }) => {
                const diff = Math.max(0, ts - now);
                const days  = diff / 86400000;
                const hours = (diff % 86400000) / 3600000;
                const mins  = (diff % 3600000) / 60000;
                const secs  = (diff % 60000) / 1000;
                el.textContent = `T-MINUS ${pad(days, 3)} : ${pad(hours, 2)} : ${pad(mins, 2)} : ${pad(secs, 2)}`;
            });
        };

        render();
        if (!prefersReducedMotion) setInterval(render, 1000);
    }


    /* ----------------------------------------------------------------------
       5. Mobile nav toggle
       ---------------------------------------------------------------------- */

    function initNavToggle() {
        const toggle = document.querySelector('[data-nav-toggle]');
        const menu   = document.querySelector('[data-nav-menu]');
        if (!toggle || !menu) return;

        const setOpen = (open) => {
            menu.setAttribute('data-open', open ? 'true' : 'false');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            document.body.style.overflow = open ? 'hidden' : '';
        };

        toggle.addEventListener('click', () => {
            const open = menu.getAttribute('data-open') !== 'true';
            setOpen(open);
        });

        menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
        window.addEventListener('resize', () => {
            if (window.innerWidth > 920) setOpen(false);
        });
    }


    /* ----------------------------------------------------------------------
       6. Formspree submission via fetch()
       ---------------------------------------------------------------------- */

    function initForms() {
        const forms = document.querySelectorAll('form[data-formspree]');
        if (!forms.length) return;

        forms.forEach(form => {
            const endpoint = form.dataset.formspree;
            const statusEl = form.querySelector('[data-status]');
            const submit   = form.querySelector('button[type="submit"]');
            const submitDefaultLabel = submit ? submit.textContent : '';

            const setStatus = (state, msg) => {
                if (!statusEl) return;
                statusEl.setAttribute('data-state', state);
                statusEl.textContent = msg;
            };

            const clearFieldErrors = () => {
                form.querySelectorAll('.field__error').forEach(e => (e.textContent = ''));
            };

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                clearFieldErrors();
                setStatus('pending', 'Sending...');
                if (submit) { submit.disabled = true; submit.textContent = 'Sending...'; }

                const data = new FormData(form);

                try {
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        body: data,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (res.ok) {
                        form.reset();
                        setStatus('success', form.dataset.successMessage || 'Received. We respond within 48 hours.');
                        if (submit) { submit.disabled = true; submit.textContent = 'Submitted'; }
                        return;
                    }

                    let body = {};
                    try { body = await res.json(); } catch (_) {}
                    if (body.errors && Array.isArray(body.errors)) {
                        body.errors.forEach(err => {
                            if (!err.field) return;
                            const errEl = form.querySelector(`[data-error-for="${err.field}"]`);
                            if (errEl) errEl.textContent = err.message || 'Invalid';
                        });
                        setStatus('error', 'Please check the highlighted fields.');
                    } else {
                        setStatus('error', 'Submission failed. Please email us at hello@7thunit.com.');
                    }

                    if (submit) { submit.disabled = false; submit.textContent = submitDefaultLabel; }
                } catch (err) {
                    setStatus('error', 'Network error. Please try again or email hello@7thunit.com.');
                    if (submit) { submit.disabled = false; submit.textContent = submitDefaultLabel; }
                }
            });
        });
    }


    /* ----------------------------------------------------------------------
       7. Boot
       ---------------------------------------------------------------------- */

    function boot() {
        initFadeUp();
        initHeroLights();
        initSceneImages();
        initCountdowns();
        initNavToggle();
        initForms();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
