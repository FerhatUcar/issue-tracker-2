"use client";

import { useEffect, useRef, useState } from "react";
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
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const start = () => {
    if (active) {
      return;
    }

    setActive(true);
    setWidth(0);

    const tick = () => {
      setWidth((w) => {
        const next = w < 80 ? w + 8 : w + Math.max(1, (100 - w) * 0.02);
        return Math.min(next, 92);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
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

  // Only start the loader if the PATHNAME changes (ignore query string)
  const willPathChange = (u: URL) => {
    if (u.origin !== location.origin) {
      return false;
    }

    return u.pathname !== location.pathname;
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

          if (urlArg) {
            const nextUrl = new URL(urlArg, location.href);

            if (willPathChange(nextUrl)) {
              start();
            }
          }
        } catch {
          // Ignore invalid URL
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

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const a = (e.target as HTMLElement)?.closest("a");
      if (!a) {
        return;
      }

      const href = a.getAttribute("href");
      if (!href) {
        return;
      }

      const url = new URL(href, location.href);

      if (url.origin !== location.origin) {
        return;
      }

      if (!willPathChange(url)) {
        return;
      }

      start();
    };

    const onPopState = () => {
      start();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      history.pushState = origPush;
      history.replaceState = origReplace;
      clearRaf();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Complete loader only when the pathname changes
  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }

    done();
    prevPath.current = pathname;
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      aria-hidden
      style={{
        top: topOffset,
        height,
        transform: `scaleX(${active ? width / 100 : 0})`,
        transitionDuration: active ? "50ms" : "200ms",
      }}
      className={`
        fixed left-0 right-0 
        origin-left 
        [transition-property:transform] 
        z-[60] 
        rounded-full 
        shadow-[0_0_8px_rgba(56,189,248,0.6)] 
        pointer-events-none 
        bg-gradient-to-r from-sky-400/90 to-sky-400/50
        ${className ?? ""}
      `}
    />
  );
};
