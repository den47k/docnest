import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type SidebarProviderProps = {
  children: ReactNode;
};

type SidebarContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const value = useContext(SidebarContext);

  if (value == null) throw Error("Cannot use outside of SidebarProvider");

  return value;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, [setIsSidebarOpen]);

  const contextValue = useMemo<SidebarContextType>(
    () => ({
      isSidebarOpen,
      toggleSidebar,
    }),
    [isSidebarOpen, toggleSidebar]
  );

  return (
    <SidebarContext.Provider
      value={contextValue}
    >
      {children}
    </SidebarContext.Provider>
  );
}
