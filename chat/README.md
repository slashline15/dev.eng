# Chat Widget - engdaniel.org

Widget de chat plugavel com backend Flask, persistencia em SQLite e envio de leads para Telegram.

## Estrutura

```
chat/
  app.py              # Backend Flask
  kb.json             # Base de conhecimento
  widget.js           # Widget frontend (auto-contido)
  widget.css          # CSS de referencia (injetado pelo JS)
  requirements.txt    # Dependencias Python
  .env.example        # Modelo de configuracao
  .gitignore          # Arquivos ignorados
  run_backend.ps1     # Script: iniciar backend
  run_tunnel.ps1      # Script: iniciar Cloudflare Tunnel
  run_all.ps1         # Script: backend + tunnel
  healthcheck.ps1     # Script: testar endpoints
  tests/
    smoke_test.py     # Testes automatizados
```

## Setup rapido

### 1. Pre-requisitos

- Python 3.12+
- PowerShell (Windows)
- `cloudflared` (para tunnel, opcional em dev)

### 2. Configurar .env

```powershell
cd chat
Copy-Item .env.example .env
# Edite .env com suas chaves:
notepad .env
```

Variaveis obrigatorias:
| Variavel | Descricao |
|---|---|
| `OPENAI_API_KEY` | Chave da API OpenAI |
| `OPENAI_MODEL` | Modelo (default: `gpt-4o-mini`) |

Variaveis opcionais:
| Variavel | Descricao |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Token do bot Telegram (para receber leads) |
| `TELEGRAM_CHAT_ID` | Chat ID do Telegram |
| `CLIENT_HEADER_VALUE` | Soft-secret para `X-Client` header (bloqueia uso externo) |
| `ADMIN_PASSWORD` | Senha do painel /admin (default: `admin`) |
| `PORT` | Porta do servidor (default: `8000`) |
| `FLASK_DEBUG` | Definir como `1` para modo debug (aceita localhost no CORS) |

### 3. Iniciar backend

```powershell
.\run_backend.ps1
```

Isso cria o venv, instala dependencias e inicia o servidor em `http://127.0.0.1:8000`.

### 4. Testar

```powershell
# PowerShell
.\healthcheck.ps1

# Ou com Python
.\.venv\Scripts\python.exe tests\smoke_test.py
```

### 5. Expor via Cloudflare Tunnel

```powershell
.\run_tunnel.ps1
```

Ou para backend + tunnel juntos:
```powershell
.\run_all.ps1
```

## Incluir no site (GitHub Pages)

Adicione no HTML da pagina (antes de `</body>`):

```html
<script src="/chat/widget.js" data-api="https://api.engdaniel.org" data-title="Daniel AI Assistant"></script>
```

Atributos disponiveis:
| Atributo | Descricao |
|---|---|
| `data-api` | URL do backend (default: `https://api.engdaniel.org`) |
| `data-title` | Titulo do chat (default: `Daniel AI Assistant`) |
| `data-client` | Valor do header `X-Client` (soft-secret, opcional) |

### Modo "attach"

Se existir um `<div id="ai-chat-root"></div>` na pagina, o widget renderiza dentro dele (inline) em vez de criar botao flutuante.

## Endpoints da API

| Metodo | Rota | Descricao |
|---|---|---|
| `GET` | `/health` | Healthcheck: `{"ok": true}` |
| `OPTIONS` | `/chat` | CORS preflight (sempre 204) |
| `POST` | `/chat` | Enviar mensagem |
| `GET` | `/admin?pw=SENHA` | Painel de metricas |
| `GET` | `/admin/export.csv?pw=SENHA` | Exportar mensagens em CSV |

### POST /chat

Request:
```json
{
  "message": "Quero um orcamento",
  "mode": "orcamento",
  "history": []
}
```

Headers:
- `Content-Type: application/json`
- `X-Session-Id: <uuid>` (gerado pelo widget)
- `X-Client: <soft-secret>` (opcional)

Response:
```json
{
  "reply": "...",
  "history": [...],
  "mode": "orcamento",
  "intent": "orcamento",
  "lat_ms": 1234
}
```

## Modos disponiveis

| Modo | Descricao |
|---|---|
| `orcamento` | Coleta dados para orcamento |
| `duvida_tecnica` | Responde duvidas tecnicas |
| `problema_site` | Reporta problemas no site |
| `servicos` | Lista servicos oferecidos |
| `contato` | Oferece canais de contato |
| `whatsapp` | Redireciona para WhatsApp |
| `email` | Redireciona para email |
| `geral` | Modo generico (default) |

## Configurar Cloudflare Tunnel (alto nivel)

1. Instale `cloudflared`: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
2. Autentique: `cloudflared tunnel login`
3. Crie o tunnel: `cloudflared tunnel create chat-api`
4. Configure DNS: no Cloudflare Dashboard, aponte `api.engdaniel.org` CNAME para `<tunnel-id>.cfargotunnel.com`
5. Crie `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: <tunnel-id>
   credentials-file: ~/.cloudflared/<tunnel-id>.json
   ingress:
     - hostname: api.engdaniel.org
       service: http://localhost:8000
     - service: http_status:404
   ```
6. Rode: `cloudflared tunnel run`

## Troubleshooting

### CORS 403 no OPTIONS (preflight bloqueado)

**Causa**: O header `X-Client` estava sendo verificado em requisicoes OPTIONS.
**Solucao**: Ja corrigido no `app.py` — o `enforce_limits` ignora requisicoes OPTIONS.

### Tunnel cai / desconecta

- Verifique conexao com a internet
- Confira se `cloudflared` esta atualizado
- Em caso de quick tunnel (temporario), a URL muda a cada restart — use tunnel nomeado para URL fixa
- Monitore com: `cloudflared tunnel info`

### OpenAI retorna 502/504

- Verifique se `OPENAI_API_KEY` esta correta no `.env`
- Verifique se o modelo (`OPENAI_MODEL`) e compativel com a Responses API (`gpt-4o-mini`, `gpt-4o`, etc.)
- Modelos antigos como `gpt-3.5-turbo` NAO funcionam com a Responses API — use Chat Completions ou troque o modelo

### Widget nao aparece

- Confira se o `<script>` esta com o caminho correto
- Verifique o console do navegador (F12) para erros
- Teste com `data-api="http://localhost:8000"` em dev

### Rate limit (429)

- Limite padrao: 30 requests/min por IP em `/chat`
- Em desenvolvimento, aumente em `app.py` se necessario

## Seguranca

- CORS allowlist: apenas `engdaniel.org` e `www.engdaniel.org`
- Payload limitado a 16KB
- Mensagens limitadas a 2000 caracteres
- Historico limitado a 12 itens
- Rate limit: 30/min por IP
- Sem stacktrace para o cliente em erros da OpenAI
- Admin protegido por senha
- Soft-secret `X-Client` opcional (nunca verificado em OPTIONS)
- `.env`, `chat.db` e credenciais no `.gitignore`
