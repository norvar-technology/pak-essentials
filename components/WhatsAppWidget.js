'use client';

/**
 * components/WhatsAppWidget.js
 * ---------------------------------------------------------------------------
 * The floating WhatsApp button required by the brief. Behaviour:
 *   1. A round green WhatsApp button floats bottom-right on every page.
 *   2. Clicking it opens a small popup styled like a WhatsApp chat bubble
 *      (green header, "typing to" vendor name, a text box).
 *   3. The user types their question and taps the paper-plane / "Chat on
 *      WhatsApp" button.
 *   4. We build a wa.me link (see lib/whatsapp.js) with their message
 *      pre-filled and open it in a new tab — WhatsApp then opens with the
 *      vendor's chat thread already open and the text already typed in,
 *      exactly as requested. Nothing is sent until the user presses
 *      WhatsApp's own send button.
 *
 * No message ever touches a server here — this is 100% client-side.
 */

import { useState } from 'react';
import { buildChatWhatsAppUrl } from '@/lib/whatsapp';

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  function handleSend() {
    const url = buildChatWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
    setMessage('');
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {/* Popup chat card */}
      {open && (
        <div className="w-[300px] rounded-2xl overflow-hidden shadow-card bg-white animate-fadeUp">
          {/* WhatsApp-style header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <WhatsAppIcon color="#fff" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">Pak Essentials</p>
              <p className="text-[11px] text-white/75 leading-tight">Typically replies within minutes</p>
            </div>
            <button aria-label="Close chat" onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Chat body - WhatsApp wallpaper-style background */}
          <div className="bg-[#ECE5DD] px-3 py-4">
            <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 text-[13px] text-ink/80 max-w-[85%] shadow-sm">
              👋 Hi there! Ask us about a product, an order, or delivery — we usually reply within minutes.
            </div>
          </div>

          {/* Composer */}
          <div className="p-3 bg-white flex items-center gap-2 border-t border-black/5">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && message.trim() && handleSend()}
              placeholder="Type a message"
              className="flex-1 bg-[#F0F0F0] rounded-full px-4 py-2 text-sm outline-none"
            />
            <button
              aria-label="Send to WhatsApp"
              disabled={!message.trim()}
              onClick={handleSend}
              className="w-9 h-9 rounded-full bg-[#25D366] disabled:opacity-40 flex items-center justify-center shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M3 20l18-8L3 4v6l12 2-12 2v6z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating round trigger button */}
      <button
        aria-label={open ? 'Close WhatsApp chat' : 'Chat with us on WhatsApp'}
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-[#25D366] shadow-card flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <WhatsAppIcon color="white" size={28} />
        )}
      </button>
    </div>
  );
}

function WhatsAppIcon({ size = 24, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.47 1.29 4.93L2 22l5.29-1.38a9.86 9.86 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.79 14.03c-.24.68-1.19 1.25-1.95 1.41-.52.11-1.2.2-3.48-.75-2.92-1.21-4.8-4.17-4.95-4.36-.14-.19-1.19-1.58-1.19-3.02 0-1.43.75-2.13 1.02-2.42.24-.27.52-.34.7-.34.17 0 .35 0 .5.01.16.01.38-.06.59.45.24.58.81 2.01.88 2.16.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.7-.81.89-1.09.19-.28.38-.23.63-.14.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}
