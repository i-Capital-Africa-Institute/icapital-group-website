"use client";

import { useEffect, useRef, ReactNode } from "react";

type ScrollSpyWrapperProps = {
  sectionIds: string[];
  children: ReactNode;
};

/**
 * Syncs the URL hash to the visible section after scrolling settles.
 * Avoids history updates mid-scroll (a common cause of scroll stutter).
 */
function useScrollSpy(ids: string[]) {
  const activeIdRef = useRef<string | null>(null);
  const pendingIdRef = useRef<string | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ids.length) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const commitHash = (nextId: string | null) => {
      if (nextId === activeIdRef.current) return;
      activeIdRef.current = nextId;

      const nextUrl = nextId
        ? `${window.location.pathname}${window.location.search}#${nextId}`
        : `${window.location.pathname}${window.location.search}`;

      const full = `${window.location.origin}${nextUrl}`;
      if (window.location.href !== full) {
        window.history.replaceState(null, "", nextUrl);
      }
    };

    const scheduleCommit = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        commitHash(pendingIdRef.current);
      }, 180);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        pendingIdRef.current = visible[0]?.target.id ?? null;
        scheduleCommit();
      },
      {
        root: null,
        rootMargin: "-80px 0px -55% 0px",
        threshold: [0, 0.25],
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [ids]);
}

export default function ScrollSpyWrapper({
  sectionIds,
  children,
}: ScrollSpyWrapperProps) {
  useScrollSpy(sectionIds);
  return <>{children}</>;
}
