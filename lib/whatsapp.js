/**
 * lib/whatsapp.js
 * ---------------------------------------------------------------------------
 * Everything related to building "wa.me" deep links is centralised here so
 * both the floating chat widget AND the post-checkout order handoff use the
 * exact same logic.
 *
 * HOW wa.me LINKS WORK
 * `https://wa.me/<number>?text=<url-encoded message>` opens WhatsApp (the
 * app on mobile, WhatsApp Web on desktop) with a chat to <number> already
 * open and the message box pre-filled with your text. Nothing is actually
 * sent until the user taps the WhatsApp "send" button themselves — which is
 * exactly the behaviour you asked for (no server needed, the customer sends
 * the final message with one tap).
 *
 * The vendor's WhatsApp number is read from an environment variable so you
 * can change it without touching code. See .env.local.example.
 */

/** The store's WhatsApp business number, international format, no "+". */
export const VENDOR_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000';

/**
 * Build a wa.me link for an arbitrary phone number + message.
 * @param {string} phoneNumber - international format, digits only, no "+".
 * @param {string} message - plain text message to pre-fill.
 */
export function buildWhatsAppUrl(phoneNumber, message) {
  const digitsOnly = String(phoneNumber).replace(/\D/g, '');
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

/**
 * Build the wa.me link used by the floating chat widget: sends whatever the
 * shopper typed straight to the vendor's WhatsApp.
 */
export function buildChatWhatsAppUrl(message) {
  const trimmed = message?.trim() || "Hi Pak Essentials! I'd like to ask about a product.";
  return buildWhatsAppUrl(VENDOR_WHATSAPP_NUMBER, trimmed);
}

/**
 * Build the wa.me link used right after a successful Paystack payment.
 * This message summarises the order (items, quantities, total) plus the
 * Paystack receipt URL, so the vendor has everything needed to fulfil the
 * order the moment the customer hits "send" in WhatsApp.
 *
 * @param {Object} order
 * @param {Array}  order.items - cart lines [{ name, qty, price, size }]
 * @param {number} order.total - order total in Naira
 * @param {string} order.reference - Paystack transaction reference
 * @param {string} [order.receiptUrl] - Paystack-hosted receipt URL, if available
 * @param {Object} [order.customer] - { name, phone, address }
 */
export function buildOrderWhatsAppUrl(order) {
  const lines = [];
  lines.push('Hello Pak Essentials! I just completed payment for the order below:');
  lines.push('');

  order.items.forEach((item) => {
    lines.push(`• ${item.name}${item.size ? ` (${item.size})` : ''} — Qty ${item.qty} — ₦${(item.price * item.qty).toLocaleString('en-NG')}`);
  });

  lines.push('');
  lines.push(`Total paid: ₦${order.total.toLocaleString('en-NG')}`);
  lines.push(`Payment reference: ${order.reference}`);

  if (order.receiptUrl) {
    lines.push(`Receipt: ${order.receiptUrl}`);
  }

  if (order.customer?.name || order.customer?.phone || order.customer?.address) {
    lines.push('');
    lines.push('Delivery details:');
    if (order.customer.name) lines.push(`Name: ${order.customer.name}`);
    if (order.customer.phone) lines.push(`Phone: ${order.customer.phone}`);
    if (order.customer.address) lines.push(`Address: ${order.customer.address}`);
  }

  lines.push('');
  lines.push('Please confirm and let me know delivery fee and timing. Thank you!');

  return buildWhatsAppUrl(VENDOR_WHATSAPP_NUMBER, lines.join('\n'));
}
