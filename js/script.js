document.addEventListener('DOMContentLoaded', function () {
  // Toggle do menu mobile
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;
  
  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('active');
    document.querySelectorAll('.bar').forEach(bar => bar.classList.toggle('active'));
    
    // Impedir rolagem do body quando o menu estiver aberto
    if (navLinks.classList.contains('active')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
      navLinks.classList.remove('active');
      document.querySelectorAll('.bar').forEach(bar => bar.classList.remove('active'));
      body.style.overflow = '';
    });
  });
  
  // Fechar menu ao redimensionar para desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      document.querySelectorAll('.bar').forEach(bar => bar.classList.remove('active'));
      body.style.overflow = '';
    }
  });

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetElement = document.querySelector(this.getAttribute('href'));
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        window.scrollTo({
          top: targetElement.offsetTop - headerHeight,
          behavior: 'smooth'
        });
      }
    });
  });

  // Efeito de digitação
  function typeEffect() {
    const typingElement = document.getElementById('typing-text');
    const phrases = [
      'Engenheiro Estrutural',
      'Projetos e Reforço',
      'Gestão de Obras',
      'Laudos Técnicos'
    ];
    let phraseIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

    function type() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }
      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
      }
      setTimeout(type, typingSpeed);
    }
    setTimeout(type, 1000);
  }


  // Animação de fade-in
  const fadeElements = document.querySelectorAll('.fade-in');
  function checkFade() {
    fadeElements.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 100) {
        el.classList.add('appear');
        const animation = el.getAttribute('data-animation');
        if (animation) el.classList.add(animation);
      }
    });
    const statsSection = document.querySelector('.stats-section');
    if (statsSection && statsSection.getBoundingClientRect().top < window.innerHeight - 100) {
      startCounters();
    }
  }


  // Efeito Parallax, barra de progresso e header fixo (throttled com rAF)
  let scrollTicking = false;
  const parallaxBg = document.querySelector('.parallax-bg');
  const scrollProgressBar = document.querySelector('.scroll-progress-bar');
  const headerEl = document.querySelector('header');

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        if (parallaxBg) {
          parallaxBg.style.transform = `translateY(${window.pageYOffset * 0.4}px)`;
        }
        const scrollPercent = (window.scrollY / (document.body.offsetHeight - window.innerHeight)) * 100;
        scrollProgressBar.style.width = scrollPercent + '%';
        if (window.scrollY > 50) headerEl.classList.add('sticky');
        else headerEl.classList.remove('sticky');
        checkFade();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // Animação de contadores
  function startCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 200;
        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  }

  // Filtro de projetos
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');
      document.querySelectorAll('.project-item').forEach(item => {
        item.style.display = (filter === 'all' || item.getAttribute('data-category') === filter) ? 'block' : 'none';
      });
    });
  });

  // Modo Escuro
  function setupDarkMode() {
    const themeSwitch = document.getElementById('theme-switch');
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      themeSwitch.checked = true;
    }
    themeSwitch.addEventListener('change', function () {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Efeito Tilt nos cartões
  function setupTiltEffect() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const rotateX = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * -10;
        const rotateY = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        const inner = card.querySelector('.tilt-card-inner');
        if (inner) inner.style.transform = 'translateZ(40px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        const inner = card.querySelector('.tilt-card-inner');
        if (inner) inner.style.transform = 'translateZ(20px)';
      });
    });
  }


  // Função para o simulador de economia com IA
  function setupEconomySimulator() {
    const projectValueSlider = document.getElementById('projectValueSlider');
    const projectValueInput = document.getElementById('projectValue');
    const economyForm = document.getElementById('economyForm');
    const economyChart = document.getElementById('economyChart');
    const chartPlaceholder = document.querySelector('.chart-placeholder');
    
    // Verificar se os elementos existem
    if (!projectValueSlider || !projectValueInput || !economyForm) return;
    
    // Sincronizar o slider com o campo de entrada
    projectValueSlider.addEventListener('input', function() {
      projectValueInput.value = this.value;
    });
    
    // Sincronizar o campo de entrada com o slider
    projectValueInput.addEventListener('input', function() {
      const value = parseInt(this.value);
      if (!isNaN(value) && value >= 50000 && value <= 10000000) {
        projectValueSlider.value = value;
      }
    });
    
    // Formatar o valor ao perder o foco
    projectValueInput.addEventListener('blur', function() {
      const value = parseInt(this.value);
      if (!isNaN(value)) {
        if (value < 50000) this.value = 50000;
        if (value > 10000000) this.value = 10000000;
      } else {
        this.value = 500000;
      }
    });
    
    // Lidar com o envio do formulário
    economyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Obter os valores do formulário
      const projectValue = parseInt(projectValueInput.value);
      const automationLevel = document.querySelector('input[name="automationLevel"]:checked').value;
      
      // Calcular economia baseada no nível de automação
      let savingsPercent, roiMultiplier, implementationTime;
      
      switch(automationLevel) {
        case 'low':
          savingsPercent = 0.12; // 12% de economia
          roiMultiplier = 2.5;   // 2.5x ROI
          implementationTime = '2-3 meses';
          break;
        case 'medium':
          savingsPercent = 0.20; // 20% de economia
          roiMultiplier = 3.2;   // 3.2x ROI
          implementationTime = '4-6 meses';
          break;
        case 'high':
          savingsPercent = 0.35; // 35% de economia
          roiMultiplier = 4.5;   // 4.5x ROI
          implementationTime = '6-8 meses';
          break;
      }
      
      // Calcular valores
      const savings = projectValue * savingsPercent;
      const roi = roiMultiplier;
      
      // Atualizar os resultados
      document.getElementById('savingsValue').textContent = 'R$ ' + savings.toLocaleString('pt-BR');
      document.getElementById('roiValue').textContent = roi.toFixed(1) + 'x';
      document.getElementById('timeValue').textContent = implementationTime;
      
      // Adicionar análise baseada no nível de automação
      const analysisElement = document.getElementById('economyAnalysis');
      if (analysisElement) {
        let analysisText = '';
        
        switch(automationLevel) {
          case 'low':
            analysisText = `Com automações básicas em seu projeto de R$ ${projectValue.toLocaleString('pt-BR')}, você pode economizar aproximadamente <strong>R$ ${savings.toLocaleString('pt-BR')}</strong>. O nível básico inclui automação de processos repetitivos e sistemas de monitoramento simples.`;
            break;
          case 'medium':
            analysisText = `Implementando automações intermediárias em seu projeto de R$ ${projectValue.toLocaleString('pt-BR')}, a economia estimada é de <strong>R$ ${savings.toLocaleString('pt-BR')}</strong>. Este nível inclui IA para otimização de processos e sistemas preditivos de gerenciamento de recursos.`;
            break;
          case 'high':
            analysisText = `Com automação completa usando IA avançada em seu projeto de R$ ${projectValue.toLocaleString('pt-BR')}, você pode economizar até <strong>R$ ${savings.toLocaleString('pt-BR')}</strong>. Este nível inclui sistemas inteligentes integrados, análise preditiva e otimização contínua de processos construtivos.`;
            break;
        }
        
        analysisElement.innerHTML = analysisText;
      }
      
      // Remover o placeholder quando os resultados são exibidos
      if (chartPlaceholder) {
        chartPlaceholder.style.display = 'none';
      }
      
      // Criar ou atualizar o gráfico
      createEconomyChart(economyChart, projectValue, savings, automationLevel);
    });
    
    // Função para criar o gráfico
    function createEconomyChart(chartElement, projectValue, savings, automationLevel) {
      if (!chartElement) return;
      
      // Destruir o gráfico existente, se houver
      if (window.economyChartInstance) {
        window.economyChartInstance.destroy();
      }
      
      // Dados para comparação entre métodos tradicionais e com IA
      const traditionalData = [];
      const iaData = [];
      const months = ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6', 'Mês 7', 'Mês 8', 'Mês 9', 'Mês 10', 'Mês 11', 'Mês 12'];
      
      // Calcular dados para os diferentes meses baseado no nível de automação
      let iaFactor, traditionalFactor;
      
      switch(automationLevel) {
        case 'low':
          iaFactor = [0.92, 0.89, 0.87, 0.85, 0.84, 0.83, 0.82, 0.81, 0.80, 0.80, 0.79, 0.78];
          traditionalFactor = [1, 0.99, 0.98, 0.97, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.90, 0.89];
          break;
        case 'medium':
          iaFactor = [0.95, 0.88, 0.83, 0.79, 0.76, 0.74, 0.72, 0.71, 0.70, 0.69, 0.68, 0.67];
          traditionalFactor = [1, 0.99, 0.98, 0.97, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.90, 0.89];
          break;
        case 'high':
          iaFactor = [0.98, 0.85, 0.75, 0.68, 0.63, 0.60, 0.58, 0.57, 0.56, 0.55, 0.54, 0.53];
          traditionalFactor = [1, 0.99, 0.98, 0.97, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.90, 0.89];
          break;
      }
      
      // Gerar dados para cada mês
      for (let i = 0; i < months.length; i++) {
        traditionalData.push(projectValue * traditionalFactor[i] / 12);
        iaData.push(projectValue * iaFactor[i] / 12);
      }
      
      // Criar o gráfico
      const ctx = chartElement.getContext('2d');
      window.economyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Método Tradicional',
              data: traditionalData,
              backgroundColor: 'rgba(234, 67, 53, 0.2)',
              borderColor: 'rgba(234, 67, 53, 1)',
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 3
            },
            {
              label: 'Com Automação IA',
              data: iaData,
              backgroundColor: 'rgba(66, 133, 244, 0.2)',
              borderColor: 'rgba(66, 133, 244, 1)',
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Comparação de Custos: Tradicional vs. Automação com IA',
              color: document.body.classList.contains('dark-mode') ? '#f5f5f5' : '#333333',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += 'R$ ' + context.parsed.y.toLocaleString('pt-BR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    });
                  }
                  return label;
                }
              }
            },
            legend: {
              position: 'bottom',
              labels: {
                color: document.body.classList.contains('dark-mode') ? '#f5f5f5' : '#333333',
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'R$ ' + value.toLocaleString('pt-BR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  });
                },
                color: document.body.classList.contains('dark-mode') ? '#aaaaaa' : '#666666'
              },
              grid: {
                color: document.body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              ticks: {
                color: document.body.classList.contains('dark-mode') ? '#aaaaaa' : '#666666'
              },
              grid: {
                color: document.body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              }
            }
          }
        }
      });
      
      // Atualizar cores do gráfico se o tema mudar
      const themeSwitch = document.getElementById('theme-switch');
      if (themeSwitch) {
        themeSwitch.addEventListener('change', function() {
          const isDarkMode = this.checked;
          const textColor = isDarkMode ? '#f5f5f5' : '#333333';
          const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
          const ticksColor = isDarkMode ? '#aaaaaa' : '#666666';
          
          window.economyChartInstance.options.plugins.title.color = textColor;
          window.economyChartInstance.options.plugins.legend.labels.color = textColor;
          window.economyChartInstance.options.scales.y.ticks.color = ticksColor;
          window.economyChartInstance.options.scales.x.ticks.color = ticksColor;
          window.economyChartInstance.options.scales.y.grid.color = gridColor;
          window.economyChartInstance.options.scales.x.grid.color = gridColor;
          
          window.economyChartInstance.update();
        });
      }
    }
  }

  // Inicializações
  checkFade();
  typeEffect();
  setupDarkMode();
  setupTiltEffect();
  setupEconomySimulator();
  // Map is now lazy-loaded via IntersectionObserver in index.html
  // setupInteractiveMap() will be called when Leaflet finishes loading
});

function setupInteractiveMap() {
  if (typeof L === 'undefined') {
    return;
  }

  const map = L.map('interactive-map').setView([-3.07, -60.02], 12);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  for (const projectId in projectsData) {
    const project = projectsData[projectId];
    if (project.coords) {
      const customIcon = L.divIcon({
        className: 'custom-marker-icon',
        html: '',
        iconSize: [20, 20]
      });

      const marker = L.marker(project.coords, { icon: customIcon }).addTo(map);

      let popupContent = `<div class="popup-title">${project.title}</div>`;
      popupContent += `<div class="popup-description">${project.description}</div>`;
      if (project.technologies) {
        popupContent += '<div class="popup-tags">';
        project.technologies.forEach(tag => {
          popupContent += `<span class="tag">${tag}</span>`;
        });
        popupContent += '</div>';
      }

      marker.bindPopup(popupContent);
    }
  }
}

