(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scriptSource = document.currentScript?.src || window.location.href;
  const statusUrl = new URL('../data/project-status.json', scriptSource);

  const scrollProgress = document.querySelector('[data-scroll-progress]');
  let scrollFrame = 0;
  const updateScrollProgress = () => {
    scrollFrame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    scrollProgress?.style.setProperty('--scroll-progress', String(progress));
  };
  updateScrollProgress();
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollProgress);
  }, { passive: true });

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-holo-card]').forEach((card) => {
      const stage = card.closest('.portrait-stage');
      stage?.addEventListener('pointermove', (event) => {
        const bounds = stage.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty('--holo-rx', `${y * -3.5}deg`);
        card.style.setProperty('--holo-ry', `${x * 4.5}deg`);
      });
      stage?.addEventListener('pointerleave', () => {
        card.style.setProperty('--holo-rx', '0deg');
        card.style.setProperty('--holo-ry', '0deg');
      });
    });
  }

  const projectStatusByRepo = new Map();
  const statusLabel = (state) => state === 'online' ? 'Live' : state === 'offline' ? 'Offline' : state === 'planned' ? 'Planned' : 'Unknown';

  if (!reduceMotion && !('startViewTransition' in document)) {
    document.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a[href]');
      if (!link || link.target && link.target !== '_self' || link.hasAttribute('download')) return;

      const rawHref = link.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#')) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.href === window.location.href) return;

      event.preventDefault();
      document.documentElement.classList.add('is-route-leaving');
      window.setTimeout(() => window.location.assign(destination.href), 180);
    });

    window.addEventListener('pageshow', () => document.documentElement.classList.remove('is-route-leaving'));
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll([
      '.page-hero > *',
      '.section-heading',
      '.proof-item',
      '.project-card',
      '.certification-card',
      '.skill-card',
      '.profile-grid > *',
      '.education-card',
      '.constellation',
      '.contact-panel',
      '.case-title-grid > *',
      '.case-meta',
      '.case-body > *'
    ].join(','));

    revealTargets.forEach((element, index) => {
      element.classList.add('reveal-item');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
    });
    document.documentElement.classList.add('motion-ready');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealTargets.forEach((element) => observer.observe(element));
  }

  document.querySelectorAll('[data-constellation]').forEach((constellation) => {
    const buttons = constellation.querySelectorAll('[data-filter]');
    const nodes = constellation.querySelectorAll('[data-node]');
    const listNodes = constellation.querySelectorAll('[data-list-node]');
    const inspector = constellation.querySelector('[data-map-inspector]');
    const inspectorTitle = inspector?.querySelector('[data-inspector-title]');
    const inspectorSummary = inspector?.querySelector('[data-inspector-summary]');
    const inspectorRole = inspector?.querySelector('[data-inspector-role]');
    const inspectorCluster = inspector?.querySelector('[data-inspector-cluster]');
    const inspectorYear = inspector?.querySelector('[data-inspector-year]');
    const inspectorIndex = inspector?.querySelector('[data-inspector-index]');
    const inspectorLink = inspector?.querySelector('[data-inspector-link]');
    const inspectorChip = inspector?.querySelector('[data-status-chip]');
    const inspectorStatus = inspector?.querySelector('[data-status-label]');
    const clusterLabels = { ml: 'ML / Vision', product: 'Product system', data: 'Data system', infra: 'Edge / Infra' };

    const inspectProject = (node) => {
      if (!inspector || !node.dataset.title) return;
      nodes.forEach((candidate) => candidate.classList.toggle('is-selected', candidate === node));
      constellation.classList.add('has-selection');
      inspector.dataset.repo = node.dataset.repo || '';
      if (inspectorTitle) inspectorTitle.textContent = node.dataset.title;
      if (inspectorSummary) inspectorSummary.textContent = node.dataset.summary || '';
      if (inspectorRole) inspectorRole.textContent = node.dataset.role || '';
      if (inspectorCluster) inspectorCluster.textContent = clusterLabels[node.dataset.cluster] || 'Project system';
      if (inspectorYear) inspectorYear.textContent = node.dataset.year || '';
      if (inspectorIndex) inspectorIndex.textContent = `PROJECT / ${node.dataset.index || '--'}`;
      if (inspectorLink) inspectorLink.href = node.getAttribute('href') || '#';
      const state = projectStatusByRepo.get(node.dataset.repo)?.demo?.state || 'pending';
      inspectorChip?.setAttribute('data-state', state);
      if (inspectorStatus) inspectorStatus.textContent = state === 'pending' ? 'Status pending' : statusLabel(state);
    };

    nodes.forEach((node) => {
      node.addEventListener('mouseenter', () => inspectProject(node));
      node.addEventListener('focus', () => inspectProject(node));
    });

    buttons.forEach((button) => button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      buttons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle('is-active', active);
        candidate.setAttribute('aria-pressed', String(active));
      });
      [...nodes, ...listNodes].forEach((node) => {
        const visible = filter === 'all' || node.getAttribute('data-cluster') === filter;
        node.classList.toggle('is-muted', !visible);
        node.setAttribute('aria-hidden', String(!visible));
        if (node.matches('[data-node]')) node.setAttribute('tabindex', visible ? '0' : '-1');
      });
    }));
  });

  const filterButtons = document.querySelectorAll('[data-project-filter]');
  const entries = document.querySelectorAll('[data-project-entry]');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.projectFilter || 'all';
    filterButtons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle('is-active', active);
      candidate.setAttribute('aria-pressed', String(active));
    });
    entries.forEach((entry) => {
      entry.hidden = filter !== 'all' && !(entry.dataset.categories || '').split(' ').includes(filter);
    });
  }));

  const applyProjectStatus = (entry) => {
    projectStatusByRepo.set(entry.repo, entry);
    document.querySelectorAll(`[data-repo="${CSS.escape(entry.repo)}"]`).forEach((container) => {
      if (!entry.demo) return;
      const chip = container.querySelector('[data-status-chip]');
      const label = container.querySelector('[data-status-label]');
      const link = container.querySelector('[data-demo-link]');
      const state = entry.demo.state;

      chip?.setAttribute('data-state', state);
      if (label) {
        label.textContent = statusLabel(state);
      }
      if (!link) return;
      if (state === 'online' && link.dataset.demoUrl) {
        link.href = link.dataset.demoUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.classList.remove('is-disabled');
        link.removeAttribute('aria-disabled');
        link.title = 'Open live deployment in a new tab';
      } else {
        link.removeAttribute('href');
        link.removeAttribute('target');
        link.classList.add('is-disabled');
        link.setAttribute('aria-disabled', 'true');
        link.title = state === 'offline' ? 'Deployment is currently unavailable' : 'Deployment is not currently enabled';
      }
    });
  };

  fetch(statusUrl, { headers: { Accept: 'application/json' } })
    .then((response) => response.ok ? response.json() : null)
    .then((payload) => payload?.projects?.forEach(applyProjectStatus))
    .catch(() => {});
})();
