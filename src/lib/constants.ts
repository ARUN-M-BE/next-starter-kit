export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 5;
export const MAX_OTP_ATTEMPTS = 3;
export const SESSION_EXPIRY_HOURS = 24;

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard", protected: true },
  { label: "Music Hub", href: "/dashboard/music", protected: true },
  { label: "Maps Integration", href: "/maps", protected: true },
  { label: "Contact Us", href: "/contact", protected: true },
];

export const FOOTER_LINKS = {
  about: [
    { label: "Company", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Status", href: "#" },
  ],
};
