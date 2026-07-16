// netlify/functions/chat.mjs
// Netlify Functions (ESM) — POST /api/chat 로 들어온 요청을 OpenAI Chat Completions로 전달합니다.
// IMPORTANT: OPENAI_API_KEY는 process.env.OPENAI_API_KEY로 관리합니다 (VITE_ 접두사 금지).

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'OPENAI_API_KEY not configured in environment' }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const messages = body.messages;
    const model = body.model || 'gpt-5-mini';
    const max_tokens = body.max_tokens ?? 400;
    const temperature = body.temperature ?? 0.7;

    if (!Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'messages must be an array' }),
      };
    }

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature,
      }),
    });

    const resultText = await resp.text();
    // If non-OK, forward error body with status
    if (!resp.ok) {
      return {
        statusCode: resp.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: resultText }),
      };
    }

    const resultJson = JSON.parse(resultText);

    // Extract assistant message if available
    const assistantText = resultJson?.choices?.[0]?.message?.content ?? null;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistant: assistantText, raw: resultJson }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: String(err) }),
    };
  }
};