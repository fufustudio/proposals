"use client";

import { useEffect, useState } from "react";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem, PatternHref } from "@/components/types";
import { Container } from "@/components/ui/container";
import { MAIN_NAV, SITE_NAME, type SiteSettings } from "@/lib/site-defaults";
import styles from "./styles.module.css";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function normalizePathname(pathname: string) {
  return pathname === "/" ? pathname : pathname.replace(/\/$/, "");
}

function hrefPathname(href: PatternHref) {
  if (typeof href === "string") return href.split(/[?#]/)[0] || "/";
  return typeof href.pathname === "string" ? href.pathname : "";
}

function isActivePath(pathname: string, href: string) {
  return (
    Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`))
  );
}

export function Header({
  siteSettings,
  navItems = MAIN_NAV,
}: {
  siteSettings?: SiteSettings | null;
  navItems?: readonly NavItem[];
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuVisible ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuVisible]);

  useEffect(() => {
    if (menuOpen || !menuVisible) return;

    const timeout = window.setTimeout(() => {
      setMenuVisible(false);
    }, 320);

    return () => window.clearTimeout(timeout);
  }, [menuOpen, menuVisible]);

  const normalizedPathname = normalizePathname(pathname);
  const hasNavItems = navItems.length > 0;
  const openMobileMenu = () => {
    setMenuVisible(true);
    window.requestAnimationFrame(() => setMenuOpen(true));
  };
  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <header className={classNames(styles.root, styles.solidOverlay)}>
      <Container size="xl" className={styles.inner}>
        <Link href="/" className={styles.wordmark}>
          {siteSettings?.name ?? SITE_NAME}
        </Link>

        {hasNavItems ? (
          <>
            <nav aria-label="Primary navigation" className={styles.desktopNav}>
              {navItems.map((item) => {
                const href = hrefPathname(item.href);
                const active = isActivePath(normalizedPathname, href);

                return (
                  <Link
                    key={item.label}
                    href={item.href as LinkProps<string>["href"]}
                    aria-current={active ? "page" : undefined}
                    className={classNames(
                      styles.desktopLink,
                      active && styles.activeLink,
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              aria-label={menuVisible ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className={styles.menuButton}
              onClick={menuVisible ? closeMobileMenu : openMobileMenu}
            >
              {menuVisible ? "Close" : "Menu"}
            </button>
          </>
        ) : null}
      </Container>

      {hasNavItems && menuVisible ? (
        <div
          id="mobile-navigation"
          className={classNames(
            styles.panel,
            styles.solidOverlay,
            menuOpen ? styles.panelOpen : styles.panelClosing,
          )}
        >
          <Container size="xl" className={styles.mobileContainer}>
            <nav
              aria-label="Mobile primary navigation"
              className={styles.primaryNav}
            >
              {navItems.map((item) => {
                const href = hrefPathname(item.href);
                const active = isActivePath(normalizedPathname, href);

                return (
                  <Link
                    key={item.label}
                    href={item.href as LinkProps<string>["href"]}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMobileMenu}
                    className={classNames(
                      styles.item,
                      styles.primaryItem,
                      active && styles.activePrimaryDark,
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
