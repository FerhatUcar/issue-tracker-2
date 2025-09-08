"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Box } from "@radix-ui/themes";

type Props = {
  /**
   * Offset from the top of the page in pixels.
   */
  topOffset?: number;

  /**
   * Height of the loading bar in pixels.
   */
  height?: number;

  /**
   * Additional CSS classes to apply to the loading bar.
   */
  className?: string;
};

export const TopLoadingBar = ({
  topOffset = 60,
  height = 2,
  className,
}: Props) => {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);

  const rafRef = useRef<number | null>(null);
  const prevPath = useRef<string | null>(null);

  const clearRaf = () => {
    if (rafRef.current === null) {
      return;
    }

    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const start = () => {
    if (active) {
      return;
    }

    setTimeout(() => {
      setActive(true);
      setWidth(0);
    }, 0);
  };

  const done = () => {
    if (!active) {
      return;
    }

    clearRaf();

    setWidth(100);

    setTimeout(() => {
      setActive(false);
      setWidth(0);
    }, 150);
  };

  const willPathChange = (u: URL) => {
    const sameOrigin = u.origin === location.origin;
    const differentPath = u.pathname !== location.pathname;

    return sameOrigin && differentPath;
  };

  const handleClick = (e: MouseEvent) => {
    const isLeftClick = e.button === 0;
    const hasModifier =
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented;

    if (!isLeftClick || hasModifier) {
      return;
    }

    const anchor = (e.target as HTMLElement)?.closest("a");
    if (anchor === null) {
      return;
    }

    const href = anchor.getAttribute("href");
    if (href === null) {
      return;
    }

    const url = new URL(href, location.href);
    if (!willPathChange(url)) {
      return;
    }

    start();
  };

  const handlePopState = () => {
    start();
  };

  useEffect(() => {
    const wrap = <K extends "pushState" | "replaceState">(key: K) => {
      const orig = history[key];
      return function (
        this: History,
        ...args: Parameters<(typeof history)[K]>
      ) {
        try {
          const urlArg = (args as unknown as [unknown, string, string?])[2];

          if (urlArg !== undefined && urlArg !== null) {
            const nextUrl = new URL(urlArg, location.href);

            if (willPathChange(nextUrl)) {
              start();
            }
          }
        } catch {
          // ignore invalid URL
        }
        return orig.apply(this, args);
      } as (typeof history)[K];
    };

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const origPush = history.pushState;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const origReplace = history.replaceState;

    history.pushState = wrap("pushState");
    history.replaceState = wrap("replaceState");

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
      history.pushState = origPush;
      history.replaceState = origReplace;
      clearRaf();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!active) return;

    const tick = () => {
      setWidth((w) => {
        const next = w < 80 ? w + 8 : w + Math.max(1, (100 - w) * 0.02);
        return Math.min(next, 92);
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => clearRaf();
  }, [active]);

  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    done();
    prevPath.current = pathname;
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const barStyle: CSSProperties = {
    top: topOffset,
    height,
    transform: `scaleX(${active ? width / 100 : 0})`,
    transitionDuration: active ? "50ms" : "200ms",
  };

  const barClass = `
    fixed left-0 right-0 
    origin-left 
    [transition-property:transform] 
    z-[60] 
    rounded-full 
    shadow-[0_0_8px_rgba(56,189,248,0.6)] 
    pointer-events-none 
    bg-gradient-to-r from-sky-400/90 to-sky-400/50
    ${className ?? ""}
  `;

  return <Box aria-hidden style={barStyle} className={barClass} />;
};
