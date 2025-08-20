"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Box } from "@radix-ui/themes";

type Props = {
  topOffset?: number;
  height?: number;
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

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    setWidth(100);

    // let it sit briefly for a "ready" feeling, then remove
    setTimeout(() => {
      setActive(false);
      setWidth(0);
    }, 150);
  };

  useEffect(() => {
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

      // skip external links
      const url = new URL(a.href, location.href);

      if (url.origin !== location.origin) {
        return;
      }

      start();
    };

    const onPopState = () => start();

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const prevPath = useRef<string | null>(null);

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
