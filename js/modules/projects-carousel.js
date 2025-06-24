/**
 * Carrossel de Projetos Recentes
 * Versão melhorada com:
 * - Navegação automática e manual
 * - Suporte a touch/swipe
 * - Responsividade automática
 * - Efeitos de transição suaves
 */

class ProjectsCarousel {
  constructor() {
    // Elementos principais
    this.container = document.querySelector('.projects-carousel');
    this.wrapper = document.querySelector('.projects-wrapper');
    this.cards = Array.from(document.querySelectorAll('.project-card'));
    this.prevBtn = document.querySelector('.carousel-nav.prev');
    this.nextBtn = document.querySelector('.carousel-nav.next');
    this.indicators = document.querySelectorAll('.indicator');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    
    // Estado do carrossel
    this.totalCards = this.cards.length;
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.isPaused = false;
    this.isAnimating = false;
    this.cardWidth = 0;
    this.cardsPerView = 1;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    // Inicialização
    this.init();
  }
  
  init() {
    // Calcular dimensões responsivas
    this.calculateDimensions();
    
    // Adicionar event listeners
    this.addEventListeners();
    
    // Configurar indicadores
    this.setupIndicators();
    
    // Iniciar autoplay
    this.startAutoPlay();
    
    // Redimensionar elementos quando a janela for redimensionada
    window.addEventListener('resize', () => {
      this.calculateDimensions();
      this.moveToSlide(this.currentIndex, false);
    });
  }
  
  calculateDimensions() {
    // Calcula dinamicamente o número de cards visíveis e seus tamanhos
    const containerWidth = this.container.clientWidth;
    
    // Define cardsPerView com base na largura do container
    if (containerWidth < 768) {
      this.cardsPerView = 1;
    } else if (containerWidth < 1200) {
      this.cardsPerView = 2;
    } else {
      this.cardsPerView = 3;
    }
    
    // Recalcula a largura do card baseada no espaço disponível (incluindo gap)
    // Assumindo gap de 2rem (32px) entre cards
    const gap = 32;
    this.cardWidth = (containerWidth - (gap * (this.cardsPerView - 1))) / this.cardsPerView;
    
    // Aplica a nova largura a todos os cards
    this.cards.forEach(card => {
      card.style.flex = `0 0 ${this.cardWidth}px`;
      card.style.maxWidth = `${this.cardWidth}px`;
    });
  }
  
  addEventListeners() {
    // Navegação por botões
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Pausa ao passar o mouse
    this.wrapper.addEventListener('mouseenter', () => this.isPaused = true);
    this.wrapper.addEventListener('mouseleave', () => this.isPaused = false);
    
    // Suporte a touch (swipe)
    this.wrapper.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    this.wrapper.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
    
    // Filtros de projetos
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => this.filterProjects(btn));
    });
    
    // Scroll com a roda do mouse
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }, { passive: false });
    
    // Clique nos cards para abrir modal
    this.cards.forEach(card => {
      card.addEventListener('click', () => {
        const projectId = card.dataset.projectId;
        if (window.ProjectModal && projectsData && projectsData[projectId]) {
          ProjectModal.open(projectsData[projectId]);
        }
      });
    });
  }
  
  setupIndicators() {
    // Recria os indicadores com base no número de slides visíveis
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    if (!indicatorsContainer) return;
    
    // Limpa indicadores existentes
    indicatorsContainer.innerHTML = '';
    
    // Calcula quantos indicadores são necessários
    const numIndicators = Math.ceil(this.totalCards / this.cardsPerView);
    
    // Cria novos indicadores
    for (let i = 0; i < numIndicators; i++) {
      const indicator = document.createElement('span');
      indicator.classList.add('indicator');
      if (i === 0) indicator.classList.add('active');
      
      indicator.addEventListener('click', () => {
        this.moveToSlide(i * this.cardsPerView);
      });
      
      indicatorsContainer.appendChild(indicator);
    }
    
    // Atualiza a referência aos indicadores
    this.indicators = document.querySelectorAll('.indicator');
  }
  
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      if (!this.isPaused && !this.isAnimating) {
        this.nextSlide();
      }
    }, 5000);
  }
  
  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }
  
  prevSlide() {
    if (this.isAnimating) return;
    
    if (this.currentIndex > 0) {
      this.moveToSlide(this.currentIndex - 1);
    } else {
      // Voltar para o último slide (navegação circular)
      this.moveToSlide(this.totalCards - this.cardsPerView);
    }
  }
  
  nextSlide() {
    if (this.isAnimating) return;
    
    if (this.currentIndex < this.totalCards - this.cardsPerView) {
      this.moveToSlide(this.currentIndex + 1);
    } else {
      // Voltar para o primeiro slide (navegação circular)
      this.moveToSlide(0);
    }
  }
  
  moveToSlide(index, animate = true) {
    // Limita o índice para evitar problemas
    const maxIndex = this.totalCards - this.cardsPerView;
    const targetIndex = Math.max(0, Math.min(index, maxIndex));
    
    // Calcula o deslocamento
    const offset = -targetIndex * (this.cardWidth + 32); // Card width + gap
    
    // Aplica a transformação com ou sem animação
    if (animate) {
      this.isAnimating = true;
      this.wrapper.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      
      // Após a animação, redefinir a flag
      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    } else {
      this.wrapper.style.transition = 'none';
    }
    
    this.wrapper.style.transform = `translateX(${offset}px)`;
    this.currentIndex = targetIndex;
    
    // Atualiza indicadores
    this.updateIndicators();
  }
  
  updateIndicators() {
    // Calcula qual indicador deve estar ativo
    const activeIndicatorIndex = Math.floor(this.currentIndex / this.cardsPerView);
    
    // Remove a classe ativa de todos os indicadores
    this.indicators.forEach(ind => ind.classList.remove('active'));
    
    // Adiciona a classe ativa ao indicador correto
    if (this.indicators[activeIndicatorIndex]) {
      this.indicators[activeIndicatorIndex].classList.add('active');
    }
  }
  
  handleSwipe() {
    const swipeThreshold = 50; // Limite mínimo para considerar um swipe
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) < swipeThreshold) return;
    
    if (diff > 0) {
      // Swipe para a esquerda (próximo slide)
      this.nextSlide();
    } else {
      // Swipe para a direita (slide anterior)
      this.prevSlide();
    }
  }
  
  filterProjects(activeBtn) {
    // Remove a classe ativa de todos os botões
    this.filterBtns.forEach(btn => btn.classList.remove('active'));
    
    // Adiciona a classe ativa ao botão clicado
    activeBtn.classList.add('active');
    
    const filter = activeBtn.dataset.filter;
    let visibleCount = 0;
    
    // Filtra os projetos
    this.cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Atualiza o estado do carrossel
    this.totalCards = visibleCount;
    
    // Reconfigura os indicadores para o novo número de cards
    this.setupIndicators();
    
    // Reseta a posição do carrossel
    this.moveToSlide(0);
  }
}

// Inicializa o carrossel quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log("Inicializando carrossel de projetos...");
  // Verifica se o carrossel existe na página
  if (document.querySelector('.projects-carousel')) {
    console.log("Carrossel encontrado, criando instância...");
    const projectsCarousel = new ProjectsCarousel();
    console.log("Carrossel inicializado com sucesso!");
  } else {
    console.error("Elemento .projects-carousel não encontrado na página");
  }
});
