/**
 * app/api/verify-payment/route.js
 * ---------------------------------------------------------------------------
 * THIS is the one server-side piece of an otherwise frontend-only site —
 * exactly the "Vercel function script" the brief asked for. When you deploy
 * this Next.js app to Vercel, this file automatically becomes a serverless
 * function at:
 *     GET /api/verify-payment?reference=<paystack_reference>
 *
 * WHY THIS NEEDS TO BE SERVER-SIDE (AND CAN'T BE DONE IN THE BROWSER)
 * Verifying a transaction requires your Paystack SECRET key, which must
 * NEVER be shipped to the browser (anyone could read it from the page
 * source and use it to query your Paystack account). This route reads
 * `PAYSTACK_SECRET_KEY` from server-only environment variables, calls
 * Paystack's own verify endpoint, and only returns the browser a simple
 * { success, amount, reference } summary — the secret key itself never
 * leaves the server.
 *
 * This is also the security-critical step: the Paystack Inline popup's
 * client-side "success" callback can't be fully trusted on its own (a
 * modified script or a fake network response could fake it), so we always
 * re-confirm with Paystack's server before telling the customer their
 * order succeeded.
 */

import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ success: false, message: 'Missing transaction reference.' }, { status: 400 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    // This means PAYSTACK_SECRET_KEY hasn't been set in your environment
    // variables yet (see .env.local.example) — a configuration error, not
    // a payment error, so we surface it clearly rather than a vague 500.
    console.error('PAYSTACK_SECRET_KEY is not set in the environment.');
    return NextResponse.json(
      { success: false, message: 'Payment verification is not configured on the server yet.' },
      { status: 500 }
    );
  }

  try {
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
        // Never cache a payment verification result.
        cache: 'no-store',
      }
    );

    const payload = await paystackRes.json();
    const txn = payload?.data;

    if (!paystackRes.ok || !txn || txn.status !== 'success') {
      return NextResponse.json(
        { success: false, message: payload?.message || 'Payment was not successful.' },
        { status: 400 }
      );
    }

    // Everything checks out — return the minimum the frontend needs.
    // `amount` is in kobo (Paystack's unit), matching what checkout sent.
    return NextResponse.json({
      success: true,
      reference: txn.reference,
      amount: txn.amount,
      currency: txn.currency,
      paidAt: txn.paid_at,
      customerEmail: txn.customer?.email,
      // Paystack doesn't return a universal public receipt URL from the
      // verify endpoint. If you want to hand the customer a clickable
      // receipt link, the most reliable option is generating your own
      // simple receipt page/route in this app keyed by `reference`, or
      // checking the latest Paystack API docs for `receipt_number` /
      // hosted-receipt support on your account plan.
      receiptUrl: null,
    });
  } catch (err) {
    console.error('Error verifying Paystack transaction:', err);
    return NextResponse.json(
      { success: false, message: 'Could not reach Paystack to verify this payment. Please try again.' },
      { status: 502 }
    );
  }
}
