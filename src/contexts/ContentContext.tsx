"use client";

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Content, ContentContextValue } from "@/types/content";
import { getDefaultContent } from "@/lib/content";

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
