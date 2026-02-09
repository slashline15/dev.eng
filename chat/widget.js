/**
 * Chat Widget - engdaniel.org
 *
 * Usage:
 *   <script src="/chat/widget.js" data-api="https://api.engdaniel.org" data-title="Daniel AI Assistant"></script>
 *
 * Options (data-* attributes on the script tag):
 *   data-api    - Backend URL (default: https://api.engdaniel.org)
 *   data-title  - Chat window title (default: Daniel AI Assistant)
 *   data-client - X-Client header value (optional soft-secret)
 */
(function () {
  "use strict";

  // ── Config ────────────────────────────────────────────────────────

  var SCRIPT = document.currentScript;
  var API_BASE = (SCRIPT && SCRIPT.getAttribute("data-api")) || "https://api.engdaniel.org";
  var TITLE = (SCRIPT && SCRIPT.getAttribute("data-title")) || "Daniel AI Assistant";
  var CLIENT_HEADER = (SCRIPT && SCRIPT.getAttribute("data-client")) || "";
  var STORAGE_KEY = "engdaniel_chat";
  var MAX_HISTORY = 12;

  // ── State ─────────────────────────────────────────────────────────

  var state = loadState();
  var isOpen = false;
  var isLoading = false;

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        return {
          sessionId: s.sessionId || genId(),
          history: Array.isArray(s.history) ? s.history.slice(-MAX_HISTORY) : [],
          mode: s.mode || null,
        };
      }
    } catch (e) { /* ignore */ }
    return { sessionId: genId(), history: [], mode: null };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        sessionId: state.sessionId,
        history: state.history.slice(-MAX_HISTORY),
        mode: state.mode,
      }));
    } catch (e) { /* ignore */ }
  }

  function genId() {
    return "xxxxxxxx-xxxx-4xxx".replace(/x/g, function () {
      return (Math.random() * 16 | 0).toString(16);
    });
  }

  // ── Modes ─────────────────────────────────────────────────────────

  var MODES = [
    { id: "orcamento", label: "Orcamento", icon: "\uD83D\uDCCB" },
    { id: "duvida_tecnica", label: "Duvida tecnica", icon: "\u2753" },
    { id: "problema_site", label: "Problema no site", icon: "\uD83D\uDC1B" },
    { id: "servicos", label: "Servicos", icon: "\uD83D\uDD27" },
    { id: "whatsapp", label: "WhatsApp", icon: "\uD83D\uDCAC" },
    { id: "email", label: "Email", icon: "\u2709\uFE0F" },
  ];

  // ── CSS (inline) ──────────────────────────────────────────────────

  var CSS = [
    "#dchat-trigger{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:#2563eb;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(37,99,235,.4);z-index:99999;display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s}",
    "#dchat-trigger:hover{transform:scale(1.08);box-shadow:0 6px 20px rgba(37,99,235,.5)}",
    "#dchat-trigger svg{width:26px;height:26px;fill:#fff}",
    "#dchat-panel{position:fixed;bottom:92px;right:24px;width:380px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.18);z-index:99999;display:none;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif}",
    "#dchat-panel.open{display:flex}",
    "#dchat-panel *{box-sizing:border-box}",
    ".dchat-header{background:#2563eb;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}",
    ".dchat-header h3{margin:0;font-size:15px;font-weight:600}",
    ".dchat-close{background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:0 4px;opacity:.8;line-height:1}",
    ".dchat-close:hover{opacity:1}",
    ".dchat-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f8f9fb}",
    ".dchat-welcome{background:#eef2ff;border-radius:12px;padding:14px;font-size:13px;color:#333;line-height:1.5}",
    ".dchat-modes{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}",
    ".dchat-mode-btn{background:#fff;border:1px solid #e0e5ec;border-radius:10px;padding:10px 8px;cursor:pointer;font-size:12px;font-weight:500;color:#333;text-align:center;transition:border-color .15s,background .15s;line-height:1.3}",
    ".dchat-mode-btn:hover{border-color:#2563eb;background:#f0f4ff}",
    ".dchat-mode-btn.active{border-color:#2563eb;background:#eef2ff;color:#2563eb}",
    ".dchat-msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5;word-wrap:break-word;white-space:pre-wrap}",
    ".dchat-msg.user{background:#2563eb;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}",
    ".dchat-msg.assistant{background:#fff;color:#1a1a1a;align-self:flex-start;border-bottom-left-radius:4px;border:1px solid #e8e8e8}",
    ".dchat-msg.error{background:#fef2f2;color:#991b1b;align-self:center;border:1px solid #fecaca;text-align:center;font-size:12px;max-width:95%}",
    ".dchat-typing{align-self:flex-start;background:#fff;border:1px solid #e8e8e8;border-radius:14px;padding:10px 18px;font-size:13px;color:#999;border-bottom-left-radius:4px}",
    ".dchat-footer{display:flex;gap:8px;padding:12px;border-top:1px solid #eee;background:#fff;flex-shrink:0}",
    ".dchat-input{flex:1;border:1px solid #ddd;border-radius:10px;padding:10px 14px;font-size:13px;outline:none;resize:none;font-family:inherit;min-height:40px;max-height:80px}",
    ".dchat-input:focus{border-color:#2563eb}",
    ".dchat-send{background:#2563eb;color:#fff;border:none;border-radius:10px;padding:0 16px;cursor:pointer;font-size:14px;font-weight:600;transition:background .15s;flex-shrink:0}",
    ".dchat-send:hover{background:#1d4ed8}",
    ".dchat-send:disabled{background:#93c5fd;cursor:not-allowed}",
    ".dchat-reset{background:none;border:none;color:#999;font-size:11px;cursor:pointer;padding:4px 8px;margin-top:2px;align-self:center}",
    ".dchat-reset:hover{color:#666}",
    "@media(max-width:480px){#dchat-panel{bottom:0;right:0;width:100vw;max-width:100vw;height:100vh;max-height:100vh;border-radius:0}#dchat-trigger{bottom:16px;right:16px}}",
  ].join("\n");

  // ── Inject CSS ────────────────────────────────────────────────────

  var styleEl = document.createElement("style");
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // ── DOM ────────────────────────────────────────────────────────────

  // Check for existing root
  var attachRoot = document.getElementById("ai-chat-root");

  // Trigger button
  var trigger = document.createElement("button");
  trigger.id = "dchat-trigger";
  trigger.setAttribute("aria-label", "Abrir chat");
  trigger.innerHTML =
    '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>';

  // Panel
  var panel = document.createElement("div");
  panel.id = "dchat-panel";
  panel.innerHTML = [
    '<div class="dchat-header">',
    '  <h3>' + escHtml(TITLE) + "</h3>",
    '  <button class="dchat-close" aria-label="Fechar">&times;</button>',
    "</div>",
    '<div class="dchat-body" id="dchat-body"></div>',
    '<div class="dchat-footer">',
    '  <textarea class="dchat-input" id="dchat-input" placeholder="Digite sua mensagem..." rows="1"></textarea>',
    '  <button class="dchat-send" id="dchat-send">Enviar</button>',
    "</div>",
  ].join("\n");

  // Attach or append
  if (attachRoot) {
    attachRoot.appendChild(panel);
    // If attached, panel shows inline (no trigger button needed unless desired)
    trigger.style.display = "none";
    panel.classList.add("open");
    panel.style.position = "relative";
    panel.style.bottom = "auto";
    panel.style.right = "auto";
    panel.style.height = "520px";
    panel.style.boxShadow = "0 2px 12px rgba(0,0,0,.1)";
    isOpen = true;
  }
  document.body.appendChild(trigger);
  document.body.appendChild(panel);

  // Refs
  var body = document.getElementById("dchat-body");
  var input = document.getElementById("dchat-input");
  var sendBtn = document.getElementById("dchat-send");
  var closeBtn = panel.querySelector(".dchat-close");

  // ── Event Handlers ────────────────────────────────────────────────

  trigger.addEventListener("click", function () {
    isOpen = !isOpen;
    panel.classList.toggle("open", isOpen);
    if (isOpen) {
      renderChat();
      input.focus();
    }
  });

  closeBtn.addEventListener("click", function () {
    isOpen = false;
    panel.classList.remove("open");
  });

  sendBtn.addEventListener("click", function () {
    handleSend();
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Auto-resize textarea
  input.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 80) + "px";
  });

  // ── Render ────────────────────────────────────────────────────────

  function renderChat() {
    body.innerHTML = "";

    // Welcome
    if (state.history.length === 0) {
      var welcome = document.createElement("div");
      welcome.className = "dchat-welcome";
      welcome.innerHTML =
        "<strong>Ola! Sou o assistente virtual do Daniel.</strong><br>" +
        "Como posso ajudar? Escolha uma opcao abaixo ou digite sua mensagem:";
      body.appendChild(welcome);

      // Mode buttons
      var modesDiv = document.createElement("div");
      modesDiv.className = "dchat-modes";
      MODES.forEach(function (m) {
        var btn = document.createElement("button");
        btn.className = "dchat-mode-btn" + (state.mode === m.id ? " active" : "");
        btn.textContent = m.icon + " " + m.label;
        btn.addEventListener("click", function () {
          selectMode(m.id);
        });
        modesDiv.appendChild(btn);
      });
      body.appendChild(modesDiv);
    }

    // Messages
    state.history.forEach(function (msg) {
      var div = document.createElement("div");
      div.className = "dchat-msg " + msg.role;
      div.textContent = msg.content;
      body.appendChild(div);
    });

    scrollDown();
  }

  function addMessage(role, content) {
    var div = document.createElement("div");
    div.className = "dchat-msg " + role;
    div.textContent = content;
    body.appendChild(div);
    scrollDown();
    return div;
  }

  function showTyping() {
    var div = document.createElement("div");
    div.className = "dchat-typing";
    div.id = "dchat-typing";
    div.textContent = "Digitando...";
    body.appendChild(div);
    scrollDown();
    return div;
  }

  function removeTyping() {
    var el = document.getElementById("dchat-typing");
    if (el) el.remove();
  }

  function showError(msg) {
    var div = document.createElement("div");
    div.className = "dchat-msg error";
    div.innerHTML = escHtml(msg) +
      '<br><small>Tente pelo <a href="https://wa.me/5592985528345" target="_blank" style="color:#2563eb">WhatsApp</a> ou <a href="mailto:contato@engdaniel.org" style="color:#2563eb">email</a>.</small>';
    body.appendChild(div);
    scrollDown();
  }

  function scrollDown() {
    setTimeout(function () {
      body.scrollTop = body.scrollHeight;
    }, 50);
  }

  // ── Mode Selection ────────────────────────────────────────────────

  function selectMode(modeId) {
    state.mode = modeId;

    // For whatsapp/email, redirect immediately
    if (modeId === "whatsapp") {
      window.open("https://wa.me/5592985528345", "_blank");
      return;
    }
    if (modeId === "email") {
      window.open("mailto:contato@engdaniel.org", "_blank");
      return;
    }

    // Send first message based on mode
    var firstMsg = {
      orcamento: "Quero solicitar um orcamento.",
      duvida_tecnica: "Tenho uma duvida tecnica.",
      problema_site: "Estou com um problema no site.",
      servicos: "Quero saber sobre os servicos oferecidos.",
      contato: "Quero entrar em contato.",
    };

    var text = firstMsg[modeId] || "Ola!";
    doSend(text);
  }

  // ── Send Message ──────────────────────────────────────────────────

  function handleSend() {
    var text = input.value.trim();
    if (!text || isLoading) return;
    input.value = "";
    input.style.height = "auto";
    doSend(text);
  }

  function doSend(text) {
    if (isLoading) return;

    state.history.push({ role: "user", content: text });
    saveState();

    // Re-render if first message (to hide welcome/modes)
    if (state.history.length === 1) {
      renderChat();
    } else {
      addMessage("user", text);
    }

    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    apiCall(text, 1);
  }

  function apiCall(text, retriesLeft) {
    var headers = {
      "Content-Type": "application/json",
      "X-Session-Id": state.sessionId,
    };
    if (CLIENT_HEADER) {
      headers["X-Client"] = CLIENT_HEADER;
    }

    var payload = {
      message: text,
      history: state.history.slice(0, -1), // exclude last user msg (already in message)
      mode: state.mode || "geral",
    };

    fetch(API_BASE + "/chat", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }
        return res.json();
      })
      .then(function (data) {
        removeTyping();
        isLoading = false;
        sendBtn.disabled = false;

        var reply = data.reply || "Sem resposta.";
        state.history.push({ role: "assistant", content: reply });
        if (data.history) {
          state.history = data.history;
        }
        saveState();
        addMessage("assistant", reply);
      })
      .catch(function (err) {
        if (retriesLeft > 0) {
          setTimeout(function () {
            apiCall(text, retriesLeft - 1);
          }, 2000);
          return;
        }
        removeTyping();
        isLoading = false;
        sendBtn.disabled = false;
        showError("Nao foi possivel conectar ao assistente.");
      });
  }

  // ── Helpers ───────────────────────────────────────────────────────

  function escHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  // ── Init ──────────────────────────────────────────────────────────

  if (isOpen) {
    renderChat();
  }
})();
