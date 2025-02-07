import { createContext, ReactNode, useContext, useState } from 'react';

type SidebarProviderProps = {
  children: ReactNode;
};

type SidebarContextType = {
  isSidebarOpen: boolean;
  setSidebarOpen: () => void;
  setSidebarClose: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebarContext() {
  const value = useContext(SidebarContext);

  if (value == null) throw Error("Cannot use outside of SidebarProvider");

  return value;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function setSidebarOpen() {
    setIsSidebarOpen(true);
  }

  function setSidebarClose() {
    setIsSidebarOpen(false);
  }

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        setSidebarOpen,
        setSidebarClose,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
