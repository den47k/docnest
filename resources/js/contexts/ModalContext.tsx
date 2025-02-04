import { useState, createContext, useContext } from "react";

type ModalContextType = {
  isCreateTeamOpen: boolean;
  openCreateTeam: () => void;
  closeCreateTeam: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  function openCreateTeam() {
    setIsCreateTeamOpen(true);
  }

  function closeCreateTeam() {
    setIsCreateTeamOpen(false);
  }

  return (
    <ModalContext.Provider value={{ isCreateTeamOpen, openCreateTeam, closeCreateTeam }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (context === undefined) throw new Error('useModal must be used within a ModalProvider');

  return context;
}
