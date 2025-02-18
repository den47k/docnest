import { useState, createContext, useContext } from "react";

type ModalContextType = {
  openModal: (name: string) => void;
  closeModal: (name: string) => void;
  isOpen: (name: string) => boolean;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<Record<string, boolean>>({});

  function openModal(name: string) {
    setModals((prev) => ({ ...prev, [name]: true }));
  }

  function closeModal(name: string) {
    setModals((prev) => ({ ...prev, [name]: false }));
  }

  function isOpen(name: string) {
    return !!modals[name];
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (context === undefined) throw new Error('useModal must be used within a ModalProvider');

  return context;
}
