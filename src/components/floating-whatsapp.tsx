"use client";

import Link from 'next/link';

// WhatsApp SVG Icon Component
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <path
            d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.546-.577-1.448-.577-1.448s-.577-.6-1.155-.6c-.577 0-1.155.6-1.155.6l-.27.27s-.577.6-1.155 1.155c-.577.577-.945 1.155-.945 1.155s-.402 1.39-.402 2.325c0 .934.402 1.868.402 1.868s.484 1.567 1.254 2.34c.77.77 1.76 1.48 2.92 2.036.77.373 1.62.6 2.403.6.577 0 1.155-.15 1.155-.15s.484-.15.945-.6c.46-.45.945-.945.945-.945s.27-.27.577-.577c.305-.305.577-.6.577-.6s.402-.484.402-1.063c0-.577-.402-1.155-.402-1.155s0-.577-.372-.577z"
            fill="#ffffff"
        />
        <path
            d="M20.57 4.437A12.54 12.54 0 0 0 16 2C7.163 2 2 7.163 2 16s5.163 14 14 14c4.463 0 8.528-2.093 11.272-5.405A12.54 12.54 0 0 0 20.57 4.437zM16 28.5c-6.903 0-12.5-5.598-12.5-12.5S9.097 3.5 16 3.5c6.903 0 12.5 5.598 12.5 12.5s-5.597 12.5-12.5 12.5z"
            fill="#ffffff"
        />
    </svg>
);


export default function FloatingWhatsApp() {
  const whatsAppUrl = `https://wa.me/918299809562?text=${encodeURIComponent("Hello! I'm interested in the courses at MTech IT Institute.")}`;

  return (
    <Link
      href={whatsAppUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </Link>
  );
}
