/**
 * Carrossel de Projetos - Loop infinito com CSS animation
 * Hover: pausa autoplay + mostra overlay
 * Cards linkam para pagina do projeto (caminho nobre)
 * Modal acessivel via click como alternativa
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        var wrapper = document.querySelector('.projects-wrapper');
        if (!wrapper) return;

        var cards = wrapper.querySelectorAll('.project-card');
        if (!cards.length) return;

        // Inject CTA button into each card overlay and wrap with link
        cards.forEach(function(card) {
            var projectId = card.getAttribute('data-project-id');
            var content = card.querySelector('.project-content');
            if (content && projectId) {
                // Add CTA link
                var cta = document.createElement('a');
                cta.href = 'projetos/' + projectId + '.html';
                cta.className = 'card-cta';
                cta.textContent = 'Ver estudo de caso';
                cta.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
                content.appendChild(cta);
            }
        });

        // Clone all cards to create seamless infinite loop
        cards.forEach(function(card) {
            var clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            // Re-bind CTA click stop propagation on clone
            var cloneCta = clone.querySelector('.card-cta');
            if (cloneCta) {
                cloneCta.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
            wrapper.appendChild(clone);
        });

        // Adjust animation duration based on card count
        var totalCards = cards.length;
        var duration = totalCards * 6; // 6s per card
        wrapper.style.animationDuration = duration + 's';

        // Card click opens modal (secondary path)
        wrapper.addEventListener('click', function(e) {
            var card = e.target.closest('.project-card');
            if (!card) return;
            // Don't open modal if user clicked the CTA link
            if (e.target.closest('.card-cta')) return;

            var projectId = card.getAttribute('data-project-id');
            if (window.ProjectModal && window.projectsDataMap && projectsDataMap[projectId]) {
                ProjectModal.open(projectsDataMap[projectId]);
            }
        });
    });
})();
