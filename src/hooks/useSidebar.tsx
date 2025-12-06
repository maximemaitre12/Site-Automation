import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const STORAGE_KEY = 'aether-sidebar-collapsed';

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarState() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarState must be used within a SidebarProvider');
  }
  return context;
}
