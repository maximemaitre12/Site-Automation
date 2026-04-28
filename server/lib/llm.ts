import axios from 'axios'
import https from 'https'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_KEY = process.env.OPENAI_KEY
const MODEL = 'gpt-4o-mini'

// Some corporate networks intercept TLS — accept the chain
const httpsAgent = new https.Agent({ rejectUnauthorized: false })

export interface LLMOptions {
  jsonMode?: boolean       // forces response_format: json_object
  maxTokens?: number       // optional output cap
  temperature?: number
  timeoutMs?: number
}

export async function callLLM(prompt: string, opts: LLMOptions = {}): Promise<string> {
  if (!OPENAI_KEY) throw new Error('OPENAI_KEY not configured')

  const body: Record<string, unknown> = {
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: opts.temperature ?? 0.4,
  }
  if (opts.jsonMode) body.response_format = { type: 'json_object' }
  if (opts.maxTokens) body.max_tokens = opts.maxTokens

  const { data } = await axios.post(OPENAI_URL, body, {
    headers: { Authorization: `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
    timeout: opts.timeoutMs ?? 30000,
    httpsAgent,
  })

  return (data?.choices?.[0]?.message?.content ?? '') as string
}
