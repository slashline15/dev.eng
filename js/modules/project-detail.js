// Project Detail Page - popula DOM a partir de projectsDataMap
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        var container = document.querySelector('[data-project-slug]');
        if (!container) return;

        var slug = container.getAttribute('data-project-slug');
        if (!slug || !projectsDataMap || !projectsDataMap[slug]) {
            container.innerHTML = '<div class="container"><p>Projeto não encontrado.</p></div>';
            return;
        }

        var p = projectsDataMap[slug];

        // Breadcrumb
        var breadcrumb = document.getElementById('detailBreadcrumbTitle');
        if (breadcrumb) breadcrumb.textContent = p.title;

        // Cover
        var cover = document.getElementById('detailCover');
        if (cover) {
            cover.src = '../' + p.cover;
            cover.alt = p.title;
        }

        // Header
        var titleEl = document.getElementById('detailTitle');
        if (titleEl) titleEl.textContent = p.title;

        var subtitleEl = document.getElementById('detailSubtitle');
        if (subtitleEl) subtitleEl.textContent = p.subtitle || '';

        var categoryEl = document.getElementById('detailCategory');
        if (categoryEl) categoryEl.textContent = p.categoryLabel;

        var statusEl = document.getElementById('detailStatus');
        if (statusEl) statusEl.textContent = p.status;

        var yearEl = document.getElementById('detailYear');
        if (yearEl) yearEl.textContent = p.year || p.date;

        var roleEl = document.getElementById('detailRole');
        if (roleEl) roleEl.textContent = p.role || '';

        var clientEl = document.getElementById('detailClient');
        if (clientEl) clientEl.textContent = p.client || '';

        var locationEl = document.getElementById('detailLocation');
        if (locationEl) locationEl.textContent = p.location || '';

        // Description
        var descEl = document.getElementById('detailDescription');
        if (descEl) descEl.textContent = p.description;

        // Challenge
        var challengeEl = document.getElementById('detailChallenge');
        if (challengeEl) challengeEl.textContent = p.challenges || '';

        // Solution
        var solutionEl = document.getElementById('detailSolution');
        if (solutionEl) solutionEl.textContent = p.solution || '';

        // Technologies
        var techEl = document.getElementById('detailTechnologies');
        if (techEl && p.technologies) {
            techEl.innerHTML = '';
            p.technologies.forEach(function(tech) {
                var span = document.createElement('span');
                span.className = 'detail-tech-tag';
                span.textContent = tech;
                techEl.appendChild(span);
            });
        }

        // Deliverables
        var deliverablesEl = document.getElementById('detailDeliverables');
        if (deliverablesEl && p.deliverables && p.deliverables.length) {
            deliverablesEl.innerHTML = '';
            p.deliverables.forEach(function(item) {
                var li = document.createElement('li');
                li.textContent = item;
                deliverablesEl.appendChild(li);
            });
        }

        // Results
        var resultsEl = document.getElementById('detailResults');
        if (resultsEl) resultsEl.textContent = p.results || '';

        // Gallery
        var galleryEl = document.getElementById('detailGallery');
        if (galleryEl && p.images && p.images.length) {
            galleryEl.innerHTML = '';
            p.images.forEach(function(imgSrc) {
                var img = document.createElement('img');
                img.src = '../' + imgSrc;
                img.alt = p.title;
                img.loading = 'lazy';
                img.className = 'gallery-image';
                galleryEl.appendChild(img);
            });
        }

        // CTA WhatsApp link
        var ctaWhatsapp = document.getElementById('detailCtaWhatsapp');
        if (ctaWhatsapp) {
            var msg = encodeURIComponent('Olá Daniel! Vi o projeto "' + p.title + '" no seu site e gostaria de conversar sobre um orçamento.');
            ctaWhatsapp.href = 'https://wa.me/5592985528345?text=' + msg;
        }
    });
})();
