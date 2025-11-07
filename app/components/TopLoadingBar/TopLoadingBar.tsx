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
};

export const TopLoadingBar = ({
  topOffset = 60,
  height = 2,
}: Props) => {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);

  const rafRef = useRef<number | null>(null);
  const prevPath = useRef<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const clearTimeoutRef = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const start = () => {
    if (active) return;
    setTimeout(() => {
      setActive(true);
      setWidth(0);
    }, 0);
  };

  const done = () => {
    if (!active) return;
    clearRaf();
    clearTimeoutRef();
    setWidth(100);

    setTimeout(() => {
      setActive(false);
      setWidth(0);
    }, 150);
  };

  const willPathChange = (u: URL) => {
    const sameOrigin = u.origin === location.origin;
    const differentPathOrQuery =
      u.pathname !== location.pathname || u.search !== location.search;
    return sameOrigin && differentPathOrQuery;
  };

  const handleClick = (e: MouseEvent) => {
    const isLeftClick = e.button === 0;
    const hasModifier =
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented;

    if (!isLeftClick || hasModifier) {
      return;
    }

    const anchor = (e.target as HTMLElement)?.closest("a");
    if (!anchor) {
      return;
    }

    const href = anchor.getAttribute("href");
    if (!href) {
      return;
    }

    const url = new URL(href, location.href);

    if (!willPathChange(url)) {
      return;
    }

    start();
  };

  const handlePopState = () => start();

  useEffect(() => {
    // Helper to safely wrap pushState/replaceState
    const wrap = (key: "pushState" | "replaceState") => {
      const original = history[key].bind(history);

      return (...args: string[]) => {
        try {
          const urlArg = args[2];
          const nextUrl = new URL(urlArg, location.href);

          if (willPathChange(nextUrl)) {
            start();
          }
        } catch {
          // ignore invalid URL
        }

        return original(...(args as Parameters<History["pushState"]>));
      };
    };

    // Save originals with bound context to avoid unbound method lint errors
    const origPush = history.pushState.bind(history);
    const origReplace = history.replaceState.bind(history);

    history.pushState = wrap("pushState");
    history.replaceState = wrap("replaceState");

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);

      // Restore originals
      history.pushState = origPush;
      history.replaceState = origReplace;

      clearRaf();
      clearTimeoutRef();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // progress animation
  useEffect(() => {
    if (!active) {
      return;
    }

    const tick = () => {
      setWidth((w) => {
        const next = w < 80 ? w + 8 : w + Math.max(1, (100 - w) * 0.02);
        return Math.min(next, 92);
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Failsafe: auto-finish after 1.5s if no path change happened
    timeoutRef.current = setTimeout(done, 1500);

    return () => {
      clearRaf();
      clearTimeoutRef();
    };
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // finish when path actually changes
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

  return <Box aria-hidden style={barStyle} className="top-loading-bar" />;
};
