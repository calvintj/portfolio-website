"use client";

import { useContext } from "react";
import { ContentContext } from "@/contexts/ContentContext";
import { getDefaultContent } from "@/lib/content";
import type { ContentContextValue } from "@/types/content";

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    return {
      content: getDefaultContent(),
      loading: false,
      refetch: async () => {},
    };
  }
  return ctx;
}
