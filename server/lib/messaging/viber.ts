import axios from 'axios'
import https from 'https'

const httpsAgent = new https.Agent({ rejectUnauthorized: false })
const TURBOSMS_URL = 'https://api.turbosms.ua/message/send.json'

export interface ViberCreds {
  token: string
  senderName: string  // ex: "Farmasoft"
}

export async function viberTest(c: ViberCreds): Promise<{ ok: boolean; error?: string }> {
  try {
    // TurboSMS doesn't expose a "ping" — just check token format and balance
    const { data } = await axios.get(
      'https://api.turbosms.ua/user/balance.json',
      { headers: { Authorization: `Bearer ${c.token}` }, timeout: 8000, httpsAgent },
    )
    if (data?.response_code === 0) return { ok: true }
    return { ok: false, error: data?.response_status || 'Token TurboSMS invalide' }
  } catch (err: unknown) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function viberSend(
  c: ViberCreds,
  toPhone: string,
  body: string,
  ctaUrl?: string,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const recipient = normalizeUaPhone(toPhone)
    const payload: Record<string, unknown> = {
      recipients: [recipient],
      viber: {
        sender: c.senderName,
        text: body,
        ttl: 3600,
        is_promotional: false,
      },
    }
    if (ctaUrl) {
      (payload.viber as Record<string, unknown>).button_caption = 'Prendre RDV'
      ;(payload.viber as Record<string, unknown>).button_action  = ctaUrl
    }

    const { data } = await axios.post(TURBOSMS_URL, payload, {
      headers: { Authorization: `Bearer ${c.token}`, 'Content-Type': 'application/json' },
      timeout: 12000, httpsAgent,
    })

    if (data?.response_code === 0) {
      const result = data?.response_result?.[0]
      if (result?.response_code === 0) return { ok: true, id: result.message_id }
      return { ok: false, error: result?.response_status || 'Échec envoi Viber' }
    }
    return { ok: false, error: data?.response_status || 'Échec envoi Viber' }
  } catch (err: unknown) {
    return { ok: false, error: (err as Error).message }
  }
}

function normalizeUaPhone(p: string): string {
  const digits = p.replace(/\D/g, '')
  if (digits.startsWith('380')) return digits
  if (digits.startsWith('0') && digits.length === 10) return '38' + digits
  return digits
}
