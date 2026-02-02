# Context Pack - engdaniel.org

## Visao Geral
Site multi-page de **Daniel Alves**, engenheiro civil estrutural (Manaus-AM).
Foco: projetos estruturais, reforco estrutural, laudos tecnicos. Automacao/IA como diferencial secundario.
Vanilla HTML/CSS/JS, hospedado no Cloudflare Pages com dominio `engdaniel.org`.
Tema: dark mode fixo, glassmorphism, tons de laranja (#FF6B35).

---

## Estrutura de Arquivos

```
index.html              -> Landing page principal
portfolio.html          -> Galeria de projetos com filtros
calculadora.html        -> Calculadora de retrabalho (ex-simulador de economia)
chatbot.html            -> Pagina de chat separada (legacy)

projetos/               -> Paginas individuais de cada projeto
  clash-detective-metalica.html
  nippon-seiki-ampliacao.html
  reforco-estrutura-guaranas.html
  estrutura-metalica.html
  projeto-bim.html
  layout-canteiro.html
  vila.html

css/
  main.css              -> Hub de imports (@import de todos os CSS)
  base.css              -> Reset, variaveis CSS, tipografia base
  theme.css             -> Variaveis de cor, dark mode fixo
  layout.css            -> Container, header, footer, nav, .logo-img, .nav-link.active
  components.css        -> Botoes, cards, forms, social links
  effects.css           -> Keyframes, particulas, parallax, fade-in
  glassmorphism.css     -> Efeito vidro (backdrop-filter blur)
  pages.css             -> Estilos por secao: hero, about, services-tags, portfolio-page,
                           project-detail, calculadora-page, contact, social-links, economy
  color-balance.css     -> Ajustes de cor
  chat-widget.css       -> Chat widget + WhatsApp FAB
  all.min.css           -> Font Awesome 6 local
  components/
    interactive-map.css -> Leaflet map
    project-modal.css   -> Modal detalhes projeto (com modal-actions, modal-btn)
    projects-carousel.css -> Carrossel infinito com CSS animation

js/
  script.js             -> Logica principal: menu, scroll, typing, fade, parallax,
                           setupEconomySimulator, setupContactForm, setupInteractiveMap
  data/
    projects-data.js    -> FONTE UNICA de dados. Array projectsData[] + TAG map + projectsDataMap{}
  modules/
    projects-carousel.js -> Loop infinito via clone nodes + CSS animation. Click abre modal ou CTA
    project-modal.js     -> Modal com dados do projectsDataMap. Link "Abrir estudo de caso"
    project-detail.js    -> Le data-project-slug, popula DOM da pagina de detalhe
    portfolio-page.js    -> Gera grid de cards, le ?tag= da querystring, filtros por categoria

functions/
  api/
    contact.js          -> Cloudflare Pages Function (POST /api/contact -> Telegram)

images/
  logo-DA.png           -> Logo provisorio
  profile.jpg           -> Foto perfil hero
  about.png             -> Foto secao sobre
  projects/             -> Imagens dos projetos
    clash-detective-metalica.png
    nippon-seiki-main.jpg
    nippon-seiki-main.png
    reforco-guaranas-main.png
    valeu-a-pena.png
    projeto_bim.png
    layout_canteiro.png
    vila.jpg
```

---

## Secoes do index.html (ordem)

1. **Header** - Logo (images/logo-DA.png), nav (Inicio/Servicos/Projetos/Sobre/Contato)
2. **Hero (#home)** - Nome, typing effect, CTA, foto perfil
3. **Sobre (#about)** - Bio, imagem, stats
4. **Servicos (#services)** - Tags que linkam para portfolio.html?tag=<id>
5. **Mapa (#map-section)** - Leaflet.js com markers (lazy loaded)
6. **Projetos (#projects)** - Carrossel infinito full-width, 7 cards. Hover: overlay + CTA
7. **Contato (#contact)** - Info chamativa + form com honeypot + social links
8. **Footer** - Links rapidos (Inicio, Sobre, Projetos, Contato, Calculadora)
9. **Modal de Projeto** - Detalhes + "Abrir estudo de caso" + "Fechar"
10. **WhatsApp FAB** - Botao verde fixo right:90px bottom:20px
11. **Chat Widget** - Bot fixo bottom-right com respostas por keyword

---

## Sistema de Tags (projects-data.js)

Tags usam `{id, label}` para evitar problemas de acentuacao na URL.
Definidas no objeto global `TAG`:

```
concreto-armado, estruturas-metalicas, reforco-estrutural, laudos-tecnicos,
execucao-de-obras, bim, compatibilizacao, planejamento, automacao, navisworks
```

Service tags no index.html linkam para `portfolio.html?tag=<id>`.
portfolio-page.js filtra por `tag.id` exato.

---

## Dados de Projetos (projects-data.js)

7 projetos no array `projectsData[]`:

| id | category | Tem dados completos? |
|----|----------|---------------------|
| clash-detective-metalica | bim | Sim |
| nippon-seiki-ampliacao | engenharia | Sim |
| reforco-estrutura-guaranas | engenharia | Sim |
| estrutura-metalica | execucao | Sim |
| projeto-bim | bim | Placeholder |
| layout-canteiro | engenharia | Placeholder |
| vila | engenharia | Placeholder |

`projectsDataMap` = lookup por id/slug. Usado por modal, carousel, detail pages.

---

## Funcoes Principais (script.js)

| Funcao | O que faz |
|--------|-----------|
| Menu mobile | Toggle hamburger, fecha em link/resize |
| Smooth scrolling | Scroll suave para anchors internos |
| `typeEffect()` | 4 frases em loop (Engenheiro Estrutural, etc) |
| `checkFade()` | Fade-in on scroll |
| Scroll handler (rAF) | Parallax, progress bar, sticky header |
| `setupDarkMode()` | Toggle dark/light + localStorage |
| `setupTiltEffect()` | 3D tilt (sem uso atual) |
| `setupEconomySimulator()` | Slider + calculo + Chart.js (usado na calculadora.html) |
| `setupContactForm()` | POST /api/contact, feedback visual no botao |
| `setupInteractiveMap()` | Global. Leaflet map com markers dos projetos |

---

## Carrossel (projects-carousel.js + projects-carousel.css)

- **CSS animation** `carouselScroll` move wrapper infinitamente
- JS clona todos os cards para criar loop seamless
- Hover: pausa animacao + mostra overlay com titulo/tags/CTA
- Click no card: abre modal (caminho secundario)
- Click no CTA "Ver estudo de caso": navega para projetos/<slug>.html (caminho nobre)
- Sem botoes prev/next, sem indicators, sem wheel scroll

---

## Formulario de Contato

- **Frontend**: POST para `/api/contact` com name/email/subject/message/website(honeypot)
- **Backend**: Cloudflare Pages Function `functions/api/contact.js`
  - Verifica honeypot, valida campos, envia para Telegram
  - CORS restrito a engdaniel.org
  - Env vars necessarias no Cloudflare Dashboard:
    - `TELEGRAM_BOT_TOKEN` = `8585147022:AAFszDd5BNO-arVnDJvlXg1VPFfFDwElrPs`
    - `TELEGRAM_CHAT_ID` = `6044772174`

---

## Social Links

- WhatsApp: https://wa.me/5592985528345
- Instagram: https://www.instagram.com/daniel.engdev/
- LinkedIn: https://www.linkedin.com/in/daniel-alves-pereira-8579b832b/
- GitHub: https://github.com/slashline15
- Email: daniel.alves66@hotmail.com
- Telefone: (92) 98552-8345

---

## Dependencias Externas

| Lib | Carregamento | Uso |
|-----|-------------|-----|
| Font Awesome 6 | Local (css/all.min.css) | Icones |
| Google Fonts | Preconnect no head | Tipografia |
| Leaflet 1.7.1 | Lazy (IntersectionObserver) | Mapa interativo |
| Chart.js | defer (calculadora.html) / nao carrega em index | Grafico simulador |

---

## Variaveis CSS (base.css / theme.css)

```
--primary-color: #FF6B35
--background-dark: #121212
--text-color / --text-dark / --text-light
--glass-background / --glass-background-dark
--glass-blur: blur(12px)
--border-radius / --spacing-xs/sm/md/lg/xl
--transition: all 0.3s ease
```

---

## Template de Pagina de Projeto (projetos/*.html)

Todos usam o mesmo template. Diferenca: `<title>` e `data-project-slug` no `<main>`.
Scripts: `../js/data/projects-data.js` + `../js/modules/project-detail.js`.
CSS: `../css/main.css`. Nav com links para `../index.html`, `../portfolio.html`.
Secoes: breadcrumb, cover, header, detail-grid (6 blocos), gallery, CTAs.

---

## Deploy

- Hospedagem: Cloudflare Pages
- CNAME: engdaniel.org
- Branch: main
- Functions: functions/api/contact.js (Cloudflare Pages Functions)
