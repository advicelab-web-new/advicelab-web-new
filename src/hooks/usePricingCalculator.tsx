import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface PricingCalculatorContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isFormSubmitted: boolean;
  setFormSubmitted: (value: boolean) => void;
  clearSession: () => void;
}

const PricingCalculatorContext = createContext<
  PricingCalculatorContextType | undefined
>(undefined);

export function PricingCalculatorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Use React state for temporary storage - clears on refresh
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const open = () => setIsOpen(true);

  const close = () => setIsOpen(false);

  const setFormSubmitted = useCallback((value: boolean) => {
    setIsFormSubmitted(value);
  }, []);

  const clearSession = useCallback(() => {
    setIsFormSubmitted(false);
  }, []);

  return (
    <PricingCalculatorContext.Provider
      value={{
        isOpen,
        open,
        close,
        isFormSubmitted,
        setFormSubmitted,
        clearSession,
      }}
    >
      {children}
    </PricingCalculatorContext.Provider>
  );
}

export function usePricingCalculator() {
  const context = useContext(PricingCalculatorContext);
  if (context === undefined) {
    throw new Error(
      "usePricingCalculator must be used within a PricingCalculatorProvider",
    );
  }
  return context;
}
