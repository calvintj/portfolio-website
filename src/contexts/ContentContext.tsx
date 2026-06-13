"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { getDefaultContent } from "@/lib/content";
import type { Content, ContentContextValue } from "@/types/content";

export const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(getDefaultContent);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      if (data && typeof data === "object") setContent(data as Content);
    } catch {
      // keep default
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <ContentContext.Provider value={{ content, loading, refetch }}>
      {children}
    </ContentContext.Provider>
  );
}
