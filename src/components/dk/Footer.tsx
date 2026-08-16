import { scrollToId } from "./primitives";

const EMAIL = "danielkimdesignco@gmail.com";
const links = [
  { label: "Work", id: "work" },
  { label: "Pricing", id: "pricing" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

export default function Footer() {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex min-h-11 items-center text-[15px] underline-offset-4 hover:underline"
          >
            {EMAIL}
          </a>
          <span className="wordmark text-[15px]">DK Studio</span>
          <span className="text-[13px] opacity-70">© 2026 DK Studio</span>
        </div>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-8 sm:justify-start">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(l.id);
                }}
                className="inline-flex min-h-11 items-center rounded-md px-1 text-[14px] opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
