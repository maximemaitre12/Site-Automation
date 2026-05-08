import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRICES: Record<string, string> = {
  precommande: "price_1TTivoH0Zbdp95xiiItwYobN",
  livraison: "price_1TTivpH0Zbdp95xioHpG333B",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const { plan, email, full_name, address, city, postal_code, country } = await req.json();
    if (!plan || !PRICES[plan]) throw new Error("Invalid plan");
    if (!email) throw new Error("Email required");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    let customerId: string | undefined;
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const created = await stripe.customers.create({
        email,
        name: full_name,
        address: address
          ? {
              line1: address,
              city: city || undefined,
              postal_code: postal_code || undefined,
              country: country || "FR",
            }
          : undefined,
      });
      customerId = created.id;
    }

    const origin = req.headers.get("origin") || "https://aether-connect.com";

    // Best-effort: persist order
    try {
      const sb = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );
      await sb.from("bracelet_orders").insert({
        full_name,
        email: email.toLowerCase(),
        plan,
        payment_method: "sepa",
        status: "pending",
        metadata: {
          shipping_address: address,
          shipping_city: city,
          shipping_postal_code: postal_code,
          shipping_country: country,
        },
      });
    } catch (_) {}

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["sepa_debit"],
      line_items: [{ price: PRICES[plan], quantity: 1 }],
      mode: "payment",
      locale: "auto",
      billing_address_collection: "auto",
      success_url: `${origin}/bracelet?checkout=success&method=sepa`,
      cancel_url: `${origin}/bracelet?checkout=canceled`,
      payment_intent_data: {
        setup_future_usage: "off_session",
        description: `Oreon bracelet — ${plan}`,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[BRACELET-SEPA] ERROR:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
