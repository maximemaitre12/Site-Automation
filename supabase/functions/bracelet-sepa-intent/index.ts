import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRICES: Record<string, string> = {
  precommande: "price_1TUPFQ5wHr6rOHUC45jOQU41",
  livraison: "price_1TUuXl5wHr6rOHUC7cW9efjd",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const publishableKey = Deno.env.get("STRIPE_PUBLISHABLE_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!publishableKey) throw new Error("STRIPE_PUBLISHABLE_KEY is not set");

    const { plan, email, full_name, address, city, postal_code, country } = await req.json();
    if (!plan || !PRICES[plan]) throw new Error("Invalid plan");
    if (!email) throw new Error("Email required");
    if (!full_name) throw new Error("Full name required");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Resolve price -> amount
    const priceObj = await stripe.prices.retrieve(PRICES[plan]);
    if (!priceObj.unit_amount || !priceObj.currency) throw new Error("Invalid Stripe price");

    // Create / reuse customer
    let customerId: string;
    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
      await stripe.customers.update(customerId, {
        name: full_name,
        address: address ? { line1: address, city, postal_code, country: country || "FR" } : undefined,
      });
    } else {
      const created = await stripe.customers.create({
        email,
        name: full_name,
        address: address ? { line1: address, city, postal_code, country: country || "FR" } : undefined,
      });
      customerId = created.id;
    }

    // PaymentIntent SEPA
    const intent = await stripe.paymentIntents.create({
      amount: priceObj.unit_amount,
      currency: priceObj.currency,
      customer: customerId,
      payment_method_types: ["sepa_debit"],
      setup_future_usage: "off_session",
      description: `Oreon bracelet — ${plan}`,
      metadata: { plan, full_name, email, address: address || "", city: city || "", postal_code: postal_code || "", country: country || "" },
    });

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
        amount: priceObj.unit_amount / 100,
        payment_method: "sepa",
        status: "pending",
        metadata: {
          stripe_payment_intent: intent.id,
          stripe_customer: customerId,
          shipping_address: address,
          shipping_city: city,
          shipping_postal_code: postal_code,
          shipping_country: country,
        },
      });
    } catch (_) {}

    return new Response(
      JSON.stringify({
        client_secret: intent.client_secret,
        publishable_key: publishableKey,
        amount: priceObj.unit_amount,
        currency: priceObj.currency,
        payment_intent_id: intent.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[BRACELET-SEPA-INTENT] ERROR:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
