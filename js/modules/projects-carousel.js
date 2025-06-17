// Sistema de carrossel
const wrapper = document.querySelector('.projects-wrapper');
const cards = document.querySelectorAll('.project-card');
const prevBtn = document.querySelector('.carousel-nav.prev');
const nextBtn = document.querySelector('.carousel-nav.next');
const indicators = document.querySelectorAll('.indicator');

let currentIndex = 0;
const cardsPerView = 3;
const totalCards = cards.length;

// Função para mover o carrossel
function moveCarousel(index) {
    const cardWidth = 350 + 32; // largura do card + gap
    const offset = -index * cardWidth;
    wrapper.style.transform = `translateX(${offset}px)`;

    // Atualizar indicadores
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });

    currentIndex = index;
}

// Navegação
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        moveCarousel(currentIndex - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < totalCards - cardsPerView) {
        moveCarousel(currentIndex + 1);
    }
});

// Indicadores
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => moveCarousel(index));
});

// Filtros
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover active de todos
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        cards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Resetar carrossel
        moveCarousel(0);
    });
});

// Pause on hover
let isPaused = false;

wrapper.addEventListener('mouseenter', () => {
    isPaused = true;
});

wrapper.addEventListener('mouseleave', () => {
    isPaused = false;
});

// Auto-play (opcional)
setInterval(() => {
    if (!isPaused) {
        if (currentIndex < totalCards - cardsPerView) {
            moveCarousel(currentIndex + 1);
        } else {
            moveCarousel(0);
        }
    }
}, 5000);

// Sistema de carrossel
const wrapper = document.querySelector('.projects-wrapper');
const cards = document.querySelectorAll('.project-card');
const prevBtn = document.querySelector('.carousel-nav.prev');
const nextBtn = document.querySelector('.carousel-nav.next');
const indicators = document.querySelectorAll('.indicator');

let currentIndex = 0;
const cardsPerView = 3;
const totalCards = cards.length;

// Função para mover o carrossel
function moveCarousel(index) {
    const cardWidth = 350 + 32; // largura do card + gap
    const offset = -index * cardWidth;
    wrapper.style.transform = `translateX(${offset}px)`;

    // Atualizar indicadores
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });

    currentIndex = index;
}

// Navegação
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        moveCarousel(currentIndex - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < totalCards - cardsPerView) {
        moveCarousel(currentIndex + 1);
    }
});

// Indicadores
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => moveCarousel(index));
});

// Filtros
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover active de todos
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        cards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Resetar carrossel
        moveCarousel(0);
    });
});

// Pause on hover
let isPaused = false;

wrapper.addEventListener('mouseenter', () => {
    isPaused = true;
});

wrapper.addEventListener('mouseleave', () => {
    isPaused = false;
});

// Auto-play (opcional)
setInterval(() => {
    if (!isPaused) {
        if (currentIndex < totalCards - cardsPerView) {
            moveCarousel(currentIndex + 1);
        } else {
            moveCarousel(0);
        }
    }
}, 5000);

// No JavaScript do carrossel
cards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.dataset.projectId;
        const projectData = projectsData[projectId];

        if (projectData) {
            ProjectModal.open(projectData);
        }
    });
});
