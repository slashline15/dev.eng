/**
 * Carrossel de Projetos - Scroll manual via botões
 * Cards linkam para o estudo de caso. Modal é mantido.
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        var carousel = document.querySelector('.projects-carousel');
        var wrapper = document.querySelector('.projects-wrapper');
        if (!wrapper || !carousel) return;

        var cards = wrapper.querySelectorAll('.project-card');
        if (!cards.length) return;

        // Injetar links CTA
        cards.forEach(function(card) {
            var projectId = card.getAttribute('data-project-id');
            var content = card.querySelector('.project-content');
            if (content && projectId) {
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

        // Configuração dos botões de navegação
        var prevBtn = document.getElementById('carousel-prev');
        var nextBtn = document.getElementById('carousel-next');

        if (prevBtn && nextBtn) {
            var scrollAmount = 0;
            var cardWidth = cards[0].getBoundingClientRect().width + 32; // width + gap (2rem = 32px aprox)

            nextBtn.addEventListener('click', function() {
                // Ao invés de animation CSS, usamos translação ou scroll nativo.
                // Como não usamos overflow: hidden puro com scrollBy (pois wrapper é max-content),
                // Vamos usar translateX manual.
                
                var maxScroll = wrapper.scrollWidth - carousel.clientWidth;
                scrollAmount += cardWidth;
                
                if (scrollAmount > maxScroll) {
                    scrollAmount = maxScroll;
                }
                wrapper.style.transform = 'translateX(-' + scrollAmount + 'px)';
            });

            prevBtn.addEventListener('click', function() {
                scrollAmount -= cardWidth;
                if (scrollAmount < 0) {
                    scrollAmount = 0;
                }
                wrapper.style.transform = 'translateX(-' + scrollAmount + 'px)';
            });
            
            // Reajusta em resize
            window.addEventListener('resize', function() {
                cardWidth = cards[0].getBoundingClientRect().width + 32;
                var maxScroll = wrapper.scrollWidth - carousel.clientWidth;
                if (scrollAmount > maxScroll && maxScroll > 0) {
                    scrollAmount = maxScroll;
                    wrapper.style.transform = 'translateX(-' + scrollAmount + 'px)';
                } else if (maxScroll <= 0) {
                    scrollAmount = 0;
                    wrapper.style.transform = 'translateX(0px)';
                }
            });
        }

        // Click no card abre modal
        wrapper.addEventListener('click', function(e) {
            var card = e.target.closest('.project-card');
            if (!card) return;
            if (e.target.closest('.card-cta')) return;

            var projectId = card.getAttribute('data-project-id');
            if (window.ProjectModal && window.projectsDataMap && projectsDataMap[projectId]) {
                ProjectModal.open(projectsDataMap[projectId]);
            }
        });
    });
})();
