// Sistema de Modal para Projetos
const ProjectModal = (function() {
    'use strict';
    
    let modal, overlay;
    let elements = {};
    
    // Inicializar modal
    function init() {
        cacheElements();
        bindEvents();
    }
    
    // Cachear elementos
    function cacheElements() {
        modal = document.getElementById('projectModal');
        elements = {
            category: document.getElementById('modalCategory'),
            title: document.getElementById('modalTitle'),
            description: document.getElementById('modalDescription'),
            mainImage: document.getElementById('modalMainImage'),
            technologies: document.getElementById('modalTechnologies'),
            challenges: document.getElementById('modalChallenges'),
            results: document.getElementById('modalResults')
        };
    }
    
    // Vincular eventos
    function bindEvents() {
        // Fechar ao clicar no overlay
        modal.addEventListener('click', function(e) {
            if (e.target === modal) close();
        });
        
        // Fechar com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') close();
        });
        
        // Botão fechar
        document.querySelector('.modal-close').addEventListener('click', close);
    }
    
    // Abrir modal
    function open(projectData) {
        // Preencher dados básicos
        elements.category.textContent = projectData.category;
        elements.title.textContent = projectData.title;
        elements.description.textContent = projectData.description;
        elements.mainImage.src = projectData.image;
        
        // Tecnologias
        elements.technologies.innerHTML = '';
        projectData.technologies.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'tech-item';
            span.textContent = tech;
            elements.technologies.appendChild(span);
        });
        
        // Desafios
        if (projectData.challenges) {
            elements.challenges.textContent = projectData.challenges;
            document.getElementById('challengesSection').style.display = 'block';
        }
        
        // Resultados
        if (projectData.results) {
            elements.results.textContent = projectData.results;
            document.getElementById('resultsSection').style.display = 'block';
        }
        
        // Mostrar modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Fechar modal
    function close() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // API pública
    return {
        init: init,
        open: open,
        close: close
    };
})();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    ProjectModal.init();
    
    // Vincular cliques nos cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.dataset.projectId;
            if (projectsData[projectId]) {
                ProjectModal.open(projectsData[projectId]);
            }
        });
    });
});