// Função para inicializar os efeitos de glassmorphism
function initGlassmorphism() {
    // Criar e adicionar o arquivo CSS se não existir
    if (!document.querySelector('link[href="glassmorphism.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'glassmorphism.css';
        document.head.appendChild(link);
    }

    // Substituir partículas por fundos dinâmicos
    document.querySelectorAll('.particle-background').forEach(particleEl => {
        // Criar elemento de fundo dinâmico
        const dynamicBg = document.createElement('div');
        dynamicBg.className = 'dynamic-background';
        
        // Inserir após o elemento de partículas
        particleEl.parentNode.insertBefore(dynamicBg, particleEl.nextSibling);
    });

    // Adicionar classes glass-card aos elementos
    const glassElements = [
        '.stat-counter',
        '.testimonial-content',
        '.contact-info',
        '#contactForm',
        '.economy-simulator',
        '.creative-modal-content'
    ];

    glassElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (!el.classList.contains('glass-card')) {
                el.classList.add('glass-card');
            }
        });
    });

    // Adicionar a classe btn-glass aos botões primários
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (!btn.classList.contains('btn-glass')) {
            btn.classList.add('btn-glass');
        }
    });

    // Reforçar o efeito de header glass quando em modo sticky
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            if (!header.classList.contains('sticky-glass')) {
                header.classList.add('sticky-glass');
            }
        } else {
            header.classList.remove('sticky-glass');
        }
    });

    // Ajustar o efeito tilt para combinar com glassmorphism
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.03, 1.03, 1.03)`;
            
            // Adiciona reflexo dinâmico
            const inner = card.querySelector('.tilt-card-inner');
            if (inner) {
                inner.style.transform = 'translateZ(30px)';
                
                // Cria efeito de brilho na direção do mouse
                const glare = x / rect.width * 100;
                inner.style.background = `linear-gradient(${glare}deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 80%)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            const inner = card.querySelector('.tilt-card-inner');
            if (inner) {
                inner.style.transform = 'translateZ(0px)';
                inner.style.background = 'none';
            }
        });
    });
}

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Código DOM existente...
    
    // Inicializar glassmorphism ao final
    initGlassmorphism();
});