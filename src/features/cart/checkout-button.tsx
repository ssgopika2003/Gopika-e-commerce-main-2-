import type { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { useCartCheckout } from "@/hooks/checkout";

interface CheckoutButtonProps extends ButtonProps {
  onSuccess?: () => void;
}

export default function CheckoutButton({
  onSuccess,
  ...props
}: CheckoutButtonProps) {
  const { startCheckoutFlow, pending } = useCartCheckout({ onSuccess });

  return (
    <LoadingButton onClick={startCheckoutFlow} loading={pending} {...props}>
      Checkout
    </LoadingButton>
  );
}
