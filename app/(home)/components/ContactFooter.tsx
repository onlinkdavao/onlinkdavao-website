import Image from "next/image";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com/onlink.dvo",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898V12h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
];

export default function ContactFooter() {
  return (
    <footer
      id="contact"
      style={{ backgroundColor: "#e2e8f0" }}
      className="px-6 py-16"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Image
              src="/assets/logo-dark.png"
              alt="Onlink Davao"
              width={140}
              height={47}
            />
            <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
              Connecting people to events and opportunities across Davao City.
            </p>
            <div className="flex gap-3 mt-1">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="transition-opacity hover:opacity-75"
                  style={{ color: "#64748b" }}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#4288C4" }}
            >
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Home", href: "/" },
                { label: "Events Calendar", href: "#calendar" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-opacity hover:opacity-75"
                    style={{ color: "#64748b" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#4288C4" }}
            >
              Get in Touch
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "#4288C4" }}
                >
                  <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898V12h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                <a
                  href="https://facebook.com/onlink.dvo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-opacity hover:opacity-75"
                  style={{ color: "#64748b" }}
                >
                  facebook.com/onlink.dvo
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "#4288C4" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm" style={{ color: "#64748b" }}>
                  Davao City, Philippines
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "#cbd5e1" }}
        >
          <p className="text-xs" style={{ color: "#94a3b8" }}>
            © {new Date().getFullYear()} Onlink Davao. All rights reserved.
          </p>
          <div className="flex gap-2 items-center">
            <span
              className="block w-2 h-2 rounded-full"
              style={{ backgroundColor: "#4288C4" }}
            />
            <span
              className="block w-2 h-2 rounded-full"
              style={{ backgroundColor: "#EF3D51" }}
            />
            <span
              className="block w-2 h-2 rounded-full"
              style={{ backgroundColor: "#FBAE0E" }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
