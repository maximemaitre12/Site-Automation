import axios from 'axios'
import https from 'https'

const httpsAgent = new https.Agent({ rejectUnauthorized: false })

export interface WhatsAppCreds {
  accountSid: string
  authToken: string
  fromNumber: string  // ex: +38050XXXXXXX
}

export async function whatsappTest(c: WhatsAppCreds): Promise<{ ok: boolean; error?: string; account?: string }> {
  try {
    const { data } = await axios.get(
      `https://api.twilio.com/2010-04-01/Accounts/${c.accountSid}.json`,
      { auth: { username: c.accountSid, password: c.authToken }, timeout: 10000, httpsAgent },
    )
    return { ok: true, account: data?.friendly_name }
  } catch (err: unknown) {
    const status = (err as { response?: { status: number; data?: { message?: string } } }).response?.status
    if (status === 401) return { ok: false, error: 'Account SID ou Auth Token invalide' }
    return { ok: false, error: (err as Error).message }
  }
}

export async function whatsappSend(
  c: WhatsAppCreds,
  toPhone: string,
  body: string,
): Promise<{ ok: boolean; sid?: string; error?: string }> {
  try {
    const params = new URLSearchParams({
      From: `whatsapp:${c.fromNumber}`,
      To:   `whatsapp:${normalizePhone(toPhone)}`,
      Body: body,
    })
    const { data } = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${c.accountSid}/Messages.json`,
      params.toString(),
      {
        auth: { username: c.accountSid, password: c.authToken },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000, httpsAgent,
      },
    )
    return { ok: true, sid: data?.sid }
  } catch (err: unknown) {
    const respData = (err as { response?: { data?: { message?: string; code?: number } } }).response?.data
    const msg = respData?.message || (err as Error).message
    return { ok: false, error: msg }
  }
}

function normalizePhone(p: string): string {
  const digits = p.replace(/\D/g, '')
  if (digits.startsWith('380')) return '+' + digits
  if (digits.startsWith('0') && digits.length === 10) return '+38' + digits
  if (!p.startsWith('+')) return '+' + digits
  return p
}
