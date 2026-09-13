import { MessageCircleMore } from "lucide-react";

type Props = {
  whatsappNumber: string;
};

export function WhatsAppFloat({ whatsappNumber }: Props) {
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Moonext Constructions, I would like to discuss a project.")}`;

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Moonext Constructions on WhatsApp"
      className="print-hidden fixed bottom-5 right-4 z-50 inline-flex min-h-14 items-center gap-3 rounded-full border border-white/20 bg-[linear-gradient(135deg,#25D366_0%,#1fae56_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_24px_55px_rgba(37,211,102,0.32)] transition hover:scale-[1.02] hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#25D366]/60 sm:bottom-6 sm:right-6"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/18">
        <MessageCircleMore size={20} />
      </span>
      <span className="hidden sm:inline">WhatsApp Us</span>
      <span className="sm:hidden">Chat</span>
    </a>
  );
}
