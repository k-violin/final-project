import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Logo } from "./Logo";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo />

        <div
          ref={navRef}
          className="hidden items-center gap-1 lg:flex"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null);
          }}
        >
          <nav aria-label="주 메뉴">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenMenu(item.label)}
                  onMouseLeave={() => item.children && setOpenMenu(null)}
                >
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={openMenu === item.label}
                        aria-haspopup="true"
                        onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                        className={cn(
                          "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-surface",
                          isActive(item.to) ? "text-primary" : "text-navy",
                        )}
                      >
                        {item.label}
                        <ChevronDown className="size-4" aria-hidden="true" />
                      </button>
                      {openMenu === item.label && (
                        <ul className="absolute left-0 top-full z-50 w-56 rounded-md border border-border bg-white py-2 shadow-lg">
                          {item.children.map((child) => (
                            <li key={child.to + child.label}>
                              <Link
                                to={child.to}
                                className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-surface hover:text-primary"
                              >
                                {child.label}
                                {child.sub && (
                                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                                    {child.sub}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.to}
                      aria-current={isActive(item.to) ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-surface",
                        isActive(item.to) ? "text-primary" : "text-navy",
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <Link
            to="/support/contact"
            className="ml-3 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            문의하기
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/support/contact"
            className="inline-flex items-center rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
          >
            문의하기
          </Link>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-md border border-border text-navy"
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="모바일 주 메뉴"
          className="border-t border-border bg-white lg:hidden"
        >
          <ul className="container-page py-2">
            {NAV.map((item) => (
              <li key={item.label} className="border-b border-border/60 last:border-0">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={mobileSub === item.label}
                      onClick={() => setMobileSub(mobileSub === item.label ? null : item.label)}
                      className="flex w-full items-center justify-between py-3 text-left text-base font-semibold text-navy"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
                          mobileSub === item.label && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {mobileSub === item.label && (
                      <ul className="pb-2">
                        {item.children.map((child) => (
                          <li key={child.to + child.label}>
                            <Link
                              to={child.to}
                              className="block py-2 pl-3 text-sm font-medium text-foreground"
                            >
                              {child.label}
                              {child.sub && (
                                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                                  {child.sub}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.to}
                    aria-current={isActive(item.to) ? "page" : undefined}
                    className="block py-3 text-base font-semibold text-navy"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
