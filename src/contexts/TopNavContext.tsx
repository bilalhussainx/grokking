"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface TopNavOverrides {
  courseTitle?: string;
  progress?: number;
  onToggleSidebar?: () => void;
}

interface TopNavContextType {
  overrides: TopNavOverrides;
  setOverrides: (overrides: TopNavOverrides) => void;
  clearOverrides: () => void;
}

const TopNavContext = createContext<TopNavContextType>({
  overrides: {},
  setOverrides: () => {},
  clearOverrides: () => {},
});

export function TopNavProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverridesState] = useState<TopNavOverrides>({});

  const setOverrides = useCallback((o: TopNavOverrides) => {
    setOverridesState(o);
  }, []);

  const clearOverrides = useCallback(() => {
    setOverridesState({});
  }, []);

  return (
    <TopNavContext.Provider value={{ overrides, setOverrides, clearOverrides }}>
      {children}
    </TopNavContext.Provider>
  );
}

export function useTopNav() {
  return useContext(TopNavContext);
}
