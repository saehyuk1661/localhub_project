// netlify/functions/chat.js
export const handler = async (event) => {
  console.log('chat function invoked', {
    method: event.httpMethod,
    bodyPresent: Boolean(event.body),
    contentType: event.headers?.['content-type'] || event.headers?.['Content-Type'] || null
  });

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not configured');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'OPENAI_API_KEY not configured in environment' })
    };
  }

  let body;
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    console.error('Invalid JSON body', err, 'raw:', event.body);
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' })
    };
  }

  let messages = body.messages;
  if (typeof messages === 'string') {
    try { messages = JSON.parse(messages); } catch (e) {}
  }

  if (!Array.isArray(messages)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'messages must be an array', receivedType: typeof messages })
    };
  }

  const model = body.model || 'gpt-5-mini';
  const temperature = body.temperature;
  const openaiPayload = { model, messages };

  // Map legacy max_tokens -> max_completion_tokens if present
  if (typeof body.max_completion_tokens === 'number') {
    openaiPayload.max_completion_tokens = body.max_completion_tokens;
  } else if (typeof body.max_tokens === 'number') {
    openaiPayload.max_completion_tokens = body.max_tokens;
  }

  if (typeof body.reasoning_effort === 'string') {
    openaiPayload.reasoning_effort = body.reasoning_effort;
  }

  // only add temperature if explicitly 1 (safe) OR leave for retry logic to remove if unsupported
  if (typeof temperature === 'number') openaiPayload.temperature = temperature;

  if (typeof body.top_p === 'number') openaiPayload.top_p = body.top_p;
  if (typeof body.frequency_penalty === 'number') openaiPayload.frequency_penalty = body.frequency_penalty;
  if (typeof body.presence_penalty === 'number') openaiPayload.presence_penalty = body.presence_penalty;

  // helper to POST to OpenAI
  const postToOpenAI = async (payload) => {
    return await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });
  };

  try {
    let resp = await postToOpenAI(openaiPayload);
    let text = await resp.text();
    console.log('OpenAI status', resp.status);

    if (!resp.ok) {
      // try to parse error
      let errBody;
      try { errBody = JSON.parse(text); } catch { errBody = { message: text }; }

      const code = errBody?.error?.code;
      const msg = errBody?.error?.message || '';

      // If unsupported parameter/value, attempt to remove offending params and retry once
      if (code === 'unsupported_parameter' || code === 'unsupported_value' || /Unsupported/.test(msg)) {
        // determine offending param names
        const offending = [];
        if (errBody?.error?.param) offending.push(errBody.error.param);
        // extract quoted tokens from message as fallback
        const matches = String(msg).match(/'([^']+)'/g) || [];
        matches.forEach((m) => {
          const clean = m.replace(/'/g, '');
          if (!offending.includes(clean)) offending.push(clean);
        });

        // build cleaned payload
        const cleaned = { ...openaiPayload };
        offending.forEach((p) => {
          if (p in cleaned) {
            delete cleaned[p];
          } else if (p === 'max_tokens' && 'max_completion_tokens' in cleaned) {
            // if server sent max_completion_tokens but error mentions max_tokens, ignore
          } else {
            // nothing
          }
        });

        console.log('Retrying without unsupported params:', offending, 'cleaned keys:', Object.keys(cleaned));

        // retry
        resp = await postToOpenAI(cleaned);
        text = await resp.text();
        console.log('Retry OpenAI status', resp.status);

        if (!resp.ok) {
          let finalErr;
          try { finalErr = JSON.parse(text); } catch { finalErr = text; }
          console.error('OpenAI final error after retry', finalErr);
          return {
            statusCode: resp.status,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: finalErr })
          };
        }

        const resultJson = JSON.parse(text);
        const assistantText = resultJson?.choices?.[0]?.message?.content ?? null;
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assistant: assistantText, raw: resultJson })
        };
      }

      // not an unsupported-parameter case -> forward error
      console.error('OpenAI error', errBody);
      return {
        statusCode: resp.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: errBody })
      };
    }

    // success first try
    const resultJson = JSON.parse(text);
    const assistantText = resultJson?.choices?.[0]?.message?.content?.trim() || null;
    if (!assistantText) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'OpenAI returned an empty response' })
      };
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistant: assistantText, raw: resultJson })
    };
  } catch (err) {
    console.error('Function error', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
