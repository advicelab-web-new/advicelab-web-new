import { useNavigate } from "react-router-dom";
import { PricingCalculatorPopup } from "@/components/ui/PricingCalculatorPopup";
import { usePricingCalculator } from "@/hooks/usePricingCalculator";

export function PricingCalculatorPopupWrapper() {
  const { isOpen, close, setFormSubmitted } = usePricingCalculator();
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Mark form as submitted in session storage (temporary state)
    setFormSubmitted(true);
    navigate("/resources/pricing-calculator");
  };

  return (
    <PricingCalculatorPopup
      open={isOpen}
      onOpenChange={close}
      onSuccess={handleSuccess}
    />
  );
}
