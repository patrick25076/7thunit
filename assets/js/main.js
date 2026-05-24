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
       7. Unit OS interactions
       Terminal skill preview and focused waitlist modals.
       ---------------------------------------------------------------------- */

    function initUnitOsInteractions() {
        const terminalModal = document.querySelector('[data-terminal-modal]');
        const terminalContent = document.querySelector('[data-terminal-content]');
        const terminalTitle = document.querySelector('[data-terminal-title]');
        const terminalClose = document.querySelector('[data-terminal-close]');
        const waitlistModals = document.querySelectorAll('[data-waitlist-modal]');

        if (!terminalModal && !waitlistModals.length) return;

        const terminalCopy = {
            'truck-unloading': `> SKILL: Truck Unloading
> STATUS: Available
> ENABLES: Autonomous unloading and
  routing of cargo from incoming
  trucks to designated zones
> RUNS ON: 7th Unit v1 /
  ROS2-compatible systems
> SCALES: Fleet-wide deployment
  in one command
> [UNLOCK SKILL]`,
            'pallet-transfer': `> SKILL: Pallet Transfer
> STATUS: Available
> ENABLES: Autonomous pallet movement
  between zones based on live task
  allocation and fleet logic
> RUNS ON: 7th Unit v1 /
  ROS2-compatible systems
> SCALES: Fleet-wide deployment
  in one command
> [UNLOCK SKILL]`,
            'box-sorting': `> SKILL: Box Sorting
> STATUS: Available
> ENABLES: Autonomous sorting of
  packages by size, weight, or
  destination in real time
> RUNS ON: 7th Unit v1 /
  ROS2-compatible systems
> SCALES: Fleet-wide deployment
  in one command
> [UNLOCK SKILL]`,
            'part-inspection': `> SKILL: Part Inspection
> STATUS: Available
> ENABLES: Automated visual inspection
  and defect detection across
  components and production lines
> RUNS ON: 7th Unit v1 /
  ROS2-compatible systems
> SCALES: Fleet-wide deployment
  in one command
> [UNLOCK SKILL]`,
            'perimeter-patrol': `> SKILL: Perimeter Patrol
> STATUS: Available
> ENABLES: Scheduled autonomous safety
  and security sweeps across your
  entire facility floor
> RUNS ON: 7th Unit v1 /
  ROS2-compatible systems
> SCALES: Fleet-wide deployment
  in one command
> [UNLOCK SKILL]`,
            'cook-omelette': `> SKILL: Cook an Omelette
> STATUS: In development
> ENABLES: [REDACTED]
> RUNS ON: Unknown
> SCALES: Unknown
> ETA: When we figure it out
> [UNLOCK SKILL]`
        };

        const setModalState = () => {
            const modalOpen = Boolean(document.querySelector('.terminal-modal:not([hidden]), .waitlist-modal:not([hidden])'));
            document.body.toggleAttribute('data-modal-open', modalOpen);
        };

        const closeTerminal = () => {
            if (!terminalModal) return;
            terminalModal.hidden = true;
            setModalState();
        };

        const closeWaitlists = () => {
            waitlistModals.forEach(modal => {
                modal.hidden = true;
            });
            setModalState();
        };

        document.querySelectorAll('[data-terminal-skill]').forEach(card => {
            card.addEventListener('click', () => {
                const skill = card.dataset.terminalSkill;
                if (!terminalModal || !terminalContent || !terminalCopy[skill]) return;
                terminalContent.textContent = terminalCopy[skill];
                if (terminalTitle) {
                    terminalTitle.textContent = card.querySelector('.skill-card__name')?.textContent || 'Skill';
                }
                terminalModal.hidden = false;
                setModalState();
                if (terminalClose) terminalClose.focus({ preventScroll: true });
            });
        });

        if (terminalClose) terminalClose.addEventListener('click', closeTerminal);
        if (terminalModal) {
            terminalModal.addEventListener('click', (event) => {
                if (event.target === terminalModal || event.target.hasAttribute('data-terminal-close')) {
                    closeTerminal();
                }
            });
        }

        document.querySelectorAll('[data-waitlist-open]').forEach(button => {
            button.addEventListener('click', () => {
                const target = button.dataset.waitlistOpen;
                const modal = document.querySelector(`[data-waitlist-modal="${target}"]`);
                if (!modal) return;
                closeWaitlists();
                modal.hidden = false;
                setModalState();
                modal.querySelector('[data-waitlist-close]')?.focus({ preventScroll: true });
            });
        });

        waitlistModals.forEach(modal => {
            modal.addEventListener('click', (event) => {
                if (event.target === modal || event.target.hasAttribute('data-waitlist-close')) {
                    modal.hidden = true;
                    setModalState();
                }
            });
            modal.querySelector('[data-waitlist-close]')?.addEventListener('click', () => {
                modal.hidden = true;
                setModalState();
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            closeTerminal();
            closeWaitlists();
        });
    }


    /* ----------------------------------------------------------------------
       8. Boot
       ---------------------------------------------------------------------- */

    function boot() {
        initFadeUp();
        initHeroLights();
        initSceneImages();
        initCountdowns();
        initNavToggle();
        initForms();
        initUnitOsInteractions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
