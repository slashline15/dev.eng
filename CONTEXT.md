# Context Pack - engdaniel.org

## Visao Geral
Portfolio/landing page de **Daniel Alves**, engenheiro civil estrutural (Manaus-AM).
Foco: projetos estruturais, reforco estrutural, laudos tecnicos. Automacao e IA como diferencial secundario.
Vanilla HTML/CSS/JS, hospedado no GitHub Pages com dominio `engdaniel.org` (CNAME).
Tema: dark mode fixo, glassmorphism, tons de laranja (#FF6B35).

---

## Estrutura de Arquivos

```
index.html              -> Pagina principal (unica landing page ativa)
chatbot.html            -> Pagina de chat separada

css/
  main.css              -> Hub de imports (@import de todos os CSS)
  base.css              -> Reset, variaveis CSS, tipografia base
  theme.css             -> Variaveis de cor, dark mode fixo, overrides de cor
  layout.css            -> Container, grid, flexbox
  components.css        -> Componentes reutilizaveis (botoes, cards, nav, footer, forms, social links)
  effects.css           -> Keyframes, particulas, parallax, dynamic-background, fade-in
  glassmorphism.css     -> Efeito vidro (backdrop-filter blur), variaveis glass
  pages.css             -> Estilos por secao (hero, about, skills, economy, contact, skill-grid)
  color-balance.css     -> Ajustes de cor
  chat-widget.css       -> CSS do chat widget
  all.min.css           -> Font Awesome 6 local
  components/
    interactive-map.css -> Leaflet map styling
    project-modal.css   -> Modal de detalhes do projeto (inclui overrides integrados)
    projects-carousel.css -> Carrossel de projetos (inclui overrides integrados)

js/
  script.js             -> Logica principal (menu, scroll, typing, fade, parallax, economia, mapa)
  data/
    projects-data.js    -> Dados dos projetos (titulo, descricao, coords, tecnologias)
  modules/
    projects-carousel.js -> Carrossel com touch/swipe e autoplay
    project-modal.js     -> Modal popup para detalhes de projeto

images/                 -> ~37MB total (PROBLEMA: imagens nao comprimidas)
  profile.jpg           -> 2.3MB - foto perfil hero
  about.png             -> 2.1MB - foto secao sobre
  projects/
    clash-detective-metalica.png -> 16MB (!!)
    nippon-seiki-main.jpg        -> 11MB (!!)
    valeu-a-pena.png             -> 3.6MB
    reforco-guaranas-main.png    -> 689KB
  32.jpg                -> 5KB - (nao usado, era foto testimonial removido)
```

---

## Secoes do index.html (ordem)

1. **Header** - Logo "DA", nav (Inicio/Sobre/Habilidades/Contato), hamburger mobile
2. **Hero (#home)** - Nome, typing effect (4 frases: Engenheiro Estrutural / Projetos e Reforco / Gestao de Obras / Laudos Tecnicos), CTA buttons, foto perfil
3. **Sobre (#about)** - Bio profissional (foco estrutural), imagem, stats (Experiencia: Execucao e Gestao de Obras + Especialidade: Projetos e Reforco Estrutural)
4. **Mapa (#map-section)** - Leaflet.js com markers dos projetos (lazy loaded)
5. **Habilidades (#skills)** - 4 skill cards: Projetos Estruturais, Reforco Estrutural, Gestao de Obras, BIM e Automacao
6. **Projetos (#projects)** - Carrossel com 4 projetos + filtros + modal
7. **Simulador (#economy)** - Calculadora ROI com Chart.js (lazy loaded)
8. **Contato (#contact)** - Info + form + social links (Instagram, WhatsApp, LinkedIn, GitHub)
9. **Footer** - Links rapidos
10. **Modal de Projeto** - Overlay para detalhes
11. **Chat Widget** - Bot fixo bottom-right com respostas por keyword

---

## Funcoes Principais (script.js)

| Funcao | O que faz |
|--------|-----------|
| `DOMContentLoaded` handler | Inicializa tudo |
| Menu mobile (hamburger) | Toggle nav, fecha ao clicar link/resize |
| Smooth scrolling | Scroll suave para anchors |
| `typeEffect()` | Digita/apaga 4 frases em loop |
| `checkFade()` | Fade-in on scroll |
| Scroll handler (rAF) | Parallax, progress bar, sticky header |
| `startCounters()` | Anima numeros (nao usado atualmente) |
| Filter buttons | Filtra `.project-item` por categoria |
| `setupDarkMode()` | Toggle dark/light + localStorage |
| `setupTiltEffect()` | 3D tilt em `.tilt-card` (nao ha tilt-cards atualmente) |
| `setupEconomySimulator()` | Slider valor + calculo + Chart.js |
| `setupInteractiveMap()` | Leaflet map com markers (global, chamada pelo lazy loader) |

### Chat widget (inline em index.html)
- `toggleChat()`, `sendMessage()`, `addMessage()`, `showTyping()`, `hideTyping()`
- `getResponse()` - respostas por keyword (projeto, bim, contato, experiencia, python)

---

## Dependencias Externas

| Lib | Versao | Carregamento | Uso |
|-----|--------|-------------|-----|
| Font Awesome 6 | 6.0.0 | Local (css/all.min.css) | Icones |
| Google Fonts | - | Preconnect no head | Tipografia |
| Leaflet | 1.7.1 | **Lazy** (IntersectionObserver) | Mapa interativo |
| Chart.js | latest | **Lazy** (IntersectionObserver) | Grafico do simulador |

---

## Sessao Atual - Mudancas Realizadas

### Conteudo reescrito (tom profissional, foco estrutural)
- Hero description: posicionamento como engenheiro estrutural
- About section: bio tecnica com foco em projetos e reforco
- Stats: "Execucao e Gestao de Obras" + "Projetos e Reforco Estrutural"
- Skills: Projetos Estruturais, Reforco Estrutural, Gestao de Obras, BIM e Automacao
- Typing effect: Engenheiro Estrutural / Projetos e Reforco / Gestao de Obras / Laudos Tecnicos

### Problemas corrigidos
- **chart.js local deletado** (247KB, nao era usado - CDN lazy loaded)
- **Social links corrigidos**: Instagram @daniel.engdev + WhatsApp (92) 98552-8345
- **Secao Depoimentos removida** (slider com 1 item so)
- **glassmorphism.js deletado** (duplicava classes que ja existiam no HTML)
- **correcoes.css integrado** nos CSS corretos (theme.css, pages.css, components.css, project-modal.css, projects-carousel.css, effects.css) e deletado
- **color-fix.css deletado** (todo comentado)
- **glassmorphism.css** cores azuis corrigidas para laranja (#ff6b35)
- **Chat widget** info de contato corrigida (email e telefone reais)

---

## Problemas Conhecidos / Pendencias

1. **Imagens nao comprimidas** - 37MB total, maior tem 16MB. Converter para WebP e comprimir
2. **Formulario de contato** nao tem backend (form submit nao faz nada)
3. **Parallax bg** carrega imagem do Unsplash externamente (pode falhar)
4. **Chat widget** usa respostas hardcoded por keyword (nao conectado a API)
5. **LinkedIn e GitHub** links sociais ainda apontam para `#`

---

## Proximas Sessoes - Planejamento

### Prioridade 1: Linkar projetos mapa <-> carrossel
- Conectar markers do mapa interativo com os projetos do carrossel
- Clicar no marker abre o modal do projeto correspondente
- Clicar no projeto do carrossel centraliza o mapa no marker

### Prioridade 2: Pagina individual de Portfolio
- Criar pagina separada `/portfolio.html` (ou rota)
- Galeria completa de projetos estruturais e de obras
- Cada projeto com pagina/modal detalhado (fotos, descricao tecnica, tecnologias)
- Filtros por tipo: estrutural, reforco, laudo, execucao, BIM

### Prioridade 3: Pagina de Acervo de Automacoes / IA
- Criar pagina separada `/automacoes.html` (ou rota)
- Acervo de scripts, ferramentas e projetos com IA
- Categorias: automacao Python, scripts utilitarios, integracao IA
- Diferencial tecnico separado do core de engenharia estrutural

---

## Variaveis CSS Importantes (base.css / theme.css)

```css
--primary-color: #FF6B35 (laranja)
--background-dark: #121212
--text-color / --text-dark / --text-light
--glass-background: rgba(255,255,255,0.25)
--glass-background-dark: rgba(35,35,35,0.7)
--glass-blur: blur(12px)
--border-radius / --spacing-xs/sm/md/lg/xl
--transition: all 0.3s ease
```

---

## Como Funciona o Lazy Loading

```
index.html (script inline no final):
  IntersectionObserver com rootMargin 200px observa:
    #economy   -> carrega Chart.js CDN
    #map-section -> carrega Leaflet CSS + JS, depois chama setupInteractiveMap()
```

---

## Git / Deploy
- Branch: `main`
- Deploy: GitHub Pages com CNAME `engdaniel.org`
- .gitignore: node_modules, .env, netlify (restos de tentativa de deploy Netlify)
