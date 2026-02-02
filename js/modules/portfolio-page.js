// Portfolio Page - gera grid de cards e aplica filtros
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        var grid = document.getElementById('portfolioGrid');
        var filtersContainer = document.getElementById('portfolioFilters');
        if (!grid || !projectsData) return;

        // Render all project cards
        function renderCards(filterCategory, filterTag) {
            grid.innerHTML = '';
            var count = 0;

            projectsData.forEach(function(p) {
                // Filter by category
                if (filterCategory && filterCategory !== 'all' && p.category !== filterCategory) return;

                // Filter by tag (from querystring)
                if (filterTag) {
                    var normalizedTag = filterTag.toLowerCase();
                    var hasTag = p.tags && p.tags.some(function(t) {
                        return t.toLowerCase().indexOf(normalizedTag) !== -1;
                    });
                    if (!hasTag) return;
                }

                count++;
                var card = document.createElement('a');
                card.href = 'projetos/' + p.slug + '.html';
                card.className = 'portfolio-card';
                card.setAttribute('data-category', p.category);

                var tagsHTML = '';
                if (p.tags) {
                    p.tags.forEach(function(tag) {
                        tagsHTML += '<span class="portfolio-tag">' + tag + '</span>';
                    });
                }

                card.innerHTML =
                    '<div class="portfolio-card-image">' +
                        '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy">' +
                    '</div>' +
                    '<div class="portfolio-card-content">' +
                        '<span class="portfolio-card-category">' + p.categoryLabel + '</span>' +
                        '<h3>' + p.title + '</h3>' +
                        '<p>' + (p.subtitle || '') + '</p>' +
                        '<div class="portfolio-card-tags">' + tagsHTML + '</div>' +
                    '</div>';

                grid.appendChild(card);
            });

            if (count === 0) {
                grid.innerHTML = '<p class="portfolio-empty">Nenhum projeto encontrado para este filtro.</p>';
            }
        }

        // Read ?tag= from querystring
        var params = new URLSearchParams(window.location.search);
        var tagParam = params.get('tag');

        // Initial render
        renderCards('all', tagParam);

        // Filter buttons
        if (filtersContainer) {
            var filterBtns = filtersContainer.querySelectorAll('.filter-btn');
            filterBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(function(b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    var filter = btn.getAttribute('data-filter');
                    // Clear tag filter when user clicks a category button
                    renderCards(filter, null);
                    // Update URL without reload
                    var url = new URL(window.location);
                    url.searchParams.delete('tag');
                    window.history.replaceState({}, '', url);
                });
            });
        }
    });
})();
