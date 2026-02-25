"use client";

import { useContext } from "react";
import type { ContentContextValue } from "@/types/content";
import { getDefaultContent } from "@/lib/content";
import { ContentContext } from "@/contexts/ContentContext";

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
