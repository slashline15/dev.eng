// Cloudflare Pages Function - POST /api/contact
// Env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = ['https://engdaniel.org', 'https://www.engdaniel.org'];
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const corsHeaders = {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const body = await request.json();
        const { name, email, subject, message, website } = body;

        // Honeypot check - reject silently if filled
        if (website) {
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return new Response(JSON.stringify({ error: 'Todos os campos são obrigatórios.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({ error: 'Formato de email inválido.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }

        // Send to Telegram
        const telegramText = `📩 *Nova mensagem do site*\n\n` +
            `*Nome:* ${name}\n` +
            `*Email:* ${email}\n` +
            `*Assunto:* ${subject}\n\n` +
            `*Mensagem:*\n${message}`;

        const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
        const telegramRes = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: env.TELEGRAM_CHAT_ID,
                text: telegramText,
                parse_mode: 'Markdown',
            }),
        });

        if (!telegramRes.ok) {
            return new Response(JSON.stringify({ error: 'Erro ao enviar mensagem. Tente novamente.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Erro interno do servidor.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
}

// Handle CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': 'https://engdaniel.org',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
}
